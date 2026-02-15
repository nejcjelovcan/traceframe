/**
 * @module vite
 *
 * Vite plugin exports for handling @fontsource font loading in Traceframe projects.
 *
 * This module provides a Vite plugin that creates a virtual module for importing
 * font CSS files, solving development mode issues where esbuild strips CSS imports.
 */

export {
  traceframeFontsPlugin,
  traceframeFontsPlugin as default,
  type TraceframeFontsPluginOptions,
} from './vite-fontsource-plugin.js'

export { resolveFontPackages, type ResolvedFontPackage } from './font-resolver.js'

/**
 * The virtual module ID that can be imported to load all font CSS files.
 *
 * @example
 * ```typescript
 * // In your app's entry point or main component
 * import 'virtual:traceframe-fonts'
 * ```
 *
 * @example
 * ```typescript
 * // TypeScript declaration to avoid type errors
 * declare module 'virtual:traceframe-fonts' {
 *   // Virtual module for font imports
 * }
 * ```
 */
export const VIRTUAL_FONTS_MODULE_ID = 'virtual:traceframe-fonts'
