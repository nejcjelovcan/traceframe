import { ESLintUtils, AST_NODE_TYPES } from '@typescript-eslint/utils'

import {
  extractTailwindClasses,
  getSuggestion as getSuggestionFromLib,
  isNonSemanticColorClass as isNonSemanticColorClassFromLib,
  SEMANTIC_TOKENS,
} from '@traceframe/ui-library'

import type { TSESTree } from '@typescript-eslint/utils'

type MessageIds = 'nonSemanticColor' | 'suggestSemantic'

type Options = [
  {
    allowedPalettes?: string[]
    semanticTokens?: string[]
    exceptions?: string[]
  },
]

const createRule = ESLintUtils.RuleCreator.withoutDocs

// Use wrapper functions to maintain compatibility with the ESLint rule interface
function isNonSemanticColorClass(className: string, allowedPalettes: string[]): boolean {
  // If palette is in allowed list, it's not a violation
  if (allowedPalettes.length > 0) {
    const cleanClass = className
      .replace(/^dark:/, '')
      .replace(/^hover:/, '')
      .replace(/^focus:/, '')
      .replace(/^active:/, '')
      .replace(/^disabled:/, '')
      .replace(/^group-hover:/, '')

    for (const palette of allowedPalettes) {
      if (cleanClass.includes(`-${palette}-`)) {
        return false // Allowed palette, not a violation
      }
    }
  }

  return isNonSemanticColorClassFromLib(className)
}

function getSuggestedReplacement(className: string): string | undefined {
  return getSuggestionFromLib(className)
}

export const noNonSemanticColors = createRule<Options, MessageIds>({
  name: 'no-non-semantic-colors',
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce usage of semantic color tokens instead of direct palette colors',
    },
    fixable: 'code',
    hasSuggestions: true,
    schema: [
      {
        type: 'object',
        properties: {
          allowedPalettes: {
            type: 'array',
            items: { type: 'string' },
            default: [],
          },
          semanticTokens: {
            type: 'array',
            items: { type: 'string' },
            default: [...SEMANTIC_TOKENS],
          },
          exceptions: {
            type: 'array',
            items: { type: 'string' },
            default: [],
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      nonSemanticColor:
        'Use semantic color token instead of "{{className}}". Consider using "{{suggestion}}" or another semantic token.',
      suggestSemantic: 'Replace with "{{replacement}}"',
    },
  },
  defaultOptions: [
    {
      allowedPalettes: [],
      semanticTokens: [...SEMANTIC_TOKENS],
      exceptions: [],
    },
  ],
  create(context) {
    const options = context.options[0] || {}
    const allowedPalettes = options.allowedPalettes || []
    const exceptions = options.exceptions || []
    const filename = context.filename || context.getFilename()

    // Check if file is in exceptions
    if (exceptions.some((exception) => filename.includes(exception))) {
      return {}
    }

    function checkClassNameValue(node: TSESTree.Node, value: string) {
      const classes = extractTailwindClasses(value)

      for (const className of classes) {
        if (isNonSemanticColorClass(className, allowedPalettes)) {
          const suggestion = getSuggestedReplacement(className)

          context.report({
            node,
            messageId: 'nonSemanticColor',
            data: {
              className,
              suggestion: suggestion || 'a semantic token',
            },
            ...(suggestion && {
              suggest: [
                {
                  messageId: 'suggestSemantic',
                  data: { replacement: suggestion },
                  fix(fixer) {
                    const newValue = value.replace(className, suggestion)
                    if (node.type === AST_NODE_TYPES.Literal) {
                      return fixer.replaceText(node, `"${newValue}"`)
                    } else if (node.type === AST_NODE_TYPES.TemplateLiteral) {
                      const quasis = node.quasis
                      if (quasis.length === 1) {
                        return fixer.replaceText(node, `\`${newValue}\``)
                      }
                    }
                    return null
                  },
                },
              ],
            }),
          })
        }
      }
    }

    return {
      // Check JSX className attribute
      JSXAttribute(node) {
        if (
          node.name.type === AST_NODE_TYPES.JSXIdentifier &&
          node.name.name === 'className' &&
          node.value
        ) {
          if (node.value.type === AST_NODE_TYPES.Literal && typeof node.value.value === 'string') {
            checkClassNameValue(node.value, node.value.value)
          } else if (
            node.value.type === AST_NODE_TYPES.JSXExpressionContainer &&
            node.value.expression.type === AST_NODE_TYPES.TemplateLiteral
          ) {
            const templateLiteral = node.value.expression
            const fullValue = templateLiteral.quasis.map((q) => q.value.raw).join('')
            checkClassNameValue(templateLiteral, fullValue)
          }
        }
      },

      // Check clsx/cn function calls
      CallExpression(node) {
        if (
          node.callee.type === AST_NODE_TYPES.Identifier &&
          ['clsx', 'cn', 'classnames', 'classNames'].includes(node.callee.name)
        ) {
          for (const arg of node.arguments) {
            if (arg.type === AST_NODE_TYPES.Literal && typeof arg.value === 'string') {
              checkClassNameValue(arg, arg.value)
            } else if (arg.type === AST_NODE_TYPES.TemplateLiteral) {
              const fullValue = arg.quasis.map((q) => q.value.raw).join('')
              checkClassNameValue(arg, fullValue)
            }
          }
        }
      },
    }
  },
})
