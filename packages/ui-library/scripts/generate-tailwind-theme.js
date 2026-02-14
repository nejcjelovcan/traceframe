#!/usr/bin/env node
/**
 * Generate a Tailwind CSS v4 @theme inline block from generated JSON token files.
 *
 * Tailwind v4 uses CSS-first configuration. This script reads the JSON token files
 * produced by Style Dictionary and generates a CSS file with @theme inline declarations.
 *
 * IMPORTANT: Tailwind v4's @theme inline detects self-referencing var() values
 * (e.g., --color-surface: rgb(var(--color-surface))) and falls back to creating
 * CSS custom properties in @layer theme, which creates circular references.
 *
 * To avoid this, we use "bridge" variables: intermediate CSS custom properties
 * (prefixed with --tw-) that reference our design tokens. The @theme inline block
 * then references these bridge variables, breaking the self-reference cycle.
 *
 * Chain: design token (--color-surface) → bridge (--tw-color-surface) → @theme inline → utility class
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const generatedDir = join(__dirname, '..', 'src', 'styles', 'generated')

function readJson(filename) {
  return JSON.parse(readFileSync(join(generatedDir, filename), 'utf-8'))
}

/**
 * Flatten a nested color object into [key, value] entries.
 * E.g., { surface: { DEFAULT: "rgb(...)", muted: "rgb(...)" } }
 * becomes: [["surface", "rgb(...)"], ["surface-muted", "rgb(...)"]]
 */
function flattenColors(obj) {
  const entries = []
  for (const [category, variants] of Object.entries(obj)) {
    if (typeof variants === 'string') {
      entries.push([category, variants])
    } else {
      for (const [variant, value] of Object.entries(variants)) {
        if (variant === 'DEFAULT') {
          entries.push([category, value])
        } else {
          entries.push([`${category}-${variant}`, value])
        }
      }
    }
  }
  return entries
}

function generateThemeCSS() {
  const bridgeLines = []
  const themeLines = []

  // --- Colors ---
  // Semantic colors already wrap palette colors in rgb() function
  // Bridge: --tw-color-surface: var(--color-surface)
  // Theme: --color-surface: var(--tw-color-surface)
  const colors = readJson('tailwind-colors.json')
  const colorEntries = flattenColors(colors)

  bridgeLines.push('  /* Colors */')
  themeLines.push('  /* Colors */')
  for (const [name] of colorEntries) {
    bridgeLines.push(`  --tw-color-${name}: var(--color-${name});`)
    // Don't wrap in rgb() - semantic colors are already wrapped
    themeLines.push(`  --color-${name}: var(--tw-color-${name});`)
  }

  // --- Spacing ---
  // Token values: "var(--spacing-sm)" → self-referencing when key is --spacing-sm
  const spacing = readJson('tailwind-spacing.json')

  bridgeLines.push('')
  bridgeLines.push('  /* Spacing */')
  themeLines.push('')
  themeLines.push('  /* Spacing */')
  for (const [key] of Object.entries(spacing)) {
    bridgeLines.push(`  --tw-spacing-${key}: var(--spacing-${key});`)
    themeLines.push(`  --spacing-${key}: var(--tw-spacing-${key});`)
  }

  // --- Sizing (width + height) ---
  // Token values: "var(--size-xs)" → key is --width-size-xs, NOT self-referencing
  // No bridge needed
  const sizing = readJson('tailwind-sizing.json')

  themeLines.push('')
  themeLines.push('  /* Sizing (width & height) */')
  for (const [key, value] of Object.entries(sizing)) {
    themeLines.push(`  --width-size-${key}: ${value};`)
    themeLines.push(`  --height-size-${key}: ${value};`)
  }

  // --- Border radius ---
  // Token values: "var(--radius-sm)" → self-referencing when key is --radius-sm
  const radius = readJson('tailwind-radius.json')

  bridgeLines.push('')
  bridgeLines.push('  /* Border radius */')
  themeLines.push('')
  themeLines.push('  /* Border radius */')
  for (const [key] of Object.entries(radius)) {
    if (key === 'DEFAULT') continue
    bridgeLines.push(`  --tw-radius-${key}: var(--radius-${key});`)
    themeLines.push(`  --radius-${key}: var(--tw-radius-${key});`)
  }

  // --- Shadows ---
  // Token values: "var(--shadow-sm)" → self-referencing when key is --shadow-sm
  const shadows = readJson('tailwind-shadows.json')

  bridgeLines.push('')
  bridgeLines.push('  /* Shadows */')
  themeLines.push('')
  themeLines.push('  /* Shadows */')
  for (const [key] of Object.entries(shadows)) {
    bridgeLines.push(`  --tw-shadow-${key}: var(--shadow-${key});`)
    themeLines.push(`  --shadow-${key}: var(--tw-shadow-${key});`)
  }

  // --- Font families ---
  // Token values: "var(--font-sans)" → self-referencing when key is --font-sans
  const fonts = readJson('tailwind-fonts.json')

  bridgeLines.push('')
  bridgeLines.push('  /* Font families */')
  themeLines.push('')
  themeLines.push('  /* Font families */')
  for (const [key] of Object.entries(fonts)) {
    bridgeLines.push(`  --tw-font-${key}: var(--font-${key});`)
    themeLines.push(`  --font-${key}: var(--tw-font-${key});`)
  }

  // --- Font sizes ---
  // Hardcoded values (e.g., "0.75rem") → NOT self-referencing, no bridge needed
  const fontSizes = readJson('tailwind-font-sizes.json')

  themeLines.push('')
  themeLines.push('  /* Font sizes */')
  for (const [key, value] of Object.entries(fontSizes)) {
    if (Array.isArray(value)) {
      themeLines.push(`  --font-size-${key}: ${value[0]};`)
      if (value[1] && value[1].lineHeight) {
        themeLines.push(`  --font-size-${key}--line-height: ${value[1].lineHeight};`)
      }
    } else {
      themeLines.push(`  --font-size-${key}: ${value};`)
    }
  }

  // --- Animations ---
  themeLines.push('')
  themeLines.push('  /* Animations */')
  themeLines.push('  --animate-collapsible-down: collapsible-down 200ms ease-out;')
  themeLines.push('  --animate-collapsible-up: collapsible-up 200ms ease-out;')

  // Assemble output
  const lines = [
    '/* Generated by scripts/generate-tailwind-theme.js - do not edit */',
    '',
    '/*',
    ' * Bridge variables: break self-reference cycles in @theme inline.',
    ' * Tailwind v4 creates CSS custom properties for self-referencing values',
    ' * (e.g., --color-surface: rgb(var(--color-surface))), causing circular',
    ' * definitions. These --tw-* bridge variables reference our design tokens,',
    ' * and @theme inline references the bridges instead.',
    ' */',
    ':root {',
    ...bridgeLines,
    '}',
    '',
    '@theme inline {',
    ...themeLines,
    '}',
    '',
    '@keyframes collapsible-down {',
    '  from { height: 0; }',
    '  to { height: var(--radix-collapsible-content-height); }',
    '}',
    '',
    '@keyframes collapsible-up {',
    '  from { height: var(--radix-collapsible-content-height); }',
    '  to { height: 0; }',
    '}',
    '',
  ]

  const output = lines.join('\n')
  const outputPath = join(generatedDir, 'tailwind-theme.css')
  writeFileSync(outputPath, output)
  console.log(`✓ Generated ${outputPath}`)
}

generateThemeCSS()
