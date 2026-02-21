import { Select } from './Select.js'
import { useTheme } from './ThemeProvider.js'
import { THEME_DESCRIPTIONS, THEME_LABELS, THEMES, type Theme } from '../utils/theme.js'

import type { selectTriggerVariants } from './Select.js'
import type { VariantProps } from 'class-variance-authority'

export interface ThemeSwitcherProps {
  /** Additional className for the container */
  className?: string
  /** Size of the select trigger */
  size?: VariantProps<typeof selectTriggerVariants>['size']
}

/**
 * ThemeSwitcher provides a select dropdown for switching between color themes.
 *
 * Requires ThemeProvider to be present in the component tree.
 *
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <ThemeSwitcher />
 * </ThemeProvider>
 * ```
 */
export function ThemeSwitcher({ className, size = 'sm' }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme()

  return (
    <Select.Root value={theme} onValueChange={(value) => setTheme(value as Theme)}>
      <Select.Trigger size={size} className={className} aria-label="Select color theme">
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        {THEMES.map((t) => (
          <Select.Item key={t} value={t} description={THEME_DESCRIPTIONS[t]}>
            {THEME_LABELS[t]}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  )
}

ThemeSwitcher.displayName = 'ThemeSwitcher'
