import { describe, expect, it } from 'vitest'

import { autofix, autofixDescription, autofixInputSchema, type AutofixResult } from './autofix.js'

describe('autofix tool', () => {
  // Note: Integration tests run actual lint:fix and format commands and are slow
  // They are skipped by default.
  describe.skip('autofix function (integration - slow)', () => {
    it('should return a result with all expected fields', async () => {
      const result = await autofix({})

      expect(typeof result.lintResults).toBe('object')
      expect(typeof result.formatResults).toBe('object')
      expect(typeof result.ready).toBe('boolean')
      expect(typeof result.nextSteps).toBe('string')
    })

    it('should include lint and format results with expected fields', async () => {
      const result = await autofix({})

      // Check lint results structure
      expect(result.lintResults).toHaveProperty('ran')
      expect(result.lintResults).toHaveProperty('fixed')
      expect(result.lintResults).toHaveProperty('errors')
      expect(result.lintResults).toHaveProperty('output')

      expect(typeof result.lintResults.ran).toBe('boolean')
      expect(typeof result.lintResults.fixed).toBe('number')
      expect(typeof result.lintResults.errors).toBe('number')
      expect(typeof result.lintResults.output).toBe('string')

      // Check format results structure
      expect(result.formatResults).toHaveProperty('ran')
      expect(result.formatResults).toHaveProperty('formatted')
      expect(result.formatResults).toHaveProperty('output')

      expect(typeof result.formatResults.ran).toBe('boolean')
      expect(typeof result.formatResults.formatted).toBe('number')
      expect(typeof result.formatResults.output).toBe('string')
    })

    it('should run both lint:fix and format successfully on clean codebase', async () => {
      // Run against actual codebase - should pass with 0 errors
      const result = await autofix({})

      expect(result.lintResults.ran).toBe(true)
      expect(result.formatResults.ran).toBe(true)
      expect(result.lintResults.errors).toBe(0)
      expect(result.ready).toBe(true)
    })

    it('should provide helpful next steps when ready', async () => {
      const result = await autofix({})

      if (result.ready) {
        expect(result.nextSteps).toContain('ready')
      } else {
        expect(result.nextSteps).toContain('error')
      }
    })

    it('should conform to AutofixResult interface', async () => {
      const result: AutofixResult = await autofix({})

      // Type checking ensures the result matches the interface
      expect(result).toHaveProperty('lintResults')
      expect(result).toHaveProperty('formatResults')
      expect(result).toHaveProperty('ready')
      expect(result).toHaveProperty('nextSteps')
    })
  })

  describe('tool metadata', () => {
    it('should have a description', () => {
      expect(autofixDescription).toBe(
        'Automatically fix code quality issues by running lint:fix and format'
      )
    })

    it('should have empty input schema (no parameters)', () => {
      expect(autofixInputSchema).toEqual({})
    })
  })
})
