import parser from '@typescript-eslint/parser'
import { RuleTester } from '@typescript-eslint/rule-tester'
import { afterAll, describe, it } from 'vitest'

import { noNonSemanticSpacing } from './no-non-semantic-spacing'

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

ruleTester.run('no-non-semantic-spacing', noNonSemanticSpacing, {
  valid: [
    // Semantic spacing tokens are allowed
    {
      code: '<div className="p-md gap-sm m-lg" />',
    },
    {
      code: '<div className="px-xs py-md space-y-sm" />',
    },
    // Zero, px, auto, full are exempt
    {
      code: '<div className="p-0 m-auto gap-0 w-full" />',
    },
    // Fractions and arbitrary values are exempt
    {
      code: '<div className="w-1/2 p-[20px] m-[2rem]" />',
    },
    // Non-spacing classes are allowed
    {
      code: '<div className="flex items-center bg-surface text-foreground" />',
    },
    // cn/clsx with semantic spacing
    {
      code: 'cn("p-md", "gap-sm")',
    },
    // Template literals with semantic spacing
    {
      code: '<div className={`p-md ${isActive ? "gap-sm" : ""}`} />',
    },
    // Files in exceptions are allowed
    {
      code: '<div className="p-4 gap-2" />',
      options: [
        {
          exceptions: ['test-file.tsx'],
        },
      ],
      filename: 'test-file.tsx',
    },
    // Template literals in className
    {
      code: '<div className={`p-md gap-sm`} />',
    },
    // Template literals with semantic tokens in cn/clsx
    {
      code: 'cn(`p-lg gap-md`)',
    },
  ],

  invalid: [
    // Numeric padding
    {
      code: '<div className="p-4" />',
      errors: [
        {
          messageId: 'nonSemanticSpacing',
          data: {
            className: 'p-4',
            suggestion: 'p-base',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'p-base' },
              output: '<div className="p-base" />',
            },
          ],
        },
      ],
    },
    // Numeric gap
    {
      code: '<div className="gap-2" />',
      errors: [
        {
          messageId: 'nonSemanticSpacing',
          data: {
            className: 'gap-2',
            suggestion: 'gap-sm',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'gap-sm' },
              output: '<div className="gap-sm" />',
            },
          ],
        },
      ],
    },
    // Numeric margin
    {
      code: '<div className="mx-8" />',
      errors: [
        {
          messageId: 'nonSemanticSpacing',
          data: {
            className: 'mx-8',
            suggestion: 'mx-lg',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'mx-lg' },
              output: '<div className="mx-lg" />',
            },
          ],
        },
      ],
    },
    // Multiple violations
    {
      code: '<div className="p-4 gap-2 mt-8" />',
      errors: [
        {
          messageId: 'nonSemanticSpacing',
          data: {
            className: 'p-4',
            suggestion: 'p-base',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'p-base' },
              output: '<div className="p-base gap-2 mt-8" />',
            },
          ],
        },
        {
          messageId: 'nonSemanticSpacing',
          data: {
            className: 'gap-2',
            suggestion: 'gap-sm',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'gap-sm' },
              output: '<div className="p-4 gap-sm mt-8" />',
            },
          ],
        },
        {
          messageId: 'nonSemanticSpacing',
          data: {
            className: 'mt-8',
            suggestion: 'mt-lg',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'mt-lg' },
              output: '<div className="p-4 gap-2 mt-lg" />',
            },
          ],
        },
      ],
    },
    // Negative margins
    {
      code: '<div className="-m-2" />',
      errors: [
        {
          messageId: 'nonSemanticSpacing',
          data: {
            className: '-m-2',
            suggestion: '-m-sm',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: '-m-sm' },
              output: '<div className="-m-sm" />',
            },
          ],
        },
      ],
    },
    // Hover prefix
    {
      code: '<div className="hover:p-4" />',
      errors: [
        {
          messageId: 'nonSemanticSpacing',
          data: {
            className: 'hover:p-4',
            suggestion: 'hover:p-base',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'hover:p-base' },
              output: '<div className="hover:p-base" />',
            },
          ],
        },
      ],
    },
    // cn/clsx function calls
    {
      code: 'cn("p-4", "gap-2")',
      errors: [
        {
          messageId: 'nonSemanticSpacing',
          data: {
            className: 'p-4',
            suggestion: 'p-base',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'p-base' },
              output: 'cn("p-base", "gap-2")',
            },
          ],
        },
        {
          messageId: 'nonSemanticSpacing',
          data: {
            className: 'gap-2',
            suggestion: 'gap-sm',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'gap-sm' },
              output: 'cn("p-4", "gap-sm")',
            },
          ],
        },
      ],
    },
    // No exact match - nearest suggestion (no autofix)
    {
      code: '<div className="p-5" />',
      errors: [
        {
          messageId: 'nonSemanticSpacing',
        },
      ],
    },
    // Template literals in JSX className
    {
      code: '<div className={`p-4 gap-2`} />',
      errors: [
        {
          messageId: 'nonSemanticSpacing',
          data: {
            className: 'p-4',
            suggestion: 'p-base',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'p-base' },
              output: '<div className={`p-base gap-2`} />',
            },
          ],
        },
        {
          messageId: 'nonSemanticSpacing',
          data: {
            className: 'gap-2',
            suggestion: 'gap-sm',
          },
          suggestions: [
            {
              messageId: 'suggestSemantic',
              data: { replacement: 'gap-sm' },
              output: '<div className={`p-4 gap-sm`} />',
            },
          ],
        },
      ],
    },
  ],
})
