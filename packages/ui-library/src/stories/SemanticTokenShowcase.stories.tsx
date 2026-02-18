import { Flex } from '../components/Flex'
import { Grid } from '../components/Grid'
import { Heading } from '../components/Heading'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta = {
  title: 'Design System/Semantic Token Showcase',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A comprehensive showcase of all semantic tokens. These tokens adapt between light and dark themes and provide consistent, meaningful color usage across the design system.',
      },
    },
  },
}

export default meta
type Story = StoryObj

interface TokenSwatchProps {
  name: string
  cssVar: string
  description?: string
  showBorder?: boolean
}

const TokenSwatch = ({ name, cssVar, description, showBorder = false }: TokenSwatchProps) => (
  <Flex direction="row" align="center" gap="md" className="group">
    <div
      className={`w-size-md h-size-md rounded-md shadow-xs flex-shrink-0 transition-transform group-hover:scale-110 ${
        showBorder ? 'ring-1 ring-border' : ''
      }`}
      style={{ backgroundColor: `var(${cssVar})` }}
      title={cssVar}
    />
    <Flex gap="xs" className="min-w-0">
      <div className="font-mono text-xs text-foreground truncate">{name}</div>
      {description && (
        <div className="text-[10px] text-foreground-muted truncate">{description}</div>
      )}
    </Flex>
  </Flex>
)

interface TokenGroupProps {
  title: string
  tokens: Array<{ name: string; cssVar: string; description?: string; showBorder?: boolean }>
  columns?: 1 | 2 | 3
}

const TokenGroup = ({ title, tokens, columns = 2 }: TokenGroupProps) => {
  return (
    <Flex gap="md" className="bg-surface rounded-lg border border-border p-base">
      <Heading level={3} size="sm" className="pb-sm border-b border-border-muted">
        {title}
      </Heading>
      <Grid cols={columns > 1 ? { sm: columns as 2 | 3 } : 1} gap="md">
        {tokens.map((token) => (
          <TokenSwatch key={token.cssVar} {...token} />
        ))}
      </Grid>
    </Flex>
  )
}

const surfaceTokens = [
  {
    name: 'surface',
    cssVar: '--color-surface',
    description: 'Primary background',
    showBorder: true,
  },
  { name: 'surface-muted', cssVar: '--color-surface-muted', description: 'Secondary background' },
  { name: 'surface-subtle', cssVar: '--color-surface-subtle', description: 'Tertiary background' },
]

const foregroundTokens = [
  { name: 'foreground', cssVar: '--color-foreground', description: 'Primary text' },
  { name: 'foreground-muted', cssVar: '--color-foreground-muted', description: 'Secondary text' },
  {
    name: 'foreground-filled',
    cssVar: '--color-foreground-filled',
    description: 'Text on filled bg',
  },
  {
    name: 'foreground-filled-muted',
    cssVar: '--color-foreground-filled-muted',
    description: 'Muted on filled bg',
  },
]

const borderTokens = [
  { name: 'border', cssVar: '--color-border', description: 'Primary borders' },
  { name: 'border-muted', cssVar: '--color-border-muted', description: 'Subtle borders' },
  { name: 'ring', cssVar: '--color-ring', description: 'Focus ring' },
]

const interactiveTokens = [
  { name: 'interactive-hover', cssVar: '--color-interactive-hover', description: 'Hover state' },
  { name: 'interactive-active', cssVar: '--color-interactive-active', description: 'Active state' },
  {
    name: 'interactive-pressed',
    cssVar: '--color-interactive-pressed',
    description: 'Pressed state',
  },
  {
    name: 'interactive-primary',
    cssVar: '--color-interactive-primary',
    description: 'Primary action',
  },
  {
    name: 'interactive-primary-hover',
    cssVar: '--color-interactive-primary-hover',
    description: 'Primary hover',
  },
  {
    name: 'interactive-primary-foreground',
    cssVar: '--color-interactive-primary-foreground',
    description: 'Primary text',
  },
  {
    name: 'interactive-primary-border',
    cssVar: '--color-interactive-primary-border',
    description: 'Primary border',
  },
  {
    name: 'interactive-secondary',
    cssVar: '--color-interactive-secondary',
    description: 'Secondary action',
  },
  {
    name: 'interactive-secondary-hover',
    cssVar: '--color-interactive-secondary-hover',
    description: 'Secondary hover',
  },
  {
    name: 'interactive-secondary-foreground',
    cssVar: '--color-interactive-secondary-foreground',
    description: 'Secondary text',
  },
  {
    name: 'interactive-secondary-border',
    cssVar: '--color-interactive-secondary-border',
    description: 'Secondary border',
  },
  {
    name: 'interactive-destructive',
    cssVar: '--color-interactive-destructive',
    description: 'Destructive action',
  },
  {
    name: 'interactive-destructive-hover',
    cssVar: '--color-interactive-destructive-hover',
    description: 'Destructive hover',
  },
  {
    name: 'interactive-destructive-foreground',
    cssVar: '--color-interactive-destructive-foreground',
    description: 'Destructive text',
  },
  {
    name: 'interactive-destructive-border',
    cssVar: '--color-interactive-destructive-border',
    description: 'Destructive border',
  },
]

const disabledTokens = [
  { name: 'disabled', cssVar: '--color-disabled', description: 'Disabled background' },
  {
    name: 'disabled-foreground',
    cssVar: '--color-disabled-foreground',
    description: 'Disabled text',
  },
]

const tooltipTokens = [
  { name: 'tooltip', cssVar: '--color-tooltip', description: 'Tooltip background' },
  {
    name: 'tooltip-foreground',
    cssVar: '--color-tooltip-foreground',
    description: 'Tooltip text',
  },
]

const statusInfoTokens = [
  { name: 'status-info', cssVar: '--color-status-info', description: 'Base' },
  { name: 'status-info-muted', cssVar: '--color-status-info-muted', description: 'Background' },
  { name: 'status-info-foreground', cssVar: '--color-status-info-foreground', description: 'Text' },
  { name: 'status-info-emphasis', cssVar: '--color-status-info-emphasis', description: 'Strong' },
  { name: 'status-info-border', cssVar: '--color-status-info-border', description: 'Border' },
]

const statusSuccessTokens = [
  { name: 'status-success', cssVar: '--color-status-success', description: 'Base' },
  {
    name: 'status-success-muted',
    cssVar: '--color-status-success-muted',
    description: 'Background',
  },
  {
    name: 'status-success-foreground',
    cssVar: '--color-status-success-foreground',
    description: 'Text',
  },
  {
    name: 'status-success-emphasis',
    cssVar: '--color-status-success-emphasis',
    description: 'Strong',
  },
  { name: 'status-success-border', cssVar: '--color-status-success-border', description: 'Border' },
]

const statusWarningTokens = [
  { name: 'status-warning', cssVar: '--color-status-warning', description: 'Base' },
  {
    name: 'status-warning-muted',
    cssVar: '--color-status-warning-muted',
    description: 'Background',
  },
  {
    name: 'status-warning-foreground',
    cssVar: '--color-status-warning-foreground',
    description: 'Text',
  },
  {
    name: 'status-warning-emphasis',
    cssVar: '--color-status-warning-emphasis',
    description: 'Strong',
  },
  { name: 'status-warning-border', cssVar: '--color-status-warning-border', description: 'Border' },
]

const statusErrorTokens = [
  { name: 'status-error', cssVar: '--color-status-error', description: 'Base' },
  { name: 'status-error-muted', cssVar: '--color-status-error-muted', description: 'Background' },
  {
    name: 'status-error-foreground',
    cssVar: '--color-status-error-foreground',
    description: 'Text',
  },
  { name: 'status-error-emphasis', cssVar: '--color-status-error-emphasis', description: 'Strong' },
  { name: 'status-error-border', cssVar: '--color-status-error-border', description: 'Border' },
]

const accent1Tokens = [
  { name: 'accent-1', cssVar: '--color-accent-1', description: 'Base' },
  { name: 'accent-1-muted', cssVar: '--color-accent-1-muted', description: 'Background' },
  { name: 'accent-1-foreground', cssVar: '--color-accent-1-foreground', description: 'Text' },
  { name: 'accent-1-emphasis', cssVar: '--color-accent-1-emphasis', description: 'Strong' },
  { name: 'accent-1-border', cssVar: '--color-accent-1-border', description: 'Border' },
]

const accent2Tokens = [
  { name: 'accent-2', cssVar: '--color-accent-2', description: 'Base' },
  { name: 'accent-2-muted', cssVar: '--color-accent-2-muted', description: 'Background' },
  { name: 'accent-2-foreground', cssVar: '--color-accent-2-foreground', description: 'Text' },
  { name: 'accent-2-emphasis', cssVar: '--color-accent-2-emphasis', description: 'Strong' },
  { name: 'accent-2-border', cssVar: '--color-accent-2-border', description: 'Border' },
]

const accent3Tokens = [
  { name: 'accent-3', cssVar: '--color-accent-3', description: 'Base' },
  { name: 'accent-3-muted', cssVar: '--color-accent-3-muted', description: 'Background' },
  { name: 'accent-3-foreground', cssVar: '--color-accent-3-foreground', description: 'Text' },
  { name: 'accent-3-emphasis', cssVar: '--color-accent-3-emphasis', description: 'Strong' },
  { name: 'accent-3-border', cssVar: '--color-accent-3-border', description: 'Border' },
]

const accent4Tokens = [
  { name: 'accent-4', cssVar: '--color-accent-4', description: 'Base' },
  { name: 'accent-4-muted', cssVar: '--color-accent-4-muted', description: 'Background' },
  { name: 'accent-4-foreground', cssVar: '--color-accent-4-foreground', description: 'Text' },
  { name: 'accent-4-emphasis', cssVar: '--color-accent-4-emphasis', description: 'Strong' },
  { name: 'accent-4-border', cssVar: '--color-accent-4-border', description: 'Border' },
]

const accent5Tokens = [
  { name: 'accent-5', cssVar: '--color-accent-5', description: 'Base' },
  { name: 'accent-5-muted', cssVar: '--color-accent-5-muted', description: 'Background' },
  { name: 'accent-5-foreground', cssVar: '--color-accent-5-foreground', description: 'Text' },
  { name: 'accent-5-emphasis', cssVar: '--color-accent-5-emphasis', description: 'Strong' },
  { name: 'accent-5-border', cssVar: '--color-accent-5-border', description: 'Border' },
]

export const AllTokens: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-muted p-lg">
      <Flex gap="lg" className="max-w-7xl mx-auto">
        {/* Header */}
        <Flex gap="sm" className="text-center">
          <Heading level={1} size="3xl">
            Semantic Tokens
          </Heading>
          <p className="text-foreground-muted mx-auto">
            Theme-aware tokens that adapt between light and dark modes. Use these instead of palette
            colors for consistent, meaningful color application.
          </p>
        </Flex>

        {/* Core Tokens */}
        <Grid cols={{ lg: 3 }} gap="base">
          <TokenGroup title="Surface (Backgrounds)" tokens={surfaceTokens} columns={1} />
          <TokenGroup title="Foreground (Text)" tokens={foregroundTokens} columns={1} />
          <TokenGroup title="Border & Ring" tokens={borderTokens} columns={1} />
        </Grid>

        {/* Interactive States */}
        <TokenGroup title="Interactive States" tokens={interactiveTokens} columns={3} />

        {/* Disabled & Tooltip */}
        <Grid cols={{ lg: 2 }} gap="base">
          <TokenGroup title="Disabled States" tokens={disabledTokens} columns={1} />
          <TokenGroup title="Tooltip" tokens={tooltipTokens} columns={1} />
        </Grid>

        {/* Status Tokens - Compact Grid */}
        <Flex gap="base" className="bg-surface rounded-lg border border-border p-base">
          <Heading level={3} size="sm" className="pb-sm border-b border-border-muted">
            Status Tokens
          </Heading>
          <Grid cols={{ sm: 2, lg: 4 }} gap="base">
            <Flex gap="sm">
              <div className="text-xs font-medium text-foreground-muted">Info</div>
              {statusInfoTokens.map((t) => (
                <TokenSwatch key={t.cssVar} {...t} />
              ))}
            </Flex>
            <Flex gap="sm">
              <div className="text-xs font-medium text-foreground-muted">Success</div>
              {statusSuccessTokens.map((t) => (
                <TokenSwatch key={t.cssVar} {...t} />
              ))}
            </Flex>
            <Flex gap="sm">
              <div className="text-xs font-medium text-foreground-muted">Warning</div>
              {statusWarningTokens.map((t) => (
                <TokenSwatch key={t.cssVar} {...t} />
              ))}
            </Flex>
            <Flex gap="sm">
              <div className="text-xs font-medium text-foreground-muted">Error</div>
              {statusErrorTokens.map((t) => (
                <TokenSwatch key={t.cssVar} {...t} />
              ))}
            </Flex>
          </Grid>
        </Flex>

        {/* Accent & Data Tokens - Compact Grid */}
        <Grid cols={{ lg: 2 }} gap="base">
          <Flex gap="base" className="bg-surface rounded-lg border border-border p-base">
            <Heading level={3} size="sm" className="pb-sm border-b border-border-muted">
              Accent Tokens (Categorization)
            </Heading>
            <Grid cols={{ sm: 3 }} gap="base">
              <Flex gap="sm">
                <div className="text-xs font-medium text-foreground-muted">Accent 1</div>
                {accent1Tokens.map((t) => (
                  <TokenSwatch key={t.cssVar} {...t} />
                ))}
              </Flex>
              <Flex gap="sm">
                <div className="text-xs font-medium text-foreground-muted">Accent 2</div>
                {accent2Tokens.map((t) => (
                  <TokenSwatch key={t.cssVar} {...t} />
                ))}
              </Flex>
              <Flex gap="sm">
                <div className="text-xs font-medium text-foreground-muted">Accent 3</div>
                {accent3Tokens.map((t) => (
                  <TokenSwatch key={t.cssVar} {...t} />
                ))}
              </Flex>
            </Grid>
          </Flex>

          <Flex gap="base" className="bg-surface rounded-lg border border-border p-base">
            <Heading level={3} size="sm" className="pb-sm border-b border-border-muted">
              Accent 4-5 Tokens (Data Visualization)
            </Heading>
            <Grid cols={{ sm: 2 }} gap="base">
              <Flex gap="sm">
                <div className="text-xs font-medium text-foreground-muted">Accent 4</div>
                {accent4Tokens.map((t) => (
                  <TokenSwatch key={t.cssVar} {...t} />
                ))}
              </Flex>
              <Flex gap="sm">
                <div className="text-xs font-medium text-foreground-muted">Accent 5</div>
                {accent5Tokens.map((t) => (
                  <TokenSwatch key={t.cssVar} {...t} />
                ))}
              </Flex>
            </Grid>
          </Flex>
        </Grid>

        {/* Token Structure Legend */}
        <Flex gap="md" className="bg-surface rounded-lg border border-border p-base">
          <Heading level={3} size="sm">
            Token Variant Structure
          </Heading>
          <Grid cols={{ sm: 2, md: 5 }} gap="base" className="text-xs">
            <Flex direction="row" align="center" gap="sm">
              <div className="w-size-xs h-size-xs rounded-sm bg-status-info" />
              <span className="text-foreground-muted">
                <strong>base</strong> - Primary color
              </span>
            </Flex>
            <Flex direction="row" align="center" gap="sm">
              <div className="w-size-xs h-size-xs rounded-sm bg-status-info-muted" />
              <span className="text-foreground-muted">
                <strong>muted</strong> - Subtle bg
              </span>
            </Flex>
            <Flex direction="row" align="center" gap="sm">
              <div className="w-size-xs h-size-xs rounded-sm bg-status-info-foreground" />
              <span className="text-foreground-muted">
                <strong>foreground</strong> - Text
              </span>
            </Flex>
            <Flex direction="row" align="center" gap="sm">
              <div className="w-size-xs h-size-xs rounded-sm bg-status-info-emphasis" />
              <span className="text-foreground-muted">
                <strong>emphasis</strong> - Strong
              </span>
            </Flex>
            <Flex direction="row" align="center" gap="sm">
              <div className="w-size-xs h-size-xs rounded-sm bg-status-info-border" />
              <span className="text-foreground-muted">
                <strong>border</strong> - Borders
              </span>
            </Flex>
          </Grid>
        </Flex>
      </Flex>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete overview of all semantic tokens organized by category.',
      },
    },
  },
}

/** Interactive example showing surface layering */
const SurfaceLayersExample = () => (
  <Flex gap="sm">
    <div className="text-xs font-medium text-foreground-muted">Surface Layering</div>
    <Flex gap="sm" className="bg-surface-muted p-base rounded-lg">
      <div className="text-xs text-foreground-muted">surface-muted (page bg)</div>
      <Flex gap="sm" className="bg-surface p-base rounded-lg shadow-xs">
        <div className="text-xs text-foreground-muted">surface (card)</div>
        <div className="bg-surface-subtle p-md rounded-sm">
          <div className="text-xs text-foreground-muted">surface-subtle (well/hover)</div>
        </div>
      </Flex>
    </Flex>
  </Flex>
)

/** Interactive list item showing hover/active/pressed states */
const InteractiveStatesExample = () => (
  <Flex gap="sm">
    <div className="text-xs font-medium text-foreground-muted">
      Interactive States (hover over items)
    </div>
    <div className="bg-surface rounded-lg border border-border overflow-hidden">
      <div className="px-base py-md text-sm text-foreground border-b border-border-muted">
        Default state
      </div>
      <div className="px-base py-md text-sm text-foreground bg-interactive-hover border-b border-border-muted">
        Hover state <span className="text-foreground-muted text-xs">(interactive-hover)</span>
      </div>
      <div className="px-base py-md text-sm text-foreground bg-interactive-active border-b border-border-muted">
        Active/selected <span className="text-foreground-muted text-xs">(interactive-active)</span>
      </div>
      <div className="px-base py-md text-sm text-foreground bg-interactive-pressed">
        Pressed state <span className="text-foreground-muted text-xs">(interactive-pressed)</span>
      </div>
    </div>
    {/* Real interactive example */}
    <div className="text-xs text-foreground-muted">Try hovering and clicking:</div>
    <div className="bg-surface rounded-lg border border-border overflow-hidden">
      {['Item 1', 'Item 2', 'Item 3'].map((item) => (
        <button
          key={item}
          className="w-full px-base py-md text-sm text-foreground text-left border-b border-border-muted last:border-b-0 transition-colors hover:bg-interactive-hover active:bg-interactive-pressed focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-inset"
        >
          {item}
        </button>
      ))}
    </div>
  </Flex>
)

/** Button variants showing primary, destructive, accent */
const ButtonVariantsExample = () => (
  <Flex gap="sm">
    <div className="text-xs font-medium text-foreground-muted">Button Tokens</div>
    <Flex direction="row" gap="md" wrap={true}>
      <button className="px-base py-sm rounded-md text-sm font-medium bg-interactive-primary text-interactive-primary-foreground hover:bg-interactive-primary-hover transition-colors">
        Primary Action
      </button>
      <button className="px-base py-sm rounded-md text-sm font-medium bg-interactive-secondary text-interactive-secondary-foreground hover:bg-interactive-secondary-hover transition-colors">
        Secondary
      </button>
      <button className="px-base py-sm rounded-md text-sm font-medium bg-interactive-destructive text-interactive-destructive-foreground hover:bg-interactive-destructive-hover transition-colors">
        Destructive
      </button>
      <button
        className="px-base py-sm rounded-md text-sm font-medium bg-disabled text-disabled-foreground cursor-not-allowed"
        disabled
      >
        Disabled
      </button>
    </Flex>
  </Flex>
)

/** Status badges showing all status token variants */
const StatusBadgesExample = () => (
  <Flex gap="base">
    <div className="text-xs font-medium text-foreground-muted">Status Badges</div>
    <Grid cols={{ sm: 2, md: 4 }} gap="base">
      {/* Info */}
      <Flex gap="sm">
        <span className="inline-flex items-center px-md py-xs rounded-full text-xs font-medium bg-status-info-muted text-status-info-foreground border border-status-info-border">
          Info Badge
        </span>
        <div className="bg-status-info-muted border border-status-info-border rounded-lg p-md">
          <div className="text-sm font-medium text-status-info-foreground">Info Alert</div>
          <div className="text-xs text-status-info-foreground/80">Using status-info tokens</div>
        </div>
      </Flex>
      {/* Success */}
      <Flex gap="sm">
        <span className="inline-flex items-center px-md py-xs rounded-full text-xs font-medium bg-status-success-muted text-status-success-foreground border border-status-success-border">
          Success
        </span>
        <div className="bg-status-success-muted border border-status-success-border rounded-lg p-md">
          <div className="text-sm font-medium text-status-success-foreground">Success Alert</div>
          <div className="text-xs text-status-success-foreground/80">
            Using status-success tokens
          </div>
        </div>
      </Flex>
      {/* Warning */}
      <Flex gap="sm">
        <span className="inline-flex items-center px-md py-xs rounded-full text-xs font-medium bg-status-warning-muted text-status-warning-foreground border border-status-warning-border">
          Warning
        </span>
        <div className="bg-status-warning-muted border border-status-warning-border rounded-lg p-md">
          <div className="text-sm font-medium text-status-warning-foreground">Warning Alert</div>
          <div className="text-xs text-status-warning-foreground/80">
            Using status-warning tokens
          </div>
        </div>
      </Flex>
      {/* Error */}
      <Flex gap="sm">
        <span className="inline-flex items-center px-md py-xs rounded-full text-xs font-medium bg-status-error-muted text-status-error-foreground border border-status-error-border">
          Error
        </span>
        <div className="bg-status-error-muted border border-status-error-border rounded-lg p-md">
          <div className="text-sm font-medium text-status-error-foreground">Error Alert</div>
          <div className="text-xs text-status-error-foreground/80">Using status-error tokens</div>
        </div>
      </Flex>
    </Grid>
  </Flex>
)

/** Accent tokens used for categorization tags */
const AccentTagsExample = () => (
  <Flex gap="sm">
    <div className="text-xs font-medium text-foreground-muted">Accent Tags (Categorization)</div>
    <Flex direction="row" gap="sm" wrap={true}>
      <span className="inline-flex items-center px-md py-xs rounded-full text-xs font-medium bg-accent-1-muted text-accent-1-foreground border border-accent-1-border">
        Category A
      </span>
      <span className="inline-flex items-center px-md py-xs rounded-full text-xs font-medium bg-accent-2-muted text-accent-2-foreground border border-accent-2-border">
        Category B
      </span>
      <span className="inline-flex items-center px-md py-xs rounded-full text-xs font-medium bg-accent-3-muted text-accent-3-foreground border border-accent-3-border">
        Category C
      </span>
    </Flex>
    {/* Solid variants */}
    <Flex direction="row" gap="sm" wrap={true}>
      <span className="inline-flex items-center px-md py-xs rounded-full text-xs font-medium bg-accent-1-emphasis text-foreground-filled">
        Solid Accent 1
      </span>
      <span className="inline-flex items-center px-md py-xs rounded-full text-xs font-medium bg-accent-2-emphasis text-foreground-filled">
        Solid Accent 2
      </span>
      <span className="inline-flex items-center px-md py-xs rounded-full text-xs font-medium bg-accent-3-emphasis text-foreground-filled">
        Solid Accent 3
      </span>
    </Flex>
  </Flex>
)

/** Accent tokens for chart legend */
const DataVisualizationExample = () => (
  <Flex gap="sm">
    <div className="text-xs font-medium text-foreground-muted">Data Visualization</div>
    {/* Simple bar chart mockup */}
    <div className="bg-surface rounded-lg border border-border p-base">
      <div className="flex items-end gap-sm h-24 mb-base">
        <div className="flex-1 bg-accent-4 rounded-t" style={{ height: '80%' }} />
        <div className="flex-1 bg-accent-5 rounded-t" style={{ height: '60%' }} />
        <div className="flex-1 bg-accent-4 rounded-t" style={{ height: '90%' }} />
        <div className="flex-1 bg-accent-5 rounded-t" style={{ height: '45%' }} />
        <div className="flex-1 bg-accent-4 rounded-t" style={{ height: '70%' }} />
        <div className="flex-1 bg-accent-5 rounded-t" style={{ height: '85%' }} />
      </div>
      {/* Legend */}
      <Flex direction="row" gap="base" className="text-xs">
        <Flex direction="row" align="center" gap="sm">
          <div className="w-3 h-3 rounded-sm bg-accent-4" />
          <span className="text-foreground-muted">Series A (accent-4)</span>
        </Flex>
        <Flex direction="row" align="center" gap="sm">
          <div className="w-3 h-3 rounded-sm bg-accent-5" />
          <span className="text-foreground-muted">Series B (accent-5)</span>
        </Flex>
      </Flex>
    </div>
    {/* Data badges */}
    <Flex direction="row" gap="sm" wrap={true}>
      <span className="inline-flex items-center px-md py-xs rounded-full text-xs font-medium bg-accent-4-muted text-accent-4-foreground border border-accent-4-border">
        Dataset 1
      </span>
      <span className="inline-flex items-center px-md py-xs rounded-full text-xs font-medium bg-accent-5-muted text-accent-5-foreground border border-accent-5-border">
        Dataset 2
      </span>
    </Flex>
  </Flex>
)

/** Text hierarchy example */
const TextHierarchyExample = () => (
  <Flex gap="sm">
    <div className="text-xs font-medium text-foreground-muted">Text Hierarchy</div>
    <Flex gap="sm" className="bg-surface rounded-lg border border-border p-base">
      <Heading level={3}>Primary Heading</Heading>
      <p className="text-sm text-foreground">
        Primary body text uses{' '}
        <code className="text-xs bg-surface-subtle px-xs rounded-sm">foreground</code>
      </p>
      <p className="text-sm text-foreground-muted">
        Secondary text uses{' '}
        <code className="text-xs bg-surface-subtle px-xs rounded-sm">foreground-muted</code>
      </p>
    </Flex>
    {/* Foreground on filled backgrounds */}
    <Flex gap="sm" className="bg-interactive-primary rounded-lg p-base">
      <Heading level={3} className="text-foreground-filled">
        Filled Background
      </Heading>
      <p className="text-sm text-foreground-filled">
        On filled backgrounds use{' '}
        <code className="text-xs bg-interactive-primary-hover px-xs rounded-sm">
          foreground-filled
        </code>
      </p>
      <p className="text-sm text-foreground-filled-muted">
        Secondary text uses{' '}
        <code className="text-xs bg-interactive-primary-hover px-xs rounded-sm">
          foreground-filled-muted
        </code>
      </p>
    </Flex>
  </Flex>
)

/** Focus ring example */
const FocusRingExample = () => (
  <Flex gap="sm">
    <div className="text-xs font-medium text-foreground-muted">Focus States (tab through)</div>
    <Flex direction="row" gap="md" wrap={true}>
      <button className="px-base py-sm rounded-md text-sm font-medium bg-surface border border-border text-foreground hover:bg-interactive-hover focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-surface transition-colors">
        Focus me
      </button>
      <input
        type="text"
        placeholder="Or focus this input"
        className="px-md py-sm rounded-md text-sm bg-surface border border-border text-foreground placeholder:text-foreground-muted focus:outline-hidden focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
      />
    </Flex>
  </Flex>
)

export const TokensInUse: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-muted p-lg">
      <Flex gap="lg" className="max-w-5xl mx-auto">
        {/* Header */}
        <Flex gap="sm" className="text-center">
          <Heading level={1} size="3xl">
            Tokens in Use
          </Heading>
          <p className="text-foreground-muted mx-auto">
            Interactive examples showing how semantic tokens create consistent, theme-aware UI
            patterns.
          </p>
        </Flex>

        {/* Examples Grid */}
        <Grid cols={{ lg: 2 }} gap="lg">
          <div className="bg-surface rounded-lg border border-border p-base">
            <SurfaceLayersExample />
          </div>
          <div className="bg-surface rounded-lg border border-border p-base">
            <InteractiveStatesExample />
          </div>
          <div className="bg-surface rounded-lg border border-border p-base">
            <ButtonVariantsExample />
          </div>
          <div className="bg-surface rounded-lg border border-border p-base">
            <TextHierarchyExample />
          </div>
          <div className="bg-surface rounded-lg border border-border p-base lg:col-span-2">
            <StatusBadgesExample />
          </div>
          <div className="bg-surface rounded-lg border border-border p-base">
            <AccentTagsExample />
          </div>
          <div className="bg-surface rounded-lg border border-border p-base">
            <DataVisualizationExample />
          </div>
          <div className="bg-surface rounded-lg border border-border p-base lg:col-span-2">
            <FocusRingExample />
          </div>
        </Grid>
      </Flex>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Interactive examples demonstrating semantic tokens in real UI patterns. Hover, click, and tab to see interactive states.',
      },
    },
  },
}
