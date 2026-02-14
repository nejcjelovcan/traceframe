import { Button } from './Button'
import { Grid } from './Grid'
import { Heading } from './Heading'
import { Stack } from './Stack'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A versatile button component with multiple variants and sizes.

**Tier:** 1 (Tailwind + CVA)

**Usage:** Use for primary actions, form submissions, navigation triggers, and interactive controls. Choose variant based on action importance and context.

**Accessibility:**
- Uses semantic \`<button>\` element
- Supports keyboard navigation (Enter/Space to activate)
- Maintains visible focus state for keyboard users
- Icon-only buttons include sr-only text for screen readers
- Disabled state removes from tab order and indicates non-interactive state
- Loading state includes aria-busy attribute for screen readers
        `.trim(),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      description: 'Visual style variant indicating action importance',
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
      table: {
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      description: 'Size preset affecting height, padding, and font size',
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    leftIcon: {
      description: 'Icon name to display before button text',
      control: 'select',
      options: [undefined, 'search', 'check', 'close', 'copy', 'arrow-left'],
    },
    rightIcon: {
      description: 'Icon name to display after button text',
      control: 'select',
      options: [undefined, 'arrow-right', 'chevron-right', 'chevron-down', 'external'],
    },
    iconOnly: {
      description: 'Render as square icon-only button (children become sr-only)',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    fullWidth: {
      description: 'Make button full width of container',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    loading: {
      description: 'Show loading spinner instead of children',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    loadingText: {
      description: 'Custom loading text (default: "Loading...")',
      control: 'text',
      table: {
        defaultValue: { summary: 'Loading...' },
      },
    },
    disabled: {
      description: 'Disable the button, preventing interaction',
      control: 'boolean',
    },
    children: {
      description: 'Button content (text label)',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
}

export const Loading: Story = {
  args: {
    loading: true,
    loadingText: 'Processing...',
    children: 'Submit',
  },
}

export const FullWidth: Story = {
  render: () => (
    <Stack className="w-96">
      <Button fullWidth>Full Width Button</Button>
    </Stack>
  ),
}

export const WithLeftIcon: Story = {
  args: {
    leftIcon: 'search',
    children: 'Search',
  },
}

export const WithRightIcon: Story = {
  args: {
    rightIcon: 'arrow-right',
    children: 'Next',
  },
}

export const WithBothIcons: Story = {
  args: {
    leftIcon: 'package',
    rightIcon: 'external',
    children: 'View Package',
  },
}

export const IconOnly: Story = {
  args: {
    leftIcon: 'close',
    iconOnly: true,
    'aria-label': 'Close',
    children: 'Close',
  },
}

export const IconOnlyVariants: Story = {
  render: () => (
    <Stack direction="horizontal" gap="sm">
      <Button leftIcon="close" iconOnly variant="primary" aria-label="Close">
        Close
      </Button>
      <Button leftIcon="copy" iconOnly variant="secondary" aria-label="Copy">
        Copy
      </Button>
      <Button leftIcon="search" iconOnly variant="outline" aria-label="Search">
        Search
      </Button>
      <Button leftIcon="info-circle" iconOnly variant="ghost" aria-label="Info">
        Info
      </Button>
      <Button leftIcon="close" iconOnly variant="destructive" aria-label="Delete">
        Delete
      </Button>
    </Stack>
  ),
}

export const IconOnlySizes: Story = {
  render: () => (
    <Stack direction="horizontal" gap="sm">
      <Button leftIcon="close" iconOnly size="sm" variant="outline" aria-label="Close">
        Close
      </Button>
      <Button leftIcon="close" iconOnly size="md" variant="outline" aria-label="Close">
        Close
      </Button>
      <Button leftIcon="close" iconOnly size="lg" variant="outline" aria-label="Close">
        Close
      </Button>
    </Stack>
  ),
}

export const IconsWithVariants: Story = {
  render: () => (
    <Stack gap="md">
      <Stack direction="horizontal" gap="sm">
        <Button variant="primary" leftIcon="check">
          Confirm
        </Button>
        <Button variant="secondary" leftIcon="copy">
          Copy
        </Button>
        <Button variant="outline" leftIcon="search">
          Search
        </Button>
        <Button variant="ghost" leftIcon="info-circle">
          Help
        </Button>
        <Button variant="destructive" leftIcon="close">
          Delete
        </Button>
      </Stack>
      <Stack direction="horizontal" gap="sm">
        <Button variant="primary" rightIcon="arrow-right">
          Continue
        </Button>
        <Button variant="outline" rightIcon="chevron-down">
          Options
        </Button>
        <Button variant="ghost" rightIcon="external">
          External Link
        </Button>
      </Stack>
    </Stack>
  ),
}

export const IconsWithSizes: Story = {
  render: () => (
    <Stack direction="horizontal" gap="sm">
      <Button size="sm" leftIcon="search">
        Small
      </Button>
      <Button size="md" leftIcon="search">
        Medium
      </Button>
      <Button size="lg" leftIcon="search">
        Large
      </Button>
    </Stack>
  ),
}

export const AsChild: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Using `asChild` to render as a different element (e.g., an `<a>` tag for external links). Button styles are merged onto the child element.',
      },
    },
  },
  render: () => (
    <Stack direction="horizontal" gap="sm">
      <Button asChild variant="outline" rightIcon="external">
        <a href="https://linear.app" target="_blank" rel="noopener noreferrer">
          View Issue
        </a>
      </Button>
      <Button asChild variant="primary" rightIcon="arrow-right">
        <a href="/dashboard">Go to Dashboard</a>
      </Button>
      <Button asChild variant="ghost">
        <a href="/settings">Settings</a>
      </Button>
    </Stack>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <Stack direction="vertical" gap="lg">
      {/* Variants × Sizes Matrix */}
      <section className="space-y-sm">
        <Heading level={3} size="sm" color="muted">
          All Variants × All Sizes
        </Heading>

        <Grid cols={6} gap="sm">
          <div />
          <div className="text-xs text-foreground-muted">Primary</div>
          <div className="text-xs text-foreground-muted">Secondary</div>
          <div className="text-xs text-foreground-muted">Outline</div>
          <div className="text-xs text-foreground-muted">Ghost</div>
          <div className="text-xs text-foreground-muted">Destructive</div>

          <div className="text-xs text-foreground-muted">Small</div>
          <Button variant="primary" size="sm">
            Button
          </Button>
          <Button variant="secondary" size="sm">
            Button
          </Button>
          <Button variant="outline" size="sm">
            Button
          </Button>
          <Button variant="ghost" size="sm">
            Button
          </Button>
          <Button variant="destructive" size="sm">
            Button
          </Button>

          <div className="text-xs text-foreground-muted">Medium</div>
          <Button variant="primary" size="md">
            Button
          </Button>
          <Button variant="secondary" size="md">
            Button
          </Button>
          <Button variant="outline" size="md">
            Button
          </Button>
          <Button variant="ghost" size="md">
            Button
          </Button>
          <Button variant="destructive" size="md">
            Button
          </Button>

          <div className="text-xs text-foreground-muted">Large</div>
          <Button variant="primary" size="lg">
            Button
          </Button>
          <Button variant="secondary" size="lg">
            Button
          </Button>
          <Button variant="outline" size="lg">
            Button
          </Button>
          <Button variant="ghost" size="lg">
            Button
          </Button>
          <Button variant="destructive" size="lg">
            Button
          </Button>
        </Grid>
      </section>

      {/* States */}
      <section className="space-y-sm">
        <Heading level={3} size="sm" color="muted">
          States
        </Heading>
        <Stack direction="horizontal" gap="sm">
          <Button>Default</Button>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
          <Button loading loadingText="Saving...">
            Custom Loading
          </Button>
        </Stack>
      </section>

      {/* Full Width */}
      <section className="space-y-sm">
        <Heading level={3} size="sm" color="muted">
          Full Width
        </Heading>
        <Stack direction="vertical" gap="sm" className="max-w-sm">
          <Button fullWidth>Full Width Button</Button>
          <Button fullWidth variant="outline">
            Full Width Outline
          </Button>
          <Button fullWidth leftIcon="check" rightIcon="arrow-right">
            With Icons
          </Button>
          <Button fullWidth loading>
            Full Width Loading
          </Button>
        </Stack>
      </section>
    </Stack>
  ),
}

export const Showcase: Story = {
  render: () => (
    <Stack gap="xl" className="p-lg">
      {/* Section 1: All Variants × All Sizes Grid */}
      <section className="space-y-base">
        <Heading level={2} size="lg">
          Variants × Sizes Matrix
        </Heading>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-sm font-medium text-foreground-muted p-sm" />
                <th className="text-center text-sm font-medium text-foreground-muted p-sm">
                  Small
                </th>
                <th className="text-center text-sm font-medium text-foreground-muted p-sm">
                  Medium
                </th>
                <th className="text-center text-sm font-medium text-foreground-muted p-sm">
                  Large
                </th>
              </tr>
            </thead>
            <tbody>
              {(['primary', 'secondary', 'outline', 'ghost', 'destructive'] as const).map(
                (variant) => (
                  <tr key={variant}>
                    <td className="text-sm font-medium text-foreground-muted capitalize p-sm">
                      {variant}
                    </td>
                    <td className="text-center p-sm">
                      <Button variant={variant} size="sm">
                        Button
                      </Button>
                    </td>
                    <td className="text-center p-sm">
                      <Button variant={variant} size="md">
                        Button
                      </Button>
                    </td>
                    <td className="text-center p-sm">
                      <Button variant={variant} size="lg">
                        Button
                      </Button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 2: States */}
      <section className="space-y-base">
        <Heading level={2} size="lg">
          States (hover, active, disabled, loading)
        </Heading>
        <Grid cols={5} gap="base">
          <Stack gap="sm">
            <p className="text-xs text-foreground-muted">Default</p>
            <Button>Default</Button>
          </Stack>
          <Stack gap="sm">
            <p className="text-xs text-foreground-muted">Hover (see on hover)</p>
            <Button>Hover Me</Button>
          </Stack>
          <Stack gap="sm">
            <p className="text-xs text-foreground-muted">Active (see on click)</p>
            <Button>Click Me</Button>
          </Stack>
          <Stack gap="sm">
            <p className="text-xs text-foreground-muted">Disabled</p>
            <Button disabled>Disabled</Button>
          </Stack>
          <Stack gap="sm">
            <p className="text-xs text-foreground-muted">Loading</p>
            <Button loading>Loading</Button>
          </Stack>
        </Grid>
        <Grid cols={5} gap="base">
          {(['primary', 'secondary', 'outline', 'ghost', 'destructive'] as const).map((variant) => (
            <Button key={variant} variant={variant} loading>
              {variant}
            </Button>
          ))}
        </Grid>
      </section>

      {/* Section 3: Icon Combinations */}
      <section className="space-y-base">
        <Heading level={2} size="lg">
          Icon Combinations
        </Heading>

        <Grid cols={3} gap="base">
          <Stack gap="sm">
            <p className="text-xs text-foreground-muted">Left Icon</p>
            <Stack gap="sm">
              <Button leftIcon="search">Search</Button>
              <Button leftIcon="check" variant="secondary">
                Confirm
              </Button>
              <Button leftIcon="copy" variant="outline">
                Copy
              </Button>
            </Stack>
          </Stack>
          <Stack gap="sm">
            <p className="text-xs text-foreground-muted">Right Icon</p>
            <Stack gap="sm">
              <Button rightIcon="arrow-right">Continue</Button>
              <Button rightIcon="chevron-down" variant="secondary">
                Options
              </Button>
              <Button rightIcon="external" variant="outline">
                External
              </Button>
            </Stack>
          </Stack>
          <Stack gap="sm">
            <p className="text-xs text-foreground-muted">Both Icons</p>
            <Stack gap="sm">
              <Button leftIcon="package" rightIcon="external">
                View Package
              </Button>
              <Button leftIcon="file" rightIcon="chevron-right" variant="secondary">
                Open File
              </Button>
              <Button leftIcon="database" rightIcon="arrow-right" variant="outline">
                Export Data
              </Button>
            </Stack>
          </Stack>
        </Grid>
      </section>

      {/* Section 4: Special Modes */}
      <section className="space-y-base">
        <Heading level={2} size="lg">
          Special Modes
        </Heading>

        <Grid cols={3} gap="lg">
          <Stack gap="sm">
            <p className="text-xs text-foreground-muted">Icon Only</p>
            <Stack gap="sm">
              <Button iconOnly leftIcon="search" aria-label="Search">
                Search
              </Button>
              <Button iconOnly leftIcon="copy" variant="secondary" aria-label="Copy">
                Copy
              </Button>
              <Button iconOnly leftIcon="close" variant="outline" aria-label="Close">
                Close
              </Button>
              <Button iconOnly leftIcon="info-circle" variant="ghost" aria-label="Info">
                Info
              </Button>
              <Button iconOnly leftIcon="close" variant="destructive" aria-label="Delete">
                Delete
              </Button>
            </Stack>
          </Stack>
          <Stack gap="sm">
            <p className="text-xs text-foreground-muted">Full Width</p>
            <Stack gap="sm">
              <Button fullWidth>Full Width</Button>
              <Button fullWidth variant="outline">
                Full Outline
              </Button>
              <Button fullWidth loading>
                Full Loading
              </Button>
            </Stack>
          </Stack>
        </Grid>
      </section>
    </Stack>
  ),
}
