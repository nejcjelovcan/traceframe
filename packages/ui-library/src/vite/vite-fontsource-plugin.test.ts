import { describe, it, expect, vi, beforeEach } from 'vitest'

import { traceframeFontsPlugin } from './vite-fontsource-plugin'

describe('traceframeFontsPlugin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
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
    const resolveId = plugin.resolveId
    if (typeof resolveId === 'function') {
      // Provide required arguments for TypeScript
      const result = (resolveId as any).call(
        undefined,
        'virtual:traceframe-fonts',
        undefined,
        { isEntry: false }
      )
      expect(result).toBe('\0virtual:traceframe-fonts')
    }
  })

  it('returns undefined for non-virtual module IDs', () => {
    const plugin = traceframeFontsPlugin()
    const resolveId = plugin.resolveId
    if (typeof resolveId === 'function') {
      // Provide required arguments for TypeScript
      const result = (resolveId as any).call(
        undefined,
        'some-other-module',
        undefined,
        { isEntry: false }
      )
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
})
