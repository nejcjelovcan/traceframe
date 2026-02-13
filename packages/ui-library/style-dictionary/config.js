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
    // Generate Tailwind colors JSON
    'tailwind-colors': {
      source: [
        join(rootDir, 'tokens/palettes/dusk.json'), // Include palette so references resolve
        join(rootDir, 'tokens/semantic/light.json'),
      ],
      transformGroup: 'js',
      buildPath: join(rootDir, 'src/styles/generated/'),
      files: [
        {
          destination: 'tailwind-colors.json',
          format: 'json/tailwind',
          options: {
            tokenPath: 'color',
            cssVarPrefix: '--color',
            valueTemplate: 'rgb(var({VAR}) / <alpha-value>)',
          },
        },
      ],
    },
    // Generate Tailwind font families JSON
    'tailwind-fonts': {
      source: [join(rootDir, 'tokens/themes/dusk.json')],
      transformGroup: 'js',
      buildPath: join(rootDir, 'src/styles/generated/'),
      files: [
        {
          destination: 'tailwind-fonts.json',
          format: 'json/tailwind',
          options: {
            tokenPath: 'fontFamily',
            cssVarPrefix: '--font',
            valueTemplate: 'var({VAR})',
            flatOutput: true,
          },
        },
      ],
    },
    // Generate Tailwind spacing JSON
    'tailwind-spacing': {
      source: [join(rootDir, 'tokens/themes/dusk.json')],
      transformGroup: 'js',
      buildPath: join(rootDir, 'src/styles/generated/'),
      files: [
        {
          destination: 'tailwind-spacing.json',
          format: 'json/tailwind',
          options: {
            tokenPath: 'spacing',
            cssVarPrefix: '--spacing',
            valueTemplate: 'var({VAR})',
            flatOutput: true,
          },
        },
      ],
    },
    // Generate Tailwind sizing JSON
    'tailwind-sizing': {
      source: [join(rootDir, 'tokens/themes/dusk.json')],
      transformGroup: 'js',
      buildPath: join(rootDir, 'src/styles/generated/'),
      files: [
        {
          destination: 'tailwind-sizing.json',
          format: 'json/tailwind',
          options: {
            tokenPath: 'size',
            cssVarPrefix: '--size',
            valueTemplate: 'var({VAR})',
            flatOutput: true,
          },
        },
      ],
    },
    // Generate Tailwind border radius JSON
    'tailwind-radius': {
      source: [join(rootDir, 'tokens/themes/dusk.json')],
      transformGroup: 'js',
      buildPath: join(rootDir, 'src/styles/generated/'),
      files: [
        {
          destination: 'tailwind-radius.json',
          format: 'json/tailwind',
          options: {
            tokenPath: 'borderRadius',
            cssVarPrefix: '--radius',
            valueTemplate: 'var({VAR})',
            flatOutput: true,
          },
        },
      ],
    },
    // Generate Tailwind shadows JSON
    'tailwind-shadows': {
      source: [join(rootDir, 'tokens/themes/dusk.json')],
      transformGroup: 'js',
      buildPath: join(rootDir, 'src/styles/generated/'),
      files: [
        {
          destination: 'tailwind-shadows.json',
          format: 'json/tailwind',
          options: {
            tokenPath: 'shadow',
            cssVarPrefix: '--shadow',
            valueTemplate: 'var({VAR})',
            flatOutput: true,
          },
        },
      ],
    },
    // Generate Tailwind font sizes JSON
    'tailwind-font-sizes': {
      source: [join(rootDir, 'tokens/themes/dusk.json')],
      transformGroup: 'js',
      buildPath: join(rootDir, 'src/styles/generated/'),
      files: [
        {
          destination: 'tailwind-font-sizes.json',
          format: 'json/tailwind-fontsize',
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
