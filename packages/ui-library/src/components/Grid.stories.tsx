import { Card, CardContent } from './Card'
import { Grid } from './Grid'
import { Heading } from './Heading'
import { StatCard } from './StatCard'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Grid> = {
  title: 'Components/Grid',
  component: Grid,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A CSS Grid layout component with responsive column support.

**Tier:** 1 (Tailwind + CVA)

**Usage:** Use for multi-column layouts like card grids, dashboards, and galleries. Supports fixed column counts or responsive breakpoints.

**Responsive Columns:**
\`\`\`tsx
// Fixed columns
<Grid cols={3}>...</Grid>

// Responsive columns
<Grid cols={{ md: 2, lg: 4 }}>...</Grid>
\`\`\`

**Accessibility:**
- Uses semantic \`<div>\` element with CSS Grid
- Grid layout does not affect content accessibility
- Children maintain their natural reading order
        `.trim(),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    cols: {
      description: 'Number of columns: fixed number (1-6) or responsive object with breakpoints',
      control: 'select',
      options: [1, 2, 3, 4, 5, 6],
      table: {
        defaultValue: { summary: '1' },
      },
    },
    gap: {
      description: 'Gap size between grid items (semantic spacing tokens)',
      control: 'select',
      options: ['none', '2xs', 'xs', 'sm', 'md', 'base', 'lg', 'xl', '2xl'],
      table: {
        defaultValue: { summary: 'base' },
      },
    },
    rows: {
      description: 'Optional fixed row count (sets grid-template-rows)',
      control: 'number',
    },
    children: {
      description: 'Grid items to render',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const GridItem = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-20 items-center justify-center rounded border border-dashed border-border-muted bg-surface-muted p-base text-sm font-medium text-foreground-muted">
    {children}
  </div>
)

export const Default: Story = {
  args: {
    cols: 3,
    gap: 'base',
  },
  render: (args) => (
    <Grid {...args}>
      <GridItem>Item 1</GridItem>
      <GridItem>Item 2</GridItem>
      <GridItem>Item 3</GridItem>
      <GridItem>Item 4</GridItem>
      <GridItem>Item 5</GridItem>
      <GridItem>Item 6</GridItem>
    </Grid>
  ),
}

export const FixedThreeColumns: Story = {
  render: () => (
    <Grid cols={3}>
      <GridItem>Column 1</GridItem>
      <GridItem>Column 2</GridItem>
      <GridItem>Column 3</GridItem>
      <GridItem>Column 4</GridItem>
      <GridItem>Column 5</GridItem>
      <GridItem>Column 6</GridItem>
    </Grid>
  ),
}

export const ResponsiveGrid: Story = {
  render: () => (
    <div className="space-y-base">
      <p className="text-sm text-foreground-muted">
        Resize the browser window to see the columns change: 1 (default) → 2 (md) → 4 (lg)
      </p>
      <Grid cols={{ md: 2, lg: 4 }}>
        <GridItem>Item 1</GridItem>
        <GridItem>Item 2</GridItem>
        <GridItem>Item 3</GridItem>
        <GridItem>Item 4</GridItem>
        <GridItem>Item 5</GridItem>
        <GridItem>Item 6</GridItem>
        <GridItem>Item 7</GridItem>
        <GridItem>Item 8</GridItem>
      </Grid>
    </div>
  ),
}

export const GapSizes: Story = {
  render: () => (
    <div className="space-y-lg">
      <div>
        <p className="mb-sm text-sm font-medium">gap="none"</p>
        <Grid cols={4} gap="none">
          <GridItem>1</GridItem>
          <GridItem>2</GridItem>
          <GridItem>3</GridItem>
          <GridItem>4</GridItem>
        </Grid>
      </div>
      <div>
        <p className="mb-sm text-sm font-medium">gap="sm"</p>
        <Grid cols={4} gap="sm">
          <GridItem>1</GridItem>
          <GridItem>2</GridItem>
          <GridItem>3</GridItem>
          <GridItem>4</GridItem>
        </Grid>
      </div>
      <div>
        <p className="mb-sm text-sm font-medium">gap="md"</p>
        <Grid cols={4} gap="md">
          <GridItem>1</GridItem>
          <GridItem>2</GridItem>
          <GridItem>3</GridItem>
          <GridItem>4</GridItem>
        </Grid>
      </div>
      <div>
        <p className="mb-sm text-sm font-medium">gap="base" (default)</p>
        <Grid cols={4} gap="base">
          <GridItem>1</GridItem>
          <GridItem>2</GridItem>
          <GridItem>3</GridItem>
          <GridItem>4</GridItem>
        </Grid>
      </div>
      <div>
        <p className="mb-sm text-sm font-medium">gap="lg"</p>
        <Grid cols={4} gap="lg">
          <GridItem>1</GridItem>
          <GridItem>2</GridItem>
          <GridItem>3</GridItem>
          <GridItem>4</GridItem>
        </Grid>
      </div>
    </div>
  ),
}

export const DashboardLayout: Story = {
  render: () => (
    <div className="space-y-base">
      <p className="text-sm text-foreground-muted">Dashboard stat cards with responsive grid</p>
      <Grid cols={{ sm: 2, lg: 4 }} gap="base">
        <StatCard label="Total Files" value="1,234" trend="+12%" />
        <StatCard label="Components" value="56" trend="+3" />
        <StatCard label="Dependencies" value="89" />
        <StatCard label="Issues" value="7" trend="-2" />
      </Grid>
    </div>
  ),
}

export const PhotoGallery: Story = {
  render: () => {
    const images = [
      'bg-accent-1-muted text-accent-1-foreground',
      'bg-accent-2-muted text-accent-2-foreground',
      'bg-accent-3-muted text-accent-3-foreground',
      'bg-accent-4-muted text-accent-4-foreground',
      'bg-accent-5-muted text-accent-5-foreground',
      'bg-accent-1-muted text-accent-1-foreground',
      'bg-accent-2-muted text-accent-2-foreground',
      'bg-accent-3-muted text-accent-3-foreground',
      'bg-accent-4-muted text-accent-4-foreground',
    ]
    return (
      <div className="space-y-base">
        <p className="text-sm text-foreground-muted">Photo gallery: 1 col (sm) → 2 (md) → 3 (lg)</p>
        <Grid cols={{ md: 2, lg: 3 }} gap="base">
          {images.map((color, i) => (
            <div
              key={i}
              className={`aspect-square rounded ${color} flex items-center justify-center text-sm font-medium`}
            >
              Image {i + 1}
            </div>
          ))}
        </Grid>
      </div>
    )
  },
}

export const AllColumnCounts: Story = {
  render: () => (
    <div className="space-y-lg">
      {([1, 2, 3, 4, 5, 6] as const).map((cols) => (
        <div key={cols}>
          <p className="mb-sm text-sm font-medium">cols={cols}</p>
          <Grid cols={cols} gap="sm">
            {Array.from({ length: cols * 2 }, (_, i) => (
              <GridItem key={i}>{i + 1}</GridItem>
            ))}
          </Grid>
        </div>
      ))}
    </div>
  ),
}

export const WithCards: Story = {
  render: () => (
    <Grid cols={{ md: 2, lg: 3 }} gap="base">
      <Card>
        <CardContent>
          <Heading level={3}>Card 1</Heading>
          <p className="mt-xs text-sm text-foreground-muted">First card content</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Heading level={3}>Card 2</Heading>
          <p className="mt-xs text-sm text-foreground-muted">Second card content</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Heading level={3}>Card 3</Heading>
          <p className="mt-xs text-sm text-foreground-muted">Third card content</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Heading level={3}>Card 4</Heading>
          <p className="mt-xs text-sm text-foreground-muted">Fourth card content</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Heading level={3}>Card 5</Heading>
          <p className="mt-xs text-sm text-foreground-muted">Fifth card content</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Heading level={3}>Card 6</Heading>
          <p className="mt-xs text-sm text-foreground-muted">Sixth card content</p>
        </CardContent>
      </Card>
    </Grid>
  ),
}

export const WithRows: Story = {
  render: () => (
    <div className="space-y-base">
      <p className="text-sm text-foreground-muted">Fixed 3 rows with 4 columns</p>
      <Grid cols={4} rows={3} gap="base" className="h-64">
        {Array.from({ length: 12 }, (_, i) => (
          <GridItem key={i}>{i + 1}</GridItem>
        ))}
      </Grid>
    </div>
  ),
}
