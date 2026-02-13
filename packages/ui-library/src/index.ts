// Components
export { Badge, badgeVariants, type BadgeProps } from './components/Badge.js'
export {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  CollapsibleHeader,
  collapsibleContentVariants,
  collapsibleTriggerVariants,
  collapsibleHeaderVariants,
  type CollapsibleContentProps,
  type CollapsibleTriggerProps,
  type CollapsibleHeaderProps,
} from './components/Collapsible.js'
export {
  BarChart,
  barChartVariants,
  type BarChartDataItem,
  type BarChartProps,
  type SemanticThresholds,
} from './components/BarChart.js'
export { Button, buttonVariants, type ButtonProps } from './components/Button.js'
export { Container, containerVariants, type ContainerProps } from './components/Container.js'
export {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  cardVariants,
  type CardContentProps,
  type CardFooterProps,
  type CardHeaderProps,
  type CardProps,
} from './components/Card.js'
export {
  DataTable,
  dataTableVariants,
  type Column,
  type DataTableProps,
  type SortState,
} from './components/DataTable.js'
export { EmptyState, emptyStateVariants, type EmptyStateProps } from './components/EmptyState.js'
export {
  Heading,
  headingVariants,
  type HeadingLevel,
  type HeadingProps,
} from './components/Heading.js'
export { Input, inputVariants, inputWrapperVariants, type InputProps } from './components/Input.js'
export { SearchInput, type SearchInputProps } from './components/SearchInput.js'
export { ErrorState, type ErrorStateProps } from './components/ErrorState.js'
export {
  Grid,
  gridVariants,
  type ColCount,
  type ColsValue,
  type GridProps,
  type ResponsiveCols,
} from './components/Grid.js'
export { Link, type LinkProps } from './components/Link.js'
export {
  LogView,
  LogEntry,
  LogPrompt,
  logViewVariants,
  type LogViewProps,
  type LogEntryProps,
  type LogPromptProps,
} from './components/LogView.js'
export {
  Navigation,
  NavItem,
  type NavigationProps,
  type NavItemProps,
} from './components/Navigation.js'
export {
  PageLayout,
  PageHeader,
  pageLayoutVariants,
  sidebarVariants,
  type PageLayoutProps,
  type PageHeaderProps,
} from './components/PageLayout.js'
export { Spinner, spinnerVariants, type SpinnerProps } from './components/Spinner.js'
export { Stack, stackVariants, type StackProps } from './components/Stack.js'
export { StatCard, type StatCardProps } from './components/StatCard.js'
export {
  ToggleGroup,
  toggleGroupVariants,
  type ToggleGroupOption,
  type ToggleGroupProps,
} from './components/ToggleGroup.js'
export {
  Select,
  selectContentVariants,
  selectItemVariants,
  selectTriggerVariants,
  type SelectContentProps,
  type SelectItemProps,
  type SelectTriggerProps,
} from './components/Select.js'
export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  tooltipContentVariants,
  type TooltipProps,
  type TooltipContentProps,
} from './components/Tooltip.js'
export { ThemeProvider, useTheme, type ThemeProviderProps } from './components/ThemeProvider.js'
export { ModeSwitcher, type ModeSwitcherProps } from './components/ModeSwitcher.js'
export { ThemeSwitcher, type ThemeSwitcherProps } from './components/ThemeSwitcher.js'

// Icons
export {
  CATEGORY_LABELS,
  getAllIconNames,
  getIconsByCategory,
  Icon,
  ICON_METADATA,
  ICON_REGISTRY,
  LIGHT_STROKE_SIZES,
  searchIcons,
  SIZE_MAP,
  type IconCategory,
  type IconMeta,
  type IconName,
  type IconProps,
  type IconSize,
} from './icons/index.js'

// Utilities
export { cn } from './utils/cn.js'
export {
  applyMode,
  applyTheme,
  MODE_LABELS,
  MODES,
  THEME_DESCRIPTIONS,
  THEME_LABELS,
  THEMES,
  type Mode,
  type Theme,
} from './utils/theme.js'

export { TOKEN_METADATA } from './styles/generated/token-metadata.js'

export {
  COMPONENT_METADATA,
  type ComponentMeta,
  type ComponentPropMeta,
  type CompoundComponentMeta,
} from './generated/component-metadata.js'

// Semantic token utilities (derived from TOKEN_METADATA)
export {
  COLOR_PALETTES,
  extractTailwindClasses,
  getSemanticTokenNames,
  getSizingSuggestion,
  getSpacingSuggestion,
  getSuggestion,
  isNonSemanticColorClass,
  isNonSemanticSizingClass,
  isNonSemanticSpacingClass,
  SEMANTIC_TOKENS,
  SHADES,
  SIZING_MAP,
  SIZING_PREFIXES,
  SPACING_MAP,
  SPACING_PREFIXES,
} from './utils/semantic-token-utils.js'
