import { describe, it, expect, vi, beforeEach } from 'vitest'

import { resolveFontPackages } from './font-resolver'

vi.mock('node:module', () => {
  const createRequireFn = vi.fn((_url: string | URL) => ({
    resolve: vi.fn((path: string) => {
      if (path.includes('@fontsource') && path.endsWith('/index.css')) {
        return `/mock/node_modules/${path}`
      }
      throw new Error(`Cannot find module '${path}'`)
    }),
  }))

  return {
    default: { createRequire: createRequireFn },
    createRequire: createRequireFn,
  }
})

describe('resolveFontPackages', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('resolves font packages with CSS paths', () => {
    const packages = resolveFontPackages()

    expect(packages).toHaveLength(6)
    expect(packages[0]).toEqual({
      name: '@fontsource/ibm-plex-mono',
      cssPath: '/mock/node_modules/@fontsource/ibm-plex-mono/index.css',
    })
    expect(packages[4]).toEqual({
      name: '@fontsource-variable/inter',
      cssPath: '/mock/node_modules/@fontsource-variable/inter/index.css',
    })
  })

  it('returns all packages with cssPath property', () => {
    const packages = resolveFontPackages()

    packages.forEach((pkg) => {
      expect(pkg).toHaveProperty('name')
      expect(pkg).toHaveProperty('cssPath')
      expect(typeof pkg.name).toBe('string')
      expect(pkg.cssPath === null || typeof pkg.cssPath === 'string').toBe(true)
    })
  })

  it('resolves all 6 font packages with expected names', () => {
    const packages = resolveFontPackages()

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
    const { createRequire } = vi.mocked(await import('node:module'))

    createRequire.mockReturnValueOnce({
      resolve: (path: string) => {
        if (path === '@fontsource/jetbrains-mono/index.css') {
          throw new Error(`Cannot find module '${path}'`)
        }
        return `/mock/node_modules/${path}`
      },
    } as unknown as ReturnType<typeof createRequire>)

    const packages = resolveFontPackages()
    const jetbrainsMonoPackage = packages.find((p) => p.name === '@fontsource/jetbrains-mono')

    expect(jetbrainsMonoPackage).toBeDefined()
    expect(jetbrainsMonoPackage?.cssPath).toBeNull()

    // Other packages should still resolve
    const interPackage = packages.find((p) => p.name === '@fontsource-variable/inter')
    expect(interPackage?.cssPath).toBe('/mock/node_modules/@fontsource-variable/inter/index.css')
  })

  it('returns all packages with cssPath: null when all resolutions fail', async () => {
    const { createRequire } = vi.mocked(await import('node:module'))

    createRequire.mockReturnValueOnce({
      resolve: (path: string) => {
        throw new Error(`Cannot find module '${path}'`)
      },
    } as unknown as ReturnType<typeof createRequire>)

    const packages = resolveFontPackages()

    expect(packages).toHaveLength(6)
    packages.forEach((pkg) => {
      expect(pkg.cssPath).toBeNull()
    })
  })

  it('each resolved package has correct name and cssPath structure', () => {
    const packages = resolveFontPackages()

    packages.forEach((pkg) => {
      expect(pkg.name).toMatch(/^@fontsource(-variable)?\/.+$/)

      if (pkg.cssPath !== null) {
        expect(pkg.cssPath).toContain(pkg.name)
        expect(pkg.cssPath).toMatch(/\/index\.css$/)
      }
    })
  })
})
