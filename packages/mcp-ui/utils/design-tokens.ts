import { TOKEN_METADATA } from '@nejcjelovcan/traceframe-ui-library'

/**
 * Semantic token variant info.
 */
export interface SemanticVariantInfo {
  description: string
}

/**
 * Semantic token with description and variants.
 */
export interface SemanticTokenInfo {
  description: string
  variants: Record<string, SemanticVariantInfo>
}

/**
 * Font size info with size and line height.
 */
export interface FontSizeInfo {
  size: string
  lineHeight: string
}

/**
 * Typography info.
 */
export interface TypographyInfo {
  fontFamily: {
    sans: string[]
    mono: string[]
  }
  fontSize: Record<string, FontSizeInfo>
}

/**
 * Spacing token info with value and description.
 */
export interface SpacingInfo {
  value: string
  description: string
}

/**
 * Sizing token info with value and description.
 */
export interface SizingInfo {
  value: string
  description: string
}

/**
 * Shadow token info with value and description.
 */
export interface ShadowInfo {
  value: string
  description: string
}

/**
 * Border style token info with value and description.
 */
export interface BorderStyleInfo {
  value: string
  description: string
}

/**
 * Gradient token info with value and description.
 */
export interface GradientTokenInfo {
  value: string
  description: string
}

/**
 * Border radius token info with value and description.
 */
export interface BorderRadiusInfo {
  value: string
  description: string
}

/**
 * Complete design tokens structure.
 * Note: Palettes are intentionally not exposed. UI code should only use semantic tokens.
 */
export interface DesignTokens {
  colors: {
    semantic: Record<string, SemanticTokenInfo>
  }
  typography: TypographyInfo
  sizing: Record<string, SizingInfo>
  spacing: Record<string, SpacingInfo>
  shadows: Record<string, ShadowInfo>
  borders: Record<string, BorderStyleInfo>
  gradients: Record<string, GradientTokenInfo>
  borderRadius: Record<string, BorderRadiusInfo>
}

/**
 * Gets all design tokens with metadata and actual values.
 * Note: Palettes are intentionally not exposed. UI code should only use semantic tokens.
 * @returns Complete design tokens structure
 */
export async function getDesignTokens(): Promise<DesignTokens> {
  // Build semantic tokens from metadata (values are CSS variable references, not resolved)
  const semantic: Record<string, SemanticTokenInfo> = {}
  for (const [name, meta] of Object.entries(TOKEN_METADATA.semantic)) {
    const variants: Record<string, SemanticVariantInfo> = {}
    for (const [variant, description] of Object.entries(meta.variants)) {
      variants[variant] = { description }
    }
    semantic[name] = {
      description: meta.description,
      variants,
    }
  }

  // Typography from the preset
  const typography: TypographyInfo = {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Menlo', 'monospace'],
    },
    fontSize: {
      xs: { size: '0.75rem', lineHeight: '1rem' },
      sm: { size: '0.875rem', lineHeight: '1.25rem' },
      base: { size: '1rem', lineHeight: '1.5rem' },
      lg: { size: '1.125rem', lineHeight: '1.75rem' },
      xl: { size: '1.25rem', lineHeight: '1.75rem' },
      '2xl': { size: '1.5rem', lineHeight: '2rem' },
      '3xl': { size: '1.875rem', lineHeight: '2.25rem' },
      '4xl': { size: '2.25rem', lineHeight: '2.5rem' },
    },
  }

  // Sizing values from TOKEN_METADATA.theme.size
  const sizing: Record<string, SizingInfo> = {}
  if ('theme' in TOKEN_METADATA && 'size' in TOKEN_METADATA.theme) {
    for (const [name, data] of Object.entries(TOKEN_METADATA.theme.size)) {
      sizing[name] = {
        value: data.value,
        description: data.description,
      }
    }
  }

  // Spacing values from TOKEN_METADATA.theme.spacing
  const spacing: Record<string, SpacingInfo> = {}
  if ('theme' in TOKEN_METADATA && 'spacing' in TOKEN_METADATA.theme) {
    for (const [name, data] of Object.entries(TOKEN_METADATA.theme.spacing)) {
      spacing[name] = {
        value: data.value,
        description: data.description,
      }
    }
  }

  // Shadow values from TOKEN_METADATA.theme.shadow
  const shadows: Record<string, ShadowInfo> = {}
  if ('theme' in TOKEN_METADATA && 'shadow' in TOKEN_METADATA.theme) {
    for (const [name, data] of Object.entries(TOKEN_METADATA.theme.shadow)) {
      shadows[name] = {
        value: data.value,
        description: data.description,
      }
    }
  }

  // Border style values from TOKEN_METADATA.theme.borderStyle
  const borders: Record<string, BorderStyleInfo> = {}
  if ('theme' in TOKEN_METADATA && 'borderStyle' in TOKEN_METADATA.theme) {
    for (const [name, data] of Object.entries(TOKEN_METADATA.theme.borderStyle)) {
      borders[name] = {
        value: data.value,
        description: data.description,
      }
    }
  }

  // Gradient values from TOKEN_METADATA.theme.gradient
  const gradients: Record<string, GradientTokenInfo> = {}
  if ('theme' in TOKEN_METADATA && 'gradient' in TOKEN_METADATA.theme) {
    for (const [name, data] of Object.entries(TOKEN_METADATA.theme.gradient)) {
      gradients[name] = {
        value: data.value,
        description: data.description,
      }
    }
  }

  // Border radius values from TOKEN_METADATA.theme.borderRadius
  const borderRadius: Record<string, BorderRadiusInfo> = {}
  if ('theme' in TOKEN_METADATA && 'borderRadius' in TOKEN_METADATA.theme) {
    for (const [name, data] of Object.entries(TOKEN_METADATA.theme.borderRadius)) {
      borderRadius[name] = {
        value: data.value,
        description: data.description,
      }
    }
  }

  return {
    colors: {
      semantic,
    },
    typography,
    sizing,
    spacing,
    shadows,
    borders,
    gradients,
    borderRadius,
  }
}
