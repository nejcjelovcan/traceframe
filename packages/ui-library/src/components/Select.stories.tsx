import * as React from 'react'

import { Heading } from './Heading'
import { Select } from './Select'
import { Stack } from './Stack'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta<typeof Select.Trigger> = {
  title: 'Components/Select',
  component: Select.Trigger,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Accessible dropdown select component with keyboard navigation.

**Tier:** 2 (Radix UI Primitive)

**Radix Handles:**
- WAI-ARIA listbox pattern
- Full keyboard navigation (Arrow keys, Enter, Escape, Type-ahead)
- Focus management and trapping
- Screen reader announcements
- Touch device support
- Scroll buttons for long lists

**Compound Components:**
- \`Select.Root\` - State management (controlled/uncontrolled)
- \`Select.Trigger\` - Button that opens the dropdown
- \`Select.Value\` - Displays selected value or placeholder
- \`Select.Content\` - Dropdown container
- \`Select.Item\` - Individual option
- \`Select.Group\` - Group options with label
- \`Select.Label\` - Group label
- \`Select.Separator\` - Visual divider

**Usage:**
\`\`\`tsx
<Select.Root>
  <Select.Trigger aria-label="Select option">
    <Select.Value placeholder="Choose..." />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="a">Option A</Select.Item>
    <Select.Item value="b">Option B</Select.Item>
  </Select.Content>
</Select.Root>
\`\`\`

**Accessibility:**
- Full keyboard navigation (Arrow keys, Home/End, Page Up/Down)
- Type-ahead search (type to jump to matching option)
- Screen reader announces selection changes
- Focus trapped in dropdown when open
        `.trim(),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      description: 'Visual variant affecting colors and style',
      control: 'select',
      options: ['default', 'secondary', 'error', 'success', 'ghost'],
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      description: 'Size preset affecting height and padding',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    density: {
      description: 'Density preset affecting padding',
      control: 'select',
      options: ['compact', 'comfortable', 'spacious'],
      table: {
        defaultValue: { summary: 'comfortable' },
      },
    },
    width: {
      description: 'Width behavior (auto, full container width, or fit content)',
      control: 'select',
      options: ['auto', 'full', 'fit'],
      table: {
        defaultValue: { summary: 'auto' },
      },
    },
    leftIcon: {
      description: 'Icon to display on the left side of the trigger',
      control: 'text',
    },
    rightIcon: {
      description: 'Icon to display on the right side of the trigger (defaults to chevron-down)',
      control: 'text',
    },
    disabled: {
      description: 'Disable the select trigger',
      control: 'boolean',
    },
    children: {
      description: 'Trigger content (typically Select.Value)',
    },
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-64 items-start justify-center p-xl">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Select.Root>
      <Select.Trigger aria-label="Select option" {...args}>
        <Select.Value placeholder="Select an option..." />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="option1">Option 1</Select.Item>
        <Select.Item value="option2">Option 2</Select.Item>
        <Select.Item value="option3">Option 3</Select.Item>
      </Select.Content>
    </Select.Root>
  ),
}

export const Sizes: Story = {
  render: () => (
    <Stack gap="md" align="start">
      <Stack direction="horizontal" align="center" gap="base">
        <span className="w-size-lg text-sm text-foreground-muted">sm</span>
        <Select.Root>
          <Select.Trigger size="sm" aria-label="Small select">
            <Select.Value placeholder="Small" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="1">Option 1</Select.Item>
            <Select.Item value="2">Option 2</Select.Item>
          </Select.Content>
        </Select.Root>
      </Stack>

      <Stack direction="horizontal" align="center" gap="base">
        <span className="w-size-lg text-sm text-foreground-muted">md</span>
        <Select.Root>
          <Select.Trigger size="md" aria-label="Medium select">
            <Select.Value placeholder="Medium (default)" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="1">Option 1</Select.Item>
            <Select.Item value="2">Option 2</Select.Item>
          </Select.Content>
        </Select.Root>
      </Stack>

      <Stack direction="horizontal" align="center" gap="base">
        <span className="w-size-lg text-sm text-foreground-muted">lg</span>
        <Select.Root>
          <Select.Trigger size="lg" aria-label="Large select">
            <Select.Value placeholder="Large" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="1">Option 1</Select.Item>
            <Select.Item value="2">Option 2</Select.Item>
          </Select.Content>
        </Select.Root>
      </Stack>
    </Stack>
  ),
}

export const FullWidth: Story = {
  decorators: [
    (Story) => (
      <div className="w-80 p-lg">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <Select.Root>
      <Select.Trigger width="full" aria-label="Full width select">
        <Select.Value placeholder="Full width select..." />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="option1">Option 1</Select.Item>
        <Select.Item value="option2">Option 2</Select.Item>
        <Select.Item value="option3">Option 3</Select.Item>
      </Select.Content>
    </Select.Root>
  ),
}

export const WithDisabledItems: Story = {
  render: () => (
    <Select.Root>
      <Select.Trigger aria-label="Select with disabled items">
        <Select.Value placeholder="Select a framework..." />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="react">React</Select.Item>
        <Select.Item value="vue" disabled>
          Vue (coming soon)
        </Select.Item>
        <Select.Item value="angular" disabled>
          Angular (coming soon)
        </Select.Item>
        <Select.Item value="svelte">Svelte</Select.Item>
      </Select.Content>
    </Select.Root>
  ),
}

export const DisabledSelect: Story = {
  render: () => (
    <Select.Root>
      <Select.Trigger disabled aria-label="Disabled select">
        <Select.Value placeholder="Disabled select..." />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="option1">Option 1</Select.Item>
      </Select.Content>
    </Select.Root>
  ),
}

export const ManyItems: Story = {
  render: () => (
    <Select.Root>
      <Select.Trigger aria-label="Select country">
        <Select.Value placeholder="Select a country..." />
      </Select.Trigger>
      <Select.Content>
        {[
          'Argentina',
          'Australia',
          'Austria',
          'Belgium',
          'Brazil',
          'Canada',
          'Chile',
          'China',
          'Colombia',
          'Czech Republic',
          'Denmark',
          'Finland',
          'France',
          'Germany',
          'Greece',
          'Hungary',
          'India',
          'Ireland',
          'Italy',
          'Japan',
          'Mexico',
          'Netherlands',
          'New Zealand',
          'Norway',
          'Poland',
          'Portugal',
          'Slovenia',
          'South Korea',
          'Spain',
          'Sweden',
          'Switzerland',
          'United Kingdom',
          'United States',
        ].map((country) => (
          <Select.Item key={country} value={country.toLowerCase().replace(/ /g, '-')}>
            {country}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  ),
}

export const WithGroups: Story = {
  render: () => (
    <Select.Root>
      <Select.Trigger aria-label="Select a package">
        <Select.Value placeholder="Select a package..." />
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
          <Select.Label>Radix UI</Select.Label>
          <Select.Item value="@radix-ui/react-tooltip">@radix-ui/react-tooltip</Select.Item>
          <Select.Item value="@radix-ui/react-select">@radix-ui/react-select</Select.Item>
          <Select.Item value="@radix-ui/react-dialog">@radix-ui/react-dialog</Select.Item>
        </Select.Group>
        <Select.Separator />
        <Select.Group>
          <Select.Label>Utilities</Select.Label>
          <Select.Item value="lodash">lodash</Select.Item>
          <Select.Item value="date-fns">date-fns</Select.Item>
          <Select.Item value="clsx">clsx</Select.Item>
        </Select.Group>
        <Select.Separator />
        <Select.Group>
          <Select.Label>React</Select.Label>
          <Select.Item value="react">react</Select.Item>
          <Select.Item value="react-dom">react-dom</Select.Item>
        </Select.Group>
      </Select.Content>
    </Select.Root>
  ),
}

export const WithPlaceholder: Story = {
  render: () => (
    <Stack gap="md">
      <Select.Root>
        <Select.Trigger aria-label="Filter by package">
          <Select.Value placeholder="Filter by package..." />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="all">All packages</Select.Item>
          <Select.Item value="react">react</Select.Item>
          <Select.Item value="lodash">lodash</Select.Item>
        </Select.Content>
      </Select.Root>

      <Select.Root defaultValue="all">
        <Select.Trigger aria-label="Filter by package (with default)">
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="all">All packages</Select.Item>
          <Select.Item value="react">react</Select.Item>
          <Select.Item value="lodash">lodash</Select.Item>
        </Select.Content>
      </Select.Root>
    </Stack>
  ),
}

export const Controlled: Story = {
  render: function ControlledSelect() {
    const [value, setValue] = React.useState('react')

    return (
      <Stack gap="md">
        <Select.Root value={value} onValueChange={setValue}>
          <Select.Trigger aria-label="Controlled select">
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="react">React</Select.Item>
            <Select.Item value="vue">Vue</Select.Item>
            <Select.Item value="svelte">Svelte</Select.Item>
          </Select.Content>
        </Select.Root>
        <p className="text-sm text-foreground-muted">Selected: {value}</p>
      </Stack>
    )
  },
}

export const LoadingState: Story = {
  render: () => (
    <Select.Root>
      <Select.Trigger aria-label="Loading select">
        <Select.Value placeholder="Select an option..." />
      </Select.Trigger>
      <Select.Content isLoading loadingText="Fetching options...">
        {/* Content is replaced with loading indicator */}
      </Select.Content>
    </Select.Root>
  ),
}

export const EmptyState: Story = {
  render: () => (
    <Stack direction="horizontal" gap="base">
      <Select.Root>
        <Select.Trigger aria-label="Empty select">
          <Select.Value placeholder="No results..." />
        </Select.Trigger>
        <Select.Content isEmpty emptyText="No options available">
          {/* Content is replaced with empty state */}
        </Select.Content>
      </Select.Root>

      <Select.Root>
        <Select.Trigger aria-label="Custom empty">
          <Select.Value placeholder="Search results..." />
        </Select.Trigger>
        <Select.Content isEmpty emptyIcon="search-off" emptyText="No matching results found">
          {/* Custom empty state */}
        </Select.Content>
      </Select.Root>
    </Stack>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <Stack gap="md">
      <Select.Root>
        <Select.Trigger leftIcon="package" aria-label="Package select">
          <Select.Value placeholder="Select a package..." />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="react" leftIcon="external">
            React
          </Select.Item>
          <Select.Item value="vue" leftIcon="code">
            Vue.js
          </Select.Item>
          <Select.Item value="angular" leftIcon="component">
            Angular
          </Select.Item>
          <Select.Item value="svelte" leftIcon="file-code">
            Svelte
          </Select.Item>
        </Select.Content>
      </Select.Root>

      <Select.Root>
        <Select.Trigger leftIcon="users" variant="secondary" aria-label="Team select">
          <Select.Value placeholder="Select team member..." />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="john" rightIcon="check">
            John Doe
          </Select.Item>
          <Select.Item value="jane" rightIcon="check">
            Jane Smith
          </Select.Item>
          <Select.Item value="bob">Bob Johnson</Select.Item>
        </Select.Content>
      </Select.Root>
    </Stack>
  ),
}

export const StatusValidation: Story = {
  render: () => (
    <Stack gap="md">
      <Stack gap="sm">
        <label className="text-sm font-medium text-foreground">Error State</label>
        <Select.Root>
          <Select.Trigger variant="error" leftIcon="alert-circle" aria-label="Error select">
            <Select.Value placeholder="Required field" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="option1" variant="error">
              Invalid Option 1
            </Select.Item>
            <Select.Item value="option2" variant="error">
              Invalid Option 2
            </Select.Item>
          </Select.Content>
        </Select.Root>
        <p className="text-xs text-status-error">Please select a valid option</p>
      </Stack>

      <Stack gap="sm">
        <label className="text-sm font-medium text-foreground">Success State</label>
        <Select.Root defaultValue="valid">
          <Select.Trigger variant="success" leftIcon="check" aria-label="Success select">
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="valid" variant="success" rightIcon="check">
              Valid Selection
            </Select.Item>
            <Select.Item value="option2" variant="success">
              Another Valid Option
            </Select.Item>
          </Select.Content>
        </Select.Root>
        <p className="text-xs text-status-success">Selection confirmed</p>
      </Stack>
    </Stack>
  ),
}

export const Showcase: Story = {
  render: () => (
    <Stack gap="lg">
      {/* Variants */}
      <Stack gap="md">
        <Heading level={3} size="sm">
          Variants
        </Heading>
        <Stack direction="horizontal" wrap align="start" gap="base">
          <Select.Root defaultValue="default">
            <Select.Trigger variant="default" aria-label="Default variant">
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="default">Default</Select.Item>
              <Select.Item value="option2">Option 2</Select.Item>
            </Select.Content>
          </Select.Root>

          <Select.Root defaultValue="secondary">
            <Select.Trigger variant="secondary" aria-label="Secondary variant">
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="secondary">Secondary</Select.Item>
              <Select.Item value="option2">Option 2</Select.Item>
            </Select.Content>
          </Select.Root>

          <Select.Root defaultValue="error">
            <Select.Trigger variant="error" aria-label="Error variant">
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="error" variant="error">
                Error
              </Select.Item>
              <Select.Item value="option2" variant="error">
                Option 2
              </Select.Item>
            </Select.Content>
          </Select.Root>

          <Select.Root defaultValue="success">
            <Select.Trigger variant="success" aria-label="Success variant">
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="success" variant="success">
                Success
              </Select.Item>
              <Select.Item value="option2" variant="success">
                Option 2
              </Select.Item>
            </Select.Content>
          </Select.Root>

          <Select.Root defaultValue="ghost">
            <Select.Trigger variant="ghost" aria-label="Ghost variant">
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="ghost">Ghost</Select.Item>
              <Select.Item value="option2">Option 2</Select.Item>
            </Select.Content>
          </Select.Root>
        </Stack>
      </Stack>

      {/* Sizes */}
      <Stack gap="md">
        <Heading level={3} size="sm">
          Sizes
        </Heading>
        <Stack direction="horizontal" align="center" gap="base">
          <Select.Root defaultValue="xs">
            <Select.Trigger size="xs" aria-label="Extra small">
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="xs">Extra Small</Select.Item>
            </Select.Content>
          </Select.Root>

          <Select.Root defaultValue="sm">
            <Select.Trigger size="sm" aria-label="Small">
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="sm">Small</Select.Item>
            </Select.Content>
          </Select.Root>

          <Select.Root defaultValue="md">
            <Select.Trigger size="md" aria-label="Medium">
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="md">Medium</Select.Item>
            </Select.Content>
          </Select.Root>

          <Select.Root defaultValue="lg">
            <Select.Trigger size="lg" aria-label="Large">
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="lg">Large</Select.Item>
            </Select.Content>
          </Select.Root>
        </Stack>
      </Stack>

      {/* With Icons */}
      <Stack gap="md">
        <Heading level={3} size="sm">
          With Icons
        </Heading>
        <Stack direction="horizontal" wrap align="start" gap="base">
          <Select.Root defaultValue="react">
            <Select.Trigger leftIcon="package" aria-label="With left icon">
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="react" leftIcon="external">
                React
              </Select.Item>
              <Select.Item value="vue" leftIcon="code">
                Vue
              </Select.Item>
              <Select.Item value="angular" leftIcon="component">
                Angular
              </Select.Item>
            </Select.Content>
          </Select.Root>

          <Select.Root defaultValue="filter">
            <Select.Trigger leftIcon="search" variant="secondary" aria-label="Filter select">
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="filter">All Results</Select.Item>
              <Select.Item value="recent">Recent</Select.Item>
              <Select.Item value="popular">Popular</Select.Item>
            </Select.Content>
          </Select.Root>

          <Select.Root>
            <Select.Trigger leftIcon="alert-circle" variant="error" aria-label="Error with icon">
              <Select.Value placeholder="Required field" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="option1">Option 1</Select.Item>
            </Select.Content>
          </Select.Root>
        </Stack>
      </Stack>

      {/* Density */}
      <Stack gap="md">
        <Heading level={3} size="sm">
          Density
        </Heading>
        <Stack direction="horizontal" wrap align="start" gap="base">
          <Select.Root defaultValue="compact">
            <Select.Trigger density="compact" aria-label="Compact density">
              <Select.Value />
            </Select.Trigger>
            <Select.Content density="compact">
              <Select.Item value="compact" density="compact">
                Compact
              </Select.Item>
              <Select.Item value="option2" density="compact">
                Option 2
              </Select.Item>
            </Select.Content>
          </Select.Root>

          <Select.Root defaultValue="comfortable">
            <Select.Trigger density="comfortable" aria-label="Comfortable density">
              <Select.Value />
            </Select.Trigger>
            <Select.Content density="comfortable">
              <Select.Item value="comfortable" density="comfortable">
                Comfortable
              </Select.Item>
              <Select.Item value="option2" density="comfortable">
                Option 2
              </Select.Item>
            </Select.Content>
          </Select.Root>

          <Select.Root defaultValue="spacious">
            <Select.Trigger density="spacious" aria-label="Spacious density">
              <Select.Value />
            </Select.Trigger>
            <Select.Content density="spacious">
              <Select.Item value="spacious" density="spacious">
                Spacious
              </Select.Item>
              <Select.Item value="option2" density="spacious">
                Option 2
              </Select.Item>
            </Select.Content>
          </Select.Root>
        </Stack>
      </Stack>

      {/* States */}
      <Stack gap="md">
        <Heading level={3} size="sm">
          States
        </Heading>
        <Stack direction="horizontal" wrap align="start" gap="base">
          <Select.Root>
            <Select.Trigger aria-label="Default state">
              <Select.Value placeholder="Default" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="1">Option 1</Select.Item>
            </Select.Content>
          </Select.Root>

          <Select.Root>
            <Select.Trigger disabled aria-label="Disabled state">
              <Select.Value placeholder="Disabled" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="1">Option 1</Select.Item>
            </Select.Content>
          </Select.Root>

          <Select.Root defaultValue="selected">
            <Select.Trigger aria-label="Selected state">
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="selected">Selected</Select.Item>
            </Select.Content>
          </Select.Root>
        </Stack>
      </Stack>
    </Stack>
  ),
}
