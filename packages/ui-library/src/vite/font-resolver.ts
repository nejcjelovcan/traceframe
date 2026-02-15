/**
 * @module font-resolver
 *
 * Resolves @fontsource font packages from ui-library's perspective using
 * Node's module resolution. Since this module lives inside ui-library,
 * createRequire(import.meta.url) already resolves from the correct context.
 */

import { createRequire } from 'node:module'

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
 * Since this module is part of ui-library, createRequire(import.meta.url)
 * resolves from ui-library's perspective directly — no intermediate
 * package.json resolution needed.
 *
 * @returns Array of font packages with their CSS paths
 *
 * @example
 * ```typescript
 * const packages = resolveFontPackages()
 * // [
 * //   { name: '@fontsource/inter', cssPath: '/path/to/inter/index.css' },
 * //   { name: '@fontsource/ibm-plex-mono', cssPath: null }, // Not installed
 * //   ...
 * // ]
 * ```
 */
export function resolveFontPackages(): ResolvedFontPackage[] {
  const require = createRequire(import.meta.url)

  return FONT_PACKAGES.map((pkg) => {
    try {
      const cssPath = require.resolve(`${pkg}/index.css`)
      return { name: pkg, cssPath }
    } catch {
      return { name: pkg, cssPath: null }
    }
  })
}
