import { useState } from 'react'

import { Flex } from './Flex'
import { SearchInput } from './SearchInput'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta<typeof SearchInput> = {
  title: 'Components/SearchInput',
  component: SearchInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A specialized input component for search functionality with a search icon.

**Tier:** 1 (Tailwind + CVA) - Composed from Input component

**Usage:** Use for search fields throughout the application. Includes a leading search icon for visual clarity.

**Features:**
- Leading search icon (always visible)
- All Input component features (sizes, disabled state, variants)
- Native browser search input behavior

**Accessibility:**
- Search icon is decorative (aria-hidden)
- Uses native \`type="search"\` for proper semantics
- Supports keyboard navigation (Tab, Escape to clear in browsers that support it)
- Consider adding \`role="search"\` on the containing form
        `.trim(),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      description: 'Size preset affecting height and padding',
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: {
        defaultValue: { summary: 'md' },
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
    value: {
      description: 'Controlled input value',
    },
    onChange: {
      description: 'Callback when input value changes',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Search components, files...',
  },
}

export const WithValue: Story = {
  render: () => {
    const [value, setValue] = useState('Button component')
    return (
      <Flex className="w-64">
        <SearchInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search..."
        />
      </Flex>
    )
  },
}

export const Sizes: Story = {
  render: () => (
    <Flex gap="md" className="w-64">
      <SearchInput size="sm" placeholder="Small search" />
      <SearchInput size="md" placeholder="Medium search" />
      <SearchInput size="lg" placeholder="Large search" />
    </Flex>
  ),
}

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled search',
  },
}

export const DisabledWithValue: Story = {
  args: {
    disabled: true,
    value: 'Cannot edit this',
  },
}

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState('')
    const [searches, setSearches] = useState<string[]>([])

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && value.trim()) {
        setSearches((prev) => [...prev, value])
      }
    }

    return (
      <Flex gap="md" className="w-72">
        <SearchInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type and press Enter..."
        />
        {searches.length > 0 && (
          <div className="text-sm text-foreground-muted">
            <p className="mb-xs font-medium">Searches:</p>
            <ul className="list-inside list-disc">
              {searches.map((search, i) => (
                <li key={i}>{search}</li>
              ))}
            </ul>
          </div>
        )}
      </Flex>
    )
  },
}

export const AllVariants: Story = {
  render: () => {
    const [value, setValue] = useState('Example search')
    return (
      <Flex gap="lg" className="w-72">
        <Flex gap="sm">
          <span className="text-sm font-medium text-foreground-muted">Sizes</span>
          <Flex gap="sm">
            <SearchInput size="sm" placeholder="Small" />
            <SearchInput size="md" placeholder="Medium" />
            <SearchInput size="lg" placeholder="Large" />
          </Flex>
        </Flex>
        <Flex gap="sm">
          <span className="text-sm font-medium text-foreground-muted">States</span>
          <Flex gap="sm">
            <SearchInput placeholder="Empty (no clear button)" />
            <SearchInput
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="With value"
            />
            <SearchInput placeholder="Disabled" disabled />
          </Flex>
        </Flex>
      </Flex>
    )
  },
}
