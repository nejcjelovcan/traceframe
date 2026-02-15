import { describe, it, expect, vi, beforeEach } from 'vitest'

import { resolveFontPackages } from './font-resolver'

vi.mock('node:module', () => {
  const createMockRequire = (basePath: string) => {
    const resolve = vi.fn((path: string) => {
      // Handle the two-level require pattern
      if (basePath.includes('import.meta.url')) {
        // First level: resolve ui-library from current module
        if (path === '@nejcjelovcan/traceframe-ui-library/package.json') {
          return '/mock/ui-library/package.json'
        }
        throw new Error(`Cannot find module '${path}'`)
      } else if (basePath.includes('/mock/ui-library')) {
        // Second level: resolve font packages from ui-library
        if (path.includes('@fontsource') && path.endsWith('/index.css')) {
          // Simulate some packages not being found
          const packageName = path.replace('/index.css', '')
          if (packageName === '@fontsource/missing-font') {
            throw new Error(`Cannot find module '${path}'`)
          }
          return `/mock/node_modules/${path}`
        }
        throw new Error(`Cannot find module '${path}'`)
      }
      throw new Error(`Cannot find module '${path}'`)
    })
    return { resolve }
  }

  return {
    default: { createRequire: createMockRequire },
    createRequire: vi.fn((url: string | URL) => createMockRequire(String(url))),
  }
})

vi.mock('node:path', () => {
  return {
    default: {
      dirname: (path: string) => path.replace('/package.json', ''),
    },
    dirname: vi.fn((path: string) => path.replace('/package.json', '')),
  }
})

describe('resolveFontPackages', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('resolves font packages from ui-library dependencies', async () => {
    const packages = await resolveFontPackages()

    expect(packages).toHaveLength(6)
    // In test environment, packages will have cssPath: null since we're mocking
    expect(packages[0]).toEqual({
      name: '@fontsource/ibm-plex-mono',
      cssPath: null,
    })
    expect(packages[3]).toEqual({
      name: '@fontsource-variable/ibm-plex-sans',
      cssPath: null,
    })
  })

  it('returns all packages with cssPath property', async () => {
    const packages = await resolveFontPackages()

    packages.forEach((pkg) => {
      expect(pkg).toHaveProperty('name')
      expect(pkg).toHaveProperty('cssPath')
      expect(typeof pkg.name).toBe('string')
      // cssPath can be either a string or null
      expect(pkg.cssPath === null || typeof pkg.cssPath === 'string').toBe(true)
    })
  })

  it('resolves all 6 font packages with expected names', async () => {
    const packages = await resolveFontPackages()

    expect(packages).toHaveLength(6)
    expect(packages.map((p) => p.name)).toEqual([
      '@fontsource/ibm-plex-mono',
      '@fontsource/jetbrains-mono',
      '@fontsource/space-mono',
      '@fontsource-variable/ibm-plex-sans',
      '@fontsource-variable/inter',
      '@fontsource-variable/space-grotesk',
    ])
  })

  it('returns cssPath: null for packages that fail to resolve', async () => {
    // Mock one package to fail
    const { createRequire } = await import('node:module')
    const mockCreateRequire = vi.mocked(createRequire)

    mockCreateRequire.mockImplementationOnce((url: string | URL) => {
      const urlString = String(url)
      if (urlString.includes('import.meta.url')) {
        return {
          resolve: (path: string) => {
            if (path === '@nejcjelovcan/traceframe-ui-library/package.json') {
              return '/mock/ui-library/package.json'
            }
            throw new Error(`Cannot find module '${path}'`)
          },
        } as ReturnType<typeof createRequire>
      }
      // UI library require that throws for some packages
      return {
        resolve: (path: string) => {
          if (path === '@fontsource/jetbrains-mono/index.css') {
            throw new Error(`Cannot find module '${path}'`)
          }
          return `/mock/node_modules/${path}`
        },
      } as ReturnType<typeof createRequire>
    })

    const packages = await resolveFontPackages()
    const jetbrainsMonoPackage = packages.find((p) => p.name === '@fontsource/jetbrains-mono')

    expect(jetbrainsMonoPackage).toBeDefined()
    expect(jetbrainsMonoPackage?.cssPath).toBeNull()
  })

  it('returns all packages with cssPath: null when ui-library fails to resolve', async () => {
    const { createRequire } = await import('node:module')
    const mockCreateRequire = vi.mocked(createRequire)

    // Mock to fail resolving ui-library itself
    mockCreateRequire.mockImplementationOnce((_url: string | URL) => {
      return {
        resolve: (path: string) => {
          throw new Error(`Cannot find module '${path}'`)
        },
      } as ReturnType<typeof createRequire>
    })

    const packages = await resolveFontPackages()

    expect(packages).toHaveLength(6)
    packages.forEach((pkg) => {
      expect(pkg.cssPath).toBeNull()
    })
  })

  it('each resolved package has correct name and cssPath structure', async () => {
    const packages = await resolveFontPackages()

    packages.forEach((pkg) => {
      expect(pkg.name).toMatch(/^@fontsource(-variable)?\/.+$/)

      // cssPath should be either a valid path string or null
      if (pkg.cssPath !== null) {
        expect(pkg.cssPath).toContain(pkg.name)
        expect(pkg.cssPath).toMatch(/\/index\.css$/)
      }
    })
  })
})
