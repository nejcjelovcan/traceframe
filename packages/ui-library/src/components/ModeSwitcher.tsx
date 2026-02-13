import { useTheme } from './ThemeProvider.js'
import { ToggleGroup, type ToggleGroupOption } from './ToggleGroup.js'
import { MODE_LABELS, type Mode } from '../utils/theme.js'

const modeOptions: readonly ToggleGroupOption<Mode>[] = [
  { value: 'light', label: MODE_LABELS.light, icon: 'sun' },
  { value: 'dark', label: MODE_LABELS.dark, icon: 'moon' },
]

export interface ModeSwitcherProps {
  /** Additional className for the container */
  className?: string
  /** Display mode for the toggle group */
  displayMode?: 'icon' | 'text'
  /** Size of the toggle group */
  size?: 'sm' | 'md' | 'lg'
}

/**
 * ModeSwitcher provides a toggle group for switching between light and dark modes.
 *
 * Requires ThemeProvider to be present in the component tree.
 *
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <ModeSwitcher />
 * </ThemeProvider>
 * ```
 */
export function ModeSwitcher({ className, displayMode = 'icon', size = 'sm' }: ModeSwitcherProps) {
  const { mode, setMode } = useTheme()

  const handleModeChange = (value: Mode | undefined) => {
    // ModeSwitcher doesn't allow deselection - always keep a mode selected
    if (value) {
      setMode(value)
    }
  }

  return (
    <ToggleGroup
      options={modeOptions}
      value={mode}
      onChange={handleModeChange}
      aria-label="Select color mode"
      size={size}
      displayMode={displayMode}
      {...(className ? { className } : {})}
    />
  )
}

ModeSwitcher.displayName = 'ModeSwitcher'
