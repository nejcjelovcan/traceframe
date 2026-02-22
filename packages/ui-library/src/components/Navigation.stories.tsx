import { Flex } from './Flex'
import { Heading } from './Heading'
import { Navigation, NavItem } from './Navigation'
import { PageLayout, PageHeader } from './PageLayout'

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
- \`colorful\` - Strong emphasis background with prominent active states
- \`subtle\` - Muted background with soft active states
- \`transparent\` - Semi-transparent background with edge-to-edge items (for use on colorful backgrounds)

**Colors (for colorful/subtle/transparent variants):**
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
      options: ['default', 'colorful', 'subtle', 'transparent'],
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

export const ColorfulPrimaryHorizontal: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Colorful variant with primary color emphasis background for prominent navigation areas.',
      },
    },
  },
  render: () => (
    <Navigation orientation="horizontal" variant="colorful" color="primary">
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

export const ColorfulSecondaryVertical: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Colorful variant with secondary color for alternative navigation sections.',
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
    <Navigation orientation="vertical" variant="colorful" color="secondary">
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
        story: 'Subtle variant with muted background for softer navigation styling.',
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

export const ColorfulColorShowcase: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Showcase of all available colors in colorful variant.',
      },
    },
  },
  render: () => (
    <div className="space-y-base">
      <div>
        <p className="mb-sm text-sm text-foreground-muted">Primary</p>
        <Navigation orientation="horizontal" variant="colorful" color="primary">
          <NavItem href="#" active>
            Active
          </NavItem>
          <NavItem href="#">Link</NavItem>
          <NavItem href="#">Link</NavItem>
        </Navigation>
      </div>
      <div>
        <p className="mb-sm text-sm text-foreground-muted">Secondary</p>
        <Navigation orientation="horizontal" variant="colorful" color="secondary">
          <NavItem href="#" active>
            Active
          </NavItem>
          <NavItem href="#">Link</NavItem>
          <NavItem href="#">Link</NavItem>
        </Navigation>
      </div>
      <div>
        <p className="mb-sm text-sm text-foreground-muted">Accent 1</p>
        <Navigation orientation="horizontal" variant="colorful" color="accent-1">
          <NavItem href="#" active>
            Active
          </NavItem>
          <NavItem href="#">Link</NavItem>
          <NavItem href="#">Link</NavItem>
        </Navigation>
      </div>
      <div>
        <p className="mb-sm text-sm text-foreground-muted">Accent 2</p>
        <Navigation orientation="horizontal" variant="colorful" color="accent-2">
          <NavItem href="#" active>
            Active
          </NavItem>
          <NavItem href="#">Link</NavItem>
          <NavItem href="#">Link</NavItem>
        </Navigation>
      </div>
      <div>
        <p className="mb-sm text-sm text-foreground-muted">Accent 3</p>
        <Navigation orientation="horizontal" variant="colorful" color="accent-3">
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
        <Navigation orientation="vertical" variant="colorful" color="primary">
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
          'Demonstrates how Navigation inherits variant and color from PageLayout context. The PageLayout has variant="colorful" and color="accent-2", which the Navigation components automatically inherit without needing explicit props.',
      },
    },
  },
  render: () => (
    <PageLayout
      variant="colorful"
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
      <Flex gap="md">
        <Heading level={1}>Context Inheritance</Heading>
        <p className="text-foreground-muted">
          The Navigation components in both the header and sidebar inherit the colorful variant and
          accent-2 color from the PageLayout, without needing explicit variant or color props.
        </p>
        <div className="rounded-lg border border-border bg-surface-subtle p-base">
          <Heading level={2} className="mb-sm">
            How it works:
          </Heading>
          <ol className="list-inside list-decimal space-y-xs text-sm text-foreground-muted">
            <li>PageLayout provides variant and color via React Context</li>
            <li>Navigation checks for context values when not explicitly set</li>
            <li>Background colors apply to PageLayout header/sidebar, not Navigation</li>
            <li>Navigation adjusts text colors based on inherited variant</li>
          </ol>
        </div>
      </Flex>
    </PageLayout>
  ),
}

export const TransparentOnColorfulBackground: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Transparent variant designed for use on colorful PageLayout backgrounds. Features semi-transparent background with backdrop blur and edge-to-edge NavItems.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-gradient-primary p-lg rounded-lg">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div className="space-y-base">
      <div>
        <p className="mb-sm text-sm text-foreground text-shadow-light">Transparent on Primary</p>
        <Navigation orientation="horizontal" variant="transparent" color="primary">
          <NavItem href="#" active>
            Active
          </NavItem>
          <NavItem href="#">Reports</NavItem>
          <NavItem href="#">Settings</NavItem>
        </Navigation>
      </div>
      <div className="w-64">
        <p className="mb-sm text-sm text-foreground text-shadow-light">Vertical Transparent</p>
        <Navigation orientation="vertical" variant="transparent" color="primary">
          <NavItem href="#" icon="dashboard" active>
            Dashboard
          </NavItem>
          <NavItem href="#" icon="components">
            Components
          </NavItem>
          <NavItem href="#" icon="hierarchy">
            Dependencies
          </NavItem>
        </Navigation>
      </div>
    </div>
  ),
}

export const TransparentColorShowcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Showcase of transparent variant with all available colors on their respective colorful backgrounds.',
      },
    },
  },
  render: () => (
    <div className="space-y-base">
      <div className="bg-gradient-primary p-base rounded-lg">
        <p className="mb-sm text-sm text-foreground text-shadow-light">Primary</p>
        <Navigation orientation="horizontal" variant="transparent" color="primary">
          <NavItem href="#" active>
            Active
          </NavItem>
          <NavItem href="#">Link</NavItem>
          <NavItem href="#">Link</NavItem>
        </Navigation>
      </div>
      <div className="bg-gradient-secondary p-base rounded-lg">
        <p className="mb-sm text-sm text-foreground text-shadow-light">Secondary</p>
        <Navigation orientation="horizontal" variant="transparent" color="secondary">
          <NavItem href="#" active>
            Active
          </NavItem>
          <NavItem href="#">Link</NavItem>
          <NavItem href="#">Link</NavItem>
        </Navigation>
      </div>
      <div className="bg-accent-1 p-base rounded-lg">
        <p className="mb-sm text-sm text-foreground text-shadow-light">Accent 1</p>
        <Navigation orientation="horizontal" variant="transparent" color="accent-1">
          <NavItem href="#" active>
            Active
          </NavItem>
          <NavItem href="#">Link</NavItem>
          <NavItem href="#">Link</NavItem>
        </Navigation>
      </div>
      <div className="bg-accent-2 p-base rounded-lg">
        <p className="mb-sm text-sm text-foreground text-shadow-light">Accent 2</p>
        <Navigation orientation="horizontal" variant="transparent" color="accent-2">
          <NavItem href="#" active>
            Active
          </NavItem>
          <NavItem href="#">Link</NavItem>
          <NavItem href="#">Link</NavItem>
        </Navigation>
      </div>
      <div className="bg-accent-3 p-base rounded-lg">
        <p className="mb-sm text-sm text-foreground text-shadow-light">Accent 3</p>
        <Navigation orientation="horizontal" variant="transparent" color="accent-3">
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

export const TransparentWithPageLayout: Story = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Demonstrates the transparent Navigation variant used within a colorful PageLayout. The transparent variant provides better contrast than the colorful variant when both PageLayout and Navigation would otherwise have solid backgrounds.',
      },
    },
  },
  render: () => (
    <PageLayout
      variant="colorful"
      color="primary"
      header={
        <PageHeader title="Transparent Navigation Demo">
          <Navigation orientation="horizontal" variant="transparent" color="primary">
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
          <Navigation orientation="vertical" variant="transparent" color="primary">
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
      <Flex gap="md">
        <Heading level={1}>Transparent Variant</Heading>
        <p className="text-foreground-muted">
          The transparent variant provides better visual separation when used on colorful PageLayout
          backgrounds. Notice how the Navigation has a semi-transparent surface with backdrop blur,
          and the NavItems extend edge-to-edge in vertical orientation for clearer hover and active
          states.
        </p>
        <div className="rounded-lg border border-border bg-surface-subtle p-base">
          <Heading level={2} className="mb-sm">
            Key Features:
          </Heading>
          <ul className="list-inside list-disc space-y-xs text-sm text-foreground-muted">
            <li>Semi-transparent background (80% opacity) with backdrop blur</li>
            <li>Edge-to-edge NavItems in vertical orientation (no rounded corners)</li>
            <li>Stronger surface colors for active/hover states</li>
            <li>Text shadows for improved readability on colorful backgrounds</li>
            <li>Works with all color options (primary, secondary, accent-1 through accent-5)</li>
          </ul>
        </div>
      </Flex>
    </PageLayout>
  ),
}

export const ContextOverride: Story = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Shows that Navigation can still override the inherited context with explicit props. Here the PageLayout has variant="colorful" but the header Navigation overrides with variant="subtle".',
      },
    },
  },
  render: () => (
    <PageLayout
      variant="colorful"
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
              Inherits Colorful
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
      <Flex gap="md">
        <Heading level={1}>Context Override</Heading>
        <p className="text-foreground-muted">
          The header Navigation explicitly sets variant="subtle" and color="secondary", overriding
          the PageLayout context. The sidebar Navigation inherits the colorful/primary from
          PageLayout.
        </p>
      </Flex>
    </PageLayout>
  ),
}
