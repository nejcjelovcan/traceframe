import { Heading } from './Heading'
import { Navigation, NavItem } from './Navigation'
import { PageLayout, PageHeader } from './PageLayout'
import { Stack } from './Stack'

import type { Meta, StoryObj } from '@storybook/react-vite'

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

**Variants:**
- \`default\` - Standard navigation with minimal styling
- \`filled\` - Strong gradient background with prominent active states
- \`subtle\` - Light gradient background with soft active states

**Colors (for filled/subtle variants):**
- \`primary\`, \`secondary\`, \`accent-1\` through \`accent-5\`

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
    variant: {
      description: 'Visual variant of the navigation',
      control: 'radio',
      options: ['default', 'filled', 'subtle'],
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    color: {
      description: 'Color scheme for filled and subtle variants',
      control: 'select',
      options: ['primary', 'secondary', 'accent-1', 'accent-2', 'accent-3', 'accent-4', 'accent-5'],
      table: {
        defaultValue: { summary: 'primary' },
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

export const AsChildHorizontal: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Using `asChild` to render custom elements (e.g., framework router links) instead of `<a>`. Props like className, aria-current, and ref are merged onto the child.',
      },
    },
  },
  render: () => (
    <Navigation orientation="horizontal">
      <NavItem asChild active icon="dashboard">
        <button type="button" onClick={() => {}}>
          Dashboard
        </button>
      </NavItem>
      <NavItem asChild>
        <button type="button" onClick={() => {}}>
          Reports
        </button>
      </NavItem>
      <NavItem asChild>
        <button type="button" onClick={() => {}}>
          Settings
        </button>
      </NavItem>
    </Navigation>
  ),
}

export const AsChildVertical: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Vertical navigation with `asChild` and icons.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-64 rounded-lg border border-border bg-surface p-base">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <Navigation orientation="vertical">
      <NavItem asChild active icon="dashboard">
        <button type="button" onClick={() => {}}>
          Overview
        </button>
      </NavItem>
      <NavItem asChild icon="components">
        <button type="button" onClick={() => {}}>
          Components
        </button>
      </NavItem>
      <NavItem asChild icon="hierarchy">
        <button type="button" onClick={() => {}}>
          Dependencies
        </button>
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

export const FilledPrimaryHorizontal: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Filled variant with primary color gradient background for prominent navigation areas.',
      },
    },
  },
  render: () => (
    <Navigation orientation="horizontal" variant="filled" color="primary">
      <NavItem href="#" icon="dashboard" active>
        Dashboard
      </NavItem>
      <NavItem href="#" icon="file-description">
        Reports
      </NavItem>
      <NavItem href="#" icon="toggle">
        Settings
      </NavItem>
      <NavItem href="#" icon="users">
        Profile
      </NavItem>
    </Navigation>
  ),
}

export const FilledSecondaryVertical: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Filled variant with secondary color for alternative navigation sections.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <Navigation orientation="vertical" variant="filled" color="secondary">
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

export const SubtlePrimaryHorizontal: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Subtle variant with light gradient background for softer navigation styling.',
      },
    },
  },
  render: () => (
    <Navigation orientation="horizontal" variant="subtle" color="primary">
      <NavItem href="#" active>
        Overview
      </NavItem>
      <NavItem href="#">Analytics</NavItem>
      <NavItem href="#">Reports</NavItem>
      <NavItem href="#">Team</NavItem>
      <NavItem href="#">Settings</NavItem>
    </Navigation>
  ),
}

export const SubtleAccentVertical: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Subtle variant with accent color for themed sidebar navigation.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <Navigation orientation="vertical" variant="subtle" color="accent-1">
      <NavItem href="#" icon="folder" active>
        Projects
      </NavItem>
      <NavItem href="#" icon="git-branch">
        Branches
      </NavItem>
      <NavItem href="#" icon="git-branch">
        Commits
      </NavItem>
      <NavItem href="#" icon="git-pull-request">
        Pull Requests
      </NavItem>
      <NavItem href="#" icon="hash">
        Releases
      </NavItem>
    </Navigation>
  ),
}

export const FilledColorShowcase: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Showcase of all available colors in filled variant.',
      },
    },
  },
  render: () => (
    <div className="space-y-base">
      <div>
        <p className="mb-sm text-sm text-foreground-muted">Primary</p>
        <Navigation orientation="horizontal" variant="filled" color="primary">
          <NavItem href="#" active>
            Active
          </NavItem>
          <NavItem href="#">Link</NavItem>
          <NavItem href="#">Link</NavItem>
        </Navigation>
      </div>
      <div>
        <p className="mb-sm text-sm text-foreground-muted">Secondary</p>
        <Navigation orientation="horizontal" variant="filled" color="secondary">
          <NavItem href="#" active>
            Active
          </NavItem>
          <NavItem href="#">Link</NavItem>
          <NavItem href="#">Link</NavItem>
        </Navigation>
      </div>
      <div>
        <p className="mb-sm text-sm text-foreground-muted">Accent 1</p>
        <Navigation orientation="horizontal" variant="filled" color="accent-1">
          <NavItem href="#" active>
            Active
          </NavItem>
          <NavItem href="#">Link</NavItem>
          <NavItem href="#">Link</NavItem>
        </Navigation>
      </div>
      <div>
        <p className="mb-sm text-sm text-foreground-muted">Accent 2</p>
        <Navigation orientation="horizontal" variant="filled" color="accent-2">
          <NavItem href="#" active>
            Active
          </NavItem>
          <NavItem href="#">Link</NavItem>
          <NavItem href="#">Link</NavItem>
        </Navigation>
      </div>
      <div>
        <p className="mb-sm text-sm text-foreground-muted">Accent 3</p>
        <Navigation orientation="horizontal" variant="filled" color="accent-3">
          <NavItem href="#" active>
            Active
          </NavItem>
          <NavItem href="#">Link</NavItem>
          <NavItem href="#">Link</NavItem>
        </Navigation>
      </div>
    </div>
  ),
}

export const SubtleColorShowcase: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Showcase of all available colors in subtle variant.',
      },
    },
  },
  render: () => (
    <div className="space-y-base">
      <div>
        <p className="mb-sm text-sm text-foreground-muted">Primary</p>
        <Navigation orientation="horizontal" variant="subtle" color="primary">
          <NavItem href="#" active>
            Active
          </NavItem>
          <NavItem href="#">Link</NavItem>
          <NavItem href="#">Link</NavItem>
        </Navigation>
      </div>
      <div>
        <p className="mb-sm text-sm text-foreground-muted">Secondary</p>
        <Navigation orientation="horizontal" variant="subtle" color="secondary">
          <NavItem href="#" active>
            Active
          </NavItem>
          <NavItem href="#">Link</NavItem>
          <NavItem href="#">Link</NavItem>
        </Navigation>
      </div>
      <div>
        <p className="mb-sm text-sm text-foreground-muted">Accent 1</p>
        <Navigation orientation="horizontal" variant="subtle" color="accent-1">
          <NavItem href="#" active>
            Active
          </NavItem>
          <NavItem href="#">Link</NavItem>
          <NavItem href="#">Link</NavItem>
        </Navigation>
      </div>
      <div>
        <p className="mb-sm text-sm text-foreground-muted">Accent 2</p>
        <Navigation orientation="horizontal" variant="subtle" color="accent-2">
          <NavItem href="#" active>
            Active
          </NavItem>
          <NavItem href="#">Link</NavItem>
          <NavItem href="#">Link</NavItem>
        </Navigation>
      </div>
      <div>
        <p className="mb-sm text-sm text-foreground-muted">Accent 3</p>
        <Navigation orientation="horizontal" variant="subtle" color="accent-3">
          <NavItem href="#" active>
            Active
          </NavItem>
          <NavItem href="#">Link</NavItem>
          <NavItem href="#">Link</NavItem>
        </Navigation>
      </div>
    </div>
  ),
}

export const ComplexLayoutExample: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Complex layout combining different navigation variants for different sections.',
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
    <div className="space-y-lg p-base">
      <div>
        <Heading level={3} size="sm" color="muted" className="mb-md uppercase tracking-wider">
          Workspace
        </Heading>
        <Navigation orientation="vertical" variant="filled" color="primary">
          <NavItem href="#" icon="dashboard" active>
            Dashboard
          </NavItem>
          <NavItem href="#" icon="package">
            Packages
          </NavItem>
          <NavItem href="#" icon="components">
            Components
          </NavItem>
        </Navigation>
      </div>
      <div>
        <Heading level={3} size="sm" color="muted" className="mb-md uppercase tracking-wider">
          Analytics
        </Heading>
        <Navigation orientation="vertical" variant="subtle" color="accent-1">
          <NavItem href="#" icon="chart">
            Metrics
          </NavItem>
          <NavItem href="#" icon="chart">
            Trends
          </NavItem>
          <NavItem href="#" icon="file-description">
            Reports
          </NavItem>
        </Navigation>
      </div>
      <div>
        <Heading level={3} size="sm" color="muted" className="mb-md uppercase tracking-wider">
          Settings
        </Heading>
        <Navigation orientation="vertical">
          <NavItem href="#" icon="users">
            Profile
          </NavItem>
          <NavItem href="#" icon="toggle">
            Preferences
          </NavItem>
          <NavItem href="#" icon="lock">
            Security
          </NavItem>
        </Navigation>
      </div>
    </div>
  ),
}

export const ContextInheritance: Story = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Demonstrates how Navigation inherits variant and color from PageLayout context. The PageLayout has variant="filled" and color="accent-2", which the Navigation components automatically inherit without needing explicit props.',
      },
    },
  },
  render: () => (
    <PageLayout
      variant="filled"
      color="accent-2"
      header={
        <PageHeader title="Context Inheritance Demo">
          <Navigation orientation="horizontal">
            <NavItem href="#" active>
              Dashboard
            </NavItem>
            <NavItem href="#">Reports</NavItem>
            <NavItem href="#">Settings</NavItem>
          </Navigation>
        </PageHeader>
      }
      sidebar={
        <div className="w-64 p-base">
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
          </Navigation>
        </div>
      }
    >
      <Stack gap="md">
        <Heading level={1}>Context Inheritance</Heading>
        <p className="text-foreground-muted">
          The Navigation components in both the header and sidebar inherit the filled variant and
          accent-2 color from the PageLayout, without needing explicit variant or color props.
        </p>
        <div className="rounded-lg border border-border bg-surface-subtle p-base">
          <Heading level={2} className="mb-sm">
            How it works:
          </Heading>
          <ol className="list-inside list-decimal space-y-xs text-sm text-foreground-muted">
            <li>PageLayout provides variant and color via React Context</li>
            <li>Navigation checks for context values when not explicitly set</li>
            <li>Background gradients apply to PageLayout header/sidebar, not Navigation</li>
            <li>Navigation adjusts text colors based on inherited variant</li>
          </ol>
        </div>
      </Stack>
    </PageLayout>
  ),
}

export const ContextOverride: Story = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Shows that Navigation can still override the inherited context with explicit props. Here the PageLayout has variant="filled" but the header Navigation overrides with variant="subtle".',
      },
    },
  },
  render: () => (
    <PageLayout
      variant="filled"
      color="primary"
      header={
        <PageHeader title="Override Demo">
          <Navigation orientation="horizontal" variant="subtle" color="secondary">
            <NavItem href="#" active>
              Dashboard
            </NavItem>
            <NavItem href="#">Reports</NavItem>
            <NavItem href="#">Settings</NavItem>
          </Navigation>
        </PageHeader>
      }
      sidebar={
        <div className="w-64 p-base">
          <Navigation orientation="vertical">
            <NavItem href="#" icon="dashboard" active>
              Inherits Filled
            </NavItem>
            <NavItem href="#" icon="components">
              From PageLayout
            </NavItem>
            <NavItem href="#" icon="hierarchy">
              Context
            </NavItem>
          </Navigation>
        </div>
      }
    >
      <Stack gap="md">
        <Heading level={1}>Context Override</Heading>
        <p className="text-foreground-muted">
          The header Navigation explicitly sets variant="subtle" and color="secondary", overriding
          the PageLayout context. The sidebar Navigation inherits the filled/primary from
          PageLayout.
        </p>
      </Stack>
    </PageLayout>
  ),
}
