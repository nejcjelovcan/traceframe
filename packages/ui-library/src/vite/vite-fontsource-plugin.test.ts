import { describe, it, expect, vi, beforeEach } from 'vitest'

import { resolveFontPackages } from './font-resolver.js'
import { traceframeFontsPlugin } from './vite-fontsource-plugin'

// Mock the font resolver module
vi.mock('./font-resolver.js', () => ({
  resolveFontPackages: vi.fn(),
}))

describe('traceframeFontsPlugin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset the mock to default resolved state
    vi.mocked(resolveFontPackages).mockReturnValue([
      { name: '@fontsource/ibm-plex-mono', cssPath: '/path/to/ibm-plex-mono/index.css' },
      { name: '@fontsource/jetbrains-mono', cssPath: '/path/to/jetbrains-mono/index.css' },
      { name: '@fontsource/space-mono', cssPath: '/path/to/space-mono/index.css' },
      { name: '@fontsource-variable/ibm-plex-sans', cssPath: '/path/to/ibm-plex-sans/index.css' },
      { name: '@fontsource-variable/inter', cssPath: '/path/to/inter/index.css' },
      { name: '@fontsource-variable/space-grotesk', cssPath: '/path/to/space-grotesk/index.css' },
    ])
  })

  it('creates a plugin with correct name', () => {
    const plugin = traceframeFontsPlugin()
    expect(plugin.name).toBe('vite-plugin-traceframe-fonts')
  })

  it('enforces pre mode', () => {
    const plugin = traceframeFontsPlugin()
    expect(plugin.enforce).toBe('pre')
  })

  it('resolves virtual module ID correctly', () => {
    const plugin = traceframeFontsPlugin()
    const resolveId = plugin.resolveId as ((id: string) => string | undefined) | undefined
    if (typeof resolveId === 'function') {
      const result = resolveId('virtual:traceframe-fonts')
      expect(result).toBe('\0virtual:traceframe-fonts')
    }
  })

  it('returns undefined for non-virtual module IDs', () => {
    const plugin = traceframeFontsPlugin()
    const resolveId = plugin.resolveId as ((id: string) => string | undefined) | undefined
    if (typeof resolveId === 'function') {
      const result = resolveId('some-other-module')
      expect(result).toBeUndefined()
    }
  })

  it('excludes font packages from optimization', () => {
    const plugin = traceframeFontsPlugin()
    const config: { optimizeDeps: { exclude?: string[] } } = { optimizeDeps: {} }
    // @ts-expect-error - config is partial for testing
    plugin.config?.(config, { command: 'serve', mode: 'development' })

    expect(config.optimizeDeps.exclude).toBeDefined()
    expect(config.optimizeDeps.exclude).toContain('@nejcjelovcan/traceframe-ui-library/fonts')
    expect(config.optimizeDeps.exclude).toContain('@fontsource/ibm-plex-mono')
    expect(config.optimizeDeps.exclude).toContain('@fontsource-variable/inter')
  })

  it('respects existing optimizeDeps config', () => {
    const plugin = traceframeFontsPlugin()
    const config = {
      optimizeDeps: {
        exclude: ['existing-package'],
      },
    }
    // @ts-expect-error - config is partial for testing
    plugin.config?.(config, { command: 'serve', mode: 'development' })

    expect(config.optimizeDeps.exclude).toContain('existing-package')
    expect(config.optimizeDeps.exclude).toContain('@nejcjelovcan/traceframe-ui-library/fonts')
  })

  it('avoids duplicate exclusions', () => {
    const plugin = traceframeFontsPlugin()
    const config = {
      optimizeDeps: {
        exclude: ['@fontsource/ibm-plex-mono'],
      },
    }
    // @ts-expect-error - config is partial for testing
    plugin.config?.(config, { command: 'serve', mode: 'development' })

    const duplicates = config.optimizeDeps.exclude?.filter(
      (item: string) => item === '@fontsource/ibm-plex-mono'
    )
    expect(duplicates).toHaveLength(1)
  })

  it('respects cache option', () => {
    const plugin = traceframeFontsPlugin({ cache: false })
    expect(plugin.name).toBe('vite-plugin-traceframe-fonts')
  })

  it('respects logWarnings option', () => {
    const plugin = traceframeFontsPlugin({ logWarnings: false })
    expect(plugin.name).toBe('vite-plugin-traceframe-fonts')
  })

  describe('buildStart() hook', () => {
    it('calls resolveFontPackages() during buildStart', async () => {
      const plugin = traceframeFontsPlugin()
      const context = { warn: vi.fn() }

      if (typeof plugin.buildStart === 'function') {
        await plugin.buildStart.call(context as never, {} as never)
      }

      expect(resolveFontPackages).toHaveBeenCalledTimes(1)
    })

    it('caches resolved packages when cache: true (default)', async () => {
      const plugin = traceframeFontsPlugin()
      const context = { warn: vi.fn() }

      // First buildStart
      if (typeof plugin.buildStart === 'function') {
        await plugin.buildStart.call(context as never, {} as never)
      }
      expect(resolveFontPackages).toHaveBeenCalledTimes(1)

      // Second buildStart - should not re-resolve
      if (typeof plugin.buildStart === 'function') {
        await plugin.buildStart.call(context as never, {} as never)
      }
      expect(resolveFontPackages).toHaveBeenCalledTimes(1) // Still 1
    })

    it('re-resolves packages when cache: false', async () => {
      const plugin = traceframeFontsPlugin({ cache: false })
      const context = { warn: vi.fn() }

      // First buildStart
      if (typeof plugin.buildStart === 'function') {
        await plugin.buildStart.call(context as never, {} as never)
      }
      expect(resolveFontPackages).toHaveBeenCalledTimes(1)

      // Second buildStart - should re-resolve
      if (typeof plugin.buildStart === 'function') {
        await plugin.buildStart.call(context as never, {} as never)
      }
      expect(resolveFontPackages).toHaveBeenCalledTimes(2)
    })

    it('emits warning when font packages have cssPath: null', async () => {
      vi.mocked(resolveFontPackages).mockReturnValue([
        { name: '@fontsource/ibm-plex-mono', cssPath: '/path/to/ibm-plex-mono/index.css' },
        { name: '@fontsource/jetbrains-mono', cssPath: null }, // Missing
        { name: '@fontsource/space-mono', cssPath: null }, // Missing
        { name: '@fontsource-variable/ibm-plex-sans', cssPath: '/path/to/ibm-plex-sans/index.css' },
        { name: '@fontsource-variable/inter', cssPath: '/path/to/inter/index.css' },
        { name: '@fontsource-variable/space-grotesk', cssPath: '/path/to/space-grotesk/index.css' },
      ])

      const plugin = traceframeFontsPlugin()
      const context = { warn: vi.fn() }

      if (typeof plugin.buildStart === 'function') {
        await plugin.buildStart.call(context as never, {} as never)
      }

      expect(context.warn).toHaveBeenCalledTimes(1)
      expect(context.warn).toHaveBeenCalledWith(
        'Missing font packages: @fontsource/jetbrains-mono, @fontsource/space-mono. ' +
          'These fonts will not be loaded. Install them in ui-library to fix.'
      )
    })

    it('does not warn when logWarnings: false', async () => {
      vi.mocked(resolveFontPackages).mockReturnValue([
        { name: '@fontsource/ibm-plex-mono', cssPath: null },
        { name: '@fontsource/jetbrains-mono', cssPath: null },
        { name: '@fontsource/space-mono', cssPath: null },
        { name: '@fontsource-variable/ibm-plex-sans', cssPath: null },
        { name: '@fontsource-variable/inter', cssPath: null },
        { name: '@fontsource-variable/space-grotesk', cssPath: null },
      ])

      const plugin = traceframeFontsPlugin({ logWarnings: false })
      const context = { warn: vi.fn() }

      if (typeof plugin.buildStart === 'function') {
        await plugin.buildStart.call(context as never, {} as never)
      }

      expect(context.warn).not.toHaveBeenCalled()
    })

    it('does not warn when all packages resolve successfully', async () => {
      // Default mock has all packages with valid cssPath
      const plugin = traceframeFontsPlugin()
      const context = { warn: vi.fn() }

      if (typeof plugin.buildStart === 'function') {
        await plugin.buildStart.call(context as never, {} as never)
      }

      expect(context.warn).not.toHaveBeenCalled()
    })
  })

  describe('load() hook', () => {
    it('returns CSS import statements for resolved font packages', async () => {
      const plugin = traceframeFontsPlugin()
      const context = { warn: vi.fn() }

      // First need to call buildStart to resolve packages
      if (typeof plugin.buildStart === 'function') {
        await plugin.buildStart.call(context as never, {} as never)
      }

      const result =
        typeof plugin.load === 'function'
          ? plugin.load.call(context as never, '\0virtual:traceframe-fonts')
          : undefined

      expect(result).toContain("import '/path/to/ibm-plex-mono/index.css'")
      expect(result).toContain("import '/path/to/jetbrains-mono/index.css'")
      expect(result).toContain("import '/path/to/space-mono/index.css'")
      expect(result).toContain("import '/path/to/ibm-plex-sans/index.css'")
      expect(result).toContain("import '/path/to/inter/index.css'")
      expect(result).toContain("import '/path/to/space-grotesk/index.css'")
    })

    it('returns "// No font packages found" when no packages resolve', async () => {
      vi.mocked(resolveFontPackages).mockReturnValue([
        { name: '@fontsource/ibm-plex-mono', cssPath: null },
        { name: '@fontsource/jetbrains-mono', cssPath: null },
        { name: '@fontsource/space-mono', cssPath: null },
        { name: '@fontsource-variable/ibm-plex-sans', cssPath: null },
        { name: '@fontsource-variable/inter', cssPath: null },
        { name: '@fontsource-variable/space-grotesk', cssPath: null },
      ])

      const plugin = traceframeFontsPlugin({ logWarnings: false })
      const context = { warn: vi.fn() }

      if (typeof plugin.buildStart === 'function') {
        await plugin.buildStart.call(context as never, {} as never)
      }

      const result =
        typeof plugin.load === 'function'
          ? plugin.load.call(context as never, '\0virtual:traceframe-fonts')
          : undefined

      expect(result).toBe('// No font packages found')
    })

    it('returns undefined for non-virtual module IDs', async () => {
      const plugin = traceframeFontsPlugin()
      const context = { warn: vi.fn() }

      if (typeof plugin.buildStart === 'function') {
        await plugin.buildStart.call(context as never, {} as never)
      }

      const result =
        typeof plugin.load === 'function'
          ? plugin.load.call(context as never, 'some-other-module')
          : undefined

      expect(result).toBeUndefined()
    })

    it('only includes CSS paths that are not null', async () => {
      vi.mocked(resolveFontPackages).mockReturnValue([
        { name: '@fontsource/ibm-plex-mono', cssPath: '/path/to/ibm-plex-mono/index.css' },
        { name: '@fontsource/jetbrains-mono', cssPath: null }, // Missing
        { name: '@fontsource/space-mono', cssPath: null }, // Missing
        { name: '@fontsource-variable/ibm-plex-sans', cssPath: '/path/to/ibm-plex-sans/index.css' },
        { name: '@fontsource-variable/inter', cssPath: null }, // Missing
        { name: '@fontsource-variable/space-grotesk', cssPath: '/path/to/space-grotesk/index.css' },
      ])

      const plugin = traceframeFontsPlugin({ logWarnings: false })
      const context = { warn: vi.fn() }

      if (typeof plugin.buildStart === 'function') {
        await plugin.buildStart.call(context as never, {} as never)
      }

      const result =
        typeof plugin.load === 'function'
          ? plugin.load.call(context as never, '\0virtual:traceframe-fonts')
          : undefined

      expect(result).toContain("import '/path/to/ibm-plex-mono/index.css'")
      expect(result).not.toContain('jetbrains-mono')
      expect(result).not.toContain('space-mono')
      expect(result).toContain("import '/path/to/ibm-plex-sans/index.css'")
      expect(result).not.toContain('inter')
      expect(result).toContain("import '/path/to/space-grotesk/index.css'")

      // Should have exactly 3 import statements
      const imports =
        typeof result === 'string'
          ? result.split('\n').filter((line: string) => line.startsWith('import'))
          : []
      expect(imports).toHaveLength(3)
    })
  })
})
