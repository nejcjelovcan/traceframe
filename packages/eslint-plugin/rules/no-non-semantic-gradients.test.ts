import parser from '@typescript-eslint/parser'
import { RuleTester } from '@typescript-eslint/rule-tester'
import { afterAll, describe, it } from 'vitest'

import { noNonSemanticGradients } from './no-non-semantic-gradients'

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

ruleTester.run('no-non-semantic-gradients', noNonSemanticGradients, {
  valid: [
    // Semantic gradient tokens are allowed
    {
      code: '<div className="bg-gradient-interactive-primary" />',
    },
    {
      code: '<div className="bg-gradient-interactive-secondary" />',
    },
    {
      code: '<div className="bg-gradient-interactive-destructive" />',
    },
    // Status gradients
    {
      code: '<div className="bg-gradient-status-success bg-gradient-status-error" />',
    },
    // Accent gradients
    {
      code: '<div className="bg-gradient-accent-1 bg-gradient-accent-2" />',
    },
    // Non-gradient classes
    {
      code: '<div className="flex items-center bg-surface text-foreground" />',
    },
    // cn/clsx with semantic gradients
    {
      code: 'cn("bg-gradient-interactive-primary", "text-foreground-filled")',
    },
    // Files in exceptions are allowed
    {
      code: '<div className="bg-gradient-to-r from-primary-500" />',
      options: [
        {
          exceptions: ['test-file.tsx'],
        },
      ],
      filename: 'test-file.tsx',
    },
  ],

  invalid: [
    // Gradient direction (non-semantic)
    {
      code: '<div className="bg-gradient-to-r" />',
      errors: [
        {
          messageId: 'nonSemanticGradient',
        },
      ],
    },
    // from-* with palette color
    {
      code: '<div className="from-primary-500" />',
      errors: [
        {
          messageId: 'nonSemanticGradient',
        },
      ],
    },
    // via-* with palette color
    {
      code: '<div className="via-neutral-200" />',
      errors: [
        {
          messageId: 'nonSemanticGradient',
        },
      ],
    },
    // to-* with palette color
    {
      code: '<div className="to-error-600" />',
      errors: [
        {
          messageId: 'nonSemanticGradient',
        },
      ],
    },
    // Multiple gradient violations
    {
      code: '<div className="bg-gradient-to-r from-primary-500 to-error-600" />',
      errors: [
        {
          messageId: 'nonSemanticGradient',
        },
        {
          messageId: 'nonSemanticGradient',
        },
        {
          messageId: 'nonSemanticGradient',
        },
      ],
    },
    // cn/clsx function calls
    {
      code: 'cn("bg-gradient-to-b", "from-primary-500")',
      errors: [
        {
          messageId: 'nonSemanticGradient',
        },
        {
          messageId: 'nonSemanticGradient',
        },
      ],
    },
  ],
})
