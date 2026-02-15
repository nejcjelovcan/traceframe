import { describe, it, expect, vi, beforeEach } from 'vitest'
import { resolveFontPackages } from './font-resolver'

vi.mock('node:module', async () => ({
  createRequire: vi.fn(() => ({
    resolve: vi.fn((path: string) => {
      if (path === '@nejcjelovcan/traceframe-ui-library/package.json') {
        return '/mock/ui-library/package.json'
      }
      if (path.includes('@fontsource')) {
        return `/mock/node_modules/${path}`
      }
      throw new Error(`Cannot find module '${path}'`)
    }),
  })),
}))

vi.mock('node:path', async () => ({
  dirname: vi.fn((path: string) => path.replace('/package.json', '')),
}))

describe('resolveFontPackages', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('resolves font packages from ui-library dependencies', async () => {
    const packages = await resolveFontPackages()

    expect(packages).toHaveLength(6)
    expect(packages[0]).toEqual({
      name: '@fontsource/ibm-plex-mono',
      cssPath: '/mock/node_modules/@fontsource/ibm-plex-mono/index.css',
    })
    expect(packages[3]).toEqual({
      name: '@fontsource-variable/ibm-plex-sans',
      cssPath: '/mock/node_modules/@fontsource-variable/ibm-plex-sans/index.css',
    })
  })

  it('returns all packages with cssPath property', async () => {
    const packages = await resolveFontPackages()

    packages.forEach((pkg) => {
      expect(pkg).toHaveProperty('name')
      expect(pkg).toHaveProperty('cssPath')
      expect(typeof pkg.name).toBe('string')
    })
  })
})
