import { Flex } from './Flex'
import { Heading } from './Heading'
import { ModeSwitcher } from './ModeSwitcher'
import { ThemeSwitcher } from './ThemeSwitcher'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta<typeof ThemeSwitcher> = {
  title: 'Components/ThemeSwitcher',
  component: ThemeSwitcher,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      table: {
        defaultValue: { summary: 'sm' },
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sizes: Story = {
  render: () => (
    <Flex gap="md" align="start">
      <Flex direction="row" align="center" gap="base">
        <span className="w-size-lg text-sm text-foreground-muted">xs</span>
        <ThemeSwitcher size="xs" />
      </Flex>
      <Flex direction="row" align="center" gap="base">
        <span className="w-size-lg text-sm text-foreground-muted">sm</span>
        <ThemeSwitcher size="sm" />
      </Flex>
      <Flex direction="row" align="center" gap="base">
        <span className="w-size-lg text-sm text-foreground-muted">md</span>
        <ThemeSwitcher size="md" />
      </Flex>
      <Flex direction="row" align="center" gap="base">
        <span className="w-size-lg text-sm text-foreground-muted">lg</span>
        <ThemeSwitcher size="lg" />
      </Flex>
    </Flex>
  ),
}

export const WithModeSwitcher: Story = {
  render: () => (
    <Flex direction="row" align="center" gap="base">
      <ThemeSwitcher />
      <ModeSwitcher />
    </Flex>
  ),
}
