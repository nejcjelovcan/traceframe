import { Badge } from './Badge'
import { Button } from './Button'
import { Card, CardContent } from './Card'
import { Flex } from './Flex'
import { Input } from './Input'
import { StatCard } from './StatCard'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta<typeof Flex> = {
  title: 'Components/Flex',
  component: Flex,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A flexbox layout component for arranging items in a row or column with consistent spacing.

**Tier:** 1 (Tailwind + CVA)

**Usage:** Use for linear layouts like form fields, button groups, navigation items, or any content that flows in a single direction. Prefer Flex over manual flex utilities for consistency.

**Common Patterns:**
\`\`\`tsx
// Form layout
<Flex gap="sm">
  <Input />
  <Button>Submit</Button>
</Flex>

// Horizontal button group
<Flex direction="row" gap="xs">
  <Button>Cancel</Button>
  <Button>Save</Button>
</Flex>

// Tag cloud with wrapping
<Flex direction="row" gap="xs" wrap>
  <Badge>Tag 1</Badge>
  <Badge>Tag 2</Badge>
</Flex>
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
      description: 'Flex direction: col (column) or row',
      control: 'select',
      options: ['col', 'row'],
      table: {
        defaultValue: { summary: 'col' },
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
      description: 'Items to arrange in the flex container',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    direction: 'col',
    gap: 'sm',
    align: 'stretch',
    justify: 'start',
    wrap: false,
  },
  render: (args) => (
    <Flex {...args} className="w-64">
      <Button>Item 1</Button>
      <Button>Item 2</Button>
      <Button>Item 3</Button>
    </Flex>
  ),
}

export const Column: Story = {
  render: () => (
    <Flex direction="col" gap="sm" className="w-64">
      <Input placeholder="you@example.com" />
      <Input type="password" placeholder="Enter password" />
      <Button variant="primary" className="self-end">
        Sign In
      </Button>
    </Flex>
  ),
}

export const Row: Story = {
  render: () => (
    <Flex direction="row" gap="sm" align="center">
      <Button>Left</Button>
      <Button>Center</Button>
      <Button>Right</Button>
    </Flex>
  ),
}

export const RowWithWrap: Story = {
  render: () => (
    <Flex direction="row" gap="xs" wrap className="max-w-xs">
      <Button size="sm">React</Button>
      <Button size="sm">TypeScript</Button>
      <Button size="sm">Tailwind</Button>
      <Button size="sm">Storybook</Button>
      <Button size="sm">Vitest</Button>
      <Button size="sm">Effect</Button>
      <Button size="sm">Node.js</Button>
      <Button size="sm">pnpm</Button>
    </Flex>
  ),
}

export const GapSizes: Story = {
  render: () => (
    <Flex direction="row" gap="lg" align="start">
      {(['none', '2xs', 'xs', 'sm', 'md', 'base', 'lg', 'xl', '2xl'] as const).map((gap) => (
        <Flex key={gap} gap="xs" align="center">
          <Badge variant="secondary">{gap}</Badge>
          <Flex gap={gap} className="rounded-sm border border-border p-sm">
            <Button size="sm">A</Button>
            <Button size="sm">B</Button>
            <Button size="sm">C</Button>
          </Flex>
        </Flex>
      ))}
    </Flex>
  ),
}

export const AlignmentVariations: Story = {
  render: () => (
    <Flex direction="row" gap="sm">
      {(['start', 'center', 'end', 'stretch'] as const).map((align) => (
        <Flex key={align} gap="xs" align="center">
          <Badge>{align}</Badge>
          <Flex align={align} gap="xs" className="w-36 rounded-sm border border-border p-sm">
            <Button size="sm">Short</Button>
            <Button size="sm">Medium text</Button>
            <Button size="sm">Lg</Button>
          </Flex>
        </Flex>
      ))}
    </Flex>
  ),
}

export const JustifyVariations: Story = {
  render: () => (
    <Flex gap="sm">
      {(['start', 'center', 'end', 'between', 'around', 'evenly'] as const).map((justify) => (
        <Flex key={justify} gap="xs">
          <Badge className="self-start">{justify}</Badge>
          <Flex direction="row" justify={justify} className="rounded-sm border border-border p-sm">
            <Button size="sm">A</Button>
            <Button size="sm">B</Button>
            <Button size="sm">C</Button>
          </Flex>
        </Flex>
      ))}
    </Flex>
  ),
}

export const FormLayout: Story = {
  render: () => (
    <Card className="w-80">
      <CardContent>
        <Flex gap="sm">
          <Input placeholder="John Doe" />
          <Input type="email" placeholder="john@example.com" />
          <Flex direction="row" justify="end" gap="xs">
            <Button variant="outline">Cancel</Button>
            <Button variant="primary">Submit</Button>
          </Flex>
        </Flex>
      </CardContent>
    </Card>
  ),
}

export const NestedFlexContainers: Story = {
  render: () => (
    <Flex gap="md" className="w-96">
      <Flex direction="row" justify="between" align="center">
        <Input placeholder="Search..." leftIcon="search" size="sm" className="w-48" />
        <Flex direction="row" gap="xs">
          <Button variant="outline" size="sm" leftIcon="package">
            Export
          </Button>
          <Button variant="primary" size="sm">
            New
          </Button>
        </Flex>
      </Flex>
      <Flex direction="row" gap="sm">
        <StatCard label="Total Users" value="1,234" trend="+12%" icon="users" className="flex-1" />
        <StatCard label="Active" value="892" trend="-3%" icon="chart" className="flex-1" />
      </Flex>
    </Flex>
  ),
}
