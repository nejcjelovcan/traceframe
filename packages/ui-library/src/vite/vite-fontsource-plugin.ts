import type { Plugin } from 'vite'

import { resolveFontPackages, type ResolvedFontPackage } from './font-resolver.js'

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

export function traceframeFontsPlugin(options: TraceframeFontsPluginOptions = {}): Plugin {
  const { cache = true, logWarnings = true } = options

  let fontPackages: ResolvedFontPackage[] = []
  let isResolved = false

  return {
    name: 'vite-plugin-traceframe-fonts',
    enforce: 'pre',

    async buildStart() {
      if (!cache || !isResolved) {
        fontPackages = await resolveFontPackages()
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
