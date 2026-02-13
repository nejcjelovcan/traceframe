#!/usr/bin/env node
import StyleDictionary from 'style-dictionary'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import cssPaletteFormatter from '../style-dictionary/formatters/css-palette.js'
import cssSemanticFormatter from '../style-dictionary/formatters/css-semantic.js'
import cssThemeFormatter from '../style-dictionary/formatters/css-theme.js'
import tsTokenMetadataFormatter from '../style-dictionary/formatters/ts-token-metadata.js'
import jsonTailwindFormatter from '../style-dictionary/formatters/json-tailwind.js'
import jsonTailwindFontSizeFormatter from '../style-dictionary/formatters/json-tailwind-fontsize.js'
import config from '../style-dictionary/config.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Register custom formatters
StyleDictionary.registerFormat({
  name: 'css/palette',
  format: cssPaletteFormatter,
})

StyleDictionary.registerFormat({
  name: 'css/semantic',
  format: cssSemanticFormatter,
})

StyleDictionary.registerFormat({
  name: 'css/theme',
  format: cssThemeFormatter,
})

StyleDictionary.registerFormat({
  name: 'ts/token-metadata',
  format: tsTokenMetadataFormatter,
})

StyleDictionary.registerFormat({
  name: 'json/tailwind',
  format: jsonTailwindFormatter,
})

StyleDictionary.registerFormat({
  name: 'json/tailwind-fontsize',
  format: jsonTailwindFontSizeFormatter,
})

// Custom transform to handle RGB space-separated values
StyleDictionary.registerTransform({
  name: 'color/rgb-space-separated',
  type: 'value',
  filter: (token) => token.$type === 'color' || token.type === 'color',
  transform: (token) => {
    const value = token.$value || token.value

    // Handle token references - they'll be resolved by Style Dictionary
    if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
      return value
    }

    // For direct RGB values (e.g., "248 250 252")
    // Return them as-is for CSS custom properties
    return value
  },
})

async function buildTokens() {
  console.log('Building design tokens with Style Dictionary...\n')

  try {
    // Build each platform
    const platforms = Object.keys(config.platforms)

    for (const platform of platforms) {
      console.log(`Building ${platform}...`)

      // Create a new Style Dictionary instance with the config
      const platformConfig = config.platforms[platform]
      const sd = new StyleDictionary({
        source: platformConfig.source,
        platforms: {
          [platform]: platformConfig,
        },
      })

      sd.log.verbosity = 'verbose'

      // Build the platform
      await sd.buildAllPlatforms()
      console.log(`✓ Built ${platform}`)
    }

    console.log('\n✅ All tokens built successfully!')
  } catch (error) {
    console.error('Build failed:', error)
    process.exit(1)
  }
}

buildTokens()
