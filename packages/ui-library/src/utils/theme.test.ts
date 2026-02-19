import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { applyMode, applyTheme, MODES, THEMES } from './theme'

describe('theme utilities', () => {
  beforeEach(() => {
    // Reset document classes
    document.documentElement.classList.remove('dark', 'light', 'arctic', 'forge', 'mist', 'aura')
  })

  afterEach(() => {
    document.documentElement.classList.remove('dark', 'light', 'arctic', 'forge', 'mist', 'aura')
  })

  describe('MODES constant', () => {
    it('contains light and dark modes', () => {
      expect(MODES).toContain('light')
      expect(MODES).toContain('dark')
      expect(MODES.length).toBe(2)
    })
  })

  describe('THEMES constant', () => {
    it('contains all theme options', () => {
      expect(THEMES).toContain('arctic')
      expect(THEMES).toContain('forge')
      expect(THEMES).toContain('mist')
      expect(THEMES).toContain('aura')
      expect(THEMES.length).toBe(4)
    })
  })

  describe('applyMode', () => {
    it('adds dark class and removes light class for dark mode', () => {
      document.documentElement.classList.add('light')

      applyMode('dark')

      expect(document.documentElement.classList.contains('dark')).toBe(true)
      expect(document.documentElement.classList.contains('light')).toBe(false)
    })

    it('adds light class and removes dark class for light mode', () => {
      document.documentElement.classList.add('dark')

      applyMode('light')

      expect(document.documentElement.classList.contains('light')).toBe(true)
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
  })

  describe('applyTheme', () => {
    it('adds theme class to document', () => {
      applyTheme('arctic')
      expect(document.documentElement.classList.contains('arctic')).toBe(true)
    })

    it('removes all other theme classes when applying a new theme', () => {
      document.documentElement.classList.add('arctic')

      applyTheme('forge')

      expect(document.documentElement.classList.contains('forge')).toBe(true)
      expect(document.documentElement.classList.contains('arctic')).toBe(false)
    })

    it('works for all themes', () => {
      for (const theme of THEMES) {
        applyTheme(theme)
        expect(document.documentElement.classList.contains(theme)).toBe(true)

        // Clean up for next iteration
        document.documentElement.classList.remove(theme)
      }
    })
  })
})
