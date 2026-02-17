import { useTheme } from './ThemeProvider.js'
import { ToggleGroup, type ToggleGroupOption } from './ToggleGroup.js'
import { THEME_LABELS, type Theme } from '../utils/theme.js'

const themeOptions: readonly ToggleGroupOption<Theme>[] = [
  { value: 'dusk', label: THEME_LABELS.dusk, icon: 'moon' },
  { value: 'arctic', label: THEME_LABELS.arctic, icon: 'database' },
  { value: 'ember', label: THEME_LABELS.ember, icon: 'chart' },
  { value: 'forge', label: THEME_LABELS.forge, icon: 'settings' },
  { value: 'mist', label: THEME_LABELS.mist, icon: 'empty' },
]

export interface ThemeSwitcherProps {
  /** Additional className for the container */
  className?: string
  /** Display mode for the toggle group */
  displayMode?: 'icon' | 'text'
  /** Size of the toggle group */
  size?: 'sm' | 'md' | 'lg'
}

/**
 * ThemeSwitcher provides a toggle group for switching between color themes.
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
export function ThemeSwitcher({
  className,
  displayMode = 'icon',
  size = 'sm',
}: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme()

  const handleThemeChange = (value: Theme | undefined) => {
    // ThemeSwitcher doesn't allow deselection - always keep a theme selected
    if (value) {
      setTheme(value)
    }
  }

  return (
    <ToggleGroup
      options={themeOptions}
      value={theme}
      onChange={handleThemeChange}
      aria-label="Select color theme"
      size={size}
      displayMode={displayMode}
      {...(className ? { className } : {})}
    />
  )
}

ThemeSwitcher.displayName = 'ThemeSwitcher'
