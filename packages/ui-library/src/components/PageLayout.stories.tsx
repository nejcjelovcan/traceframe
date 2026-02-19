import { Card, CardContent } from './Card'
import { DataTable, type Column } from './DataTable'
import { Flex } from './Flex'
import { Grid } from './Grid'
import { Heading } from './Heading'
import { Navigation, NavItem } from './Navigation'
import { PageLayout, PageHeader, SidebarToggle } from './PageLayout'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta<typeof PageLayout> = {
  title: 'Components/PageLayout',
  component: PageLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
A full-page layout component with header, sidebar, main content, and footer slots.

**Tier:** 1 (Tailwind + CVA)

**Slot Components:**
- \`header\` - Sticky top header (navigation, branding)
- \`sidebar\` - Optional left/right sidebar (navigation, filters)
- \`children\` - Main content area
- \`footer\` - Optional footer (status, links)

**Layout Behavior:**
- Header is sticky and stays visible when scrolling
- Sidebar can be positioned left or right
- Sidebar collapses on mobile by default (configurable)
- Main content scrolls independently
- Content width can be contained (max-width) or full

**Accessibility:**
- Supports skip link for keyboard navigation (\`skipLinkText\` prop)
- Uses semantic \`<header>\`, \`<main>\`, \`<aside>\`, \`<footer>\` elements
- Main content has \`id="main-content"\` for skip link target
- Skip link appears on focus (visually hidden otherwise)
        `.trim(),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'Main content to render in the content area',
    },
    header: {
      description: 'Header slot content (sticky top)',
    },
    sidebar: {
      description: 'Sidebar slot content (left or right)',
    },
    footer: {
      description: 'Footer slot content',
    },
    contentWidth: {
      description: 'Main content width behavior',
      control: 'select',
      options: ['contained', 'full'],
      table: {
        defaultValue: { summary: 'contained' },
      },
    },
    sidebarPosition: {
      description: 'Sidebar placement (left or right)',
      control: 'select',
      options: ['left', 'right'],
      table: {
        defaultValue: { summary: 'left' },
      },
    },
    sidebarCollapsible: {
      description: 'Allow sidebar to collapse on mobile viewports',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    skipLinkText: {
      description: 'Text for the skip navigation link (enables skip link when provided)',
      control: 'text',
    },
    variant: {
      description: 'Visual variant for header and sidebar backgrounds',
      control: 'select',
      options: ['default', 'colorful', 'subtle'],
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
    sidebarWidth: {
      description: 'Predefined sidebar width',
      control: 'select',
      options: [undefined, 'xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        defaultValue: { summary: 'undefined' },
      },
    },
    sidebarSticky: {
      description: 'Makes sidebar sticky within scroll container',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const SampleHeader = () => (
  <PageHeader title="Traceframe">
    <Navigation orientation="horizontal">
      <NavItem href="#" active>
        Dashboard
      </NavItem>
      <NavItem href="#">Reports</NavItem>
      <NavItem href="#">Settings</NavItem>
    </Navigation>
  </PageHeader>
)

const SampleSidebar = () => (
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
      <NavItem href="#" icon="toggle">
        Settings
      </NavItem>
    </Navigation>
  </div>
)

const SampleFooter = () => (
  <div className="flex h-size-lg items-center justify-between px-base text-sm text-foreground-muted">
    <div>Traceframe v1.0.0</div>
    <div>Last scan: 2 hours ago</div>
  </div>
)

const SampleContent = () => (
  <Flex gap="lg">
    <div>
      <Heading level={1}>Dashboard</Heading>
      <p className="mt-xs text-foreground-muted">Welcome to your project overview.</p>
    </div>
    <Grid cols={{ md: 3 }} gap="base">
      {['Components', 'Dependencies', 'Issues'].map((title) => (
        <Card key={title}>
          <CardContent>
            <Heading level={3}>{title}</Heading>
            <p className="mt-sm text-2xl font-bold">{Math.floor(Math.random() * 100)}</p>
          </CardContent>
        </Card>
      ))}
    </Grid>
  </Flex>
)

export const Default: Story = {
  args: {
    header: <SampleHeader />,
  },
  render: (args) => (
    <PageLayout {...args}>
      <SampleContent />
    </PageLayout>
  ),
}

export const FullLayout: Story = {
  render: () => (
    <PageLayout header={<SampleHeader />} sidebar={<SampleSidebar />} footer={<SampleFooter />}>
      <SampleContent />
    </PageLayout>
  ),
}

export const HeaderAndSidebar: Story = {
  render: () => (
    <PageLayout header={<SampleHeader />} sidebar={<SampleSidebar />}>
      <SampleContent />
    </PageLayout>
  ),
}

interface PackageData {
  name: string
  version: string
  components: number
  dependencies: number
  status: string
}

const packageColumns: Column<PackageData>[] = [
  {
    key: 'name',
    header: 'Package',
    render: (row) => <span className="font-mono">{row.name}</span>,
  },
  { key: 'version', header: 'Version' },
  { key: 'components', header: 'Components' },
  { key: 'dependencies', header: 'Dependencies' },
  { key: 'status', header: 'Status' },
]

const packageData: PackageData[] = [
  {
    name: '@traceframe/core',
    version: '1.0.0',
    components: 24,
    dependencies: 12,
    status: 'Stable',
  },
  { name: '@traceframe/ui', version: '0.8.0', components: 18, dependencies: 8, status: 'Beta' },
  {
    name: '@traceframe/scanner',
    version: '0.5.0',
    components: 6,
    dependencies: 15,
    status: 'Alpha',
  },
]

export const FullWidthContent: Story = {
  render: () => (
    <PageLayout header={<SampleHeader />} sidebar={<SampleSidebar />} contentWidth="full">
      <div className="p-lg">
        <Heading level={1} className="mb-base">
          Data Table
        </Heading>
        <DataTable columns={packageColumns} data={packageData} />
      </div>
    </PageLayout>
  ),
}

export const RightSidebar: Story = {
  render: () => (
    <PageLayout
      header={<SampleHeader />}
      sidebar={
        <div className="w-64 p-base">
          <Heading level={3} className="mb-md">
            On This Page
          </Heading>
          <Navigation orientation="vertical">
            <NavItem href="#" active>
              Introduction
            </NavItem>
            <NavItem href="#">Getting Started</NavItem>
            <NavItem href="#">Configuration</NavItem>
            <NavItem href="#">API Reference</NavItem>
          </Navigation>
        </div>
      }
      sidebarPosition="right"
    >
      <Flex gap="md">
        <Heading level={1}>Documentation</Heading>
        <p className="text-foreground-muted">
          This demonstrates a right-positioned sidebar, commonly used for table of contents
          navigation.
        </p>
      </Flex>
    </PageLayout>
  ),
}

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => (
    <PageLayout
      header={
        <PageHeader title="Traceframe">
          <SidebarToggle />
        </PageHeader>
      }
      sidebar={<SampleSidebar />}
      footer={<SampleFooter />}
      sidebarWidth="md"
    >
      <SampleContent />
    </PageLayout>
  ),
}

export const LongScrollableContent: Story = {
  render: () => (
    <PageLayout header={<SampleHeader />} sidebar={<SampleSidebar />} footer={<SampleFooter />}>
      <Flex gap="lg">
        <Heading level={1}>Long Content Example</Heading>
        {Array.from({ length: 20 }).map((_, i) => (
          <Card key={i}>
            <CardContent>
              <Heading level={3}>Section {i + 1}</Heading>
              <p className="mt-sm text-foreground-muted">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris.
              </p>
            </CardContent>
          </Card>
        ))}
      </Flex>
    </PageLayout>
  ),
}

export const DashboardLayout: Story = {
  render: () => (
    <PageLayout header={<SampleHeader />} sidebar={<SampleSidebar />}>
      <Flex gap="lg">
        <div>
          <Heading level={1}>Project Dashboard</Heading>
          <p className="mt-xs text-foreground-muted">Overview of your codebase health.</p>
        </div>
        <Grid cols={{ md: 4 }} gap="base">
          {[
            { label: 'Components', value: '142', trend: '+12%' },
            { label: 'Dependencies', value: '48', trend: '-3' },
            { label: 'Open Issues', value: '7', trend: '+2' },
            { label: 'Code Coverage', value: '84%', trend: '+5%' },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent>
                <p className="text-sm text-foreground-muted">{stat.label}</p>
                <p className="mt-xs text-2xl font-bold">{stat.value}</p>
                <p className="mt-xs text-sm text-status-success-foreground">{stat.trend}</p>
              </CardContent>
            </Card>
          ))}
        </Grid>
        <Card>
          <CardContent>
            <Heading level={2} className="mb-base">
              Recent Activity
            </Heading>
            <Flex gap="md">
              {[
                'Added new Button component',
                'Updated dependency versions',
                'Fixed accessibility issue in Modal',
                'Added unit tests for Card',
              ].map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center gap-md border-b border-border-muted pb-md last:border-0"
                >
                  <div className="h-sm w-sm rounded-full bg-interactive-primary" />
                  <span className="text-sm">{activity}</span>
                </div>
              ))}
            </Flex>
          </CardContent>
        </Card>
      </Flex>
    </PageLayout>
  ),
}

export const WithSkipLink: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Press Tab to reveal the skip link. This accessibility feature allows keyboard users to bypass navigation and jump directly to the main content.',
      },
    },
  },
  render: () => (
    <PageLayout
      header={<SampleHeader />}
      sidebar={<SampleSidebar />}
      footer={<SampleFooter />}
      skipLinkText="Skip to main content"
    >
      <Flex gap="md">
        <Heading level={1}>Skip Link Demo</Heading>
        <p className="text-foreground-muted">
          Press <kbd className="rounded-sm border bg-surface-muted px-xs py-2xs text-sm">Tab</kbd>{' '}
          to reveal the skip link at the top-left of the page. This is a WCAG 2.1 Level A
          requirement that helps keyboard users bypass repetitive navigation.
        </p>
        <div className="rounded-lg border border-border bg-surface-subtle p-base">
          <Heading level={2}>How it works:</Heading>
          <ol className="mt-sm list-inside list-decimal space-y-xs text-sm text-foreground-muted">
            <li>The skip link is visually hidden by default</li>
            <li>When focused via Tab, it appears at the top-left</li>
            <li>Clicking or pressing Enter moves focus to the main content</li>
            <li>This allows keyboard users to skip past navigation</li>
          </ol>
        </div>
      </Flex>
    </PageLayout>
  ),
}

export const ColorfulHeaderVariant: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the colorful variant with primary color on the header. The Navigation inherits the variant context and adjusts its text colors accordingly.',
      },
    },
  },
  render: () => (
    <PageLayout
      variant="colorful"
      color="primary"
      header={
        <PageHeader title="Traceframe">
          <Navigation orientation="horizontal">
            <NavItem href="#" active>
              Dashboard
            </NavItem>
            <NavItem href="#">Reports</NavItem>
            <NavItem href="#">Settings</NavItem>
          </Navigation>
        </PageHeader>
      }
      sidebar={<SampleSidebar />}
    >
      <SampleContent />
    </PageLayout>
  ),
}

export const ColorfulSidebarVariant: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Shows the colorful variant applied to the sidebar with accent-1 color. The Navigation component inherits the variant and displays appropriate text colors.',
      },
    },
  },
  render: () => (
    <PageLayout
      variant="colorful"
      color="accent-1"
      header={<SampleHeader />}
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
            <NavItem href="#" icon="toggle">
              Settings
            </NavItem>
          </Navigation>
        </div>
      }
    >
      <SampleContent />
    </PageLayout>
  ),
}

export const SubtleVariant: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The subtle variant provides a muted background. Navigation components automatically inherit this context.',
      },
    },
  },
  render: () => (
    <PageLayout
      variant="subtle"
      color="secondary"
      header={
        <PageHeader title="Traceframe">
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
          </Navigation>
        </div>
      }
    >
      <SampleContent />
    </PageLayout>
  ),
}

export const MixedVariants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates that Navigation components can override the inherited context by providing their own variant/color props.',
      },
    },
  },
  render: () => (
    <PageLayout
      variant="colorful"
      color="primary"
      header={
        <PageHeader title="Traceframe">
          <Navigation orientation="horizontal" variant="subtle" color="secondary">
            <NavItem href="#" active>
              Dashboard
            </NavItem>
            <NavItem href="#">Reports</NavItem>
            <NavItem href="#">Settings</NavItem>
          </Navigation>
        </PageHeader>
      }
      sidebar={<SampleSidebar />}
    >
      <Flex gap="md">
        <Heading level={1}>Mixed Variants</Heading>
        <p className="text-foreground-muted">
          The PageLayout has variant="colorful" and color="primary", but the Navigation in the
          header explicitly overrides with variant="subtle" and color="secondary".
        </p>
      </Flex>
    </PageLayout>
  ),
}

export const FixedSidebar: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates sidebarWidth and sidebarSticky combined. The sidebar has a fixed width of "md" (w-64) and stays visible as main content scrolls.',
      },
    },
  },
  render: () => (
    <PageLayout
      header={<SampleHeader />}
      sidebar={<SampleSidebar />}
      footer={<SampleFooter />}
      sidebarWidth="md"
      sidebarSticky
    >
      <Flex gap="lg">
        <Heading level={1}>Sticky Sidebar</Heading>
        {Array.from({ length: 15 }).map((_, i) => (
          <Card key={i}>
            <CardContent>
              <Heading level={3}>Section {i + 1}</Heading>
              <p className="mt-sm text-foreground-muted">
                Scroll to see the sidebar stay fixed while content scrolls.
              </p>
            </CardContent>
          </Card>
        ))}
      </Flex>
    </PageLayout>
  ),
}

export const MobileSidebarToggle: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story:
          'Shows the SidebarToggle button in the header on mobile viewports. Click the hamburger icon to open the sidebar overlay.',
      },
    },
  },
  render: () => (
    <PageLayout
      header={
        <PageHeader title="Traceframe">
          <SidebarToggle />
        </PageHeader>
      }
      sidebar={<SampleSidebar />}
      sidebarWidth="md"
    >
      <SampleContent />
    </PageLayout>
  ),
}

export const MobileSidebarRight: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Right-side mobile sidebar overlay. The panel slides in from the right edge.',
      },
    },
  },
  render: () => (
    <PageLayout
      header={
        <PageHeader title="Traceframe">
          <SidebarToggle />
        </PageHeader>
      }
      sidebar={
        <div className="p-base">
          <Heading level={3} className="mb-md">
            On This Page
          </Heading>
          <Navigation orientation="vertical">
            <NavItem href="#" active>
              Introduction
            </NavItem>
            <NavItem href="#">Getting Started</NavItem>
            <NavItem href="#">Configuration</NavItem>
            <NavItem href="#">API Reference</NavItem>
          </Navigation>
        </div>
      }
      sidebarPosition="right"
      sidebarWidth="md"
    >
      <SampleContent />
    </PageLayout>
  ),
}
