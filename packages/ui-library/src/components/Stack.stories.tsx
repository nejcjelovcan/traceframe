import { Badge } from './Badge'
import { Button } from './Button'
import { Card, CardContent } from './Card'
import { Input } from './Input'
import { Stack } from './Stack'
import { StatCard } from './StatCard'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Stack> = {
  title: 'Components/Stack',
  component: Stack,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A flexbox layout component for arranging items in a row or column with consistent spacing.

**Tier:** 1 (Tailwind + CVA)

**Usage:** Use for linear layouts like form fields, button groups, navigation items, or any content that flows in a single direction. Prefer Stack over manual flex utilities for consistency.

**Common Patterns:**
\`\`\`tsx
// Form layout
<Stack gap="sm">
  <Input />
  <Button>Submit</Button>
</Stack>

// Horizontal button group
<Stack direction="horizontal" gap="xs">
  <Button>Cancel</Button>
  <Button>Save</Button>
</Stack>

// Tag cloud with wrapping
<Stack direction="horizontal" gap="xs" wrap>
  <Badge>Tag 1</Badge>
  <Badge>Tag 2</Badge>
</Stack>
\`\`\`

**Accessibility:**
- Uses semantic \`<div>\` element with flexbox
- Maintains natural DOM order for screen readers
- Gap spacing does not affect content accessibility
        `.trim(),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    direction: {
      description: 'Stack direction: vertical (column) or horizontal (row)',
      control: 'select',
      options: ['vertical', 'horizontal'],
      table: {
        defaultValue: { summary: 'vertical' },
      },
    },
    gap: {
      description: 'Gap size between items (semantic spacing scale)',
      control: 'select',
      options: ['none', '2xs', 'xs', 'sm', 'md', 'base', 'lg', 'xl', '2xl'],
      table: {
        defaultValue: { summary: 'sm' },
      },
    },
    align: {
      description: 'Cross-axis alignment (align-items)',
      control: 'select',
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
      table: {
        defaultValue: { summary: 'stretch' },
      },
    },
    justify: {
      description: 'Main-axis alignment (justify-content)',
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
      table: {
        defaultValue: { summary: 'start' },
      },
    },
    wrap: {
      description: 'Allow items to wrap to new lines',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    children: {
      description: 'Items to arrange in the stack',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    direction: 'vertical',
    gap: 'sm',
    align: 'stretch',
    justify: 'start',
    wrap: false,
  },
  render: (args) => (
    <Stack {...args} className="w-64">
      <Button>Item 1</Button>
      <Button>Item 2</Button>
      <Button>Item 3</Button>
    </Stack>
  ),
}

export const Vertical: Story = {
  render: () => (
    <Stack direction="vertical" gap="sm" className="w-64">
      <Input placeholder="you@example.com" />
      <Input type="password" placeholder="Enter password" />
      <Button variant="primary" className="self-end">
        Sign In
      </Button>
    </Stack>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <Stack direction="horizontal" gap="sm" align="center">
      <Button>Left</Button>
      <Button>Center</Button>
      <Button>Right</Button>
    </Stack>
  ),
}

export const HorizontalWithWrap: Story = {
  render: () => (
    <Stack direction="horizontal" gap="xs" wrap className="max-w-xs">
      <Button size="sm">React</Button>
      <Button size="sm">TypeScript</Button>
      <Button size="sm">Tailwind</Button>
      <Button size="sm">Storybook</Button>
      <Button size="sm">Vitest</Button>
      <Button size="sm">Effect</Button>
      <Button size="sm">Node.js</Button>
      <Button size="sm">pnpm</Button>
    </Stack>
  ),
}

export const GapSizes: Story = {
  render: () => (
    <Stack direction="horizontal" gap="lg" align="start">
      {(['none', '2xs', 'xs', 'sm', 'md', 'base', 'lg', 'xl', '2xl'] as const).map((gap) => (
        <Stack key={gap} gap="xs" align="center">
          <Badge variant="secondary">{gap}</Badge>
          <Stack gap={gap} className="rounded border border-border p-sm">
            <Button size="sm">A</Button>
            <Button size="sm">B</Button>
            <Button size="sm">C</Button>
          </Stack>
        </Stack>
      ))}
    </Stack>
  ),
}

export const AlignmentVariations: Story = {
  render: () => (
    <Stack direction="horizontal" gap="sm">
      {(['start', 'center', 'end', 'stretch'] as const).map((align) => (
        <Stack key={align} gap="xs" align="center">
          <Badge>{align}</Badge>
          <Stack align={align} gap="xs" className="w-36 rounded border border-border p-sm">
            <Button size="sm">Short</Button>
            <Button size="sm">Medium text</Button>
            <Button size="sm">Lg</Button>
          </Stack>
        </Stack>
      ))}
    </Stack>
  ),
}

export const JustifyVariations: Story = {
  render: () => (
    <Stack gap="sm">
      {(['start', 'center', 'end', 'between', 'around', 'evenly'] as const).map((justify) => (
        <Stack key={justify} gap="xs">
          <Badge className="self-start">{justify}</Badge>
          <Stack
            direction="horizontal"
            justify={justify}
            className="rounded border border-border p-sm"
          >
            <Button size="sm">A</Button>
            <Button size="sm">B</Button>
            <Button size="sm">C</Button>
          </Stack>
        </Stack>
      ))}
    </Stack>
  ),
}

export const FormLayout: Story = {
  render: () => (
    <Card className="w-80">
      <CardContent>
        <Stack gap="sm">
          <Input placeholder="John Doe" />
          <Input type="email" placeholder="john@example.com" />
          <Stack direction="horizontal" justify="end" gap="xs">
            <Button variant="outline">Cancel</Button>
            <Button variant="primary">Submit</Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  ),
}

export const NestedStacks: Story = {
  render: () => (
    <Stack gap="md" className="w-96">
      <Stack direction="horizontal" justify="between" align="center">
        <Input placeholder="Search..." leftIcon="search" size="sm" className="w-48" />
        <Stack direction="horizontal" gap="xs">
          <Button variant="outline" size="sm" leftIcon="package">
            Export
          </Button>
          <Button variant="primary" size="sm">
            New
          </Button>
        </Stack>
      </Stack>
      <Stack direction="horizontal" gap="sm">
        <StatCard label="Total Users" value="1,234" trend="+12%" icon="users" className="flex-1" />
        <StatCard label="Active" value="892" trend="-3%" icon="chart" className="flex-1" />
      </Stack>
    </Stack>
  ),
}
