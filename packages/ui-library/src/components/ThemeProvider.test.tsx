import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { ThemeProvider, useTheme } from './ThemeProvider'

describe('ThemeProvider', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark', 'light', 'arctic', 'forge', 'mist')
  })

  afterEach(() => {
    document.documentElement.classList.remove('dark', 'light', 'arctic', 'forge', 'mist')
  })

  describe('mode', () => {
    it('defaults to light mode', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      })

      expect(result.current.mode).toBe('light')
    })

    it('respects defaultMode prop', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider defaultMode="dark">{children}</ThemeProvider>,
      })

      expect(result.current.mode).toBe('dark')
    })

    it('updates mode when setMode is called', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      })

      act(() => {
        result.current.setMode('dark')
      })

      expect(result.current.mode).toBe('dark')
    })

    it('applies dark class to document when mode is dark', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      })

      act(() => {
        result.current.setMode('dark')
      })

      expect(document.documentElement.classList.contains('dark')).toBe(true)
      expect(document.documentElement.classList.contains('light')).toBe(false)
    })

    it('applies light class to document when mode is light', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider defaultMode="dark">{children}</ThemeProvider>,
      })

      act(() => {
        result.current.setMode('light')
      })

      expect(document.documentElement.classList.contains('light')).toBe(true)
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
  })

  describe('theme', () => {
    it('defaults to arctic theme', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      })

      expect(result.current.theme).toBe('arctic')
    })

    it('respects defaultTheme prop', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider defaultTheme="arctic">{children}</ThemeProvider>,
      })

      expect(result.current.theme).toBe('arctic')
    })

    it('updates theme when setTheme is called', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      })

      act(() => {
        result.current.setTheme('arctic')
      })

      expect(result.current.theme).toBe('arctic')
    })

    it('applies theme class to document', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      })

      act(() => {
        result.current.setTheme('arctic')
      })

      expect(document.documentElement.classList.contains('arctic')).toBe(true)
    })

    it('removes previous theme class when switching', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider defaultTheme="arctic">{children}</ThemeProvider>,
      })

      expect(document.documentElement.classList.contains('arctic')).toBe(true)

      act(() => {
        result.current.setTheme('forge')
      })

      expect(document.documentElement.classList.contains('arctic')).toBe(false)
      expect(document.documentElement.classList.contains('forge')).toBe(true)
    })
  })

  describe('useTheme hook', () => {
    it('throws when useTheme is used outside ThemeProvider', () => {
      expect(() => {
        renderHook(() => useTheme())
      }).toThrow('useTheme must be used within a ThemeProvider')
    })
  })
})
