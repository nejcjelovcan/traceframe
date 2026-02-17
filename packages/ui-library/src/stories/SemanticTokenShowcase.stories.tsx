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
  <div className="flex items-center gap-md group">
    <div
      className={`w-size-md h-size-md rounded-md shadow-xs flex-shrink-0 transition-transform group-hover:scale-110 ${
        showBorder ? 'ring-1 ring-border' : ''
      }`}
      style={{ backgroundColor: `rgb(var(${cssVar}))` }}
      title={cssVar}
    />
    <div className="min-w-0">
      <div className="font-mono text-xs text-foreground truncate">{name}</div>
      {description && (
        <div className="text-[10px] text-foreground-muted truncate">{description}</div>
      )}
    </div>
  </div>
)

interface TokenGroupProps {
  title: string
  tokens: Array<{ name: string; cssVar: string; description?: string; showBorder?: boolean }>
  columns?: 1 | 2 | 3
}

const TokenGroup = ({ title, tokens, columns = 2 }: TokenGroupProps) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  }

  return (
    <div className="bg-surface rounded-lg border border-border p-base">
      <Heading level={3} size="sm" className="mb-md pb-sm border-b border-border-muted">
        {title}
      </Heading>
      <div className={`grid ${gridCols[columns]} gap-md`}>
        {tokens.map((token) => (
          <TokenSwatch key={token.cssVar} {...token} />
        ))}
      </div>
    </div>
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
    name: 'interactive-destructive',
    cssVar: '--color-interactive-destructive',
    description: 'Destructive action',
  },
  {
    name: 'interactive-destructive-hover',
    cssVar: '--color-interactive-destructive-hover',
    description: 'Destructive hover',
  },
  { name: 'interactive-accent', cssVar: '--color-interactive-accent', description: 'Accent/links' },
  {
    name: 'interactive-accent-hover',
    cssVar: '--color-interactive-accent-hover',
    description: 'Accent hover',
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
      <div className="max-w-7xl mx-auto space-y-lg">
        {/* Header */}
        <div className="text-center mb-lg">
          <Heading level={1} size="3xl" className="mb-sm">
            Semantic Tokens
          </Heading>
          <p className="text-foreground-muted max-w-2xl mx-auto">
            Theme-aware tokens that adapt between light and dark modes. Use these instead of palette
            colors for consistent, meaningful color application.
          </p>
        </div>

        {/* Core Tokens */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-base">
          <TokenGroup title="Surface (Backgrounds)" tokens={surfaceTokens} columns={1} />
          <TokenGroup title="Foreground (Text)" tokens={foregroundTokens} columns={1} />
          <TokenGroup title="Border & Ring" tokens={borderTokens} columns={1} />
        </div>

        {/* Interactive & Disabled */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-base">
          <TokenGroup title="Interactive States" tokens={interactiveTokens} columns={2} />
          <TokenGroup title="Disabled States" tokens={disabledTokens} columns={1} />
        </div>

        {/* Status Tokens - Compact Grid */}
        <div className="bg-surface rounded-lg border border-border p-base">
          <Heading level={3} size="sm" className="mb-base pb-sm border-b border-border-muted">
            Status Tokens
          </Heading>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-base">
            <div className="space-y-sm">
              <div className="text-xs font-medium text-foreground-muted mb-sm">Info</div>
              {statusInfoTokens.map((t) => (
                <TokenSwatch key={t.cssVar} {...t} />
              ))}
            </div>
            <div className="space-y-sm">
              <div className="text-xs font-medium text-foreground-muted mb-sm">Success</div>
              {statusSuccessTokens.map((t) => (
                <TokenSwatch key={t.cssVar} {...t} />
              ))}
            </div>
            <div className="space-y-sm">
              <div className="text-xs font-medium text-foreground-muted mb-sm">Warning</div>
              {statusWarningTokens.map((t) => (
                <TokenSwatch key={t.cssVar} {...t} />
              ))}
            </div>
            <div className="space-y-sm">
              <div className="text-xs font-medium text-foreground-muted mb-sm">Error</div>
              {statusErrorTokens.map((t) => (
                <TokenSwatch key={t.cssVar} {...t} />
              ))}
            </div>
          </div>
        </div>

        {/* Accent & Data Tokens - Compact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-base">
          <div className="bg-surface rounded-lg border border-border p-base">
            <Heading level={3} size="sm" className="mb-base pb-sm border-b border-border-muted">
              Accent Tokens (Categorization)
            </Heading>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-base">
              <div className="space-y-sm">
                <div className="text-xs font-medium text-foreground-muted mb-sm">Accent 1</div>
                {accent1Tokens.map((t) => (
                  <TokenSwatch key={t.cssVar} {...t} />
                ))}
              </div>
              <div className="space-y-sm">
                <div className="text-xs font-medium text-foreground-muted mb-sm">Accent 2</div>
                {accent2Tokens.map((t) => (
                  <TokenSwatch key={t.cssVar} {...t} />
                ))}
              </div>
              <div className="space-y-sm">
                <div className="text-xs font-medium text-foreground-muted mb-sm">Accent 3</div>
                {accent3Tokens.map((t) => (
                  <TokenSwatch key={t.cssVar} {...t} />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-lg border border-border p-base">
            <Heading level={3} size="sm" className="mb-base pb-sm border-b border-border-muted">
              Accent 4-5 Tokens (Data Visualization)
            </Heading>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-base">
              <div className="space-y-sm">
                <div className="text-xs font-medium text-foreground-muted mb-sm">Accent 4</div>
                {accent4Tokens.map((t) => (
                  <TokenSwatch key={t.cssVar} {...t} />
                ))}
              </div>
              <div className="space-y-sm">
                <div className="text-xs font-medium text-foreground-muted mb-sm">Accent 5</div>
                {accent5Tokens.map((t) => (
                  <TokenSwatch key={t.cssVar} {...t} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Token Structure Legend */}
        <div className="bg-surface rounded-lg border border-border p-base">
          <Heading level={3} size="sm" className="mb-md">
            Token Variant Structure
          </Heading>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-base text-xs">
            <div className="flex items-center gap-sm">
              <div className="w-size-xs h-size-xs rounded-sm bg-status-info" />
              <span className="text-foreground-muted">
                <strong>base</strong> - Primary color
              </span>
            </div>
            <div className="flex items-center gap-sm">
              <div className="w-size-xs h-size-xs rounded-sm bg-status-info-muted" />
              <span className="text-foreground-muted">
                <strong>muted</strong> - Subtle bg
              </span>
            </div>
            <div className="flex items-center gap-sm">
              <div className="w-size-xs h-size-xs rounded-sm bg-status-info-foreground" />
              <span className="text-foreground-muted">
                <strong>foreground</strong> - Text
              </span>
            </div>
            <div className="flex items-center gap-sm">
              <div className="w-size-xs h-size-xs rounded-sm bg-status-info-emphasis" />
              <span className="text-foreground-muted">
                <strong>emphasis</strong> - Strong
              </span>
            </div>
            <div className="flex items-center gap-sm">
              <div className="w-size-xs h-size-xs rounded-sm bg-status-info-border" />
              <span className="text-foreground-muted">
                <strong>border</strong> - Borders
              </span>
            </div>
          </div>
        </div>
      </div>
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
  <div className="space-y-sm">
    <div className="text-xs font-medium text-foreground-muted mb-md">Surface Layering</div>
    <div className="bg-surface-muted p-base rounded-lg">
      <div className="text-xs text-foreground-muted mb-sm">surface-muted (page bg)</div>
      <div className="bg-surface p-base rounded-lg shadow-xs">
        <div className="text-xs text-foreground-muted mb-sm">surface (card)</div>
        <div className="bg-surface-subtle p-md rounded-sm">
          <div className="text-xs text-foreground-muted">surface-subtle (well/hover)</div>
        </div>
      </div>
    </div>
  </div>
)

/** Interactive list item showing hover/active/pressed states */
const InteractiveStatesExample = () => (
  <div className="space-y-sm">
    <div className="text-xs font-medium text-foreground-muted mb-md">
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
    <div className="text-xs text-foreground-muted mt-base mb-sm">Try hovering and clicking:</div>
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
  </div>
)

/** Button variants showing primary, destructive, accent */
const ButtonVariantsExample = () => (
  <div className="space-y-sm">
    <div className="text-xs font-medium text-foreground-muted mb-md">Button Tokens</div>
    <div className="flex flex-wrap gap-md">
      <button className="px-base py-sm rounded-md text-sm font-medium bg-interactive-primary text-foreground-filled hover:bg-interactive-primary-hover transition-colors">
        Primary Action
      </button>
      <button className="px-base py-sm rounded-md text-sm font-medium bg-interactive-destructive text-foreground-filled hover:bg-interactive-destructive-hover transition-colors">
        Destructive
      </button>
      <button className="px-base py-sm rounded-md text-sm font-medium text-interactive-accent hover:text-interactive-accent-hover transition-colors">
        Accent Link
      </button>
      <button
        className="px-base py-sm rounded-md text-sm font-medium bg-disabled text-disabled-foreground cursor-not-allowed"
        disabled
      >
        Disabled
      </button>
    </div>
  </div>
)

/** Status badges showing all status token variants */
const StatusBadgesExample = () => (
  <div className="space-y-base">
    <div className="text-xs font-medium text-foreground-muted mb-md">Status Badges</div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-base">
      {/* Info */}
      <div className="space-y-sm">
        <span className="inline-flex items-center px-md py-xs rounded-full text-xs font-medium bg-status-info-muted text-status-info-foreground border border-status-info-border">
          Info Badge
        </span>
        <div className="bg-status-info-muted border border-status-info-border rounded-lg p-md">
          <div className="text-sm font-medium text-status-info-foreground">Info Alert</div>
          <div className="text-xs text-status-info-foreground/80">Using status-info tokens</div>
        </div>
      </div>
      {/* Success */}
      <div className="space-y-sm">
        <span className="inline-flex items-center px-md py-xs rounded-full text-xs font-medium bg-status-success-muted text-status-success-foreground border border-status-success-border">
          Success
        </span>
        <div className="bg-status-success-muted border border-status-success-border rounded-lg p-md">
          <div className="text-sm font-medium text-status-success-foreground">Success Alert</div>
          <div className="text-xs text-status-success-foreground/80">
            Using status-success tokens
          </div>
        </div>
      </div>
      {/* Warning */}
      <div className="space-y-sm">
        <span className="inline-flex items-center px-md py-xs rounded-full text-xs font-medium bg-status-warning-muted text-status-warning-foreground border border-status-warning-border">
          Warning
        </span>
        <div className="bg-status-warning-muted border border-status-warning-border rounded-lg p-md">
          <div className="text-sm font-medium text-status-warning-foreground">Warning Alert</div>
          <div className="text-xs text-status-warning-foreground/80">
            Using status-warning tokens
          </div>
        </div>
      </div>
      {/* Error */}
      <div className="space-y-sm">
        <span className="inline-flex items-center px-md py-xs rounded-full text-xs font-medium bg-status-error-muted text-status-error-foreground border border-status-error-border">
          Error
        </span>
        <div className="bg-status-error-muted border border-status-error-border rounded-lg p-md">
          <div className="text-sm font-medium text-status-error-foreground">Error Alert</div>
          <div className="text-xs text-status-error-foreground/80">Using status-error tokens</div>
        </div>
      </div>
    </div>
  </div>
)

/** Accent tokens used for categorization tags */
const AccentTagsExample = () => (
  <div className="space-y-sm">
    <div className="text-xs font-medium text-foreground-muted mb-md">
      Accent Tags (Categorization)
    </div>
    <div className="flex flex-wrap gap-sm">
      <span className="inline-flex items-center px-md py-xs rounded-full text-xs font-medium bg-accent-1-muted text-accent-1-foreground border border-accent-1-border">
        Category A
      </span>
      <span className="inline-flex items-center px-md py-xs rounded-full text-xs font-medium bg-accent-2-muted text-accent-2-foreground border border-accent-2-border">
        Category B
      </span>
      <span className="inline-flex items-center px-md py-xs rounded-full text-xs font-medium bg-accent-3-muted text-accent-3-foreground border border-accent-3-border">
        Category C
      </span>
    </div>
    {/* Solid variants */}
    <div className="flex flex-wrap gap-sm mt-md">
      <span className="inline-flex items-center px-md py-xs rounded-full text-xs font-medium bg-accent-1-emphasis text-foreground-filled">
        Solid Accent 1
      </span>
      <span className="inline-flex items-center px-md py-xs rounded-full text-xs font-medium bg-accent-2-emphasis text-foreground-filled">
        Solid Accent 2
      </span>
      <span className="inline-flex items-center px-md py-xs rounded-full text-xs font-medium bg-accent-3-emphasis text-foreground-filled">
        Solid Accent 3
      </span>
    </div>
  </div>
)

/** Accent tokens for chart legend */
const DataVisualizationExample = () => (
  <div className="space-y-sm">
    <div className="text-xs font-medium text-foreground-muted mb-md">Data Visualization</div>
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
      <div className="flex gap-base text-xs">
        <div className="flex items-center gap-sm">
          <div className="w-3 h-3 rounded-sm bg-accent-4" />
          <span className="text-foreground-muted">Series A (accent-4)</span>
        </div>
        <div className="flex items-center gap-sm">
          <div className="w-3 h-3 rounded-sm bg-accent-5" />
          <span className="text-foreground-muted">Series B (accent-5)</span>
        </div>
      </div>
    </div>
    {/* Data badges */}
    <div className="flex flex-wrap gap-sm mt-md">
      <span className="inline-flex items-center px-md py-xs rounded-full text-xs font-medium bg-accent-4-muted text-accent-4-foreground border border-accent-4-border">
        Dataset 1
      </span>
      <span className="inline-flex items-center px-md py-xs rounded-full text-xs font-medium bg-accent-5-muted text-accent-5-foreground border border-accent-5-border">
        Dataset 2
      </span>
    </div>
  </div>
)

/** Text hierarchy example */
const TextHierarchyExample = () => (
  <div className="space-y-sm">
    <div className="text-xs font-medium text-foreground-muted mb-md">Text Hierarchy</div>
    <div className="bg-surface rounded-lg border border-border p-base space-y-sm">
      <Heading level={3}>Primary Heading</Heading>
      <p className="text-sm text-foreground">
        Primary body text uses{' '}
        <code className="text-xs bg-surface-subtle px-xs rounded-sm">foreground</code>
      </p>
      <p className="text-sm text-foreground-muted">
        Secondary text uses{' '}
        <code className="text-xs bg-surface-subtle px-xs rounded-sm">foreground-muted</code>
      </p>
    </div>
    {/* Foreground on filled backgrounds */}
    <div className="bg-interactive-primary rounded-lg p-base space-y-sm">
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
    </div>
  </div>
)

/** Focus ring example */
const FocusRingExample = () => (
  <div className="space-y-sm">
    <div className="text-xs font-medium text-foreground-muted mb-md">
      Focus States (tab through)
    </div>
    <div className="flex flex-wrap gap-md">
      <button className="px-base py-sm rounded-md text-sm font-medium bg-surface border border-border text-foreground hover:bg-interactive-hover focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-surface transition-colors">
        Focus me
      </button>
      <input
        type="text"
        placeholder="Or focus this input"
        className="px-md py-sm rounded-md text-sm bg-surface border border-border text-foreground placeholder:text-foreground-muted focus:outline-hidden focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
      />
    </div>
  </div>
)

export const TokensInUse: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-muted p-lg">
      <div className="max-w-5xl mx-auto space-y-lg">
        {/* Header */}
        <div className="text-center mb-lg">
          <Heading level={1} size="3xl" className="mb-sm">
            Tokens in Use
          </Heading>
          <p className="text-foreground-muted max-w-2xl mx-auto">
            Interactive examples showing how semantic tokens create consistent, theme-aware UI
            patterns.
          </p>
        </div>

        {/* Examples Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
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
        </div>
      </div>
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
