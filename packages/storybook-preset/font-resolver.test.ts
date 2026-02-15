import { describe, it, expect, vi, beforeEach } from 'vitest'
import { resolveFontPackages } from './font-resolver'

vi.mock('node:module', () => ({
  createRequire: vi.fn(),
}))

describe('resolveFontPackages', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('returns an array of ResolvedFontPackage objects', async () => {
    const mockRequire = {
      resolve: vi.fn().mockImplementation((path: string) => {
        if (path === '@nejcjelovcan/traceframe-ui-library/package.json') {
          return '/path/to/ui-library/package.json'
        }
        if (path.endsWith('/index.css')) {
          return `/path/to/${path}`
        }
        throw new Error('Not found')
      }),
    }

    const { createRequire } = await import('node:module')
    // @ts-expect-error - mocked function
    createRequire.mockReturnValue(mockRequire)

    const result = await resolveFontPackages()

    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBe(6)
    expect(result[0]).toHaveProperty('name')
    expect(result[0]).toHaveProperty('cssPath')
  })

  it('handles missing font packages gracefully', async () => {
    const mockRequire = {
      resolve: vi.fn().mockImplementation((path: string) => {
        if (path === '@nejcjelovcan/traceframe-ui-library/package.json') {
          return '/path/to/ui-library/package.json'
        }
        throw new Error('Font package not found')
      }),
    }

    const { createRequire } = await import('node:module')
    // @ts-expect-error - mocked function
    createRequire.mockReturnValue(mockRequire)

    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const result = await resolveFontPackages()

    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBe(6)
    result.forEach((pkg) => {
      expect(pkg.cssPath).toBeNull()
    })

    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('handles missing ui-library gracefully', async () => {
    const mockRequire = {
      resolve: vi.fn().mockImplementation(() => {
        throw new Error('ui-library not found')
      }),
    }

    const { createRequire } = await import('node:module')
    // @ts-expect-error - mocked function
    createRequire.mockReturnValue(mockRequire)

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const result = await resolveFontPackages()

    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBe(6)
    result.forEach((pkg) => {
      expect(pkg.cssPath).toBeNull()
    })

    expect(consoleSpy).toHaveBeenCalledWith(
      '[vite-plugin-traceframe-fonts] Failed to resolve ui-library:',
      expect.any(Error)
    )
    consoleSpy.mockRestore()
  })

  it('includes all expected font packages', async () => {
    const mockRequire = {
      resolve: vi.fn().mockImplementation((path: string) => {
        if (path === '@nejcjelovcan/traceframe-ui-library/package.json') {
          return '/path/to/ui-library/package.json'
        }
        if (path.endsWith('/index.css')) {
          return `/path/to/${path}`
        }
        throw new Error('Not found')
      }),
    }

    const { createRequire } = await import('node:module')
    // @ts-expect-error - mocked function
    createRequire.mockReturnValue(mockRequire)

    const result = await resolveFontPackages()

    const packageNames = result.map((p) => p.name)
    expect(packageNames).toContain('@fontsource/ibm-plex-mono')
    expect(packageNames).toContain('@fontsource/jetbrains-mono')
    expect(packageNames).toContain('@fontsource/space-mono')
    expect(packageNames).toContain('@fontsource-variable/ibm-plex-sans')
    expect(packageNames).toContain('@fontsource-variable/inter')
    expect(packageNames).toContain('@fontsource-variable/space-grotesk')
  })
})
