import { ESLintUtils, AST_NODE_TYPES } from '@typescript-eslint/utils'

import {
  extractTailwindClasses,
  getSpacingSuggestion as getSpacingSuggestionFromLib,
  isNonSemanticSpacingClass as isNonSemanticSpacingClassFromLib,
} from '@nejcjelovcan/traceframe-ui-library'

import type { TSESTree } from '@typescript-eslint/utils'

type MessageIds = 'nonSemanticSpacing' | 'suggestSemantic'

type Options = [
  {
    exceptions?: string[]
  },
]

const createRule = ESLintUtils.RuleCreator.withoutDocs

function getSuggestedReplacement(className: string): string | undefined {
  return getSpacingSuggestionFromLib(className)
}

export const noNonSemanticSpacing = createRule<Options, MessageIds>({
  name: 'no-non-semantic-spacing',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce usage of semantic spacing tokens instead of numeric spacing values',
    },
    fixable: 'code',
    hasSuggestions: true,
    schema: [
      {
        type: 'object',
        properties: {
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
      nonSemanticSpacing:
        'Use semantic spacing token instead of "{{className}}". Consider using "{{suggestion}}" or another semantic token.',
      suggestSemantic: 'Replace with "{{replacement}}"',
    },
  },
  defaultOptions: [
    {
      exceptions: [],
    },
  ],
  create(context) {
    const options = context.options[0] || {}
    const exceptions = options.exceptions || []
    const filename = context.filename || context.getFilename()

    // Check if file is in exceptions
    if (exceptions.some((exception) => filename.includes(exception))) {
      return {}
    }

    function checkClassNameValue(node: TSESTree.Node, value: string) {
      const classes = extractTailwindClasses(value)

      for (const className of classes) {
        if (isNonSemanticSpacingClassFromLib(className)) {
          const suggestion = getSuggestedReplacement(className)
          const isExactSuggestion = suggestion && !suggestion.startsWith('nearest:')

          context.report({
            node,
            messageId: 'nonSemanticSpacing',
            data: {
              className,
              suggestion: suggestion || 'a semantic spacing token',
            },
            ...(isExactSuggestion && {
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
