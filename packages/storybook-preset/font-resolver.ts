import { dirname } from 'node:path'
import { createRequire } from 'node:module'

export interface ResolvedFontPackage {
  name: string
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
