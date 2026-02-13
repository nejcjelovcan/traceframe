import { useState } from 'react'

import {
  Badge,
  BarChart,
  Button,
  Card,
  CardContent,
  CardHeader,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Container,
  DataTable,
  EmptyState,
  ErrorState,
  Grid,
  Heading,
  Icon,
  Input,
  Link,
  SearchInput,
  Select,
  Spinner,
  Stack,
  StatCard,
  ThemeSwitcher,
  ToggleGroup,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../index.js'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta = {
  title: 'Design System/Component Showcase',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
A comprehensive showcase of all design system components. This displays every component 
in the library with their primary variants, demonstrating the cohesive design language 
and consistent visual patterns across the system.

**Categories:**
- **Actions**: Buttons, Links, Toggle Groups
- **Data Display**: Cards, Charts, Tables, Stats
- **Feedback**: Badges, Spinners, Empty States, Error States
- **Forms**: Inputs, Search, Select
- **Layout**: Containers, Grid, Stack, Page Layout
- **Navigation**: Links, Collapsible sections
- **Overlays**: Tooltips
- **Utilities**: Theme Switcher, Icons

Each component follows consistent design patterns for spacing, typography, colors, and interaction states.
        `.trim(),
      },
    },
  },
}

export default meta
type Story = StoryObj

// Sample data for showcase
const sampleChartData = [
  { label: 'Jan', value: 65, threshold: 'success' as const },
  { label: 'Feb', value: 45, threshold: 'warning' as const },
  { label: 'Mar', value: 85, threshold: 'success' as const },
  { label: 'Apr', value: 25, threshold: 'error' as const },
  { label: 'May', value: 75, threshold: 'success' as const },
]

const sampleTableData = [
  { id: 1, name: 'Alice Johnson', role: 'Developer', status: 'Active' },
  { id: 2, name: 'Bob Smith', role: 'Designer', status: 'Inactive' },
  { id: 3, name: 'Carol Williams', role: 'Manager', status: 'Active' },
]

const sampleTableColumns = [
  { key: 'name' as keyof (typeof sampleTableData)[0], header: 'Name', sortable: true },
  { key: 'role' as keyof (typeof sampleTableData)[0], header: 'Role', sortable: true },
  { key: 'status' as keyof (typeof sampleTableData)[0], header: 'Status', sortable: false },
]

const toggleOptions = [
  { value: 'grid', label: 'Grid View' },
  { value: 'list', label: 'List View' },
]

interface ShowcaseSectionProps {
  title: string
  description?: string
  children: React.ReactNode
}

const ShowcaseSection = ({ title, description, children }: ShowcaseSectionProps) => (
  <div className="space-y-base">
    <div>
      <Heading level={3}>{title}</Heading>
      {description && <p className="text-sm text-foreground-muted mt-xs">{description}</p>}
    </div>
    <div className="bg-surface dark:bg-surface p-lg rounded-lg border border-border dark:border-border-muted">
      {children}
    </div>
  </div>
)

const DesignSystemShowcase = () => {
  const [searchValue, setSearchValue] = useState('')
  const [selectValue, setSelectValue] = useState('option1')
  const [toggleValue, setToggleValue] = useState<string>('grid')
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false)

  return (
    <div className="min-h-screen bg-surface-muted bg-surface">
      <Container size="full" className="py-lg">
        <div className="max-w-6xl mx-auto space-y-lg">
          {/* Header */}
          <div className="text-center space-y-base">
            <Heading level={1} size="4xl">
              Design System Components
            </Heading>
            <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
              A complete overview of all available components, showcasing consistent design patterns
              and interaction states across the system.
            </p>
            <div className="flex justify-center">
              <ThemeSwitcher />
            </div>
          </div>

          {/* Actions Section */}
          <ShowcaseSection
            title="Actions"
            description="Interactive elements that trigger actions or navigate users"
          >
            <Stack direction="vertical" gap="lg">
              <div>
                <Heading level={4} color="muted" className="mb-md">
                  Buttons
                </Heading>
                <Stack direction="horizontal" gap="md">
                  <Button variant="primary">Primary Button</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button size="sm">Small</Button>
                  <Button size="lg">Large</Button>
                  <Button disabled>Disabled</Button>
                </Stack>
              </div>

              <div>
                <Heading level={4} color="muted" className="mb-md">
                  Links & Toggle Groups
                </Heading>
                <Stack direction="vertical" gap="md">
                  <Stack direction="horizontal" gap="md">
                    <Link href="#">Default Link</Link>
                    <Link href="#">Muted Link</Link>
                    <Link href="#" external>
                      External Link
                    </Link>
                  </Stack>
                  <ToggleGroup
                    value={toggleValue}
                    onChange={(value) => value && setToggleValue(value)}
                    options={toggleOptions}
                    aria-label="View mode toggle"
                  />
                </Stack>
              </div>
            </Stack>
          </ShowcaseSection>

          {/* Forms Section */}
          <ShowcaseSection
            title="Forms"
            description="Input components for collecting and selecting data"
          >
            <Grid cols={{ sm: 1, md: 2 }} gap="lg">
              <Stack direction="vertical" gap="md">
                <div>
                  <label className="block text-sm font-medium text-foreground-muted mb-sm">
                    Text Input
                  </label>
                  <Input placeholder="Enter text here..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground-muted mb-sm">
                    Search Input
                  </label>
                  <SearchInput
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search components..."
                  />
                </div>
              </Stack>
              <Stack direction="vertical" gap="md">
                <div>
                  <label className="block text-sm font-medium text-foreground-muted mb-sm">
                    Select Dropdown
                  </label>
                  <Select.Root value={selectValue} onValueChange={setSelectValue}>
                    <Select.Trigger>
                      <Select.Value placeholder="Select an option" />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value="option1">Option 1</Select.Item>
                      <Select.Item value="option2">Option 2</Select.Item>
                      <Select.Item value="option3">Option 3</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground-muted mb-sm">
                    Input States
                  </label>
                  <Stack direction="vertical" gap="sm">
                    <Input placeholder="Normal state" />
                    <Input placeholder="Error state" className="border-error" />
                    <Input placeholder="Disabled state" disabled />
                  </Stack>
                </div>
              </Stack>
            </Grid>
          </ShowcaseSection>

          {/* Feedback Section */}
          <ShowcaseSection
            title="Feedback"
            description="Components that provide status, progress, and state information"
          >
            <Grid cols={{ sm: 1, md: 2 }} gap="lg">
              <Stack direction="vertical" gap="md">
                <div>
                  <Heading level={4} color="muted" className="mb-md">
                    Badges
                  </Heading>
                  <Stack direction="horizontal" gap="sm" wrap>
                    <Badge variant="default">Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="error">Error</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                  </Stack>
                </div>
                <div>
                  <Heading level={4} color="muted" className="mb-md">
                    Loading States
                  </Heading>
                  <Stack direction="horizontal" gap="md" align="center">
                    <Spinner size="sm" />
                    <Spinner size="md" />
                    <Spinner size="lg" />
                  </Stack>
                </div>
              </Stack>
              <Stack direction="vertical" gap="md">
                <div>
                  <Heading level={4} color="muted" className="mb-md">
                    State Messages
                  </Heading>
                  <Stack direction="vertical" gap="sm">
                    <EmptyState title="No items found" icon="search" />
                    <ErrorState title="Something went wrong" />
                  </Stack>
                </div>
              </Stack>
            </Grid>
          </ShowcaseSection>

          {/* Data Display Section */}
          <ShowcaseSection
            title="Data Display"
            description="Components for presenting and organizing information"
          >
            <Stack direction="vertical" gap="lg">
              <Grid cols={{ sm: 1, md: 3 }} gap="base">
                <StatCard title="Total Users" value="1,234" label="Total Users" icon="users" />
                <StatCard title="Revenue" value="$45,678" label="Revenue" icon="chart" />
                <StatCard
                  title="Conversion Rate"
                  value="3.24%"
                  label="Conversion Rate"
                  icon="percentage"
                />
              </Grid>

              <Grid cols={{ sm: 1, lg: 2 }} gap="lg">
                <Card>
                  <CardHeader>
                    <Heading level={4} size="lg">
                      Sample Chart
                    </Heading>
                  </CardHeader>
                  <CardContent>
                    <BarChart data={sampleChartData} colorScheme="semantic" showValues />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Heading level={4} size="lg">
                      Data Table
                    </Heading>
                  </CardHeader>
                  <CardContent>
                    <DataTable data={sampleTableData} columns={sampleTableColumns} />
                  </CardContent>
                </Card>
              </Grid>
            </Stack>
          </ShowcaseSection>

          {/* Interactive Elements Section */}
          <ShowcaseSection
            title="Interactive Elements"
            description="Components with interactive behaviors and state management"
          >
            <Stack direction="vertical" gap="lg">
              <div>
                <Heading level={4} color="muted" className="mb-md">
                  Collapsible Content
                </Heading>
                <Collapsible open={isCollapsibleOpen} onOpenChange={setIsCollapsibleOpen}>
                  <CollapsibleTrigger>
                    <Button variant="outline" className="w-full justify-between">
                      Toggle Section
                      <Icon name={isCollapsibleOpen ? 'chevron-up' : 'chevron-down'} size="sm" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="p-base border border-t-0 border-border dark:border-border-muted rounded-b-lg">
                      <p className="text-sm text-foreground-muted">
                        This content can be collapsed and expanded. Perfect for FAQ sections,
                        detailed information, or space-saving layouts.
                      </p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              <div>
                <Heading level={4} color="muted" className="mb-md">
                  Tooltips
                </Heading>
                <Stack direction="horizontal" gap="md">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button variant="outline">Hover for tooltip</Button>
                      </TooltipTrigger>
                      <TooltipContent>This is a helpful tooltip</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="secondary">Badge with tooltip</Badge>
                      </TooltipTrigger>
                      <TooltipContent>Tooltips provide additional context</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Stack>
              </div>
            </Stack>
          </ShowcaseSection>

          {/* Footer */}
          <div className="text-center py-lg border-t border-border dark:border-border-muted">
            <p className="text-sm text-foreground-muted">
              Design System Component Showcase • Built with consistent patterns and semantic tokens
            </p>
          </div>
        </div>
      </Container>
    </div>
  )
}

export const AllComponents: Story = {
  render: () => <DesignSystemShowcase />,
  parameters: {
    layout: 'fullscreen',
  },
}
