import parser from '@typescript-eslint/parser'
import { RuleTester } from '@typescript-eslint/rule-tester'
import { afterAll, describe, it } from 'vitest'

import { noNonSemanticTypography } from './no-non-semantic-typography.js'

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

describe('no-non-semantic-typography', () => {
  ruleTester.run('no-non-semantic-typography', noNonSemanticTypography, {
    valid: [
      // Semantic font sizes
      {
        code: '<div className="text-xs" />',
      },
      {
        code: '<div className="text-sm" />',
      },
      {
        code: '<div className="text-base" />',
      },
      {
        code: '<div className="text-lg" />',
      },
      {
        code: '<div className="text-xl" />',
      },
      {
        code: '<div className="text-2xl" />',
      },
      {
        code: '<div className="text-3xl" />',
      },
      {
        code: '<div className="text-4xl" />',
      },
      // Semantic font families
      {
        code: '<div className="font-sans" />',
      },
      {
        code: '<div className="font-mono" />',
      },
      // Standard line heights
      {
        code: '<div className="leading-none" />',
      },
      {
        code: '<div className="leading-tight" />',
      },
      {
        code: '<div className="leading-snug" />',
      },
      {
        code: '<div className="leading-normal" />',
      },
      {
        code: '<div className="leading-relaxed" />',
      },
      {
        code: '<div className="leading-loose" />',
      },
      // Standard letter spacing
      {
        code: '<div className="tracking-tighter" />',
      },
      {
        code: '<div className="tracking-tight" />',
      },
      {
        code: '<div className="tracking-normal" />',
      },
      {
        code: '<div className="tracking-wide" />',
      },
      {
        code: '<div className="tracking-wider" />',
      },
      {
        code: '<div className="tracking-widest" />',
      },
      // Font weights (allowed)
      {
        code: '<div className="font-thin font-light font-normal font-medium font-semibold font-bold font-extrabold font-black" />',
      },
      // Font styles (allowed)
      {
        code: '<div className="italic not-italic" />',
      },
      // With modifiers
      {
        code: '<div className="hover:text-lg dark:text-xl" />',
      },
      // In cn/clsx
      {
        code: 'cn("text-base", "font-sans")',
      },
      {
        code: 'clsx("leading-normal", "tracking-normal")',
      },
      // Exception files
      {
        code: '<div className="text-[14px]" />',
        options: [{ exceptions: ['token-definitions.tsx'] }],
        filename: 'src/styles/token-definitions.tsx',
      },
    ],
    invalid: [
      // Arbitrary font sizes
      {
        code: '<div className="text-[14px]" />',
        errors: [
          {
            messageId: 'nonSemanticTypography',
            data: {
              className: 'text-[14px]',
              suggestion: 'Use semantic font sizes: text-xs through text-4xl',
            },
          },
        ],
      },
      {
        code: '<div className="text-[1.2rem]" />',
        errors: [
          {
            messageId: 'nonSemanticTypography',
            data: {
              className: 'text-[1.2rem]',
              suggestion: 'Use semantic font sizes: text-xs through text-4xl',
            },
          },
        ],
      },
      // Oversized text
      {
        code: '<div className="text-5xl" />',
        errors: [
          {
            messageId: 'nonSemanticTypography',
            data: {
              className: 'text-5xl',
              suggestion: 'Use text-4xl for maximum size, or consider if this is truly needed',
            },
          },
        ],
      },
      {
        code: '<div className="text-6xl" />',
        errors: [
          {
            messageId: 'nonSemanticTypography',
            data: {
              className: 'text-6xl',
              suggestion: 'Use text-4xl for maximum size, or consider if this is truly needed',
            },
          },
        ],
      },
      {
        code: '<div className="text-7xl text-8xl text-9xl" />',
        errors: [
          {
            messageId: 'nonSemanticTypography',
            data: {
              className: 'text-7xl',
              suggestion: 'Use text-4xl for maximum size, or consider if this is truly needed',
            },
          },
          {
            messageId: 'nonSemanticTypography',
            data: {
              className: 'text-8xl',
              suggestion: 'Use text-4xl for maximum size, or consider if this is truly needed',
            },
          },
          {
            messageId: 'nonSemanticTypography',
            data: {
              className: 'text-9xl',
              suggestion: 'Use text-4xl for maximum size, or consider if this is truly needed',
            },
          },
        ],
      },
      // Arbitrary font families
      {
        code: '<div className="font-[Arial]" />',
        errors: [
          {
            messageId: 'nonSemanticTypography',
            data: {
              className: 'font-[Arial]',
              suggestion: 'Use font-sans or font-mono',
            },
          },
        ],
      },
      {
        code: `<div className="font-['Custom Font']" />`,
        errors: [
          {
            messageId: 'nonSemanticTypography',
            data: {
              className: `font-['Custom Font']`,
              suggestion: 'Use font-sans or font-mono',
            },
          },
        ],
      },
      // Arbitrary line heights
      {
        code: '<div className="leading-[20px]" />',
        errors: [
          {
            messageId: 'nonSemanticTypography',
            data: {
              className: 'leading-[20px]',
              suggestion:
                'Use standard line-height utilities: leading-none, leading-tight, leading-snug, leading-normal, leading-relaxed, or leading-loose',
            },
          },
        ],
      },
      {
        code: '<div className="leading-[1.4]" />',
        errors: [
          {
            messageId: 'nonSemanticTypography',
            data: {
              className: 'leading-[1.4]',
              suggestion:
                'Use standard line-height utilities: leading-none, leading-tight, leading-snug, leading-normal, leading-relaxed, or leading-loose',
            },
          },
        ],
      },
      // Arbitrary letter spacing
      {
        code: '<div className="tracking-[0.05em]" />',
        errors: [
          {
            messageId: 'nonSemanticTypography',
            data: {
              className: 'tracking-[0.05em]',
              suggestion:
                'Use standard letter-spacing utilities: tracking-tighter through tracking-widest',
            },
          },
        ],
      },
      // With modifiers
      {
        code: '<div className="hover:text-[16px] dark:font-[Helvetica]" />',
        errors: [
          {
            messageId: 'nonSemanticTypography',
            data: {
              className: 'hover:text-[16px]',
              suggestion: 'Use semantic font sizes: text-xs through text-4xl',
            },
          },
          {
            messageId: 'nonSemanticTypography',
            data: {
              className: 'dark:font-[Helvetica]',
              suggestion: 'Use font-sans or font-mono',
            },
          },
        ],
      },
      // In cn/clsx
      {
        code: 'cn("text-[14px]", "font-[Arial]")',
        errors: [
          {
            messageId: 'nonSemanticTypography',
            data: {
              className: 'text-[14px]',
              suggestion: 'Use semantic font sizes: text-xs through text-4xl',
            },
          },
          {
            messageId: 'nonSemanticTypography',
            data: {
              className: 'font-[Arial]',
              suggestion: 'Use font-sans or font-mono',
            },
          },
        ],
      },
      // Template literals
      {
        code: '<div className={`text-5xl leading-[1.2]`} />',
        errors: [
          {
            messageId: 'nonSemanticTypography',
            data: {
              className: 'text-5xl',
              suggestion: 'Use text-4xl for maximum size, or consider if this is truly needed',
            },
          },
          {
            messageId: 'nonSemanticTypography',
            data: {
              className: 'leading-[1.2]',
              suggestion:
                'Use standard line-height utilities: leading-none, leading-tight, leading-snug, leading-normal, leading-relaxed, or leading-loose',
            },
          },
        ],
      },
    ],
  })
})
