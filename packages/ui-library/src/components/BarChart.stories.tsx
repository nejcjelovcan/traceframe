import { BarChart, type BarChartDataItem } from './BarChart'
import { Flex } from './Flex'
import { Heading } from './Heading'

import type { Meta, StoryObj } from '@storybook/react-vite'

const sampleData: BarChartDataItem[] = [
  { label: 'Button', value: 45 },
  { label: 'Card', value: 30 },
  { label: 'Badge', value: 25 },
  { label: 'Input', value: 18 },
  { label: 'Modal', value: 12 },
]

const meta: Meta<typeof BarChart> = {
  title: 'Components/BarChart',
  component: BarChart,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A data visualization component for displaying bar charts with tooltips.

**Tier:** 1 (Tailwind + CVA)

**Usage:** Use for visualizing comparative data, rankings, or distributions. Supports horizontal and vertical orientations with default or semantic coloring.

**Color Schemes:**
- \`default\`: Uses 5 distinct accent + data colors (accent-1, accent-2, accent-3, data-1, data-2)
- \`semantic\`: Colors based on value thresholds (success/warning/error)
  - Above warning threshold: Green (success)
  - Between warning and error: Yellow (warning)
  - At or below error: Red (error)
  - Note: Lower values = worse (like coverage percentage)

**Semantic Thresholds Example:**
\`\`\`tsx
<BarChart
  data={coverageData}
  colorScheme="semantic"
  thresholds={{ warning: 50, error: 30 }}
/>
\`\`\`

**Accessibility:**
- \`role="figure"\` on chart container
- Each bar has \`aria-label\` with label and value
- Includes hidden \`<table>\` for screen reader data access
- Keyboard navigation to individual bars
- Tooltips appear on focus (not just hover)
        `.trim(),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      description: 'Array of data items with label and value',
    },
    orientation: {
      description: 'Chart orientation (horizontal bars vs vertical bars)',
      control: 'select',
      options: ['horizontal', 'vertical'],
      table: {
        defaultValue: { summary: 'horizontal' },
      },
    },
    colorScheme: {
      description: 'Color scheme for bars',
      control: 'select',
      options: ['default', 'semantic'],
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    thresholds: {
      description: 'Thresholds for semantic coloring (required if colorScheme="semantic")',
    },
    showValues: {
      description: 'Display values inline on bars',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    maxBars: {
      description: 'Limit number of bars displayed',
      control: 'number',
    },
    formatValue: {
      description: 'Custom formatter for tooltip values (e.g., add % suffix)',
    },
    onBarClick: {
      description: 'Click handler for bar interaction',
    },
    ariaLabel: {
      description: 'Accessible label for the chart',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    data: sampleData,
    ariaLabel: 'Component usage statistics',
  },
}

export const Horizontal: Story = {
  args: {
    data: sampleData,
    orientation: 'horizontal',
    ariaLabel: 'Component usage - horizontal',
  },
}

export const Vertical: Story = {
  args: {
    data: sampleData,
    orientation: 'vertical',
    ariaLabel: 'Component usage - vertical',
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
}

export const DefaultColors: Story = {
  args: {
    data: sampleData,
    colorScheme: 'default',
    ariaLabel: 'Default color scheme',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Each bar cycles through 5 distinct accent + data colors (accent-1, accent-2, accent-3, data-1, data-2).',
      },
    },
  },
}

export const SemanticColors: Story = {
  args: {
    data: [
      { label: 'Button', value: 95 },
      { label: 'Card', value: 75 },
      { label: 'Badge', value: 50 },
      { label: 'Input', value: 30 },
      { label: 'Modal', value: 15 },
    ],
    colorScheme: 'semantic',
    thresholds: { warning: 50, error: 30 },
    ariaLabel: 'Code coverage by component',
    formatValue: (value: number) => `${value}%`,
    showValues: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Colors indicate status: green for values above warning threshold, yellow for values between warning and error, red for values at or below error threshold. Low values = bad.',
      },
    },
  },
}

export const WithFormatValue: Story = {
  args: {
    data: [
      { label: 'TypeScript', value: 85 },
      { label: 'JavaScript', value: 60 },
      { label: 'CSS', value: 42 },
      { label: 'HTML', value: 28 },
    ],
    formatValue: (value: number) => `${value}%`,
    ariaLabel: 'Language coverage percentages',
  },
  parameters: {
    docs: {
      description: {
        story: 'Custom value formatting for tooltips (e.g., adding percentage signs).',
      },
    },
  },
}

export const WithShowValues: Story = {
  args: {
    data: sampleData,
    showValues: true,
    ariaLabel: 'Components with inline values',
  },
  parameters: {
    docs: {
      description: {
        story: 'Values displayed inline on bars in addition to tooltips.',
      },
    },
  },
}

export const WithClickHandler: Story = {
  args: {
    data: sampleData,
    onBarClick: (item: BarChartDataItem) => alert(`Clicked: ${item.label} (${item.value})`),
    ariaLabel: 'Clickable bar chart',
  },
  parameters: {
    docs: {
      description: {
        story: 'Bars are clickable. Click a bar to see an alert with the item details.',
      },
    },
  },
}

export const LimitedBars: Story = {
  args: {
    data: [
      { label: 'Button', value: 100 },
      { label: 'Card', value: 85 },
      { label: 'Badge', value: 72 },
      { label: 'Input', value: 65 },
      { label: 'Modal', value: 55 },
      { label: 'Table', value: 48 },
      { label: 'Form', value: 40 },
      { label: 'Link', value: 35 },
      { label: 'Icon', value: 28 },
      { label: 'Menu', value: 20 },
    ],
    maxBars: 5,
    ariaLabel: 'Top 5 components',
  },
  parameters: {
    docs: {
      description: {
        story: 'Display only the first N bars using the maxBars prop.',
      },
    },
  },
}

export const ManyItems: Story = {
  args: {
    data: [
      { label: 'Button', value: 100 },
      { label: 'Card', value: 85 },
      { label: 'Badge', value: 72 },
      { label: 'Input', value: 65 },
      { label: 'Modal', value: 55 },
      { label: 'Table', value: 48 },
      { label: 'Form', value: 40 },
      { label: 'Link', value: 35 },
      { label: 'Icon', value: 28 },
      { label: 'Menu', value: 20 },
    ],
    ariaLabel: 'All 10 components',
  },
  parameters: {
    docs: {
      description: {
        story: 'Chart with many items (10+) to demonstrate color cycling.',
      },
    },
  },
}

export const EmptyData: Story = {
  args: {
    data: [],
    ariaLabel: 'Empty chart',
  },
  parameters: {
    docs: {
      description: {
        story: 'Graceful handling of empty data array.',
      },
    },
  },
}

export const AllVariants: Story = {
  render: () => (
    <Flex gap="lg">
      <div>
        <Heading level={3} className="mb-base">
          Horizontal + Default Colors
        </Heading>
        <BarChart
          data={sampleData}
          orientation="horizontal"
          colorScheme="default"
          ariaLabel="Horizontal default"
        />
      </div>

      <div>
        <Heading level={3} className="mb-base">
          Horizontal + Semantic
        </Heading>
        <BarChart
          data={[
            { label: 'High', value: 90 },
            { label: 'Medium', value: 50 },
            { label: 'Low', value: 20 },
          ]}
          orientation="horizontal"
          colorScheme="semantic"
          thresholds={{ warning: 60, error: 30 }}
          formatValue={(v) => `${v}%`}
          showValues
          ariaLabel="Horizontal semantic"
        />
      </div>

      <div className="w-96">
        <Heading level={3} className="mb-base">
          Vertical + Default Colors
        </Heading>
        <BarChart
          data={sampleData.slice(0, 4)}
          orientation="vertical"
          colorScheme="default"
          ariaLabel="Vertical default"
        />
      </div>

      <div className="w-96">
        <Heading level={3} className="mb-base">
          Vertical + Semantic
        </Heading>
        <BarChart
          data={[
            { label: 'A', value: 85 },
            { label: 'B', value: 45 },
            { label: 'C', value: 20 },
          ]}
          orientation="vertical"
          colorScheme="semantic"
          thresholds={{ warning: 50, error: 30 }}
          ariaLabel="Vertical semantic"
        />
      </div>
    </Flex>
  ),
}

export const KeyboardNavigation: Story = {
  args: {
    data: sampleData.slice(0, 3),
    onBarClick: (item: BarChartDataItem) => alert(`Selected: ${item.label}`),
    ariaLabel: 'Keyboard accessible chart',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Tab through bars to focus them. Tooltips appear on focus. Press Enter to activate click handler.',
      },
    },
  },
  decorators: [
    (Story) => (
      <Flex gap="md">
        <p className="text-sm text-foreground-muted">
          Use Tab to navigate between bars. Tooltips appear on focus. Press Enter to click.
        </p>
        <Story />
      </Flex>
    ),
  ],
}

export const VerticalWithShowValues: Story = {
  args: {
    data: sampleData.slice(0, 4),
    orientation: 'vertical',
    showValues: true,
    ariaLabel: 'Vertical with values',
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
}
