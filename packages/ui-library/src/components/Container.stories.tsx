import { Button } from './Button'
import { Container } from './Container'
import { DataTable, type Column } from './DataTable'
import { Heading } from './Heading'
import { Input } from './Input'
import { Stack } from './Stack'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta<typeof Container> = {
  title: 'Components/Container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
A layout wrapper that constrains content width and provides consistent horizontal padding.

**Tier:** 1 (Tailwind + CVA)

**Usage:** Wrap page content to maintain readable line lengths and consistent margins. Use different sizes based on content type: \`sm\` for forms, \`lg\` for standard pages, \`full\` for data tables.

**Size Reference:**
- \`sm\`: 640px (forms, narrow content)
- \`md\`: 768px (default content)
- \`lg\`: 1024px (standard pages)
- \`xl\`: 1280px (wider layouts)
- \`2xl\`: 1536px (extra wide)
- \`full\`: 100% (data tables, visualizations)

**Accessibility:**
- Uses semantic \`<div>\` element
- Does not affect content accessibility
- Horizontal padding provides comfortable reading margins
        `.trim(),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      description: 'Maximum width constraint for the container',
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl', 'full'],
      table: {
        defaultValue: { summary: 'lg' },
      },
    },
    padding: {
      description: 'Horizontal padding on container edges',
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    children: {
      description: 'Content to render inside the container',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const ContentBox = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded border border-dashed border-border-muted bg-surface-muted p-base">
    {children}
  </div>
)

export const Default: Story = {
  args: {
    size: 'lg',
    padding: 'md',
  },
  render: (args) => (
    <Container {...args}>
      <ContentBox>
        <p>Default container with lg size and md padding.</p>
        <p className="mt-sm text-sm text-foreground-muted">
          Max-width: 1024px | Padding: 1rem (16px)
        </p>
      </ContentBox>
    </Container>
  ),
}

export const Small: Story = {
  render: () => (
    <Container size="sm">
      <ContentBox>
        <p>Small container - ideal for narrow content like forms.</p>
        <p className="mt-sm text-sm text-foreground-muted">Max-width: 640px</p>
      </ContentBox>
    </Container>
  ),
}

export const Medium: Story = {
  render: () => (
    <Container size="md">
      <ContentBox>
        <p>Medium container - default content width.</p>
        <p className="mt-sm text-sm text-foreground-muted">Max-width: 768px</p>
      </ContentBox>
    </Container>
  ),
}

export const Large: Story = {
  render: () => (
    <Container size="lg">
      <ContentBox>
        <p>Large container - standard pages.</p>
        <p className="mt-sm text-sm text-foreground-muted">Max-width: 1024px</p>
      </ContentBox>
    </Container>
  ),
}

export const ExtraLarge: Story = {
  render: () => (
    <Container size="xl">
      <ContentBox>
        <p>Extra large container - wider pages.</p>
        <p className="mt-sm text-sm text-foreground-muted">Max-width: 1280px</p>
      </ContentBox>
    </Container>
  ),
}

export const TwoXL: Story = {
  render: () => (
    <Container size="2xl">
      <ContentBox>
        <p>2XL container - extra wide pages.</p>
        <p className="mt-sm text-sm text-foreground-muted">Max-width: 1536px</p>
      </ContentBox>
    </Container>
  ),
}

export const FullWidth: Story = {
  render: () => (
    <Container size="full">
      <ContentBox>
        <p>Full width container - no max-width constraint.</p>
        <p className="mt-sm text-sm text-foreground-muted">
          Uses 100% available width - ideal for data tables and visualizations.
        </p>
      </ContentBox>
    </Container>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <Stack gap="md" className="py-base">
      {(
        [
          ['sm', '640px'],
          ['md', '768px'],
          ['lg', '1024px'],
          ['xl', '1280px'],
          ['2xl', '1536px'],
          ['full', '100%'],
        ] as const
      ).map(([size, width]) => (
        <div key={size} className="bg-surface-subtle">
          <Container size={size}>
            <div className="rounded border border-dashed border-border-muted bg-surface p-sm">
              <p className="text-sm font-medium">
                {size} ({width})
              </p>
            </div>
          </Container>
        </div>
      ))}
    </Stack>
  ),
}

export const PaddingVariants: Story = {
  render: () => (
    <Stack gap="md" className="bg-surface-subtle py-base">
      <Container size="lg" padding="none">
        <ContentBox>
          <p className="text-sm font-medium">padding: none (0px)</p>
        </ContentBox>
      </Container>
      <Container size="lg" padding="sm">
        <ContentBox>
          <p className="text-sm font-medium">padding: sm (8px)</p>
        </ContentBox>
      </Container>
      <Container size="lg" padding="md">
        <ContentBox>
          <p className="text-sm font-medium">padding: md (16px)</p>
        </ContentBox>
      </Container>
      <Container size="lg" padding="lg">
        <ContentBox>
          <p className="text-sm font-medium">padding: lg (24px)</p>
        </ContentBox>
      </Container>
    </Stack>
  ),
}

interface PackageRow {
  name: string
  version: string
  components: number
  dependencies: number
  lastUpdated: string
  status: string
}

const packageColumns: Column<PackageRow>[] = [
  {
    key: 'name',
    header: 'Package',
    render: (row) => <span className="font-mono">{row.name}</span>,
  },
  { key: 'version', header: 'Version' },
  { key: 'components', header: 'Components' },
  { key: 'dependencies', header: 'Dependencies' },
  { key: 'lastUpdated', header: 'Last Updated' },
  { key: 'status', header: 'Status' },
]

const packageData: PackageRow[] = [
  {
    name: '@nejcjelovcan/traceframe-ui-library',
    version: '1.0.0',
    components: 12,
    dependencies: 5,
    lastUpdated: '2024-01-15',
    status: 'Active',
  },
  {
    name: '@traceframe/scanner',
    version: '0.5.0',
    components: 0,
    dependencies: 8,
    lastUpdated: '2024-01-14',
    status: 'Beta',
  },
  {
    name: '@traceframe/reporter',
    version: '0.1.0',
    components: 8,
    dependencies: 12,
    lastUpdated: '2024-01-13',
    status: 'Alpha',
  },
]

export const FullWidthTable: Story = {
  render: () => (
    <Container size="full" padding="md">
      <DataTable columns={packageColumns} data={packageData} size="sm" />
    </Container>
  ),
}

export const FormLayout: Story = {
  render: () => (
    <Container size="sm" padding="lg">
      <Stack gap="md">
        <Heading level={2}>Settings</Heading>
        <Stack gap="xs">
          <span className="text-sm font-medium">Project Name</span>
          <Input placeholder="My Project" />
        </Stack>
        <Stack gap="xs">
          <span className="text-sm font-medium">Description</span>
          <Input placeholder="Describe your project..." />
        </Stack>
        <Button variant="primary">Save Changes</Button>
      </Stack>
    </Container>
  ),
}
