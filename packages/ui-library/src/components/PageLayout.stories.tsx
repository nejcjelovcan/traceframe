import { Card, CardContent } from './Card'
import { DataTable, type Column } from './DataTable'
import { Grid } from './Grid'
import { Heading } from './Heading'
import { Navigation, NavItem } from './Navigation'
import { PageLayout, PageHeader } from './PageLayout'
import { Stack } from './Stack'

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
  <Stack gap="lg">
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
  </Stack>
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
      <Stack gap="md">
        <Heading level={1}>Documentation</Heading>
        <p className="text-foreground-muted">
          This demonstrates a right-positioned sidebar, commonly used for table of contents
          navigation.
        </p>
      </Stack>
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
    <PageLayout header={<SampleHeader />} sidebar={<SampleSidebar />} footer={<SampleFooter />}>
      <SampleContent />
    </PageLayout>
  ),
}

export const LongScrollableContent: Story = {
  render: () => (
    <PageLayout header={<SampleHeader />} sidebar={<SampleSidebar />} footer={<SampleFooter />}>
      <Stack gap="lg">
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
      </Stack>
    </PageLayout>
  ),
}

export const DashboardLayout: Story = {
  render: () => (
    <PageLayout header={<SampleHeader />} sidebar={<SampleSidebar />}>
      <Stack gap="lg">
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
            <Stack gap="md">
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
            </Stack>
          </CardContent>
        </Card>
      </Stack>
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
      <Stack gap="md">
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
      </Stack>
    </PageLayout>
  ),
}
