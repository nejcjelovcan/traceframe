import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { ActionList } from './ActionList.js'
import { Button } from './Button.js'

const meta: Meta<typeof ActionList.Root> = {
  title: 'Components/ActionList',
  component: ActionList.Root,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
ActionList is a selectable list component that displays items inline without a trigger/popover.
Perfect for displaying selectable items like agent sessions, tasks, or any list where users need to pick one item from a visible list.

## Features
- Single selection state management
- Full keyboard navigation (Arrow keys, Enter/Space, Home/End, Type-ahead)
- Status indicators (active, completed, failed, pending)
- Rich content with descriptions
- Multiple visual variants
- Accessible with WAI-ARIA listbox pattern
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['card', 'subtle', 'ghost'],
    },
    density: {
      control: 'select',
      options: ['compact', 'comfortable', 'spacious'],
    },
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
    disabled: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof ActionList.Root>

// Helper component for controlled examples
function ControlledExample({
  variant = 'subtle',
  density = 'comfortable',
  orientation = 'vertical',
  disabled = false,
}: {
  variant?: 'card' | 'subtle' | 'ghost'
  density?: 'compact' | 'comfortable' | 'spacious'
  orientation?: 'vertical' | 'horizontal'
  disabled?: boolean
}) {
  const [value, setValue] = useState<string>('session-1')

  return (
    <div className="space-y-md">
      <ActionList.Root
        value={value}
        onValueChange={setValue}
        variant={variant}
        density={density}
        orientation={orientation}
        disabled={disabled}
        className="max-w-lg"
      >
        <ActionList.Item value="session-1" status="active">
          <ActionList.ItemText>Current Live Session</ActionList.ItemText>
          <ActionList.ItemDescription>Started 5 minutes ago</ActionList.ItemDescription>
        </ActionList.Item>
        <ActionList.Item value="session-2" status="completed">
          <ActionList.ItemText>Previous Session</ActionList.ItemText>
          <ActionList.ItemDescription>Completed 2 hours ago</ActionList.ItemDescription>
        </ActionList.Item>
        <ActionList.Item value="session-3" status="failed">
          <ActionList.ItemText>Failed Session</ActionList.ItemText>
          <ActionList.ItemDescription>Error occurred 1 hour ago</ActionList.ItemDescription>
        </ActionList.Item>
        <ActionList.Item value="session-4" status="pending">
          <ActionList.ItemText>Pending Session</ActionList.ItemText>
          <ActionList.ItemDescription>Scheduled for later</ActionList.ItemDescription>
        </ActionList.Item>
      </ActionList.Root>
      <div className="text-sm text-foreground-muted">
        Selected: <code className="px-xs py-2xs bg-surface-subtle rounded">{value}</code>
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => <ControlledExample />,
}

export const WithGroups: Story = {
  render: () => {
    const [value, setValue] = useState<string>()

    return (
      <ActionList.Root value={value} onValueChange={setValue} variant="card" className="max-w-lg">
        <ActionList.Group>
          <ActionList.Label>Active Sessions</ActionList.Label>
          <ActionList.Item value="session-1" status="active">
            <ActionList.ItemText>Production Agent</ActionList.ItemText>
            <ActionList.ItemDescription>Running for 2h 15m</ActionList.ItemDescription>
          </ActionList.Item>
          <ActionList.Item value="session-2" status="active">
            <ActionList.ItemText>Development Agent</ActionList.ItemText>
            <ActionList.ItemDescription>Running for 45m</ActionList.ItemDescription>
          </ActionList.Item>
        </ActionList.Group>

        <ActionList.Separator />

        <ActionList.Group>
          <ActionList.Label>Recent Sessions</ActionList.Label>
          <ActionList.Item value="session-3" status="completed">
            <ActionList.ItemText>Data Processing</ActionList.ItemText>
            <ActionList.ItemDescription>Completed successfully</ActionList.ItemDescription>
          </ActionList.Item>
          <ActionList.Item value="session-4" status="failed">
            <ActionList.ItemText>Failed Migration</ActionList.ItemText>
            <ActionList.ItemDescription>Connection timeout</ActionList.ItemDescription>
          </ActionList.Item>
          <ActionList.Item value="session-5" status="pending">
            <ActionList.ItemText>Scheduled Backup</ActionList.ItemText>
            <ActionList.ItemDescription>Starts in 30 minutes</ActionList.ItemDescription>
          </ActionList.Item>
        </ActionList.Group>
      </ActionList.Root>
    )
  },
}

export const NavigationMenu: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState('dashboard')

    return (
      <ActionList.Root
        value={currentPage}
        onValueChange={setCurrentPage}
        variant="ghost"
        density="comfortable"
        className="w-64"
      >
        <ActionList.Item value="dashboard" leftIcon="layout-dashboard">
          <ActionList.ItemText>Dashboard</ActionList.ItemText>
        </ActionList.Item>
        <ActionList.Item value="agents" leftIcon="robot">
          <ActionList.ItemText>Agents</ActionList.ItemText>
        </ActionList.Item>
        <ActionList.Item value="tasks" leftIcon="checklist">
          <ActionList.ItemText>Tasks</ActionList.ItemText>
        </ActionList.Item>
        <ActionList.Item value="analytics" leftIcon="chart-bar">
          <ActionList.ItemText>Analytics</ActionList.ItemText>
        </ActionList.Item>
        <ActionList.Separator />
        <ActionList.Item value="settings" leftIcon="settings">
          <ActionList.ItemText>Settings</ActionList.ItemText>
        </ActionList.Item>
        <ActionList.Item value="help" leftIcon="help-circle">
          <ActionList.ItemText>Help & Support</ActionList.ItemText>
        </ActionList.Item>
      </ActionList.Root>
    )
  },
}

export const TaskSelection: Story = {
  render: () => {
    const [selectedTask, setSelectedTask] = useState<string>()

    return (
      <ActionList.Root
        value={selectedTask}
        onValueChange={setSelectedTask}
        variant="subtle"
        density="spacious"
        className="max-w-2xl"
      >
        <ActionList.Label>Available Tasks</ActionList.Label>
        <ActionList.Item value="code-review" leftIcon="code" rightIcon="chevron-right">
          <ActionList.ItemText>Code Review</ActionList.ItemText>
          <ActionList.ItemDescription>
            Review pull request #234 for the authentication module
          </ActionList.ItemDescription>
        </ActionList.Item>
        <ActionList.Item value="bug-fix" leftIcon="bug" rightIcon="chevron-right">
          <ActionList.ItemText>Bug Fix</ActionList.ItemText>
          <ActionList.ItemDescription>
            Fix critical issue in payment processing service
          </ActionList.ItemDescription>
        </ActionList.Item>
        <ActionList.Item value="feature" leftIcon="sparkles" rightIcon="chevron-right">
          <ActionList.ItemText>New Feature</ActionList.ItemText>
          <ActionList.ItemDescription>
            Implement dark mode toggle for user preferences
          </ActionList.ItemDescription>
        </ActionList.Item>
        <ActionList.Item value="refactor" leftIcon="code-2" rightIcon="chevron-right">
          <ActionList.ItemText>Refactoring</ActionList.ItemText>
          <ActionList.ItemDescription>
            Optimize database queries for improved performance
          </ActionList.ItemDescription>
        </ActionList.Item>
      </ActionList.Root>
    )
  },
}

export const DifferentVariants: Story = {
  render: () => {
    const [value1, setValue1] = useState('option-1')
    const [value2, setValue2] = useState('option-1')
    const [value3, setValue3] = useState('option-1')

    const items = [
      { value: 'option-1', text: 'Option 1', description: 'First option' },
      { value: 'option-2', text: 'Option 2', description: 'Second option' },
      { value: 'option-3', text: 'Option 3', description: 'Third option' },
    ]

    return (
      <div className="space-y-lg">
        <div>
          <h3 className="text-lg font-semibold mb-sm">Card Variant</h3>
          <ActionList.Root
            value={value1}
            onValueChange={setValue1}
            variant="card"
            className="max-w-md"
          >
            {items.map((item) => (
              <ActionList.Item key={item.value} value={item.value}>
                <ActionList.ItemText>{item.text}</ActionList.ItemText>
                <ActionList.ItemDescription>{item.description}</ActionList.ItemDescription>
              </ActionList.Item>
            ))}
          </ActionList.Root>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-sm">Subtle Variant</h3>
          <ActionList.Root
            value={value2}
            onValueChange={setValue2}
            variant="subtle"
            className="max-w-md"
          >
            {items.map((item) => (
              <ActionList.Item key={item.value} value={item.value}>
                <ActionList.ItemText>{item.text}</ActionList.ItemText>
                <ActionList.ItemDescription>{item.description}</ActionList.ItemDescription>
              </ActionList.Item>
            ))}
          </ActionList.Root>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-sm">Ghost Variant</h3>
          <ActionList.Root
            value={value3}
            onValueChange={setValue3}
            variant="ghost"
            className="max-w-md"
          >
            {items.map((item) => (
              <ActionList.Item key={item.value} value={item.value}>
                <ActionList.ItemText>{item.text}</ActionList.ItemText>
                <ActionList.ItemDescription>{item.description}</ActionList.ItemDescription>
              </ActionList.Item>
            ))}
          </ActionList.Root>
        </div>
      </div>
    )
  },
}

export const DifferentDensities: Story = {
  render: () => {
    const [value1, setValue1] = useState('item-1')
    const [value2, setValue2] = useState('item-1')
    const [value3, setValue3] = useState('item-1')

    const items = [
      { value: 'item-1', text: 'Compact Item 1', icon: 'file' as const },
      { value: 'item-2', text: 'Compact Item 2', icon: 'folder' as const },
      { value: 'item-3', text: 'Compact Item 3', icon: 'archive' as const },
    ]

    return (
      <div className="space-y-lg">
        <div>
          <h3 className="text-lg font-semibold mb-sm">Compact Density</h3>
          <ActionList.Root
            value={value1}
            onValueChange={setValue1}
            variant="card"
            density="compact"
            className="max-w-sm"
          >
            {items.map((item) => (
              <ActionList.Item key={item.value} value={item.value} leftIcon={item.icon}>
                <ActionList.ItemText>{item.text}</ActionList.ItemText>
              </ActionList.Item>
            ))}
          </ActionList.Root>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-sm">Comfortable Density</h3>
          <ActionList.Root
            value={value2}
            onValueChange={setValue2}
            variant="card"
            density="comfortable"
            className="max-w-sm"
          >
            {items.map((item) => (
              <ActionList.Item key={item.value} value={item.value} leftIcon={item.icon}>
                <ActionList.ItemText>
                  {item.text.replace('Compact', 'Comfortable')}
                </ActionList.ItemText>
              </ActionList.Item>
            ))}
          </ActionList.Root>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-sm">Spacious Density</h3>
          <ActionList.Root
            value={value3}
            onValueChange={setValue3}
            variant="card"
            density="spacious"
            className="max-w-sm"
          >
            {items.map((item) => (
              <ActionList.Item key={item.value} value={item.value} leftIcon={item.icon}>
                <ActionList.ItemText>
                  {item.text.replace('Compact', 'Spacious')}
                </ActionList.ItemText>
              </ActionList.Item>
            ))}
          </ActionList.Root>
        </div>
      </div>
    )
  },
}

export const HorizontalOrientation: Story = {
  render: () => {
    const [value, setValue] = useState('view-grid')

    return (
      <ActionList.Root
        value={value}
        onValueChange={setValue}
        orientation="horizontal"
        variant="subtle"
        density="compact"
        className="w-fit"
      >
        <ActionList.Item value="view-grid" leftIcon="layout-grid">
          <ActionList.ItemText>Grid</ActionList.ItemText>
        </ActionList.Item>
        <ActionList.Item value="view-list" leftIcon="layout-list">
          <ActionList.ItemText>List</ActionList.ItemText>
        </ActionList.Item>
        <ActionList.Item value="view-cards" leftIcon="layout-cards">
          <ActionList.ItemText>Cards</ActionList.ItemText>
        </ActionList.Item>
      </ActionList.Root>
    )
  },
}

export const WithDisabledState: Story = {
  render: () => {
    const [value, setValue] = useState<string>()

    return (
      <div className="space-y-md">
        <ActionList.Root value={value} onValueChange={setValue} variant="card" className="max-w-md">
          <ActionList.Item value="enabled-1">
            <ActionList.ItemText>Enabled Option 1</ActionList.ItemText>
          </ActionList.Item>
          <ActionList.Item value="disabled-1" disabled>
            <ActionList.ItemText>Disabled Option</ActionList.ItemText>
            <ActionList.ItemDescription>This item cannot be selected</ActionList.ItemDescription>
          </ActionList.Item>
          <ActionList.Item value="enabled-2">
            <ActionList.ItemText>Enabled Option 2</ActionList.ItemText>
          </ActionList.Item>
        </ActionList.Root>

        <div>
          <p className="text-sm text-foreground-muted mb-sm">Entire list disabled:</p>
          <ActionList.Root value="option-1" disabled variant="card" className="max-w-md">
            <ActionList.Item value="option-1">
              <ActionList.ItemText>Option 1</ActionList.ItemText>
            </ActionList.Item>
            <ActionList.Item value="option-2">
              <ActionList.ItemText>Option 2</ActionList.ItemText>
            </ActionList.Item>
          </ActionList.Root>
        </div>
      </div>
    )
  },
}

export const LongList: Story = {
  name: 'Long List (Performance Test)',
  render: () => {
    const [value, setValue] = useState<string>()

    const items = Array.from({ length: 50 }, (_, i) => ({
      value: `item-${i + 1}`,
      text: `Item ${i + 1}`,
      description: `Description for item ${i + 1}`,
      status:
        i % 4 === 0
          ? 'active'
          : i % 4 === 1
            ? 'completed'
            : i % 4 === 2
              ? 'failed'
              : ('pending' as const),
    }))

    return (
      <div className="space-y-md">
        <p className="text-sm text-foreground-muted">
          Testing performance with 50 items. Use keyboard navigation to move through the list.
        </p>
        <ActionList.Root
          value={value}
          onValueChange={setValue}
          variant="card"
          density="compact"
          className="max-w-lg max-h-96 overflow-y-auto"
        >
          {items.map((item) => (
            <ActionList.Item key={item.value} value={item.value} status={item.status}>
              <ActionList.ItemText>{item.text}</ActionList.ItemText>
              <ActionList.ItemDescription>{item.description}</ActionList.ItemDescription>
            </ActionList.Item>
          ))}
        </ActionList.Root>
        {value && (
          <div className="text-sm text-foreground-muted">
            Selected: <code className="px-xs py-2xs bg-surface-subtle rounded">{value}</code>
          </div>
        )}
      </div>
    )
  },
}

export const InteractiveExample: Story = {
  name: 'Interactive Example',
  render: () => {
    const [value, setValue] = useState<string>()
    const [variant, setVariant] = useState<'card' | 'subtle' | 'ghost'>('card')
    const [density, setDensity] = useState<'compact' | 'comfortable' | 'spacious'>('comfortable')

    return (
      <div className="space-y-lg">
        <div className="flex gap-md">
          <div>
            <label className="text-sm font-medium">Variant:</label>
            <select
              value={variant}
              onChange={(e) => setVariant(e.target.value as any)}
              className="ml-sm px-sm py-xs border border-border rounded"
            >
              <option value="card">Card</option>
              <option value="subtle">Subtle</option>
              <option value="ghost">Ghost</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Density:</label>
            <select
              value={density}
              onChange={(e) => setDensity(e.target.value as any)}
              className="ml-sm px-sm py-xs border border-border rounded"
            >
              <option value="compact">Compact</option>
              <option value="comfortable">Comfortable</option>
              <option value="spacious">Spacious</option>
            </select>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setValue(undefined)}>
            Clear Selection
          </Button>
        </div>

        <ActionList.Root
          value={value}
          onValueChange={setValue}
          variant={variant}
          density={density}
          className="max-w-lg"
        >
          <ActionList.Group>
            <ActionList.Label>Agent Sessions</ActionList.Label>
            <ActionList.Item value="agent-1" status="active" leftIcon="robot">
              <ActionList.ItemText>Production Agent</ActionList.ItemText>
              <ActionList.ItemDescription>Processing 125 requests/min</ActionList.ItemDescription>
            </ActionList.Item>
            <ActionList.Item value="agent-2" status="active" leftIcon="robot">
              <ActionList.ItemText>Development Agent</ActionList.ItemText>
              <ActionList.ItemDescription>Testing new features</ActionList.ItemDescription>
            </ActionList.Item>
            <ActionList.Item value="agent-3" status="completed" leftIcon="robot">
              <ActionList.ItemText>Batch Processing Agent</ActionList.ItemText>
              <ActionList.ItemDescription>Completed 5,000 items</ActionList.ItemDescription>
            </ActionList.Item>
            <ActionList.Item value="agent-4" status="failed" leftIcon="robot">
              <ActionList.ItemText>Data Migration Agent</ActionList.ItemText>
              <ActionList.ItemDescription>Connection lost</ActionList.ItemDescription>
            </ActionList.Item>
            <ActionList.Item value="agent-5" status="pending" leftIcon="robot">
              <ActionList.ItemText>Scheduled Agent</ActionList.ItemText>
              <ActionList.ItemDescription>Starts at 2:00 PM</ActionList.ItemDescription>
            </ActionList.Item>
          </ActionList.Group>
        </ActionList.Root>

        {value && (
          <div className="p-md bg-surface-subtle rounded-lg">
            <p className="text-sm font-medium text-foreground">Selected Agent:</p>
            <code className="text-xs text-foreground-muted">{value}</code>
          </div>
        )}
      </div>
    )
  },
}
