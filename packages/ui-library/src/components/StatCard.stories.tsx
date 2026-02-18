import { Grid } from './Grid.js'
import { Heading } from './Heading.js'
import { Flex } from './Flex.js'
import { StatCard } from './StatCard.js'
import { Icon } from '../icons/index.js'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta<typeof StatCard> = {
  title: 'Components/StatCard',
  component: StatCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A specialized card for displaying key metrics and statistics with optional trend indicators.

**Tier:** 1 (Tailwind + CVA) - Composed from Card component

**Usage:** Use in dashboards and summary views to highlight important metrics. Typically arranged in a grid layout. Supports trend indicators that automatically colorize based on positive/negative values.

**Features:**
- All Card variants (11 total: outlined, elevated, 4 status, 3 accent, 2 data)
- Trend indicators with visual arrows and manual control
- Icon positioning (left/right) with type-safe IconName or custom icons
- Loading state with skeleton animation
- Compact mode for dense layouts
- Subtitle and description support
- Size variants for different contexts
- Semantic color tokens for theming

**Trend Colors:**
- Positive (starts with \`+\`): Green (success) with upward arrow
- Negative (starts with \`-\`): Red (error) with downward arrow
- Neutral (other): Gray (muted) without arrow

**Accessibility:**
- Trend indicators include \`aria-label\` describing the change
- Trend arrow icons are marked as decorative with \`aria-hidden\`
- Icon is decorative when present
- Values should be formatted for screen readers (e.g., "1.2K" should be "1,200")
        `.trim(),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      description: 'Descriptive label for the statistic',
      control: 'text',
    },
    value: {
      description: 'The main statistic value (number or formatted string)',
      control: 'text',
    },
    trend: {
      description: 'Optional trend indicator (e.g., "+12%", "-5", "stable")',
      control: 'text',
    },
    icon: {
      description: 'Type-safe icon name from ui-library',
      control: 'select',
      options: ['package', 'users', 'chart', 'database', 'component', 'file-code'],
    },
    customIcon: {
      description: "Custom icon element when IconName doesn't suffice",
    },
    iconPosition: {
      description: 'Icon position relative to value',
      control: 'select',
      options: ['left', 'right'],
      table: {
        defaultValue: { summary: 'left' },
      },
    },
    variant: {
      description: 'Card variant (inherited from Card component)',
      control: 'select',
      options: [
        'outlined',
        'elevated',
        'info',
        'success',
        'warning',
        'error',
        'accent1',
        'accent2',
        'accent3',
        'data1',
        'data2',
      ],
      table: {
        defaultValue: { summary: 'outlined' },
      },
    },
    subtitle: {
      description: 'Optional secondary label below main label',
      control: 'text',
    },
    description: {
      description: 'Optional longer description below value',
      control: 'text',
    },
    compact: {
      description: 'Reduced padding for dense layouts',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    trendVariant: {
      description: 'Manual control for trend color/icon',
      control: 'select',
      options: ['auto', 'positive', 'negative', 'neutral'],
      table: {
        defaultValue: { summary: 'auto' },
      },
    },
    size: {
      description: 'Size preset affecting typography',
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    loading: {
      description: 'Show loading skeleton animation',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    showTrendIcon: {
      description: 'Show arrow icons for trends',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Total Components',
    value: 42,
  },
}

export const WithPositiveTrend: Story = {
  args: {
    label: 'Active Users',
    value: 1234,
    trend: '+12%',
  },
}

export const WithNegativeTrend: Story = {
  args: {
    label: 'Error Count',
    value: 5,
    trend: '-3',
  },
}

export const WithNeutralTrend: Story = {
  args: {
    label: 'System Status',
    value: 'Healthy',
    trend: 'stable',
  },
}

export const WithIcon: Story = {
  args: {
    label: 'Total Usages',
    value: 156,
    trend: '+24',
    icon: 'chart',
  },
}

export const WithCustomIcon: Story = {
  args: {
    label: 'Custom Icon',
    value: 42,
    customIcon: <Icon name="database" size="lg" className="text-interactive-secondary" />,
  },
}

export const IconPositionRight: Story = {
  args: {
    label: 'Components',
    value: 42,
    icon: 'package',
    iconPosition: 'right',
  },
}

export const WithSubtitle: Story = {
  args: {
    label: 'Active Users',
    subtitle: 'Last 30 days',
    value: 1234,
    trend: '+12%',
  },
}

export const WithDescription: Story = {
  args: {
    label: 'API Latency',
    value: '45ms',
    description: 'Average response time across all endpoints',
    trend: '-5ms',
  },
}

export const CompactMode: Story = {
  args: {
    label: 'Compact',
    value: 99,
    compact: true,
  },
}

export const ManualTrendControl: Story = {
  render: () => (
    <Flex direction="row" gap="base">
      <StatCard
        label="Positive"
        value="100"
        trend="5 points"
        trendVariant="positive"
        className="w-40"
      />
      <StatCard
        label="Negative"
        value="50"
        trend="10 units"
        trendVariant="negative"
        className="w-40"
      />
      <StatCard
        label="Neutral"
        value="75"
        trend="no change"
        trendVariant="neutral"
        className="w-40"
      />
    </Flex>
  ),
}

export const DashboardGrid: Story = {
  render: () => (
    <Grid cols={{ md: 4 }} gap="base">
      <StatCard
        variant="outlined"
        label="Total Components"
        value={42}
        customIcon={<Icon name="package" size="md" />}
        className="w-48"
      />
      <StatCard
        variant="elevated"
        label="Active Users"
        value={1234}
        trend="+12%"
        customIcon={<Icon name="users" size="md" />}
        className="w-48"
      />
      <StatCard
        variant="outlined"
        label="Usages This Week"
        value={567}
        trend="+89"
        className="w-48"
      />
      <StatCard
        variant="outlined"
        label="Error Rate"
        value="0.1%"
        trend="-0.05%"
        className="w-48"
      />
    </Grid>
  ),
}

export const LongValues: Story = {
  render: () => (
    <Flex direction="row" gap="base">
      <StatCard label="Short" value={42} className="w-48" />
      <StatCard label="Medium" value={1234} className="w-48" />
      <StatCard label="Long" value={1234567} className="w-48" />
      <StatCard label="Formatted" value="$1,234,567.89" className="w-48" />
    </Flex>
  ),
}

export const SizeSmall: Story = {
  args: {
    label: 'Components',
    value: 12,
    size: 'sm',
  },
}

export const SizeMedium: Story = {
  args: {
    label: 'Components',
    value: 12,
    size: 'md',
  },
}

export const SizeLarge: Story = {
  args: {
    label: 'Components',
    value: 12,
    size: 'lg',
  },
}

export const AllSizes: Story = {
  render: () => (
    <Flex direction="row" align="end" gap="base">
      <StatCard size="sm" label="Small" value={42} trend="+5" className="w-40" />
      <StatCard size="md" label="Medium (default)" value={42} trend="+5" className="w-48" />
      <StatCard size="lg" label="Large" value={42} trend="+5" className="w-56" />
    </Flex>
  ),
}

export const SizesWithIcons: Story = {
  render: () => (
    <Flex direction="row" align="end" gap="base">
      <StatCard
        size="sm"
        label="Components"
        value={12}
        customIcon={<Icon name="package" size="sm" />}
        className="w-40"
      />
      <StatCard
        size="md"
        label="Components"
        value={12}
        customIcon={<Icon name="package" size="md" />}
        className="w-48"
      />
      <StatCard
        size="lg"
        label="Components"
        value={12}
        customIcon={<Icon name="package" size="lg" />}
        className="w-56"
      />
    </Flex>
  ),
}

export const SizesWithVariants: Story = {
  render: () => (
    <Flex gap="md">
      <Flex direction="row" align="end" gap="base">
        <StatCard size="sm" variant="outlined" label="Outlined SM" value={42} className="w-40" />
        <StatCard size="md" variant="outlined" label="Outlined MD" value={42} className="w-48" />
        <StatCard size="lg" variant="outlined" label="Outlined LG" value={42} className="w-56" />
      </Flex>
      <Flex direction="row" align="end" gap="base">
        <StatCard size="sm" variant="elevated" label="Elevated SM" value={42} className="w-40" />
        <StatCard size="md" variant="elevated" label="Elevated MD" value={42} className="w-48" />
        <StatCard size="lg" variant="elevated" label="Elevated LG" value={42} className="w-56" />
      </Flex>
      <Flex direction="row" align="end" gap="base">
        <StatCard size="sm" variant="info" label="Info SM" value={42} className="w-40" />
        <StatCard size="md" variant="info" label="Info MD" value={42} className="w-48" />
        <StatCard size="lg" variant="info" label="Info LG" value={42} className="w-56" />
      </Flex>
    </Flex>
  ),
}

export const LoadingState: Story = {
  args: {
    label: 'Loading...',
    value: 0,
    loading: true,
  },
}

export const LoadingStates: Story = {
  render: () => (
    <Flex direction="row" gap="base">
      <StatCard variant="outlined" label="Loading" value={0} loading className="w-48" />
      <StatCard variant="elevated" label="Loading" value={0} loading size="sm" className="w-48" />
      <StatCard variant="info" label="Loading" value={0} loading size="lg" className="w-48" />
    </Flex>
  ),
}

export const TrendWithIcons: Story = {
  render: () => (
    <Flex direction="row" gap="base">
      <StatCard label="Revenue" value="$12,450" trend="+15%" className="w-48" />
      <StatCard label="Expenses" value="$8,200" trend="-8%" className="w-48" />
      <StatCard label="Status" value="Stable" trend="unchanged" className="w-48" />
    </Flex>
  ),
}

export const TrendWithoutIcons: Story = {
  render: () => (
    <Flex direction="row" gap="base">
      <StatCard
        label="Revenue"
        value="$12,450"
        trend="+15%"
        showTrendIcon={false}
        className="w-48"
      />
      <StatCard
        label="Expenses"
        value="$8,200"
        trend="-8%"
        showTrendIcon={false}
        className="w-48"
      />
      <StatCard
        label="Status"
        value="Stable"
        trend="unchanged"
        showTrendIcon={false}
        className="w-48"
      />
    </Flex>
  ),
}

export const MixedStates: Story = {
  render: () => (
    <Grid cols={{ md: 4 }} gap="base">
      <StatCard
        variant="outlined"
        label="Active Users"
        value={1234}
        trend="+12%"
        icon="users"
        className="w-48"
      />
      <StatCard variant="elevated" label="Loading..." value={0} loading className="w-48" />
      <StatCard variant="info" label="Success Rate" value="98.5%" trend="+0.5%" className="w-48" />
      <StatCard
        variant="error"
        label="Errors"
        value={3}
        trend="-2"
        icon="alert-circle"
        className="w-48"
      />
    </Grid>
  ),
}

function ShowcaseContent() {
  return (
    <Flex gap="lg" className="bg-surface p-lg">
      {/* Title */}
      <div className="flex items-center gap-base">
        <Heading level={2} size="lg">
          StatCard Showcase
        </Heading>
      </div>

      {/* All Card Variants */}
      <section>
        <Heading level={3} className="mb-base">
          All Card Variants
        </Heading>
        <Grid cols={{ sm: 3, md: 4, lg: 6 }} gap="base">
          <StatCard variant="outlined" label="Outlined" value={42} trend="+5%" className="w-full" />
          <StatCard
            variant="elevated"
            label="Elevated"
            value={128}
            trend="-2%"
            className="w-full"
          />
          <StatCard variant="info" label="Info" value={256} icon="info-circle" className="w-full" />
          <StatCard variant="success" label="Success" value="98%" trend="+3%" className="w-full" />
          <StatCard
            variant="warning"
            label="Warning"
            value={15}
            trend="stable"
            className="w-full"
          />
          <StatCard variant="error" label="Error" value={3} trend="-1" className="w-full" />
          <StatCard variant="accent1" label="Accent 1" value="A1" className="w-full" />
          <StatCard variant="accent2" label="Accent 2" value="A2" className="w-full" />
          <StatCard variant="accent3" label="Accent 3" value="A3" className="w-full" />
          <StatCard variant="accent4" label="Accent 4" value={512} className="w-full" />
          <StatCard variant="accent5" label="Accent 5" value={1024} className="w-full" />
        </Grid>
      </section>

      {/* Size Variants */}
      <section>
        <Heading level={3} className="mb-base">
          Size Variants
        </Heading>
        <Flex direction="row" align="end" gap="base">
          <StatCard
            size="sm"
            label="Small"
            value={42}
            trend="+5%"
            icon="package"
            className="w-40"
          />
          <StatCard
            size="md"
            label="Medium"
            value={128}
            trend="-2%"
            icon="users"
            className="w-48"
          />
          <StatCard
            size="lg"
            label="Large"
            value={256}
            trend="+10%"
            icon="chart"
            className="w-56"
          />
        </Flex>
      </section>

      {/* Icon Positioning */}
      <section>
        <Heading level={3} className="mb-base">
          Icon Positioning
        </Heading>
        <Flex direction="row" gap="base">
          <StatCard
            label="Left Icon"
            value={100}
            icon="database"
            iconPosition="left"
            className="w-48"
          />
          <StatCard
            label="Right Icon"
            value={200}
            icon="component"
            iconPosition="right"
            className="w-48"
          />
          <StatCard label="No Icon" value={300} className="w-48" />
        </Flex>
      </section>

      {/* Trend Variations */}
      <section>
        <Heading level={3} className="mb-base">
          Trend Indicators
        </Heading>
        <Flex direction="row" gap="base">
          <StatCard label="Auto Positive" value={100} trend="+25%" className="w-40" />
          <StatCard label="Auto Negative" value={50} trend="-10%" className="w-40" />
          <StatCard
            label="Manual Positive"
            value={75}
            trend="5 units"
            trendVariant="positive"
            className="w-40"
          />
          <StatCard
            label="Manual Negative"
            value={25}
            trend="3 units"
            trendVariant="negative"
            className="w-40"
          />
          <StatCard
            label="Neutral"
            value={60}
            trend="stable"
            trendVariant="neutral"
            className="w-40"
          />
        </Flex>
      </section>

      {/* Compact Mode */}
      <section>
        <Heading level={3} className="mb-base">
          Compact vs Normal
        </Heading>
        <Flex direction="row" gap="base">
          <StatCard
            compact
            label="Compact"
            subtitle="Hidden in compact"
            value={42}
            description="Also hidden"
            className="w-40"
          />
          <StatCard
            compact={false}
            label="Normal"
            subtitle="Visible subtitle"
            value={84}
            description="Visible description text"
            className="w-48"
          />
        </Flex>
      </section>

      {/* Loading States */}
      <section>
        <Heading level={3} className="mb-base">
          Loading States
        </Heading>
        <Flex direction="row" gap="base">
          <StatCard loading variant="outlined" label="" value={0} size="sm" className="w-40" />
          <StatCard loading variant="elevated" label="" value={0} size="md" className="w-48" />
          <StatCard loading variant="info" label="" value={0} size="lg" className="w-56" />
        </Flex>
      </section>

      {/* Rich Content Examples */}
      <section>
        <Heading level={3} className="mb-base">
          Rich Content
        </Heading>
        <Grid cols={{ md: 3 }} gap="base">
          <StatCard
            variant="outlined"
            label="API Performance"
            subtitle="Last 24 hours"
            value="45ms"
            description="Average response time across all endpoints"
            trend="-5ms"
            icon="code"
            className="w-full"
          />
          <StatCard
            variant="success"
            label="Uptime"
            subtitle="Current month"
            value="99.98%"
            description="2 minutes of downtime"
            trend="+0.02%"
            icon="resolved"
            className="w-full"
          />
          <StatCard
            variant="warning"
            label="Memory Usage"
            subtitle="Server cluster"
            value="78%"
            description="Consider scaling if it reaches 85%"
            trend="+12%"
            icon="database"
            className="w-full"
          />
        </Grid>
      </section>

      {/* Dashboard Grid Example */}
      <section>
        <Heading level={3} className="mb-base">
          Dashboard Grid Layout
        </Heading>
        <Grid cols={{ md: 4, lg: 6 }} gap="base">
          <StatCard label="Users" value={1234} trend="+12%" icon="users" />
          <StatCard label="Revenue" value="$45.2K" trend="+8%" icon="chart" />
          <StatCard label="Orders" value={89} trend="-3" icon="package" />
          <StatCard label="Products" value={456} icon="database" />
          <StatCard label="Reviews" value={4.8} trend="+0.2" />
          <StatCard label="Support" value={12} trend="-5" />
        </Grid>
      </section>
    </Flex>
  )
}

export const Showcase: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => <ShowcaseContent />,
}
