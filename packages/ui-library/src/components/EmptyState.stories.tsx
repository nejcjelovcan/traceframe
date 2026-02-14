import { Button } from './Button.js'
import { Card, CardContent } from './Card.js'
import { EmptyState } from './EmptyState.js'
import { Grid } from './Grid.js'
import { Heading } from './Heading.js'
import { Stack } from './Stack.js'
import { Icon } from '../icons/index.js'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A feedback component for displaying empty data states with optional call-to-action.

**Tier:** 1 (Tailwind + CVA)

**Usage:** Use when a list, table, or content area has no data to display. Provides a friendly message with optional icon, description, and action button to guide users on next steps.

**Common Patterns:**
- Search results with no matches
- Empty data tables
- First-time user states (no content yet)
- Filtered lists with no results

**Accessibility:**
- Uses semantic heading for title
- Icon is decorative (aria-hidden) when present
- Action buttons should have clear, descriptive labels
        `.trim(),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      description: 'Main heading text explaining the empty state',
      control: 'text',
    },
    description: {
      description: 'Optional supporting text with additional context or guidance',
      control: 'text',
    },
    size: {
      description: 'Size variant controlling padding, icon size, and typography scale',
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    icon: {
      description: 'Icon name from ui-library (type-safe)',
      control: 'select',
      options: [
        undefined,
        'search',
        'search-off',
        'package',
        'file',
        'file-search',
        'database',
        'users',
        'empty',
        'alert-circle',
        'info-circle',
      ],
    },
    customIcon: {
      description: 'Custom icon element (use when IconName does not suffice)',
      control: false,
    },
    action: {
      description: 'Optional action element (button or link) for user to take action',
      control: false,
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'No results found',
  },
}

export const WithDescription: Story = {
  args: {
    title: 'No results found',
    description: 'Try adjusting your search terms or filters',
  },
}

export const WithIcon: Story = {
  args: {
    title: 'No results found',
    icon: 'search',
  },
}

export const WithCustomIcon: Story = {
  args: {
    title: 'No results found',
    customIcon: <Icon name="search" size="2xl" />,
  },
}

export const WithAction: Story = {
  args: {
    title: 'No scan results',
    description: 'Run a scan to analyze your codebase',
    action: <Button size="sm">Run Scan</Button>,
  },
}

export const AllProps: Story = {
  args: {
    title: 'No packages found',
    description: 'Try adjusting your search terms or clearing filters',
    icon: 'package',
    action: <Button size="sm">Clear Filters</Button>,
  },
}

export const SizeSmall: Story = {
  args: {
    title: 'No results',
    description: 'Compact empty state for tight spaces',
    icon: 'search',
    size: 'sm',
  },
}

export const SizeMedium: Story = {
  args: {
    title: 'No results',
    description: 'Default size empty state',
    icon: 'search',
    size: 'md',
  },
}

export const SizeLarge: Story = {
  args: {
    title: 'No results',
    description: 'Large empty state for prominent placement',
    icon: 'search',
    size: 'lg',
  },
}

export const InCard: Story = {
  render: () => (
    <Card className="w-96">
      <CardContent>
        <EmptyState title="No data available" description="This table is empty" icon="search" />
      </CardContent>
    </Card>
  ),
}

export const Showcase: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <Stack gap="xl" className="max-w-4xl">
      {/* Size Variants */}
      <section>
        <Heading level={2} size="lg" className="mb-base">
          Size Variants
        </Heading>
        <Grid cols={3} gap="base">
          <Card>
            <CardContent>
              <EmptyState size="sm" title="Small" description="Compact size" icon="search" />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <EmptyState
                size="md"
                title="Medium (default)"
                description="Standard size"
                icon="search"
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <EmptyState size="lg" title="Large" description="Prominent size" icon="search" />
            </CardContent>
          </Card>
        </Grid>
      </section>

      {/* Icon Usage */}
      <section>
        <Heading level={2} size="lg" className="mb-base">
          Icon Usage
        </Heading>
        <Grid cols={2} gap="base">
          <Card>
            <CardContent>
              <EmptyState
                title="Type-safe icon"
                description="Using icon prop with IconName"
                icon="package"
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <EmptyState
                title="Custom icon"
                description="Using customIcon for ReactNode"
                customIcon={
                  <div className="text-4xl">
                    <span role="img" aria-hidden="true">
                      🔍
                    </span>
                  </div>
                }
              />
            </CardContent>
          </Card>
        </Grid>
      </section>

      {/* Content Variations */}
      <section>
        <Heading level={2} size="lg" className="mb-base">
          Content Variations
        </Heading>
        <Grid cols={2} gap="base">
          <Card>
            <CardContent>
              <EmptyState title="Title only" />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <EmptyState title="With description" description="Supporting text provides context" />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <EmptyState
                title="With action"
                action={
                  <Button size="sm" variant="outline">
                    Take Action
                  </Button>
                }
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <EmptyState
                title="Full example"
                description="All elements combined"
                icon="file-search"
                action={<Button size="sm">Get Started</Button>}
              />
            </CardContent>
          </Card>
        </Grid>
      </section>

      {/* Common Use Cases */}
      <section>
        <Heading level={2} size="lg" className="mb-base">
          Common Use Cases
        </Heading>
        <Grid cols={3} gap="base">
          <Card>
            <CardContent>
              <EmptyState
                title="No search results"
                description="Try different keywords or clear filters"
                icon="search-off"
                action={
                  <Button size="sm" variant="outline">
                    Clear Search
                  </Button>
                }
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <EmptyState
                title="No packages yet"
                description="Scan a codebase to discover packages"
                icon="package"
                action={<Button size="sm">Run Scan</Button>}
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <EmptyState
                title="Welcome!"
                description="Get started by creating your first project"
                icon="file"
                action={<Button size="sm">Create Project</Button>}
              />
            </CardContent>
          </Card>
        </Grid>
      </section>

      {/* In Card Context */}
      <section>
        <Heading level={2} size="lg" className="mb-base">
          In Card Context
        </Heading>
        <Grid cols={2} gap="base">
          <Card>
            <CardContent className="p-0">
              <div className="p-base border-b border-border">
                <Heading level={3}>Dependencies</Heading>
              </div>
              <EmptyState
                size="sm"
                title="No dependencies"
                description="This package has no dependencies"
                icon="empty"
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-0">
              <div className="p-base border-b border-border">
                <Heading level={3}>Recent Activity</Heading>
              </div>
              <EmptyState
                size="sm"
                title="No activity"
                description="Check back later for updates"
                icon="database"
              />
            </CardContent>
          </Card>
        </Grid>
      </section>
    </Stack>
  ),
}
