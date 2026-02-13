import parser from '@typescript-eslint/parser'
import { RuleTester } from '@typescript-eslint/rule-tester'
import { afterAll, describe, it } from 'vitest'

import { noNonSemanticSizing } from './no-non-semantic-sizing'

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

ruleTester.run('no-non-semantic-sizing', noNonSemanticSizing, {
  valid: [
    // Semantic sizing tokens are allowed
    {
      code: '<div className="h-size-md w-size-lg" />',
    },
    // Zero, full, auto, screen are exempt
    {
      code: '<div className="h-0 w-full h-auto w-screen" />',
    },
    // Fractions and arbitrary values are exempt
    {
      code: '<div className="w-1/2 h-[50%] w-[300px]" />',
    },
    // Large layout dimensions are exempt (above MAX_SIZING_NUMERIC=16)
    {
      code: '<div className="w-48 w-64 w-96 h-24 h-32" />',
    },
    // Below element size range (< 4) are exempt
    {
      code: '<div className="h-2 h-3 w-1 w-2" />',
    },
    // Non-sizing classes are allowed
    {
      code: '<div className="flex items-center bg-surface p-md" />',
    },
    // cn/clsx with semantic sizing
    {
      code: 'cn("h-size-md", "w-size-lg")',
    },
    // Files in exceptions are allowed
    {
      code: '<div className="h-8 w-10" />',
      options: [
        {
          exceptions: ['test-file.tsx'],
        },
      ],
      filename: 'test-file.tsx',
    },
  ],

  invalid: [
    // Numeric height in element size range
    {
      code: '<div className="h-8" />',
      errors: [
        {
          messageId: 'nonSemanticSizing',
          data: {
            className: 'h-8',
            suggestion: 'h-size-sm',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'h-size-sm' },
              output: '<div className="h-size-sm" />',
            },
          ],
        },
      ],
    },
    // Numeric width in element size range
    {
      code: '<div className="w-10" />',
      errors: [
        {
          messageId: 'nonSemanticSizing',
          data: {
            className: 'w-10',
            suggestion: 'w-size-md',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'w-size-md' },
              output: '<div className="w-size-md" />',
            },
          ],
        },
      ],
    },
    // Min/max variants
    {
      code: '<div className="min-h-10" />',
      errors: [
        {
          messageId: 'nonSemanticSizing',
          data: {
            className: 'min-h-10',
            suggestion: 'min-h-size-md',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'min-h-size-md' },
              output: '<div className="min-h-size-md" />',
            },
          ],
        },
      ],
    },
    // Multiple violations
    {
      code: '<div className="h-8 w-10" />',
      errors: [
        {
          messageId: 'nonSemanticSizing',
          data: {
            className: 'h-8',
            suggestion: 'h-size-sm',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'h-size-sm' },
              output: '<div className="h-size-sm w-10" />',
            },
          ],
        },
        {
          messageId: 'nonSemanticSizing',
          data: {
            className: 'w-10',
            suggestion: 'w-size-md',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'w-size-md' },
              output: '<div className="h-8 w-size-md" />',
            },
          ],
        },
      ],
    },
    // Hover prefix
    {
      code: '<div className="hover:h-10" />',
      errors: [
        {
          messageId: 'nonSemanticSizing',
          data: {
            className: 'hover:h-10',
            suggestion: 'hover:h-size-md',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'hover:h-size-md' },
              output: '<div className="hover:h-size-md" />',
            },
          ],
        },
      ],
    },
    // cn/clsx function calls
    {
      code: 'cn("h-8", "w-10")',
      errors: [
        {
          messageId: 'nonSemanticSizing',
          data: {
            className: 'h-8',
            suggestion: 'h-size-sm',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'h-size-sm' },
              output: 'cn("h-size-sm", "w-10")',
            },
          ],
        },
        {
          messageId: 'nonSemanticSizing',
          data: {
            className: 'w-10',
            suggestion: 'w-size-md',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'w-size-md' },
              output: 'cn("h-8", "w-size-md")',
            },
          ],
        },
      ],
    },
    // No exact match - nearest suggestion (no autofix)
    {
      code: '<div className="h-9" />',
      errors: [
        {
          messageId: 'nonSemanticSizing',
        },
      ],
    },
  ],
})
