import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')

// Theme configurations - each theme references a palette and adds customizations
const themes = ['dusk', 'arctic', 'ember']

const config = {
  platforms: {
    // Generate palette CSS files (one per theme)
    // Description is read from $description in each palette JSON file
    ...Object.fromEntries(
      themes.map((theme) => [
        `palette-${theme}`,
        {
          source: [join(rootDir, `tokens/palettes/${theme}.json`)],
          transformGroup: 'css',
          transforms: ['attribute/cti', 'name/kebab', 'color/rgb-space-separated'],
          buildPath: join(rootDir, 'src/styles/generated/'),
          files: [
            {
              destination: `palette.${theme}.css`,
              format: 'css/palette',
              options: {
                theme,
                source: join(rootDir, `tokens/palettes/${theme}.json`),
              },
            },
          ],
        },
      ])
    ),

    // Generate semantic tokens CSS (light theme)
    'semantic-light': {
      source: [
        join(rootDir, 'tokens/palettes/dusk.json'),
        join(rootDir, 'tokens/semantic/light.json'),
      ],
      transformGroup: 'css',
      transforms: ['attribute/cti', 'name/kebab', 'color/rgb-space-separated'],
      buildPath: join(rootDir, 'src/styles/generated/'),
      files: [
        {
          destination: 'semantic.light.css',
          format: 'css/semantic',
          options: { theme: 'light' },
        },
      ],
    },
    // Generate semantic tokens CSS (dark theme)
    'semantic-dark': {
      source: [
        join(rootDir, 'tokens/palettes/dusk.json'),
        join(rootDir, 'tokens/semantic/dark.json'),
      ],
      transformGroup: 'css',
      transforms: ['attribute/cti', 'name/kebab', 'color/rgb-space-separated'],
      buildPath: join(rootDir, 'src/styles/generated/'),
      files: [
        {
          destination: 'semantic.dark.css',
          format: 'css/semantic',
          options: { theme: 'dark' },
        },
      ],
    },
    // Generate TypeScript token metadata
    'token-metadata': {
      source: [
        join(rootDir, 'tokens/palettes/dusk.json'),
        join(rootDir, 'tokens/semantic/light.json'),
        join(rootDir, 'tokens/themes/dusk.json'),
      ],
      transformGroup: 'js',
      buildPath: join(rootDir, 'src/styles/generated/'),
      files: [
        {
          destination: 'token-metadata.ts',
          format: 'ts/token-metadata',
        },
      ],
    },
    // Generate Tailwind v4 CSS theme configuration
    'tailwind-theme': {
      source: [
        join(rootDir, 'tokens/palettes/dusk.json'),
        join(rootDir, 'tokens/semantic/light.json'),
        join(rootDir, 'tokens/themes/dusk.json'),
      ],
      transformGroup: 'css',
      buildPath: join(rootDir, 'src/styles/generated/'),
      files: [
        {
          destination: 'tailwind-theme.css',
          format: 'css/tailwind-theme',
          options: {
            showFileHeader: true,
          },
        },
      ],
    },

    // Generate theme CSS files (typography, shadows, radius, spacing per theme)
    ...Object.fromEntries(
      themes.map((theme) => [
        `theme-${theme}`,
        {
          // Include typography as minimal source to trigger file creation
          // The formatter reads theme JSON directly for the actual output
          source: [join(rootDir, `tokens/themes/${theme}.json`)],
          transformGroup: 'css',
          buildPath: join(rootDir, 'src/styles/generated/'),
          files: [
            {
              destination: `theme.${theme}.css`,
              format: 'css/theme',
              options: {
                theme,
                source: join(rootDir, `tokens/themes/${theme}.json`),
              },
            },
          ],
        },
      ])
    ),
  },
}

export default config
