import { Heading } from './Heading'
import { Navigation, NavItem } from './Navigation'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Navigation> = {
  title: 'Components/Navigation',
  component: Navigation,
  parameters: {
    docs: {
      description: {
        component: `
A navigation component that supports both horizontal (header) and vertical (sidebar) layouts.

**Tier:** 1 (Tailwind + CVA)

**Subcomponents:**
- \`NavItem\` - Individual navigation link with optional icon

**Orientation:**
- \`horizontal\` - For header navigation (inline, gap-4)
- \`vertical\` - For sidebar navigation (stacked, with hover backgrounds)

**Features:**
- Active state styling with \`active\` prop
- Icon support via \`icon\` prop (uses Icon component)
- Accessible \`aria-current="page"\` for active items
        `.trim(),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      description: 'Navigation layout orientation',
      control: 'radio',
      options: ['horizontal', 'vertical'],
      table: {
        defaultValue: { summary: 'horizontal' },
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: () => (
    <Navigation orientation="horizontal">
      <NavItem href="#" active>
        Dashboard
      </NavItem>
      <NavItem href="#">Reports</NavItem>
      <NavItem href="#">Settings</NavItem>
    </Navigation>
  ),
}

export const HorizontalWithIcons: Story = {
  render: () => (
    <Navigation orientation="horizontal">
      <NavItem href="#" icon="dashboard" active>
        Dashboard
      </NavItem>
      <NavItem href="#" icon="file-description">
        Reports
      </NavItem>
      <NavItem href="#" icon="toggle">
        Settings
      </NavItem>
    </Navigation>
  ),
}

export const Vertical: Story = {
  decorators: [
    (Story) => (
      <div className="w-64 rounded-lg border border-border bg-surface p-base">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <Navigation orientation="vertical">
      <NavItem href="#" active>
        Overview
      </NavItem>
      <NavItem href="#">Components</NavItem>
      <NavItem href="#">Dependencies</NavItem>
      <NavItem href="#">Issues</NavItem>
      <NavItem href="#">Settings</NavItem>
    </Navigation>
  ),
}

export const VerticalWithIcons: Story = {
  decorators: [
    (Story) => (
      <div className="w-64 rounded-lg border border-border bg-surface p-base">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <Navigation orientation="vertical">
      <NavItem href="#" icon="dashboard" active>
        Overview
      </NavItem>
      <NavItem href="#" icon="components">
        Components
      </NavItem>
      <NavItem href="#" icon="hierarchy">
        Dependencies
      </NavItem>
      <NavItem href="#" icon="alert-circle">
        Issues
      </NavItem>
      <NavItem href="#" icon="toggle">
        Settings
      </NavItem>
    </Navigation>
  ),
}

export const SidebarExample: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Example of Navigation used in a sidebar context with a header.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-64 border-r border-border bg-surface">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div className="p-base">
      <Heading level={3} size="sm" color="muted" className="mb-md uppercase tracking-wider">
        Main Menu
      </Heading>
      <Navigation orientation="vertical">
        <NavItem href="#" icon="dashboard" active>
          Dashboard
        </NavItem>
        <NavItem href="#" icon="package">
          Packages
        </NavItem>
        <NavItem href="#" icon="components">
          Components
        </NavItem>
        <NavItem href="#" icon="hierarchy">
          Dependencies
        </NavItem>
      </Navigation>
      <Heading level={3} size="sm" color="muted" className="mb-md mt-lg uppercase tracking-wider">
        Tools
      </Heading>
      <Navigation orientation="vertical">
        <NavItem href="#" icon="search">
          Search
        </NavItem>
        <NavItem href="#" icon="chart">
          Reports
        </NavItem>
        <NavItem href="#" icon="toggle">
          Settings
        </NavItem>
      </Navigation>
    </div>
  ),
}
