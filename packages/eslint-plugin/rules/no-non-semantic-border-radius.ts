import { ESLintUtils, AST_NODE_TYPES } from '@typescript-eslint/utils'

import {
  extractTailwindClasses,
  getBorderRadiusSuggestion as getBorderRadiusSuggestionFromLib,
  isNonSemanticBorderRadiusClass as isNonSemanticBorderRadiusClassFromLib,
} from '@nejcjelovcan/traceframe-ui-library'

import type { TSESTree } from '@typescript-eslint/utils'

type MessageIds = 'nonSemanticBorderRadius' | 'suggestSemantic'

type Options = [
  {
    exceptions?: string[]
  },
]

const createRule = ESLintUtils.RuleCreator.withoutDocs

function getSuggestedReplacement(className: string): string | undefined {
  return getBorderRadiusSuggestionFromLib(className)
}

export const noNonSemanticBorderRadius = createRule<Options, MessageIds>({
  name: 'no-non-semantic-border-radius',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce usage of semantic border radius tokens instead of arbitrary values or oversized radii',
    },
    hasSuggestions: false,
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
      nonSemanticBorderRadius:
        'Use semantic border radius instead of "{{className}}". {{suggestion}}',
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
        if (isNonSemanticBorderRadiusClassFromLib(className)) {
          const suggestion = getSuggestedReplacement(className)

          context.report({
            node,
            messageId: 'nonSemanticBorderRadius',
            data: {
              className,
              suggestion: suggestion || 'Use semantic border radius tokens',
            },
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
