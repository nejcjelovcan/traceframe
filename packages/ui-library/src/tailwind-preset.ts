import generatedColors from './styles/generated/tailwind-colors.json'
import generatedFontSizes from './styles/generated/tailwind-font-sizes.json'
import generatedFonts from './styles/generated/tailwind-fonts.json'
import generatedRadius from './styles/generated/tailwind-radius.json'
import generatedShadows from './styles/generated/tailwind-shadows.json'
import generatedSizing from './styles/generated/tailwind-sizing.json'
import generatedSpacing from './styles/generated/tailwind-spacing.json'

import type { Config } from 'tailwindcss'

// Prefix sizing tokens with 'size-' to avoid collision with spacing tokens
const prefixedSizing = Object.fromEntries(
  Object.entries(generatedSizing).map(([key, value]) => [`size-${key}`, value])
)

const preset: Partial<Config> = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: generatedColors,
      fontFamily: generatedFonts,
      // @ts-expect-error - JSON const doesn't match but is valid Tailwind config
      fontSize: generatedFontSizes,
      spacing: generatedSpacing,
      height: prefixedSizing,
      width: prefixedSizing,
      borderRadius: generatedRadius,
      boxShadow: generatedShadows,
      keyframes: {
        'collapsible-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'collapsible-down': 'collapsible-down 200ms ease-out',
        'collapsible-up': 'collapsible-up 200ms ease-out',
      },
    },
  },
}

export default preset
