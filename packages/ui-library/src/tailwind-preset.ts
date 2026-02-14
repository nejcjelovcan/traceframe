import type { Config } from 'tailwindcss'

/**
 * Tailwind CSS v4 preset for Traceframe.
 *
 * In v4, theme tokens are defined via CSS (@theme inline) rather than JS config.
 * Consumers should import the CSS: @import "@nejcjelovcan/traceframe-ui-library/styles.css";
 *
 * This preset provides only non-theme configuration (darkMode).
 */
const preset: Partial<Config> = {
  darkMode: 'class',
}

export default preset
