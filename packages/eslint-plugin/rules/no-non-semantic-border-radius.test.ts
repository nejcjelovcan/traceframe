import parser from '@typescript-eslint/parser'
import { RuleTester } from '@typescript-eslint/rule-tester'
import { afterAll, describe, it } from 'vitest'

import { noNonSemanticBorderRadius } from './no-non-semantic-border-radius.js'

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

describe('no-non-semantic-border-radius', () => {
  ruleTester.run('no-non-semantic-border-radius', noNonSemanticBorderRadius, {
    valid: [
      // Semantic border radius values
      {
        code: '<div className="rounded-none" />',
      },
      {
        code: '<div className="rounded-sm" />',
      },
      {
        code: '<div className="rounded-md" />',
      },
      {
        code: '<div className="rounded-lg" />',
      },
      {
        code: '<div className="rounded-xl" />',
      },
      {
        code: '<div className="rounded-full" />',
      },
      // Default rounded (maps to md)
      {
        code: '<div className="rounded" />',
      },
      // Directional variants
      {
        code: '<div className="rounded-t-sm" />',
      },
      {
        code: '<div className="rounded-r-md" />',
      },
      {
        code: '<div className="rounded-b-lg" />',
      },
      {
        code: '<div className="rounded-l-xl" />',
      },
      {
        code: '<div className="rounded-tl-sm" />',
      },
      {
        code: '<div className="rounded-tr-md" />',
      },
      {
        code: '<div className="rounded-br-lg" />',
      },
      {
        code: '<div className="rounded-bl-xl" />',
      },
      // Default directional (no value suffix)
      {
        code: '<div className="rounded-t rounded-r rounded-b rounded-l" />',
      },
      {
        code: '<div className="rounded-tl rounded-tr rounded-br rounded-bl" />',
      },
      // With modifiers
      {
        code: '<div className="hover:rounded-lg dark:rounded-xl" />',
      },
      // In cn/clsx
      {
        code: 'cn("rounded-md", "rounded-full")',
      },
      {
        code: 'clsx("rounded-none", "rounded-sm")',
      },
      // Multiple valid classes
      {
        code: '<div className="rounded-sm rounded-t-lg rounded-bl-full" />',
      },
      // Exception files
      {
        code: '<div className="rounded-[12px]" />',
        options: [{ exceptions: ['token-definitions.tsx'] }],
        filename: 'src/styles/token-definitions.tsx',
      },
    ],
    invalid: [
      // Arbitrary values
      {
        code: '<div className="rounded-[12px]" />',
        errors: [
          {
            messageId: 'nonSemanticBorderRadius',
            data: {
              className: 'rounded-[12px]',
              suggestion:
                'Use semantic border radius: rounded-sm, rounded-md, rounded-lg, or rounded-xl',
            },
          },
        ],
      },
      {
        code: '<div className="rounded-[0.8rem]" />',
        errors: [
          {
            messageId: 'nonSemanticBorderRadius',
            data: {
              className: 'rounded-[0.8rem]',
              suggestion:
                'Use semantic border radius: rounded-sm, rounded-md, rounded-lg, or rounded-xl',
            },
          },
        ],
      },
      // Oversized radius values
      {
        code: '<div className="rounded-2xl" />',
        errors: [
          {
            messageId: 'nonSemanticBorderRadius',
            data: {
              className: 'rounded-2xl',
              suggestion: 'rounded-xl (0.75rem) or rounded-full for pills/circles',
            },
          },
        ],
      },
      {
        code: '<div className="rounded-3xl" />',
        errors: [
          {
            messageId: 'nonSemanticBorderRadius',
            data: {
              className: 'rounded-3xl',
              suggestion: 'rounded-xl (0.75rem) or rounded-full for pills/circles',
            },
          },
        ],
      },
      // Directional with arbitrary values
      {
        code: '<div className="rounded-t-[10px]" />',
        errors: [
          {
            messageId: 'nonSemanticBorderRadius',
            data: {
              className: 'rounded-t-[10px]',
              suggestion:
                'Use semantic border radius: rounded-t-sm, rounded-t-md, rounded-t-lg, or rounded-t-xl',
            },
          },
        ],
      },
      {
        code: '<div className="rounded-tl-[0.8rem]" />',
        errors: [
          {
            messageId: 'nonSemanticBorderRadius',
            data: {
              className: 'rounded-tl-[0.8rem]',
              suggestion:
                'Use semantic border radius: rounded-tl-sm, rounded-tl-md, rounded-tl-lg, or rounded-tl-xl',
            },
          },
        ],
      },
      // Directional with oversized values
      {
        code: '<div className="rounded-r-2xl" />',
        errors: [
          {
            messageId: 'nonSemanticBorderRadius',
            data: {
              className: 'rounded-r-2xl',
              suggestion: 'rounded-r-xl (0.75rem) or rounded-r-full for pills/circles',
            },
          },
        ],
      },
      {
        code: '<div className="rounded-bl-3xl" />',
        errors: [
          {
            messageId: 'nonSemanticBorderRadius',
            data: {
              className: 'rounded-bl-3xl',
              suggestion: 'rounded-bl-xl (0.75rem) or rounded-bl-full for pills/circles',
            },
          },
        ],
      },
      // Multiple invalid classes
      {
        code: '<div className="rounded-[12px] rounded-2xl rounded-t-3xl" />',
        errors: [
          {
            messageId: 'nonSemanticBorderRadius',
            data: {
              className: 'rounded-[12px]',
              suggestion:
                'Use semantic border radius: rounded-sm, rounded-md, rounded-lg, or rounded-xl',
            },
          },
          {
            messageId: 'nonSemanticBorderRadius',
            data: {
              className: 'rounded-2xl',
              suggestion: 'rounded-xl (0.75rem) or rounded-full for pills/circles',
            },
          },
          {
            messageId: 'nonSemanticBorderRadius',
            data: {
              className: 'rounded-t-3xl',
              suggestion: 'rounded-t-xl (0.75rem) or rounded-t-full for pills/circles',
            },
          },
        ],
      },
      // With modifiers
      {
        code: '<div className="hover:rounded-[16px] dark:rounded-2xl" />',
        errors: [
          {
            messageId: 'nonSemanticBorderRadius',
            data: {
              className: 'hover:rounded-[16px]',
              suggestion:
                'Use semantic border radius: rounded-sm, rounded-md, rounded-lg, or rounded-xl',
            },
          },
          {
            messageId: 'nonSemanticBorderRadius',
            data: {
              className: 'dark:rounded-2xl',
              suggestion: 'rounded-xl (0.75rem) or rounded-full for pills/circles',
            },
          },
        ],
      },
      // In cn/clsx
      {
        code: 'cn("rounded-[12px]", "rounded-2xl")',
        errors: [
          {
            messageId: 'nonSemanticBorderRadius',
            data: {
              className: 'rounded-[12px]',
              suggestion:
                'Use semantic border radius: rounded-sm, rounded-md, rounded-lg, or rounded-xl',
            },
          },
          {
            messageId: 'nonSemanticBorderRadius',
            data: {
              className: 'rounded-2xl',
              suggestion: 'rounded-xl (0.75rem) or rounded-full for pills/circles',
            },
          },
        ],
      },
      // Template literals
      {
        code: '<div className={`rounded-[14px] rounded-3xl`} />',
        errors: [
          {
            messageId: 'nonSemanticBorderRadius',
            data: {
              className: 'rounded-[14px]',
              suggestion:
                'Use semantic border radius: rounded-sm, rounded-md, rounded-lg, or rounded-xl',
            },
          },
          {
            messageId: 'nonSemanticBorderRadius',
            data: {
              className: 'rounded-3xl',
              suggestion: 'rounded-xl (0.75rem) or rounded-full for pills/circles',
            },
          },
        ],
      },
    ],
  })
})
