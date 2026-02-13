import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

import {
  DEFAULT_STORYBOOK_PORT,
  DEFAULT_STARTUP_TIMEOUT_MS,
  STARTUP_CHECK_INTERVAL_MS,
  getUiLibraryPackagePath,
  isStorybookRunning,
} from './storybook-runner.js'

describe('storybook-runner', () => {
  describe('constants', () => {
    it('should have default port of 6006', () => {
      expect(DEFAULT_STORYBOOK_PORT).toBe(6006)
    })

    it('should have default startup timeout of 60 seconds', () => {
      expect(DEFAULT_STARTUP_TIMEOUT_MS).toBe(60000)
    })

    it('should have startup check interval of 1 second', () => {
      expect(STARTUP_CHECK_INTERVAL_MS).toBe(1000)
    })
  })

  describe('getUiLibraryPackagePath', () => {
    it('should return path to ui-library package', () => {
      const path = getUiLibraryPackagePath()
      expect(path).toBe('packages/ui-library')
    })
  })

  describe('isStorybookRunning', () => {
    beforeEach(() => {
      vi.stubGlobal('fetch', vi.fn())
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('should return true when fetch succeeds with ok response', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
      } as Response)

      const result = await isStorybookRunning(6006)

      expect(result).toBe(true)
      expect(fetch).toHaveBeenCalledWith('http://localhost:6006', expect.any(Object))
    })

    it('should return false when fetch succeeds but response is not ok', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
      } as Response)

      const result = await isStorybookRunning(6006)

      expect(result).toBe(false)
    })

    it('should return false when fetch throws an error', async () => {
      vi.mocked(fetch).mockRejectedValue(new Error('Connection refused'))

      const result = await isStorybookRunning(6006)

      expect(result).toBe(false)
    })

    it('should use the provided port in the URL', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
      } as Response)

      await isStorybookRunning(8080)

      expect(fetch).toHaveBeenCalledWith('http://localhost:8080', expect.any(Object))
    })
  })
})
