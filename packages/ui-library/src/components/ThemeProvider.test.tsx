import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ThemeProvider, useTheme } from './ThemeProvider'

describe('ThemeProvider', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark', 'light', 'arctic', 'forge', 'mist', 'aura')
    localStorage.clear()
  })

  afterEach(() => {
    document.documentElement.classList.remove('dark', 'light', 'arctic', 'forge', 'mist', 'aura')
    localStorage.clear()
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

  describe('localStorage persistence', () => {
    it('does not persist by default', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      })

      act(() => {
        result.current.setMode('dark')
        result.current.setTheme('forge')
      })

      expect(localStorage.getItem('traceframe-theme-mode')).toBeNull()
      expect(localStorage.getItem('traceframe-theme-theme')).toBeNull()
    })

    it('persists mode and theme when persistToStorage is true', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider persistToStorage>{children}</ThemeProvider>,
      })

      act(() => {
        result.current.setMode('dark')
        result.current.setTheme('forge')
      })

      expect(localStorage.getItem('traceframe-theme-mode')).toBe('dark')
      expect(localStorage.getItem('traceframe-theme-theme')).toBe('forge')
    })

    it('loads persisted values on mount', () => {
      localStorage.setItem('traceframe-theme-mode', 'dark')
      localStorage.setItem('traceframe-theme-theme', 'mist')

      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider persistToStorage>{children}</ThemeProvider>,
      })

      expect(result.current.mode).toBe('dark')
      expect(result.current.theme).toBe('mist')
      expect(document.documentElement.classList.contains('dark')).toBe(true)
      expect(document.documentElement.classList.contains('mist')).toBe(true)
    })

    it('falls back to defaults when stored values are invalid', () => {
      localStorage.setItem('traceframe-theme-mode', 'invalid-mode')
      localStorage.setItem('traceframe-theme-theme', 'invalid-theme')

      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => (
          <ThemeProvider persistToStorage defaultMode="light" defaultTheme="arctic">
            {children}
          </ThemeProvider>
        ),
      })

      expect(result.current.mode).toBe('light')
      expect(result.current.theme).toBe('arctic')
    })

    it('uses custom storage key when provided', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => (
          <ThemeProvider persistToStorage storageKey="custom-key">
            {children}
          </ThemeProvider>
        ),
      })

      act(() => {
        result.current.setMode('dark')
        result.current.setTheme('aura')
      })

      expect(localStorage.getItem('custom-key-mode')).toBe('dark')
      expect(localStorage.getItem('custom-key-theme')).toBe('aura')
      expect(localStorage.getItem('traceframe-theme-mode')).toBeNull()
      expect(localStorage.getItem('traceframe-theme-theme')).toBeNull()
    })

    it('handles localStorage unavailability gracefully', () => {
      const originalLocalStorage = window.localStorage
      const mockGetItem = vi.fn(() => {
        throw new Error('localStorage unavailable')
      })
      const mockSetItem = vi.fn(() => {
        throw new Error('localStorage unavailable')
      })

      Object.defineProperty(window, 'localStorage', {
        configurable: true,
        value: {
          getItem: mockGetItem,
          setItem: mockSetItem,
          clear: vi.fn(),
        },
      })

      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => (
          <ThemeProvider persistToStorage defaultMode="light" defaultTheme="arctic">
            {children}
          </ThemeProvider>
        ),
      })

      expect(result.current.mode).toBe('light')
      expect(result.current.theme).toBe('arctic')

      act(() => {
        result.current.setMode('dark')
      })

      expect(result.current.mode).toBe('dark')

      Object.defineProperty(window, 'localStorage', {
        configurable: true,
        value: originalLocalStorage,
      })
    })
  })
})
