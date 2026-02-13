import { describe, expect, it } from 'vitest'

import {
  captureStorybookScreenshotsTool,
  captureStorybookScreenshotsDescription,
  captureStorybookScreenshotsInputSchema,
} from './capture-storybook-screenshots.js'

describe('capture_storybook_screenshots tool', () => {
  describe('tool metadata', () => {
    it('should have a description', () => {
      expect(captureStorybookScreenshotsDescription).toContain('screenshot')
    })

    it('should have input schema with required properties', () => {
      expect(captureStorybookScreenshotsInputSchema).toHaveProperty('stories')
    })

    it('should have optional storyFilter property', () => {
      expect(captureStorybookScreenshotsInputSchema).toHaveProperty('storyFilter')
    })

    it('should have optional port property', () => {
      expect(captureStorybookScreenshotsInputSchema).toHaveProperty('port')
    })
  })

  describe('captureStorybookScreenshotsTool function', () => {
    it('should return error for empty stories array', async () => {
      const result = await captureStorybookScreenshotsTool({
        stories: [],
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('stories')
      expect(result.screenshots).toHaveLength(0)
    })

    // Integration tests - these require Storybook to either start or already be running
    it.skip('should accept optional storyFilter parameter', async () => {
      const result = await captureStorybookScreenshotsTool({
        stories: ['src/components/Link.stories.tsx'],
        storyFilter: 'Primary',
      })

      expect(result.outputDir).toBeDefined()
    })

    it.skip('should accept optional port parameter', async () => {
      const result = await captureStorybookScreenshotsTool({
        stories: ['src/components/Link.stories.tsx'],
        port: 9009,
      })

      expect(result.outputDir).toBeDefined()
    })

    // Integration test - requires Storybook to be running
    it.skip('should capture screenshots when Storybook is running', async () => {
      const result = await captureStorybookScreenshotsTool({
        stories: ['src/components/Link.stories.tsx'],
      })

      expect(result.success).toBe(true)
      expect(result.screenshots.length).toBeGreaterThan(0)
      expect(result.outputDir).toBeDefined()
    }, 120000)
  })
})
