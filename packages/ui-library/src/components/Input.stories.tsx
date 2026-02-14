import { useState } from 'react'

import { Heading } from './Heading'
import { Input } from './Input'
import { Stack } from './Stack'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A styled text input component for forms with validation states, icons, and helper text support.

**Tier:** 1 (Tailwind + CVA)

**Usage:** Use for single-line text entry in forms. Supports leading/trailing icons, validation states (default, error, success), helper text, and automatic status icons. For dedicated search inputs, consider using SearchInput.

**Accessibility:**
- Uses semantic \`<input>\` element
- Always pair with a \`<label>\` element or \`aria-label\` attribute
- Error state uses \`aria-invalid\` and \`aria-describedby\` for screen reader announcements
- Visible focus state for keyboard navigation
- Disabled state removes from tab order
        `.trim(),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      description: 'Visual style variant for validation states',
      control: 'select',
      options: ['default', 'error', 'success'],
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      description: 'Size preset affecting height and padding',
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    type: {
      description: 'HTML input type attribute',
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
      table: {
        defaultValue: { summary: 'text' },
      },
    },
    disabled: {
      description: 'Disable the input, preventing interaction',
      control: 'boolean',
    },
    placeholder: {
      description: 'Placeholder text shown when input is empty',
      control: 'text',
    },
    leftIcon: {
      description: 'Icon name to display on the left side of the input',
      control: 'select',
      options: [undefined, 'search', 'package', 'file', 'code', 'alert-circle'],
    },
    rightIcon: {
      description: 'Icon name to display on the right side of the input',
      control: 'select',
      options: [undefined, 'check', 'close', 'arrow-right', 'external', 'info-circle'],
    },
    helperText: {
      description: 'Helper text displayed below the input',
      control: 'text',
    },
    showStatusIcon: {
      description:
        'Show status icon automatically based on variant (error: alert-circle, success: check)',
      control: 'boolean',
    },
    fullWidth: {
      description: 'Whether the input takes full container width',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
}

export const Sizes: Story = {
  render: () => (
    <Stack gap="md" className="w-64">
      <Input size="sm" placeholder="Small input" />
      <Input size="md" placeholder="Medium input" />
      <Input size="lg" placeholder="Large input" />
    </Stack>
  ),
}

export const Variants: Story = {
  render: () => (
    <Stack gap="md" className="w-64">
      <Input variant="default" placeholder="Default variant" />
      <Input variant="error" placeholder="Error variant" />
      <Input variant="success" placeholder="Success variant" />
    </Stack>
  ),
}

export const States: Story = {
  render: () => (
    <Stack gap="md" className="w-64">
      <Input placeholder="Default state" />
      <Input placeholder="Disabled state" disabled />
    </Stack>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <Stack gap="sm" className="w-64">
      <label htmlFor="email-input" className="text-sm font-medium text-foreground">
        Email address
      </label>
      <Input id="email-input" type="email" placeholder="name@example.com" />
    </Stack>
  ),
}

export const WithError: Story = {
  render: () => (
    <Stack gap="sm" className="w-64">
      <label htmlFor="error-input" className="text-sm font-medium text-foreground">
        Email address
      </label>
      <Input
        id="error-input"
        type="email"
        variant="error"
        placeholder="name@example.com"
        aria-invalid="true"
        aria-describedby="error-message"
      />
      <p id="error-message" className="text-sm text-status-error-foreground">
        Please enter a valid email address
      </p>
    </Stack>
  ),
}

export const InputTypes: Story = {
  render: () => (
    <Stack gap="md" className="w-64">
      <Input type="text" placeholder="Text input" />
      <Input type="email" placeholder="Email input" />
      <Input type="password" placeholder="Password input" />
      <Input type="number" placeholder="Number input" />
      <Input type="search" placeholder="Search input" />
    </Stack>
  ),
}

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input',
  },
}

export const WithLeftIcon: Story = {
  args: {
    leftIcon: 'search',
    placeholder: 'Search...',
  },
}

export const WithRightIcon: Story = {
  args: {
    rightIcon: 'check',
    placeholder: 'Verified input',
  },
}

export const WithBothIcons: Story = {
  args: {
    leftIcon: 'package',
    rightIcon: 'external',
    placeholder: 'Package name',
  },
}

export const IconsWithSizes: Story = {
  render: () => (
    <Stack gap="md" className="w-64">
      <Input size="sm" leftIcon="search" placeholder="Small with icon" />
      <Input size="md" leftIcon="search" placeholder="Medium with icon" />
      <Input size="lg" leftIcon="search" placeholder="Large with icon" />
    </Stack>
  ),
}

export const IconsWithError: Story = {
  render: () => (
    <Stack gap="sm" className="w-64">
      <label htmlFor="error-icon-input" className="text-sm font-medium text-foreground">
        Email address
      </label>
      <Input
        id="error-icon-input"
        type="email"
        variant="error"
        leftIcon="alert-circle"
        placeholder="name@example.com"
        aria-invalid="true"
        aria-describedby="error-icon-message"
      />
      <p id="error-icon-message" className="text-sm text-status-error-foreground">
        Please enter a valid email address
      </p>
    </Stack>
  ),
}

export const IconsDisabled: Story = {
  render: () => (
    <Stack gap="md" className="w-64">
      <Input leftIcon="search" placeholder="Disabled with icon" disabled />
      <Input leftIcon="package" rightIcon="check" placeholder="Disabled both icons" disabled />
    </Stack>
  ),
}

export const WithHelperText: Story = {
  render: () => (
    <Stack gap="md" className="w-64">
      <Input placeholder="Default helper" helperText="This is a helpful hint" />
      <Input variant="error" placeholder="Error helper" helperText="This field is required" />
      <Input variant="success" placeholder="Success helper" helperText="Valid input" />
    </Stack>
  ),
}

export const WithStatusIcons: Story = {
  render: () => (
    <Stack gap="md" className="w-64">
      <Input
        variant="error"
        showStatusIcon
        placeholder="Error with icon"
        helperText="This field has an error"
      />
      <Input
        variant="success"
        showStatusIcon
        placeholder="Success with icon"
        helperText="Valid input"
      />
    </Stack>
  ),
}

export const FullWidthControl: Story = {
  render: () => (
    <Stack gap="md" className="max-w-md">
      <Input fullWidth placeholder="Full width (default)" />
      <Input fullWidth={false} placeholder="Auto width" />
      <Stack direction="horizontal" gap="sm">
        <Input fullWidth={false} placeholder="Inline 1" />
        <Input fullWidth={false} placeholder="Inline 2" />
      </Stack>
    </Stack>
  ),
}

export const Showcase: Story = {
  render: function Render() {
    const [email, setEmail] = useState('')
    const isEmailValid = email.includes('@') && email.includes('.')

    return (
      <Stack gap="lg" className="w-96 p-lg">
        {/* Sizes */}
        <Stack gap="md">
          <Heading level={3} size="sm">
            Sizes
          </Heading>
          <Input size="sm" placeholder="Small input" />
          <Input size="md" placeholder="Medium input (default)" />
          <Input size="lg" placeholder="Large input" />
        </Stack>

        {/* Validation Variants */}
        <Stack gap="md">
          <Heading level={3} size="sm">
            Validation States
          </Heading>
          <Input variant="default" placeholder="Default state" helperText="Neutral helper text" />
          <Input variant="error" placeholder="Error state" helperText="This field has an error" />
          <Input variant="success" placeholder="Success state" helperText="Valid input confirmed" />
        </Stack>

        {/* Status Icons */}
        <Stack gap="md">
          <Heading level={3} size="sm">
            Automatic Status Icons
          </Heading>
          <Input
            variant="error"
            showStatusIcon
            placeholder="Error with icon"
            helperText="Alert icon appears automatically"
          />
          <Input
            variant="success"
            showStatusIcon
            placeholder="Success with icon"
            helperText="Check icon appears automatically"
          />
        </Stack>

        {/* Icons */}
        <Stack gap="md">
          <Heading level={3} size="sm">
            Icons
          </Heading>
          <Input leftIcon="search" placeholder="Search..." />
          <Input rightIcon="arrow-right" placeholder="Continue" />
          <Input leftIcon="package" rightIcon="external" placeholder="Package name" />
          <Input
            leftIcon="file"
            variant="success"
            showStatusIcon
            placeholder="File validated"
            helperText="Combines left icon with status icon"
          />
        </Stack>

        {/* Width Control */}
        <Stack gap="md">
          <Heading level={3} size="sm">
            Width Control
          </Heading>
          <Input fullWidth placeholder="Full width (default)" />
          <Input fullWidth={false} placeholder="Auto width" />
          <Stack gap="sm" className="flex">
            <Input fullWidth={false} size="sm" placeholder="Inline" />
            <Input fullWidth={false} size="sm" placeholder="Inputs" />
          </Stack>
        </Stack>

        {/* Interactive Example */}
        <Stack gap="md">
          <Heading level={3} size="sm">
            Interactive Form Example
          </Heading>
          <Stack gap="sm">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              leftIcon="users"
              variant={email ? (isEmailValid ? 'success' : 'error') : 'default'}
              showStatusIcon={email !== ''}
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              helperText={
                email === ''
                  ? 'Enter your email address'
                  : isEmailValid
                    ? 'Valid email format'
                    : 'Please enter a valid email'
              }
              aria-invalid={email !== '' && !isEmailValid}
            />
          </Stack>
        </Stack>

        {/* States */}
        <Stack gap="md">
          <Heading level={3} size="sm">
            States
          </Heading>
          <Input placeholder="Enabled state" />
          <Input placeholder="Disabled state" disabled />
          <Input leftIcon="search" rightIcon="check" placeholder="Disabled with icons" disabled />
        </Stack>

        {/* All Combined */}
        <Stack gap="md">
          <Heading level={3} size="sm">
            All Features Combined
          </Heading>
          <Input
            size="lg"
            variant="success"
            leftIcon="code"
            showStatusIcon
            placeholder="Large success input with all features"
            helperText="Combines size, variant, icons, and helper text"
            fullWidth
          />
        </Stack>
      </Stack>
    )
  },
}
