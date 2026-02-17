import { Badge } from '../components/Badge.js'
import { Button } from '../components/Button.js'
import { Card, CardContent, CardHeader } from '../components/Card.js'
import { Container } from '../components/Container.js'
import { Heading } from '../components/Heading.js'
import { Input } from '../components/Input.js'
import { Stack } from '../components/Stack.js'
import { StatCard } from '../components/StatCard.js'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { FC } from 'react'

const meta = {
  title: 'Foundation/Inverse Mode',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## Inverse Mode Architecture

The new inverse mode provides a CSS-based approach to creating inverted color contexts using a simple \`.inverse\` utility class.

### Key Features:
- **CSS Variable Swapping**: The \`.inverse\` class swaps CSS variables to create inverted contexts
- **Nesting Support**: Nested inverse contexts (inverse within inverse) swap back to normal
- **Component Agnostic**: Works with any component without requiring special props
- **Performance Optimized**: Uses CSS variables for efficient color switching

### Usage:
\`\`\`tsx
// Apply inverse to any container
<div className="inverse">
  <Card>Appears with inverted colors</Card>
  <Button>Also inverted</Button>
</div>

// Nested inverse swaps back
<div className="inverse">
  <Card>Inverted appearance</Card>
  <div className="inverse">
    <Card>Back to normal appearance</Card>
  </div>
</div>
\`\`\`

### Migration from inverted prop:
The old \`inverted\` prop on Card and other components has been removed. Replace it with the \`.inverse\` utility class:

\`\`\`tsx
// Old way (deprecated)
<Card inverted>Content</Card>

// New way
<Card className="inverse">Content</Card>
\`\`\`
        `,
      },
    },
  },
  decorators: [
    (Story: FC) => (
      <div className="min-h-screen bg-surface p-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const BasicInverse: Story = {
  name: 'Basic Inverse Context',
  render: () => (
    <Container>
      <Stack gap="lg">
        <section>
          <Heading level={2} className="mb-md">
            Normal Context
          </Heading>
          <div className="grid grid-cols-3 gap-md">
            <Card>
              <CardHeader>Normal Card</CardHeader>
              <CardContent>Standard appearance in current theme</CardContent>
            </Card>
            <Card variant="info">
              <CardHeader>Info Card</CardHeader>
              <CardContent>Blue-tinted info variant</CardContent>
            </Card>
            <Card variant="accent1">
              <CardHeader>Accent Card</CardHeader>
              <CardContent>Accent variant for categorization</CardContent>
            </Card>
          </div>
        </section>

        <section className="inverse p-lg rounded-md">
          <Heading level={2} className="mb-md">
            Inverse Context
          </Heading>
          <div className="grid grid-cols-3 gap-md">
            <Card>
              <CardHeader>Inverse Card</CardHeader>
              <CardContent>Inverted colors via CSS variables</CardContent>
            </Card>
            <Card variant="info">
              <CardHeader>Info Card</CardHeader>
              <CardContent>Info variant in inverse context</CardContent>
            </Card>
            <Card variant="accent1">
              <CardHeader>Accent Card</CardHeader>
              <CardContent>Accent in inverse context</CardContent>
            </Card>
          </div>
        </section>
      </Stack>
    </Container>
  ),
}

export const NestedInverse: Story = {
  name: 'Nested Inverse (Double Negative)',
  render: () => (
    <Container>
      <Stack gap="lg">
        <Card>
          <CardHeader>Level 0: Normal Context</CardHeader>
          <CardContent>
            <p className="mb-md">This is the base level with normal appearance.</p>

            <div className="inverse p-md rounded-md">
              <Card>
                <CardHeader>Level 1: First Inverse</CardHeader>
                <CardContent>
                  <p className="mb-md">This card has inverted colors.</p>

                  <div className="inverse p-md rounded-md">
                    <Card>
                      <CardHeader>Level 2: Double Inverse</CardHeader>
                      <CardContent>
                        <p>Nested inverse swaps back to normal appearance!</p>
                        <p className="text-sm text-foreground-muted mt-sm">
                          This demonstrates that inverse contexts can be nested, with each level
                          toggling the color scheme.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  ),
}

export const ComponentsInInverse: Story = {
  name: 'All Components in Inverse',
  render: () => (
    <Container>
      <div className="grid grid-cols-2 gap-lg">
        <div>
          <Heading level={3} className="mb-md">
            Normal Context
          </Heading>
          <Stack gap="md">
            <div className="flex gap-sm">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
            </div>

            <div className="flex gap-sm flex-wrap">
              <Badge>Default</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="emphasis-info">Emphasis</Badge>
            </div>

            <Input placeholder="Normal input field" />

            <StatCard label="Revenue" value="$12,345" trend="+15%" icon="chart" />
          </Stack>
        </div>

        <div className="inverse p-lg rounded-md">
          <Heading level={3} className="mb-md">
            Inverse Context
          </Heading>
          <Stack gap="md">
            <div className="flex gap-sm">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
            </div>

            <div className="flex gap-sm flex-wrap">
              <Badge>Default</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="emphasis-info">Emphasis</Badge>
            </div>

            <Input placeholder="Inverse input field" />

            <StatCard label="Revenue" value="$12,345" trend="+15%" icon="chart" />
          </Stack>
        </div>
      </div>
    </Container>
  ),
}

export const DashboardExample: Story = {
  name: 'Dashboard with Inverse Sidebar',
  render: () => (
    <div className="flex min-h-[600px]">
      <aside className="inverse w-64 p-lg">
        <Heading level={3} className="mb-lg">
          Dashboard
        </Heading>
        <Stack gap="sm">
          <Button variant="ghost" className="w-full justify-start">
            Overview
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Analytics
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Reports
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Settings
          </Button>
        </Stack>

        <Card className="mt-lg">
          <CardHeader>Quick Stats</CardHeader>
          <CardContent>
            <Stack gap="xs">
              <div className="flex justify-between">
                <span className="text-sm">Active Users</span>
                <span className="font-semibold">1,234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Revenue</span>
                <span className="font-semibold">$45.6k</span>
              </div>
            </Stack>
          </CardContent>
        </Card>
      </aside>

      <main className="flex-1 p-lg">
        <Heading level={2} className="mb-lg">
          Overview
        </Heading>

        <div className="grid grid-cols-3 gap-md mb-lg">
          <StatCard label="Total Revenue" value="$125,430" trend="+12%" />
          <StatCard label="Active Users" value="8,234" trend="+5%" />
          <StatCard label="Conversion Rate" value="3.42%" trend="-0.2%" trendVariant="negative" />
        </div>

        <Card>
          <CardHeader>Recent Activity</CardHeader>
          <CardContent>
            <Stack gap="sm">
              <div className="flex items-center justify-between p-sm hover:bg-surface-subtle rounded">
                <div>
                  <div className="font-medium">New user registration</div>
                  <div className="text-sm text-foreground-muted">user@example.com joined</div>
                </div>
                <Badge variant="success">New</Badge>
              </div>
              <div className="flex items-center justify-between p-sm hover:bg-surface-subtle rounded">
                <div>
                  <div className="font-medium">Payment received</div>
                  <div className="text-sm text-foreground-muted">$450 from Acme Corp</div>
                </div>
                <Badge variant="info">Payment</Badge>
              </div>
            </Stack>
          </CardContent>
        </Card>
      </main>
    </div>
  ),
}

export const TokenSwapping: Story = {
  name: 'Token Swapping Demonstration',
  render: () => (
    <Container>
      <Stack gap="lg">
        <Card>
          <CardHeader>CSS Variable Token Swapping</CardHeader>
          <CardContent>
            <p className="mb-md">
              The inverse mode works by swapping CSS variable values. Here's how tokens map in each
              context:
            </p>

            <div className="grid grid-cols-2 gap-md">
              <div>
                <h4 className="font-semibold mb-sm">Normal Mode</h4>
                <div className="space-y-xs text-sm font-mono">
                  <div>--token-surface → light background</div>
                  <div>--token-foreground → dark text</div>
                  <div>--token-border → medium border</div>
                </div>
              </div>

              <div className="inverse p-md rounded">
                <h4 className="font-semibold mb-sm">Inverse Mode</h4>
                <div className="space-y-xs text-sm font-mono">
                  <div>--token-surface → dark background</div>
                  <div>--token-foreground → light text</div>
                  <div>--token-border → lighter border</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-md">
          <div className="p-md border-line rounded">
            <div className="bg-surface text-foreground p-sm rounded mb-xs">surface</div>
            <div className="bg-surface-muted text-foreground-muted p-sm rounded mb-xs">
              surface-muted
            </div>
            <div className="bg-surface-subtle p-sm rounded">surface-subtle</div>
          </div>

          <div className="inverse p-md border-line rounded">
            <div className="bg-surface text-foreground p-sm rounded mb-xs">surface (inverse)</div>
            <div className="bg-surface-muted text-foreground-muted p-sm rounded mb-xs">
              surface-muted
            </div>
            <div className="bg-surface-subtle p-sm rounded">surface-subtle</div>
          </div>

          <div className="inverse p-md border-line rounded">
            <div className="inverse p-sm">
              <div className="bg-surface text-foreground p-sm rounded mb-xs">double inverse</div>
              <div className="text-sm text-foreground-muted">Back to normal!</div>
            </div>
          </div>
        </div>
      </Stack>
    </Container>
  ),
}
