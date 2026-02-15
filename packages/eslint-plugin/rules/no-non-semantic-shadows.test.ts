import parser from '@typescript-eslint/parser'
import { RuleTester } from '@typescript-eslint/rule-tester'
import { afterAll, describe, it } from 'vitest'

import { noNonSemanticShadows } from './no-non-semantic-shadows'

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

ruleTester.run('no-non-semantic-shadows', noNonSemanticShadows, {
  valid: [
    // Semantic shadow tokens are allowed
    {
      code: '<div className="shadow-sm" />',
    },
    {
      code: '<div className="shadow-md" />',
    },
    {
      code: '<div className="shadow-lg" />',
    },
    // Interactive shadows
    {
      code: '<div className="shadow-interactive shadow-interactive-hover shadow-interactive-pressed" />',
    },
    // Highlight shadows
    {
      code: '<div className="shadow-highlight shadow-highlight-hover shadow-highlight-pressed" />',
    },
    // Inset shadows
    {
      code: '<div className="shadow-inset-sm shadow-inset-md shadow-inset-underline" />',
    },
    // Non-shadow classes
    {
      code: '<div className="flex items-center bg-surface text-foreground" />',
    },
    // cn/clsx with semantic shadows
    {
      code: 'cn("shadow-sm", "shadow-interactive")',
    },
    // Files in exceptions are allowed
    {
      code: '<div className="shadow" />',
      options: [
        {
          exceptions: ['test-file.tsx'],
        },
      ],
      filename: 'test-file.tsx',
    },
  ],

  invalid: [
    // Plain shadow (non-semantic)
    {
      code: '<div className="shadow" />',
      errors: [
        {
          messageId: 'nonSemanticShadow',
          data: {
            className: 'shadow',
            suggestion: 'shadow-sm or shadow-interactive',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'shadow-sm' },
              output: '<div className="shadow-sm" />',
            },
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'shadow-interactive' },
              output: '<div className="shadow-interactive" />',
            },
          ],
        },
      ],
    },
    // shadow-none
    {
      code: '<div className="shadow-none" />',
      errors: [
        {
          messageId: 'nonSemanticShadow',
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'Remove class' },
              output: '<div className="" />',
            },
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'use shadow-sm for minimal elevation' },
              output: '<div className="shadow-sm" />',
            },
          ],
        },
      ],
    },
    // shadow-inner
    {
      code: '<div className="shadow-inner" />',
      errors: [
        {
          messageId: 'nonSemanticShadow',
          data: {
            className: 'shadow-inner',
            suggestion: 'shadow-inset-sm or shadow-inset-md',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'shadow-inset-sm' },
              output: '<div className="shadow-inset-sm" />',
            },
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'shadow-inset-md' },
              output: '<div className="shadow-inset-md" />',
            },
          ],
        },
      ],
    },
    // shadow-xl
    {
      code: '<div className="shadow-xl" />',
      errors: [
        {
          messageId: 'nonSemanticShadow',
          data: {
            className: 'shadow-xl',
            suggestion: 'shadow-lg or shadow-highlight',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'shadow-lg' },
              output: '<div className="shadow-lg" />',
            },
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'shadow-highlight' },
              output: '<div className="shadow-highlight" />',
            },
          ],
        },
      ],
    },
    // shadow-2xl
    {
      code: '<div className="shadow-2xl" />',
      errors: [
        {
          messageId: 'nonSemanticShadow',
          data: {
            className: 'shadow-2xl',
            suggestion: 'shadow-lg',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'shadow-lg' },
              output: '<div className="shadow-lg" />',
            },
          ],
        },
      ],
    },
    // cn/clsx function calls
    {
      code: 'cn("shadow", "shadow-inner")',
      errors: [
        {
          messageId: 'nonSemanticShadow',
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'shadow-sm' },
              output: 'cn("shadow-sm", "shadow-inner")',
            },
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'shadow-interactive' },
              output: 'cn("shadow-interactive", "shadow-inner")',
            },
          ],
        },
        {
          messageId: 'nonSemanticShadow',
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'shadow-inset-sm' },
              output: 'cn("shadow", "shadow-inset-sm")',
            },
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'shadow-inset-md' },
              output: 'cn("shadow", "shadow-inset-md")',
            },
          ],
        },
      ],
    },
  ],
})
