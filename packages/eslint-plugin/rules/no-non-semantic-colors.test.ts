import parser from '@typescript-eslint/parser'
import { RuleTester } from '@typescript-eslint/rule-tester'
import { afterAll, describe, it } from 'vitest'

import { noNonSemanticColors } from './no-non-semantic-colors'

// Setup for RuleTester to work with vitest
RuleTester.afterAll = afterAll
RuleTester.it = it
RuleTester.describe = describe

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
})

ruleTester.run('no-non-semantic-colors', noNonSemanticColors, {
  valid: [
    // Semantic tokens are allowed
    {
      code: '<div className="bg-surface text-foreground" />',
    },
    {
      code: '<div className="bg-surface-muted border-border" />',
    },
    {
      code: '<div className="hover:bg-interactive-hover" />',
    },
    {
      code: '<div className="bg-status-error text-status-error-foreground" />',
    },
    // Non-color classes are allowed
    {
      code: '<div className="flex items-center gap-4 p-4" />',
    },
    // Template literals with semantic tokens
    {
      code: '<div className={`bg-surface ${isActive ? "bg-interactive-active" : ""}`} />',
    },
    // cn/clsx with semantic tokens
    {
      code: 'cn("bg-surface", "text-foreground")',
    },
    // Files in exceptions are allowed
    {
      code: '<div className="bg-neutral-100" />',
      options: [
        {
          exceptions: ['test-file.tsx'],
        },
      ],
      filename: 'test-file.tsx',
    },
    // Allowed palette colors (e.g., for palette documentation)
    {
      code: '<div className="bg-arctic-500" />',
      options: [
        {
          allowedPalettes: ['arctic'],
        },
      ],
    },
    {
      code: '<div className="text-dusk-700 border-ember-400" />',
      options: [
        {
          allowedPalettes: ['dusk', 'ember'],
        },
      ],
    },
  ],

  invalid: [
    // Direct palette colors
    {
      code: '<div className="bg-neutral-100" />',
      errors: [
        {
          messageId: 'nonSemanticColor',
          data: {
            className: 'bg-neutral-100',
            suggestion: 'bg-surface-muted',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'bg-surface-muted' },
              output: '<div className="bg-surface-muted" />',
            },
          ],
        },
      ],
    },
    {
      code: '<div className="text-primary-500" />',
      errors: [
        {
          messageId: 'nonSemanticColor',
          data: {
            className: 'text-primary-500',
            suggestion: 'text-status-info-foreground',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'text-status-info-foreground' },
              output: '<div className="text-status-info-foreground" />',
            },
          ],
        },
      ],
    },
    {
      code: '<div className="border-error-700" />',
      errors: [
        {
          messageId: 'nonSemanticColor',
          data: {
            className: 'border-error-700',
            suggestion: 'border-status-error-border',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'border-status-error-border' },
              output: '<div className="border-status-error-border" />',
            },
          ],
        },
      ],
    },
    // Multiple violations
    {
      code: '<div className="bg-neutral-50 text-neutral-900 border-neutral-200" />',
      errors: [
        {
          messageId: 'nonSemanticColor',
          data: {
            className: 'bg-neutral-50',
            suggestion: 'bg-surface-muted',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'bg-surface-muted' },
              output: '<div className="bg-surface-muted text-neutral-900 border-neutral-200" />',
            },
          ],
        },
        {
          messageId: 'nonSemanticColor',
          data: {
            className: 'text-neutral-900',
            suggestion: 'text-foreground',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'text-foreground' },
              output: '<div className="bg-neutral-50 text-foreground border-neutral-200" />',
            },
          ],
        },
        {
          messageId: 'nonSemanticColor',
          data: {
            className: 'border-neutral-200',
            suggestion: 'border-border',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'border-border' },
              output: '<div className="bg-neutral-50 text-neutral-900 border-border" />',
            },
          ],
        },
      ],
    },
    // Dark mode prefixes
    {
      code: '<div className="dark:bg-neutral-950" />',
      errors: [
        {
          messageId: 'nonSemanticColor',
          data: {
            className: 'dark:bg-neutral-950',
            suggestion: 'dark:bg-surface',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'dark:bg-surface' },
              output: '<div className="dark:bg-surface" />',
            },
          ],
        },
      ],
    },
    // Hover states
    {
      code: '<div className="hover:bg-neutral-100" />',
      errors: [
        {
          messageId: 'nonSemanticColor',
          data: {
            className: 'hover:bg-neutral-100',
            suggestion: 'hover:bg-surface-muted',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'hover:bg-surface-muted' },
              output: '<div className="hover:bg-surface-muted" />',
            },
          ],
        },
      ],
    },
    // White/black colors
    {
      code: '<div className="bg-white text-black" />',
      errors: [
        {
          messageId: 'nonSemanticColor',
          data: {
            className: 'bg-white',
            suggestion: 'bg-surface',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'bg-surface' },
              output: '<div className="bg-surface text-black" />',
            },
          ],
        },
        {
          messageId: 'nonSemanticColor',
          data: {
            className: 'text-black',
            suggestion: 'a semantic token',
          },
        },
      ],
    },
    // Arbitrary color values
    {
      code: '<div className="bg-[#123456]" />',
      errors: [
        {
          messageId: 'nonSemanticColor',
          data: {
            className: 'bg-[#123456]',
            suggestion: 'a semantic token',
          },
        },
      ],
    },
    // Active states
    {
      code: '<div className="active:bg-neutral-200" />',
      errors: [
        {
          messageId: 'nonSemanticColor',
          data: {
            className: 'active:bg-neutral-200',
            suggestion: 'active:bg-surface-subtle',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'active:bg-surface-subtle' },
              output: '<div className="active:bg-surface-subtle" />',
            },
          ],
        },
      ],
    },
    // Focus states
    {
      code: '<div className="focus:border-primary-500" />',
      errors: [
        {
          messageId: 'nonSemanticColor',
          data: {
            className: 'focus:border-primary-500',
            suggestion: 'focus:border-status-info-border',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'focus:border-status-info-border' },
              output: '<div className="focus:border-status-info-border" />',
            },
          ],
        },
      ],
    },
    // Disabled states
    {
      code: '<div className="disabled:text-neutral-400" />',
      errors: [
        {
          messageId: 'nonSemanticColor',
          data: {
            className: 'disabled:text-neutral-400',
            suggestion: 'disabled:text-foreground-muted',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'disabled:text-foreground-muted' },
              output: '<div className="disabled:text-foreground-muted" />',
            },
          ],
        },
      ],
    },
    // Group hover states
    {
      code: '<div className="group-hover:bg-neutral-50" />',
      errors: [
        {
          messageId: 'nonSemanticColor',
          data: {
            className: 'group-hover:bg-neutral-50',
            suggestion: 'group-hover:bg-surface-muted',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'group-hover:bg-surface-muted' },
              output: '<div className="group-hover:bg-surface-muted" />',
            },
          ],
        },
      ],
    },
    // Template literals (only checks literal parts, not expressions)
    {
      code: '<div className={`bg-neutral-100 ${isActive ? "bg-primary-600" : ""}`} />',
      errors: [
        {
          messageId: 'nonSemanticColor',
          data: {
            className: 'bg-neutral-100',
            suggestion: 'bg-surface-muted',
          },
        },
      ],
    },
    // cn/clsx function calls
    {
      code: 'cn("bg-neutral-100", "text-neutral-500")',
      errors: [
        {
          messageId: 'nonSemanticColor',
          data: {
            className: 'bg-neutral-100',
            suggestion: 'bg-surface-muted',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'bg-surface-muted' },
              output: 'cn("bg-surface-muted", "text-neutral-500")',
            },
          ],
        },
        {
          messageId: 'nonSemanticColor',
          data: {
            className: 'text-neutral-500',
            suggestion: 'text-foreground-muted',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'text-foreground-muted' },
              output: 'cn("bg-neutral-100", "text-foreground-muted")',
            },
          ],
        },
      ],
    },
    // Status colors
    {
      code: '<div className="bg-error-50 text-error-700" />',
      errors: [
        {
          messageId: 'nonSemanticColor',
          data: {
            className: 'bg-error-50',
            suggestion: 'bg-status-error-muted',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'bg-status-error-muted' },
              output: '<div className="bg-status-error-muted text-error-700" />',
            },
          ],
        },
        {
          messageId: 'nonSemanticColor',
          data: {
            className: 'text-error-700',
            suggestion: 'text-status-error-foreground',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'text-status-error-foreground' },
              output: '<div className="bg-error-50 text-status-error-foreground" />',
            },
          ],
        },
      ],
    },
  ],
})
