import { Flex } from './Flex'
import { Spinner } from './Spinner'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A loading indicator that shows an animated spinning circle.

**Tier:** 1 (Tailwind + CVA)

**Usage:** Use to indicate loading states, async operations, or pending content. Typically used inside buttons during form submission, loading overlays, or as placeholder content.

**Accessibility:**
- Has \`role="status"\` to announce loading state to screen readers
- Includes visually hidden text for screen readers (customizable via \`label\` prop)
- Animation respects \`prefers-reduced-motion\` preference
        `.trim(),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      description: 'Size preset affecting spinner dimensions',
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    label: {
      description: 'Accessible label for screen readers',
      control: 'text',
      table: {
        defaultValue: { summary: 'Loading' },
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const Small: Story = {
  args: {
    size: 'sm',
  },
}

export const Medium: Story = {
  args: {
    size: 'md',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
  },
}

export const AllSizes: Story = {
  render: () => (
    <Flex gap="lg" align="center">
      <Flex align="center" gap="sm">
        <Spinner size="sm" />
        <span className="text-sm text-foreground-muted">Small</span>
      </Flex>
      <Flex align="center" gap="sm">
        <Spinner size="md" />
        <span className="text-sm text-foreground-muted">Medium</span>
      </Flex>
      <Flex align="center" gap="sm">
        <Spinner size="lg" />
        <span className="text-sm text-foreground-muted">Large</span>
      </Flex>
    </Flex>
  ),
}

export const WithTextLabel: Story = {
  render: () => (
    <Flex gap="md" direction="row" align="center">
      <Spinner size="sm" />
      <span className="text-foreground">Loading data...</span>
    </Flex>
  ),
}

export const CustomLabel: Story = {
  args: {
    label: 'Processing your request',
  },
}
