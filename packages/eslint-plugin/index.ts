/**
 * @traceframe/eslint-plugin
 * ESLint plugin with custom rules for Traceframe code quality
 */

import { noNonSemanticColors } from './rules/no-non-semantic-colors'

export const rules = {
  'no-non-semantic-colors': noNonSemanticColors,
}

export const configs = {
  recommended: {
    plugins: ['@traceframe'],
    rules: {
      '@traceframe/no-non-semantic-colors': [
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
          exceptions: [
            'packages/ui-library/src/styles/index.css',
            'packages/ui-library/src/tailwind-preset.ts',
            'packages/ui-library/tailwind-preset.ts',
          ],
        },
      ],
    },
  },
}
