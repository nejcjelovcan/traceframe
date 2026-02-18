import { Button } from './Button'
import { Card, CardContent } from './Card'
import { ErrorState } from './ErrorState'
import { Flex } from './Flex'
import { Grid } from './Grid'
import { Heading } from './Heading'
import { Link } from './Link'
import { Icon } from '../icons/index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta<typeof ErrorState> = {
  title: 'Components/ErrorState',
  component: ErrorState,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A feedback component for displaying error states with optional retry action.

**Tier:** 1 (Tailwind + CVA)

**Usage:** Use when an operation fails (network error, server error, validation failure). Provides a clear error message with optional details and retry button to help users recover.

**Size Variants:**
- \`sm\`: Compact for inline/card contexts (py-8, lg icon, text-base title)
- \`md\` (default): Standard size (py-12, 2xl icon, text-lg title)
- \`lg\`: Prominent for full-page errors (py-16, 2xl icon, text-xl title)

**Icon Customization:**
- \`icon\`: Pass an IconName for type-safe icon selection (default: 'alert-circle')
- \`customIcon\`: Pass a ReactNode for complete icon customization

**Props Priority:**
- If both \`action\` and \`onRetry\` are provided, \`action\` takes precedence
- If both \`customIcon\` and \`icon\` are provided, \`customIcon\` takes precedence
- Use \`onRetry\` for simple retry scenarios
- Use \`action\` for custom actions (e.g., navigation links)

**Accessibility:**
- \`role="alert"\` for screen reader announcements
- Error icon includes \`aria-hidden\` (decorative)
- Title and error message are announced to screen readers
- Retry/action buttons are keyboard accessible
- Uses appropriate color contrast for error states
        `.trim(),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      description: 'Size variant affecting padding, icon size, and typography',
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    title: {
      description: 'Main heading text explaining what failed',
      control: 'text',
    },
    error: {
      description: 'Optional detailed error message or description',
      control: 'text',
    },
    icon: {
      description: 'Icon name from ui-library (defaults to alert-circle)',
      control: 'select',
      options: ['alert-circle', 'info-circle', 'search-off', 'close'],
      table: {
        defaultValue: { summary: 'alert-circle' },
      },
    },
    customIcon: {
      description: 'Custom icon element (takes precedence over icon prop)',
      control: false,
    },
    onRetry: {
      description: 'Callback for retry button. Shows default retry button when provided.',
    },
    retryLabel: {
      description: 'Custom label for the retry button',
      control: 'text',
      table: {
        defaultValue: { summary: 'Try again' },
      },
    },
    action: {
      description: 'Custom action element (takes precedence over onRetry)',
      control: false,
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Failed to load',
  },
}

export const WithErrorMessage: Story = {
  args: {
    title: 'Failed to load',
    error: 'Network connection lost. Please check your internet connection.',
  },
}

export const WithRetryButton: Story = {
  args: {
    title: 'Failed to load data',
    onRetry: () => alert('Retry clicked!'),
  },
}

export const WithAllProps: Story = {
  args: {
    title: 'Unable to load packages',
    error: 'The server returned an unexpected error (500). This might be a temporary issue.',
    onRetry: () => alert('Retry clicked!'),
    retryLabel: 'Try again',
  },
}

export const WithCustomRetryLabel: Story = {
  args: {
    title: 'Connection failed',
    error: 'Unable to reach the server',
    onRetry: () => alert('Reconnect clicked!'),
    retryLabel: 'Reconnect',
  },
}

// Size Variants
export const SizeSmall: Story = {
  args: {
    title: 'Failed to load',
    error: 'Network error occurred',
    size: 'sm',
    onRetry: () => alert('Retry clicked!'),
  },
}

export const SizeMedium: Story = {
  args: {
    title: 'Failed to load',
    error: 'Network error occurred',
    size: 'md',
    onRetry: () => alert('Retry clicked!'),
  },
}

export const SizeLarge: Story = {
  args: {
    title: 'Failed to load',
    error: 'Network error occurred',
    size: 'lg',
    onRetry: () => alert('Retry clicked!'),
  },
}

export const AllSizes: Story = {
  render: () => (
    <Flex gap="lg">
      <div className="border-b pb-base">
        <Heading level={4} color="muted" className="mb-base">
          Small (sm)
        </Heading>
        <ErrorState
          size="sm"
          title="Failed to load"
          error="Network error"
          onRetry={() => alert('Retry clicked!')}
        />
      </div>

      <div className="border-b pb-base">
        <Heading level={4} color="muted" className="mb-base">
          Medium (md) - Default
        </Heading>
        <ErrorState
          size="md"
          title="Failed to load"
          error="Network error"
          onRetry={() => alert('Retry clicked!')}
        />
      </div>

      <div>
        <Heading level={4} color="muted" className="mb-base">
          Large (lg)
        </Heading>
        <ErrorState
          size="lg"
          title="Failed to load"
          error="Network error"
          onRetry={() => alert('Retry clicked!')}
        />
      </div>
    </Flex>
  ),
}

// Icon Customization
export const WithCustomIconName: Story = {
  args: {
    title: 'No results found',
    error: 'Try adjusting your search criteria',
    icon: 'search-off',
  },
}

export const WithCustomIconElement: Story = {
  args: {
    title: 'Custom error display',
    error: 'Using a custom icon element',
    customIcon: (
      <div className="flex h-size-lg w-size-lg items-center justify-center rounded-full bg-status-error-muted">
        <Icon name="close" size="lg" className="text-status-error-foreground" />
      </div>
    ),
  },
}

export const IconCustomization: Story = {
  render: () => (
    <Flex gap="lg">
      <div className="border-b pb-base">
        <Heading level={4} color="muted" className="mb-base">
          Default icon (alert-circle)
        </Heading>
        <ErrorState title="Default error" error="Using default alert-circle icon" />
      </div>

      <div className="border-b pb-base">
        <Heading level={4} color="muted" className="mb-base">
          Custom icon name (info-circle)
        </Heading>
        <ErrorState title="Information error" error="Using info-circle icon" icon="info-circle" />
      </div>

      <div className="border-b pb-base">
        <Heading level={4} color="muted" className="mb-base">
          Custom icon name (search-off)
        </Heading>
        <ErrorState title="Search failed" error="Using search-off icon" icon="search-off" />
      </div>

      <div>
        <Heading level={4} color="muted" className="mb-base">
          Custom icon element
        </Heading>
        <ErrorState
          title="Custom styled icon"
          error="Using customIcon prop with styled wrapper"
          customIcon={
            <div className="flex h-size-lg w-size-lg items-center justify-center rounded-full bg-status-error-muted">
              <Icon name="alert-circle" size="lg" className="text-status-error-foreground" />
            </div>
          }
        />
      </div>
    </Flex>
  ),
}

export const InCard: Story = {
  render: () => (
    <Card className="w-96">
      <CardContent>
        <ErrorState
          size="sm"
          title="Parse error"
          error="Failed to parse the configuration file"
          onRetry={() => alert('Retry clicked!')}
        />
      </CardContent>
    </Card>
  ),
}

export const WithCustomAction: Story = {
  args: {
    title: 'Package not found',
    error: 'The requested package does not exist',
    action: <Link href="/packages">View all packages</Link>,
  },
}

export const WithButtonAction: Story = {
  args: {
    title: 'Access denied',
    error: 'You do not have permission to view this resource',
    action: (
      <Button variant="secondary" size="sm" onClick={() => alert('Go back clicked!')}>
        Go back
      </Button>
    ),
  },
}

export const ActionVsOnRetry: Story = {
  render: () => (
    <Flex gap="lg">
      <div className="border-b pb-base">
        <Heading level={4} color="muted" className="mb-base">
          With onRetry (default button)
        </Heading>
        <ErrorState
          title="Failed to load"
          error="Network error"
          onRetry={() => alert('Retry clicked!')}
        />
      </div>

      <div className="border-b pb-base">
        <Heading level={4} color="muted" className="mb-base">
          With custom action
        </Heading>
        <ErrorState
          title="Package not found"
          error="The package does not exist"
          action={<Link href="/packages">View all packages</Link>}
        />
      </div>

      <div>
        <Heading level={4} color="muted" className="mb-base">
          Both provided (action takes precedence)
        </Heading>
        <ErrorState
          title="Resource unavailable"
          error="This demonstrates that action takes precedence over onRetry"
          onRetry={() => alert('This will not be shown!')}
          action={
            <Button variant="secondary" size="sm" onClick={() => alert('Custom action!')}>
              Custom action wins
            </Button>
          }
        />
      </div>
    </Flex>
  ),
}

// Comprehensive Showcase
export const Showcase: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <Flex gap="xl">
      {/* Size Variants */}
      <section>
        <Heading level={2} className="mb-lg">
          Size Variants
        </Heading>
        <Grid cols={{ sm: 1, lg: 3 }} gap="base">
          <Card>
            <CardContent>
              <div className="mb-sm text-xs font-medium text-foreground-muted">Small (sm)</div>
              <ErrorState
                size="sm"
                title="Failed to load"
                error="Network error"
                onRetry={() => {}}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="mb-sm text-xs font-medium text-foreground-muted">Medium (md)</div>
              <ErrorState
                size="md"
                title="Failed to load"
                error="Network error"
                onRetry={() => {}}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="mb-sm text-xs font-medium text-foreground-muted">Large (lg)</div>
              <ErrorState
                size="lg"
                title="Failed to load"
                error="Network error"
                onRetry={() => {}}
              />
            </CardContent>
          </Card>
        </Grid>
      </section>

      {/* Icon Customization */}
      <section>
        <Heading level={2} className="mb-lg">
          Icon Customization
        </Heading>
        <Grid cols={{ sm: 1, md: 2, lg: 4 }} gap="base">
          <Card>
            <CardContent>
              <div className="mb-sm text-xs font-medium text-foreground-muted">
                Default (alert-circle)
              </div>
              <ErrorState size="sm" title="Default icon" />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="mb-sm text-xs font-medium text-foreground-muted">info-circle</div>
              <ErrorState size="sm" title="Info icon" icon="info-circle" />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="mb-sm text-xs font-medium text-foreground-muted">search-off</div>
              <ErrorState size="sm" title="Search icon" icon="search-off" />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="mb-sm text-xs font-medium text-foreground-muted">Custom element</div>
              <ErrorState
                size="sm"
                title="Custom icon"
                customIcon={
                  <div className="flex h-size-sm w-size-sm items-center justify-center rounded-full bg-status-error-muted">
                    <Icon name="close" size="sm" className="text-status-error-foreground" />
                  </div>
                }
              />
            </CardContent>
          </Card>
        </Grid>
      </section>

      {/* Content Variations */}
      <section>
        <Heading level={2} className="mb-lg">
          Content Variations
        </Heading>
        <Grid cols={{ sm: 1, md: 2 }} gap="base">
          <Card>
            <CardContent>
              <div className="mb-sm text-xs font-medium text-foreground-muted">Title only</div>
              <ErrorState size="sm" title="An error occurred" />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="mb-sm text-xs font-medium text-foreground-muted">
                With error message
              </div>
              <ErrorState size="sm" title="Failed to load" error="Connection timed out" />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="mb-sm text-xs font-medium text-foreground-muted">
                With retry button
              </div>
              <ErrorState size="sm" title="Failed to load" onRetry={() => {}} />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="mb-sm text-xs font-medium text-foreground-muted">All content</div>
              <ErrorState
                size="sm"
                title="Failed to load"
                error="Network error occurred"
                onRetry={() => {}}
                retryLabel="Retry"
              />
            </CardContent>
          </Card>
        </Grid>
      </section>

      {/* Action Patterns */}
      <section>
        <Heading level={2} className="mb-lg">
          Action Patterns
        </Heading>
        <Grid cols={{ sm: 1, md: 3 }} gap="base">
          <Card>
            <CardContent>
              <div className="mb-sm text-xs font-medium text-foreground-muted">
                onRetry callback
              </div>
              <ErrorState size="sm" title="Retryable error" onRetry={() => {}} />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="mb-sm text-xs font-medium text-foreground-muted">Link action</div>
              <ErrorState size="sm" title="Not found" action={<Link href="/">Go home</Link>} />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="mb-sm text-xs font-medium text-foreground-muted">Button action</div>
              <ErrorState
                size="sm"
                title="Access denied"
                action={
                  <Button variant="secondary" size="sm" onClick={() => {}}>
                    Go back
                  </Button>
                }
              />
            </CardContent>
          </Card>
        </Grid>
      </section>

      {/* Common Error Scenarios */}
      <section>
        <Heading level={2} className="mb-lg">
          Common Scenarios
        </Heading>
        <Grid cols={{ sm: 1, md: 2 }} gap="base">
          <Card>
            <CardContent>
              <div className="mb-sm text-xs font-medium text-foreground-muted">Network Error</div>
              <ErrorState
                size="sm"
                title="Network error"
                error="Unable to connect to server"
                onRetry={() => {}}
                retryLabel="Retry connection"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="mb-sm text-xs font-medium text-foreground-muted">Auth Error</div>
              <ErrorState
                size="sm"
                title="Session expired"
                error="Please log in again"
                action={
                  <Button variant="secondary" size="sm" onClick={() => {}}>
                    Log in
                  </Button>
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="mb-sm text-xs font-medium text-foreground-muted">Not Found</div>
              <ErrorState
                size="sm"
                title="Resource not found"
                error="The page you're looking for doesn't exist"
                icon="search-off"
                action={<Link href="/">Go home</Link>}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="mb-sm text-xs font-medium text-foreground-muted">Server Error</div>
              <ErrorState
                size="sm"
                title="Server error"
                error="Internal server error (500)"
                onRetry={() => {}}
              />
            </CardContent>
          </Card>
        </Grid>
      </section>

      {/* In Context */}
      <section>
        <Heading level={2} className="mb-lg">
          In Context
        </Heading>
        <Grid cols={{ sm: 1, lg: 2 }} gap="base">
          <Card className="h-64">
            <CardContent className="flex h-full items-center justify-center">
              <ErrorState
                title="Failed to load components"
                error="Unable to fetch component data"
                onRetry={() => {}}
              />
            </CardContent>
          </Card>

          <Card className="h-64">
            <CardContent className="flex h-full items-center justify-center">
              <ErrorState
                size="lg"
                title="Page not found"
                error="The requested page could not be found"
                icon="search-off"
                action={<Link href="/">Return to dashboard</Link>}
              />
            </CardContent>
          </Card>
        </Grid>
      </section>
    </Flex>
  ),
}
