import parser from '@typescript-eslint/parser'
import { RuleTester } from '@typescript-eslint/rule-tester'
import { afterAll, describe, it } from 'vitest'

import { noNonSemanticBorders } from './no-non-semantic-borders'

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

ruleTester.run('no-non-semantic-borders', noNonSemanticBorders, {
  valid: [
    // Semantic border style tokens are allowed
    {
      code: '<div className="border-line" />',
    },
    {
      code: '<div className="border-thick" />',
    },
    {
      code: '<div className="border-highlight" />',
    },
    // Directional semantic variants
    {
      code: '<div className="border-t-line border-b-thick" />',
    },
    // Default border (no numeric width) is allowed
    {
      code: '<div className="border" />',
    },
    // border-0 (removing border) is allowed
    {
      code: '<div className="border-0" />',
    },
    // Border color classes are allowed
    {
      code: '<div className="border-border border-status-error-border" />',
    },
    // Non-border classes
    {
      code: '<div className="flex items-center bg-surface text-foreground" />',
    },
    // cn/clsx with semantic borders
    {
      code: 'cn("border-line", "border-thick")',
    },
    // Files in exceptions are allowed
    {
      code: '<div className="border-2" />',
      options: [
        {
          exceptions: ['test-file.tsx'],
        },
      ],
      filename: 'test-file.tsx',
    },
  ],

  invalid: [
    // Numeric border width
    {
      code: '<div className="border-2" />',
      errors: [
        {
          messageId: 'nonSemanticBorder',
          data: {
            className: 'border-2',
            suggestion: 'border-thick or border-highlight',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'border-thick' },
              output: '<div className="border-thick" />',
            },
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'border-highlight' },
              output: '<div className="border-highlight" />',
            },
          ],
        },
      ],
    },
    // border-4 (no exact semantic match for 4, but still flagged)
    {
      code: '<div className="border-4" />',
      errors: [
        {
          messageId: 'nonSemanticBorder',
        },
      ],
    },
    // Directional numeric border
    {
      code: '<div className="border-t-2" />',
      errors: [
        {
          messageId: 'nonSemanticBorder',
          data: {
            className: 'border-t-2',
            suggestion: 'border-t-thick or border-t-highlight',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'border-t-thick' },
              output: '<div className="border-t-thick" />',
            },
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'border-t-highlight' },
              output: '<div className="border-t-highlight" />',
            },
          ],
        },
      ],
    },
    // cn/clsx function calls
    {
      code: 'cn("border-2")',
      errors: [
        {
          messageId: 'nonSemanticBorder',
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'border-thick' },
              output: 'cn("border-thick")',
            },
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'border-highlight' },
              output: 'cn("border-highlight")',
            },
          ],
        },
      ],
    },
  ],
})
