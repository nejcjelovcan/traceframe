/**
 * Design token metadata for MCP tools and documentation.
 * Describes the purpose and usage of each design token.
 *
 * This file is hand-maintained. Update it when adding or modifying tokens.
 */
export const TOKEN_METADATA = {
  palettes: {
    primary: {
      description: '',
      usage: 'Links, buttons, focus states, primary actions',
      shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    },
    neutral: {
      description: '',
      usage: 'Text, backgrounds, borders, disabled states',
      shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    },
    success: {
      description: '',
      usage: 'Success messages, positive indicators, confirmations',
      shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    },
    warning: {
      description: '',
      usage: 'Warnings, cautions, pending states',
      shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    },
    error: {
      description: '',
      usage: 'Errors, destructive actions, critical alerts',
      shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    },
    info: {
      description: '',
      usage: 'Informational messages, tips, neutral alerts',
      shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    },
    'accent-1': {
      description: '',
      usage: '',
      shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    },
    'accent-2': {
      description: '',
      usage: '',
      shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    },
    'accent-3': {
      description: '',
      usage: '',
      shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    },
    'accent-4': {
      description: '',
      usage: '',
      shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    },
    'accent-5': {
      description: '',
      usage: '',
      shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    },
  },
  semantic: {
    shadow: {
      description: 'Elevation shadows that adapt to light/dark theme',
      variants: {
        sm: 'Small shadow with slightly deeper intensity for drama',
        md: 'Medium shadow for cards, dropdowns',
        lg: 'Large shadow for modals, popovers - deeper for mystery',
        interactive: '',
        highlight: '',
        inset: '',
      },
    },
    surface: {
      description: 'Primary surface color for backgrounds and containers',
      variants: {
        DEFAULT: 'Primary surface color for backgrounds and containers',
        muted: 'Secondary surface for sidebars, alternating rows, and nested elements',
        subtle: 'Tertiary surface for hover states, wells, and recessed areas',
      },
    },
    foreground: {
      description: 'Primary text and icon color for headings and body text',
      variants: {
        DEFAULT: 'Primary text and icon color for headings and body text',
        muted: 'Secondary text for descriptions, placeholders, and less prominent content',
        filled: 'Text color on filled/emphasis backgrounds like primary buttons and badges',
        'filled-muted': 'Secondary text color on filled/emphasis backgrounds',
      },
    },
    border: {
      description: 'Primary border color for inputs, cards, and containers',
      variants: {
        DEFAULT: 'Primary border color for inputs, cards, and containers',
        muted: 'Subtle border for dividers, separators, and less prominent boundaries',
      },
    },
    ring: {
      description: 'Focus ring color for accessibility outlines and focus states',
      variants: {
        DEFAULT: 'Focus ring color for accessibility outlines and focus states',
      },
    },
    interactive: {
      description: '',
      variants: {
        hover: 'Background color for hover states on neutral interactive elements',
        active: 'Background color for active or selected states',
        pressed: 'Background color for pressed or clicking states',
        primary: 'Primary button and CTA background color',
        'primary-hover': 'Primary button background on hover',
        'primary-foreground': 'Text and icon color on primary buttons',
        'primary-border': 'Border color for primary buttons and outlined primary elements',
        'primary-muted': 'Muted primary background for subtle containers and indicators',
        secondary: 'Secondary button and accent background color',
        'secondary-hover': 'Secondary button background on hover',
        'secondary-foreground': 'Text and icon color on secondary buttons',
        'secondary-border': 'Border color for secondary buttons and outlined secondary elements',
        'secondary-muted': 'Muted secondary background for subtle containers and indicators',
        destructive: 'Destructive action button background color',
        'destructive-hover': 'Destructive button background on hover',
        'destructive-foreground': 'Text and icon color on destructive buttons',
        'destructive-border':
          'Border color for destructive buttons and outlined destructive elements',
      },
    },
    status: {
      description: '',
      variants: {
        info: 'Info status color for informational messages, tips, and non-critical alerts',
        'info-muted': 'Info status muted background for subtle info indicators',
        'info-foreground': 'Info status text color for readability on info backgrounds',
        'info-emphasis': 'Info status emphasis color for icons and strong indicators',
        'info-border': 'Info status border color for info containers and alerts',
        success: 'Success status color for positive outcomes, completed actions, and confirmations',
        'success-muted': 'Success status muted background for subtle success indicators',
        'success-foreground': 'Success status text color for readability on success backgrounds',
        'success-emphasis': 'Success status emphasis color for icons and strong indicators',
        'success-border': 'Success status border color for success containers and alerts',
        warning: 'Warning status color for cautions, pending states, and attention required',
        'warning-muted': 'Warning status muted background for subtle warning indicators',
        'warning-foreground': 'Warning status text color for readability on warning backgrounds',
        'warning-emphasis': 'Warning status emphasis color for icons and strong indicators',
        'warning-border': 'Warning status border color for warning containers and alerts',
        error: 'Error status color for failures, critical issues, and destructive actions',
        'error-muted': 'Error status muted background for subtle error indicators',
        'error-foreground': 'Error status text color for readability on error backgrounds',
        'error-emphasis': 'Error status emphasis color for icons and strong indicators',
        'error-border': 'Error status border color for error containers and alerts',
      },
    },
    disabled: {
      description: 'Disabled background color for inactive interactive elements',
      variants: {
        DEFAULT: 'Disabled background color for inactive interactive elements',
        foreground: 'Disabled text and icon color for inactive elements',
      },
    },
    tooltip: {
      description: 'Tooltip background color for contextual help and hints',
      variants: {
        DEFAULT: 'Tooltip background color for contextual help and hints',
        foreground: 'Tooltip text color for readability on dark tooltip backgrounds',
      },
    },
    accent: {
      description: '',
      variants: {
        '1': 'Accent 1 base color for categorical data and visual distinction',
        '2': 'Accent 2 base color for categorical data and visual distinction',
        '3': 'Accent 3 base color for categorical data and visual distinction',
        '4': 'Accent 4 base color for categorical data and visual distinction',
        '5': 'Accent 5 base color for categorical data and visual distinction',
        '1-muted': 'Accent 1 muted background for subtle indicators',
        '1-foreground': 'Accent 1 text color for readability on accent backgrounds',
        '1-emphasis': 'Accent 1 emphasis color for icons and strong indicators',
        '1-border': 'Accent 1 border color for containers and elements',
        '2-muted': 'Accent 2 muted background for subtle indicators',
        '2-foreground': 'Accent 2 text color for readability on accent backgrounds',
        '2-emphasis': 'Accent 2 emphasis color for icons and strong indicators',
        '2-border': 'Accent 2 border color for containers and elements',
        '3-muted': 'Accent 3 muted background for subtle indicators',
        '3-foreground': 'Accent 3 text color for readability on accent backgrounds',
        '3-emphasis': 'Accent 3 emphasis color for icons and strong indicators',
        '3-border': 'Accent 3 border color for containers and elements',
        '4-muted': 'Accent 4 muted background for subtle indicators',
        '4-foreground': 'Accent 4 text color for readability on accent backgrounds',
        '4-emphasis': 'Accent 4 emphasis color for icons and strong indicators',
        '4-border': 'Accent 4 border color for containers and elements',
        '5-muted': 'Accent 5 muted background for subtle indicators',
        '5-foreground': 'Accent 5 text color for readability on accent backgrounds',
        '5-emphasis': 'Accent 5 emphasis color for icons and strong indicators',
        '5-border': 'Accent 5 border color for containers and elements',
      },
    },
  },
  theme: {
    fontFamily: {
      sans: {
        value: 'Inter Variable, Inter, system-ui, sans-serif',
        description: 'Primary font family for body text and UI',
      },
      mono: {
        value: 'JetBrains Mono, Menlo, monospace',
        description: 'Monospace font family for code',
      },
    },
    fontSize: {
      xs: {
        value: '0.75rem',
        lineHeight: '1rem',
        description: 'Extra small text (12px)',
      },
      sm: {
        value: '0.875rem',
        lineHeight: '1.25rem',
        description: 'Small text (14px)',
      },
      base: {
        value: '1rem',
        lineHeight: '1.5rem',
        description: 'Base text size (16px)',
      },
      lg: {
        value: '1.125rem',
        lineHeight: '1.75rem',
        description: 'Large text (18px)',
      },
      xl: {
        value: '1.25rem',
        lineHeight: '1.75rem',
        description: 'Extra large text (20px)',
      },
      '2xl': {
        value: '1.5rem',
        lineHeight: '2rem',
        description: '2x large text (24px)',
      },
      '3xl': {
        value: '1.875rem',
        lineHeight: '2.25rem',
        description: '3x large text (30px)',
      },
      '4xl': {
        value: '2.25rem',
        lineHeight: '2.5rem',
        description: '4x large text (36px)',
      },
    },
    borderRadius: {
      sm: {
        value: '0.25rem',
        description: 'Small border radius',
      },
      md: {
        value: '0.375rem',
        description: 'Medium border radius - default',
        isDefault: true,
      },
      lg: {
        value: '0.5rem',
        description: 'Large border radius',
      },
      xl: {
        value: '0.75rem',
        description: 'Extra large border radius - pill shapes, badges',
      },
    },
    shadow: {
      sm: {
        value: '0 1px 3px 0 color-mix(in srgb, var(--color-shadow) 8%, transparent)',
        description: 'Small shadow with slightly deeper intensity for drama',
      },
      md: {
        value:
          '0 4px 8px -1px color-mix(in srgb, var(--color-shadow) 12%, transparent), 0 2px 4px -2px color-mix(in srgb, var(--color-shadow) 8%, transparent)',
        description: 'Medium shadow for cards, dropdowns',
      },
      lg: {
        value:
          '0 12px 20px -4px color-mix(in srgb, var(--color-shadow) 15%, transparent), 0 4px 8px -4px color-mix(in srgb, var(--color-shadow) 10%, transparent)',
        description: 'Large shadow for modals, popovers - deeper for mystery',
      },
      interactive: {
        value: '0 2px 4px 0 color-mix(in srgb, var(--color-shadow) 10%, transparent)',
        description: 'Resting shadow for interactive elements',
      },
      'interactive-hover': {
        value:
          '0 6px 12px -2px color-mix(in srgb, var(--color-shadow) 14%, transparent), 0 3px 6px -2px color-mix(in srgb, var(--color-shadow) 10%, transparent)',
        description: 'Elevated shadow for hover state',
      },
      'interactive-pressed': {
        value: '0 1px 2px 0 color-mix(in srgb, var(--color-shadow) 8%, transparent)',
        description: 'Compressed shadow for pressed/active state',
      },
      highlight: {
        value:
          '0 4px 8px -1px color-mix(in srgb, var(--color-shadow) 12%, transparent), 0 2px 4px -2px color-mix(in srgb, var(--color-shadow) 8%, transparent)',
        description: 'Prominent resting shadow for featured elements',
      },
      'highlight-hover': {
        value:
          '0 8px 16px -3px color-mix(in srgb, var(--color-shadow) 16%, transparent), 0 4px 8px -3px color-mix(in srgb, var(--color-shadow) 12%, transparent)',
        description: 'Elevated shadow for highlighted hover state',
      },
      'highlight-pressed': {
        value: '0 2px 4px 0 color-mix(in srgb, var(--color-shadow) 10%, transparent)',
        description: 'Compressed shadow for highlighted pressed state',
      },
      'inset-sm': {
        value: 'inset 0 2px 4px 0 color-mix(in srgb, var(--color-shadow) 8%, transparent)',
        description: 'Small inset shadow for subtle pressed states',
      },
      'inset-md': {
        value: 'inset 0 4px 8px 0 color-mix(in srgb, var(--color-shadow) 10%, transparent)',
        description: 'Medium inset shadow for standard pressed states',
      },
      'inset-underline': {
        value: 'inset 0 -2px 0 0',
        description: 'Bottom underline effect for active indicators',
      },
    },
    spacing: {
      '2xs': {
        value: '0.125rem',
        description: 'Extra extra small spacing (2px) - very tight gaps, micro spacing',
      },
      xs: {
        value: '0.25rem',
        description: 'Extra small spacing (4px) - tight inline elements, icon gaps',
      },
      sm: {
        value: '0.5rem',
        description: 'Small spacing (8px) - form inputs, button padding',
      },
      md: {
        value: '0.75rem',
        description: 'Medium spacing (12px) - card padding, section gaps',
      },
      base: {
        value: '1rem',
        description: 'Base spacing (16px) - component padding, medium element gaps',
      },
      lg: {
        value: '2rem',
        description: 'Large spacing (32px) - section separation, major gaps',
      },
      xl: {
        value: '4rem',
        description: 'Extra large spacing (64px) - page sections, major separators',
      },
      '2xl': {
        value: '8rem',
        description: 'Double extra large spacing (128px) - hero sections, major landmarks',
      },
    },
    size: {
      xs: {
        value: '1.5rem',
        description: 'Extra small element size (24px) - compact buttons, badges',
      },
      sm: {
        value: '2rem',
        description: 'Small element size (32px) - small buttons, inputs',
      },
      md: {
        value: '2.5rem',
        description: 'Medium element size (40px) - default buttons, inputs',
      },
      lg: {
        value: '3rem',
        description: 'Large element size (48px) - large buttons, inputs',
      },
      xl: {
        value: '3.5rem',
        description: 'Extra large element size (56px) - hero buttons, prominent elements',
      },
    },
    gradient: {
      primary: {
        value: 'linear-gradient(180deg, var(--palette-primary-600), var(--palette-primary-700))',
        description: 'Primary button and CTA gradient',
      },
      'primary-light': {
        value: 'linear-gradient(180deg, var(--palette-primary-50), var(--palette-primary-100))',
        description: 'Primary light gradient for cards and subtle backgrounds',
      },
      secondary: {
        value:
          'linear-gradient(180deg, var(--palette-secondary-600), var(--palette-secondary-700))',
        description: 'Secondary button gradient',
      },
      'secondary-light': {
        value: 'linear-gradient(180deg, var(--palette-secondary-50), var(--palette-secondary-100))',
        description: 'Secondary light gradient for cards and subtle backgrounds',
      },
      destructive: {
        value: 'linear-gradient(180deg, var(--palette-error-600), var(--palette-error-700))',
        description: 'Destructive button gradient',
      },
      'destructive-light': {
        value: 'linear-gradient(180deg, var(--palette-error-50), var(--palette-error-100))',
        description: 'Destructive light gradient for cards and subtle backgrounds',
      },
      surface: {
        value: 'linear-gradient(180deg, var(--palette-neutral-700), var(--palette-neutral-800))',
        description: 'Surface gradient',
      },
      'surface-light': {
        value: 'linear-gradient(180deg, var(--palette-neutral-50), var(--palette-neutral-100))',
        description: 'Surface light gradient for cards and subtle backgrounds',
      },
      'status-info': {
        value: 'linear-gradient(180deg, var(--palette-primary-600), var(--palette-primary-700))',
        description: 'Info status emphasis gradient',
      },
      'status-info-light': {
        value: 'linear-gradient(180deg, var(--palette-primary-50), var(--palette-primary-100))',
        description: 'Info status light gradient for cards and subtle backgrounds',
      },
      'status-success': {
        value: 'linear-gradient(180deg, var(--palette-success-600), var(--palette-success-700))',
        description: 'Success status emphasis gradient',
      },
      'status-success-light': {
        value: 'linear-gradient(180deg, var(--palette-success-50), var(--palette-success-100))',
        description: 'Success status light gradient for cards and subtle backgrounds',
      },
      'status-warning': {
        value: 'linear-gradient(180deg, var(--palette-warning-500), var(--palette-warning-600))',
        description: 'Warning status emphasis gradient',
      },
      'status-warning-light': {
        value: 'linear-gradient(180deg, var(--palette-warning-50), var(--palette-warning-100))',
        description: 'Warning status light gradient for cards and subtle backgrounds',
      },
      'status-error': {
        value: 'linear-gradient(180deg, var(--palette-error-600), var(--palette-error-700))',
        description: 'Error status emphasis gradient',
      },
      'status-error-light': {
        value: 'linear-gradient(180deg, var(--palette-error-50), var(--palette-error-100))',
        description: 'Error status light gradient for cards and subtle backgrounds',
      },
      'accent-1': {
        value: 'linear-gradient(180deg, var(--palette-accent-1-600), var(--palette-accent-1-700))',
        description: 'Accent 1 emphasis gradient',
      },
      'accent-1-light': {
        value: 'linear-gradient(180deg, var(--palette-accent-1-50), var(--palette-accent-1-100))',
        description: 'Accent 1 light gradient for cards and subtle backgrounds',
      },
      'accent-2': {
        value: 'linear-gradient(180deg, var(--palette-accent-2-600), var(--palette-accent-2-700))',
        description: 'Accent 2 emphasis gradient',
      },
      'accent-2-light': {
        value: 'linear-gradient(180deg, var(--palette-accent-2-50), var(--palette-accent-2-100))',
        description: 'Accent 2 light gradient for cards and subtle backgrounds',
      },
      'accent-3': {
        value: 'linear-gradient(180deg, var(--palette-accent-3-600), var(--palette-accent-3-700))',
        description: 'Accent 3 emphasis gradient',
      },
      'accent-3-light': {
        value: 'linear-gradient(180deg, var(--palette-accent-3-50), var(--palette-accent-3-100))',
        description: 'Accent 3 light gradient for cards and subtle backgrounds',
      },
      'accent-4': {
        value: 'linear-gradient(180deg, var(--palette-accent-4-600), var(--palette-accent-4-700))',
        description: 'Accent 4 emphasis gradient',
      },
      'accent-4-light': {
        value: 'linear-gradient(180deg, var(--palette-accent-4-50), var(--palette-accent-4-100))',
        description: 'Accent 4 light gradient for cards and subtle backgrounds',
      },
      'accent-5': {
        value: 'linear-gradient(180deg, var(--palette-accent-5-600), var(--palette-accent-5-700))',
        description: 'Accent 5 emphasis gradient',
      },
      'accent-5-light': {
        value: 'linear-gradient(180deg, var(--palette-accent-5-50), var(--palette-accent-5-100))',
        description: 'Accent 5 light gradient for cards and subtle backgrounds',
      },
    },
    borderStyle: {
      line: {
        value: '1px solid',
        description: 'Standard border for cards, inputs, containers (default)',
      },
      thick: {
        value: '2px solid',
        description: 'Heavier border for emphasis or structural separation',
      },
      highlight: {
        value: '2px dashed',
        description: 'Prominent dashed border for highlighting, selection, or CTAs',
      },
    },
  },
} as const
