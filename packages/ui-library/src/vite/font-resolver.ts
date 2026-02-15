/**
 * @module font-resolver
 *
 * Resolves @fontsource font packages from ui-library's perspective using
 * Node's module resolution. This ensures fonts are resolved correctly
 * regardless of where the plugin is executed from (monorepo root, app, etc.).
 */

import { createRequire } from 'node:module'
import { dirname } from 'node:path'

export interface ResolvedFontPackage {
  /** The package name (e.g., '@fontsource/inter') */
  name: string
  /** Absolute path to the package's CSS file, or null if not found */
  cssPath: string | null
}

const FONT_PACKAGES = [
  '@fontsource/ibm-plex-mono',
  '@fontsource/jetbrains-mono',
  '@fontsource/space-mono',
  '@fontsource-variable/ibm-plex-sans',
  '@fontsource-variable/inter',
  '@fontsource-variable/space-grotesk',
] as const

/**
 * Resolves font packages from ui-library's installed dependencies.
 *
 * Uses a two-level require pattern to ensure correct module resolution:
 * 1. First, resolves ui-library's location from the current module
 * 2. Then, creates a require function from ui-library's perspective
 * 3. Finally, resolves font packages as if requiring from ui-library
 *
 * This approach ensures that font packages are resolved from ui-library's
 * node_modules, not from the consuming app's node_modules. This is critical
 * in monorepo setups where packages may be hoisted to different levels.
 *
 * @returns Promise resolving to an array of font packages with their CSS paths
 *
 * @example
 * ```typescript
 * const packages = await resolveFontPackages()
 * // [
 * //   { name: '@fontsource/inter', cssPath: '/path/to/inter/index.css' },
 * //   { name: '@fontsource/ibm-plex-mono', cssPath: null }, // Not installed
 * //   ...
 * // ]
 * ```
 */
export async function resolveFontPackages(): Promise<ResolvedFontPackage[]> {
  const require = createRequire(import.meta.url)

  try {
    const uiLibraryPath = dirname(
      require.resolve('@nejcjelovcan/traceframe-ui-library/package.json')
    )

    const uiRequire = createRequire(uiLibraryPath + '/package.json')

    return FONT_PACKAGES.map((pkg) => {
      try {
        const cssPath = uiRequire.resolve(`${pkg}/index.css`)
        return { name: pkg, cssPath }
      } catch (error) {
        console.warn(`[vite-plugin-traceframe-fonts] Font package ${pkg} not found: ${error}`)
        return { name: pkg, cssPath: null }
      }
    })
  } catch (error) {
    console.error('[vite-plugin-traceframe-fonts] Failed to resolve ui-library:', error)
    return FONT_PACKAGES.map((pkg) => ({ name: pkg, cssPath: null }))
  }
}
