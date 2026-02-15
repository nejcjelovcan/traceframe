/**
 * @module vite-fontsource-plugin
 *
 * Vite plugin that solves development mode font loading issues for @fontsource packages.
 *
 * ## Problem
 *
 * When importing @fontsource CSS files directly in JavaScript/TypeScript files,
 * esbuild's pre-bundling process strips the CSS imports during development,
 * causing fonts not to load. This only affects development mode - production
 * builds work correctly.
 *
 * ## Solution
 *
 * This plugin creates a virtual module that imports all required font CSS files,
 * bypassing esbuild's pre-bundling and ensuring fonts load correctly in development.
 * The virtual module pattern is a common Vite/Rollup technique for generating
 * dynamic import statements at build time.
 */

import { resolveFontPackages, type ResolvedFontPackage } from './font-resolver.js'

import type { Plugin } from 'vite'

const VIRTUAL_MODULE_ID = 'virtual:traceframe-fonts'
const RESOLVED_VIRTUAL_ID = '\0' + VIRTUAL_MODULE_ID

const FONT_PACKAGES = [
  '@fontsource/ibm-plex-mono',
  '@fontsource/jetbrains-mono',
  '@fontsource/space-mono',
  '@fontsource-variable/ibm-plex-sans',
  '@fontsource-variable/inter',
  '@fontsource-variable/space-grotesk',
] as const

export interface TraceframeFontsPluginOptions {
  /**
   * Whether to cache resolved font paths
   * @default true
   */
  cache?: boolean
  /**
   * Whether to log warnings for missing packages
   * @default true
   */
  logWarnings?: boolean
}

/**
 * Creates a Vite plugin that handles @fontsource font loading for Traceframe.
 *
 * The plugin resolves font packages installed in ui-library and creates a
 * virtual module that imports their CSS files. This ensures fonts load correctly
 * in development mode despite esbuild's CSS stripping behavior.
 *
 * @param options - Plugin configuration options
 * @param options.cache - Whether to cache resolved font paths (default: true)
 * @param options.logWarnings - Whether to log warnings for missing packages (default: true)
 * @returns Vite plugin object
 *
 * @example
 * ```typescript
 * // vite.config.ts
 * import { defineConfig } from 'vite'
 * import { traceframeFontsPlugin } from '@nejcjelovcan/traceframe-ui-library/vite-plugin'
 *
 * export default defineConfig({
 *   plugins: [
 *     traceframeFontsPlugin({
 *       cache: true,        // Cache font resolutions (default)
 *       logWarnings: true,  // Warn about missing fonts (default)
 *     }),
 *   ],
 * })
 * ```
 *
 * @example
 * ```typescript
 * // main.tsx - Import the virtual module in your app
 * import 'virtual:traceframe-fonts'
 * ```
 */
export function traceframeFontsPlugin(options: TraceframeFontsPluginOptions = {}): Plugin {
  const { cache = true, logWarnings = true } = options

  let fontPackages: ResolvedFontPackage[] = []
  let isResolved = false

  return {
    name: 'vite-plugin-traceframe-fonts',
    enforce: 'pre',

    buildStart() {
      if (!cache || !isResolved) {
        fontPackages = resolveFontPackages()
        isResolved = true

        if (logWarnings) {
          const missing = fontPackages.filter((p) => !p.cssPath)
          if (missing.length > 0) {
            this.warn(
              `Missing font packages: ${missing.map((p) => p.name).join(', ')}. ` +
                'These fonts will not be loaded. Install them in ui-library to fix.'
            )
          }
        }
      }
    },

    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_ID
      }
    },

    load(id) {
      if (id === RESOLVED_VIRTUAL_ID) {
        const validPaths = fontPackages.filter((p) => p.cssPath).map((p) => p.cssPath)

        if (validPaths.length === 0) {
          return '// No font packages found'
        }

        return validPaths.map((path) => `import '${path}'`).join('\n')
      }
    },

    config(config) {
      if (!config.optimizeDeps) {
        config.optimizeDeps = {}
      }
      if (!config.optimizeDeps.exclude) {
        config.optimizeDeps.exclude = []
      }

      const excludes = ['@nejcjelovcan/traceframe-ui-library/fonts', ...FONT_PACKAGES]

      config.optimizeDeps.exclude = [
        ...config.optimizeDeps.exclude,
        ...excludes.filter((pkg) => !config.optimizeDeps!.exclude!.includes(pkg)),
      ]
    },
  }
}

export default traceframeFontsPlugin
