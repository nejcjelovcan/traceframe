/**
 * @nejcjelovcan/eslint-plugin-traceframe
 * ESLint plugin with custom rules for Traceframe code quality
 */

import { noNonSemanticBorders } from './rules/no-non-semantic-borders.js'
import { noNonSemanticColors } from './rules/no-non-semantic-colors.js'
import { noNonSemanticGradients } from './rules/no-non-semantic-gradients.js'
import { noNonSemanticShadows } from './rules/no-non-semantic-shadows.js'
import { noNonSemanticSizing } from './rules/no-non-semantic-sizing.js'
import { noNonSemanticSpacing } from './rules/no-non-semantic-spacing.js'

/**
 * File patterns that intentionally use non-semantic tokens.
 * Shared across all rules for consistency with the mcp-ui validate:tokens tool.
 */
const TOKEN_EXCEPTIONS = [
  'packages/ui-library/src/styles/',
  'packages/ui-library/src/utils/semantic-token-utils.ts',
  'packages/ui-library/style-dictionary/',
  'packages/ui-library/src/stories/PaletteShowcase.stories.tsx',
]

export const rules = {
  'no-non-semantic-borders': noNonSemanticBorders,
  'no-non-semantic-colors': noNonSemanticColors,
  'no-non-semantic-gradients': noNonSemanticGradients,
  'no-non-semantic-shadows': noNonSemanticShadows,
  'no-non-semantic-sizing': noNonSemanticSizing,
  'no-non-semantic-spacing': noNonSemanticSpacing,
}

export const configs = {
  recommended: {
    plugins: ['@nejcjelovcan/traceframe'],
    rules: {
      '@nejcjelovcan/traceframe/no-non-semantic-colors': [
        'error',
        {
          allowedPalettes: [],
          semanticTokens: [
            'surface',
            'foreground',
            'border',
            'ring',
            'interactive',
            'status',
            'code',
            'tooltip',
            'badge',
          ],
          exceptions: TOKEN_EXCEPTIONS,
        },
      ],
      '@nejcjelovcan/traceframe/no-non-semantic-spacing': [
        'warn',
        {
          exceptions: TOKEN_EXCEPTIONS,
        },
      ],
      '@nejcjelovcan/traceframe/no-non-semantic-sizing': [
        'warn',
        {
          exceptions: TOKEN_EXCEPTIONS,
        },
      ],
      '@nejcjelovcan/traceframe/no-non-semantic-borders': [
        'warn',
        {
          exceptions: TOKEN_EXCEPTIONS,
        },
      ],
      '@nejcjelovcan/traceframe/no-non-semantic-shadows': [
        'warn',
        {
          exceptions: TOKEN_EXCEPTIONS,
        },
      ],
      '@nejcjelovcan/traceframe/no-non-semantic-gradients': [
        'warn',
        {
          exceptions: TOKEN_EXCEPTIONS,
        },
      ],
    },
  },
}

const plugin = { rules, configs }
export default plugin
