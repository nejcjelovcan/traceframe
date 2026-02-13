import { badgeSnippets } from './badge'
import { barChartSnippets } from './bar-chart'
import { buttonSnippets } from './button'
import { cardSnippets } from './card'
import { collapsibleSnippets } from './collapsible'
import { containerSnippets } from './container'
import { dataTableSnippets } from './data-table'
import { emptyStateSnippets } from './empty-state'
import { errorStateSnippets } from './error-state'
import { gridSnippets } from './grid'
import { headingSnippets } from './heading'
import { inputSnippets } from './input'
import { linkSnippets } from './link'
import { navigationSnippets } from './navigation'
import { pageLayoutSnippets } from './page-layout'
import { searchInputSnippets } from './search-input'
import { selectSnippets } from './select'
import { spinnerSnippets } from './spinner'
import { stackSnippets } from './stack'
import { statCardSnippets } from './stat-card'
import { toggleGroupSnippets } from './toggle-group'
import { tooltipSnippets } from './tooltip'

export type { Snippet } from './types'

const allSnippets = [
  ...badgeSnippets,
  ...barChartSnippets,
  ...buttonSnippets,
  ...cardSnippets,
  ...collapsibleSnippets,
  ...containerSnippets,
  ...dataTableSnippets,
  ...emptyStateSnippets,
  ...errorStateSnippets,
  ...gridSnippets,
  ...headingSnippets,
  ...inputSnippets,
  ...linkSnippets,
  ...navigationSnippets,
  ...pageLayoutSnippets,
  ...searchInputSnippets,
  ...selectSnippets,
  ...spinnerSnippets,
  ...stackSnippets,
  ...statCardSnippets,
  ...toggleGroupSnippets,
  ...tooltipSnippets,
]

export default allSnippets
