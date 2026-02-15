import { describe, it, expect } from 'vitest'
import {
  traceframeFontsPlugin,
  resolveFontPackages,
  VIRTUAL_FONTS_MODULE_ID,
} from '../index'

describe('storybook-preset exports', () => {
  it('exports traceframeFontsPlugin as a function', () => {
    expect(typeof traceframeFontsPlugin).toBe('function')
  })

  it('exports resolveFontPackages as a function', () => {
    expect(typeof resolveFontPackages).toBe('function')
  })

  it('exports VIRTUAL_FONTS_MODULE_ID constant', () => {
    expect(VIRTUAL_FONTS_MODULE_ID).toBe('virtual:traceframe-fonts')
  })

  it('traceframeFontsPlugin returns a valid Vite plugin object', () => {
    const plugin = traceframeFontsPlugin()
    expect(plugin).toHaveProperty('name')
    expect(plugin.name).toBe('vite-plugin-traceframe-fonts')
    expect(plugin).toHaveProperty('enforce')
    expect(plugin.enforce).toBe('pre')
    expect(typeof plugin.buildStart).toBe('function')
    expect(typeof plugin.resolveId).toBe('function')
    expect(typeof plugin.load).toBe('function')
    expect(typeof plugin.config).toBe('function')
  })

  it('resolveFontPackages returns a promise', () => {
    const result = resolveFontPackages()
    expect(result).toBeInstanceOf(Promise)
  })
})
