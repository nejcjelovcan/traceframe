import { useState } from 'react'

import { Heading } from './Heading'
import { Stack } from './Stack'
import { ToggleGroup, type ToggleGroupOption } from './ToggleGroup'

import type { Meta, StoryObj } from '@storybook/react-vite'

type FilterValue = 'all' | 'external' | 'local'
type ViewMode = 'grid' | 'list' | 'compact'
type TabValue = 'overview' | 'files' | 'commits' | 'settings'

const filterOptions: readonly ToggleGroupOption<FilterValue>[] = [
  { value: 'all', label: 'All' },
  { value: 'external', label: 'External' },
  { value: 'local', label: 'Local' },
]

const filterOptionsWithIcons: readonly ToggleGroupOption<FilterValue>[] = [
  { value: 'all', label: 'All', icon: 'components' },
  { value: 'external', label: 'External', icon: 'external' },
  { value: 'local', label: 'Local', icon: 'internal' },
]

const viewModeOptions: readonly ToggleGroupOption<ViewMode>[] = [
  { value: 'grid', label: 'Grid', icon: 'database' },
  { value: 'list', label: 'List', icon: 'file' },
  { value: 'compact', label: 'Compact', icon: 'dots' },
]

const tabOptions: readonly ToggleGroupOption<TabValue>[] = [
  { value: 'overview', label: 'Overview', icon: 'info-circle' },
  { value: 'files', label: 'Files', icon: 'file-code' },
  { value: 'commits', label: 'Commits', icon: 'check' },
  { value: 'settings', label: 'Settings', icon: 'toggle' },
]

const meta: Meta<typeof ToggleGroup> = {
  title: 'Components/ToggleGroup',
  component: ToggleGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Toggle button group for filtering, mode switching, or multi-selection.

**Tier:** 2 (Radix UI Primitive)

**Features:**
- Single and multiple selection modes
- Multiple visual variants (default, solid, ghost, tabs)
- Vertical and horizontal orientations
- Icon support with standardized IconName type
- Keyboard navigation (Arrow keys, roving tabindex)
- WAI-ARIA compliant accessibility
- Semantic token integration

**Variants:**
- \`default\`: Outline style with attached buttons
- \`solid\`: Solid segmented control appearance
- \`ghost\`: Minimal style with spacing
- \`tabs\`: Tab-like appearance with underline

**Usage:**
\`\`\`tsx
// Single selection
<ToggleGroup
  options={[
    { value: 'all', label: 'All', icon: 'components' },
    { value: 'external', label: 'External', icon: 'external' },
  ]}
  value={filter}
  onChange={(value) => value && setFilter(value)}
  aria-label="Filter items"
/>

// Multiple selection
<ToggleGroup
  type="multiple"
  options={options}
  value={selectedValues}
  onChange={setSelectedValues}
  aria-label="Select options"
/>
\`\`\`

**Accessibility:**
- Uses \`aria-label\` on group for screen readers
- Arrow keys navigate between options
- Selection state announced via \`aria-pressed\`
- Icon-only mode includes sr-only label text
- Supports keyboard looping and roving focus
        `.trim(),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      description: 'Selection mode: single or multiple',
      control: 'select',
      options: ['single', 'multiple'],
      table: {
        defaultValue: { summary: 'single' },
      },
    },
    variant: {
      description: 'Visual variant affecting appearance',
      control: 'select',
      options: ['default', 'solid', 'ghost', 'tabs'],
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      description: 'Size preset affecting button dimensions',
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: {
        defaultValue: { summary: 'sm' },
      },
    },
    orientation: {
      description: 'Layout orientation',
      control: 'select',
      options: ['horizontal', 'vertical'],
      table: {
        defaultValue: { summary: 'horizontal' },
      },
    },
    indicator: {
      description: 'Visual indicator style for selection',
      control: 'select',
      options: ['background', 'underline', 'dot'],
      table: {
        defaultValue: { summary: 'background' },
      },
    },
    displayMode: {
      description: 'Display mode: text shows labels, icon shows only icons',
      control: 'select',
      options: ['text', 'icon'],
      table: {
        defaultValue: { summary: 'text' },
      },
    },
    loop: {
      description: 'Enable keyboard navigation looping at ends',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    rovingFocus: {
      description: 'Enable roving focus for keyboard navigation',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    disabled: {
      description: 'Disable the entire toggle group',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    options: {
      description: 'Array of options with value, label, and optional icon',
    },
    value: {
      description: 'Currently selected value(s) (controlled)',
    },
    onChange: {
      description: 'Callback when selection changes',
    },
    'aria-label': {
      description: 'Accessible label for the toggle group (required)',
    },
  },
}

export default meta
// Using unknown due to TypeScript limitations with generic component stories
type Story = StoryObj<unknown>

export const ShowcaseStory: Story = {
  name: 'Showcase (All Features)',
  render: () => {
    const [singleValue, setSingleValue] = useState<FilterValue>('all')
    const [multiValue, setMultiValue] = useState<FilterValue[]>(['all', 'external'])
    const [viewMode, setViewMode] = useState<ViewMode>('grid')
    const [activeTab, setActiveTab] = useState<TabValue>('overview')

    return (
      <Stack gap="xl" className="p-lg">
        {/* Header */}
        <div className="text-center">
          <Heading level={1} className="mb-sm">
            ToggleGroup Component Showcase
          </Heading>
          <p className="text-foreground-muted">All variants, sizes, and features in one view</p>
        </div>

        {/* Variants Section */}
        <section>
          <Heading level={2} size="lg" className="mb-base">
            Appearance Variants
          </Heading>
          <Stack gap="lg">
            <Stack direction="horizontal" align="center" gap="lg">
              <span className="w-24 text-sm text-foreground-muted">Default:</span>
              <ToggleGroup
                variant="default"
                options={filterOptionsWithIcons}
                value={singleValue}
                onChange={(value) => value && setSingleValue(value)}
                aria-label="Default variant"
              />
            </Stack>
            <Stack direction="horizontal" align="center" gap="lg">
              <span className="w-24 text-sm text-foreground-muted">Solid:</span>
              <ToggleGroup
                variant="solid"
                options={filterOptionsWithIcons}
                value={singleValue}
                onChange={(value) => value && setSingleValue(value)}
                aria-label="Solid variant"
              />
            </Stack>
            <Stack direction="horizontal" align="center" gap="lg">
              <span className="w-24 text-sm text-foreground-muted">Ghost:</span>
              <ToggleGroup
                variant="ghost"
                options={filterOptionsWithIcons}
                value={singleValue}
                onChange={(value) => value && setSingleValue(value)}
                aria-label="Ghost variant"
              />
            </Stack>
            <Stack direction="horizontal" align="center" gap="lg">
              <span className="w-24 text-sm text-foreground-muted">Tabs:</span>
              <ToggleGroup
                variant="tabs"
                options={tabOptions}
                value={activeTab}
                onChange={(value) => value && setActiveTab(value)}
                aria-label="Tabs variant"
              />
            </Stack>
          </Stack>
        </section>

        {/* Sizes Section */}
        <section>
          <Heading level={2} size="lg" className="mb-base">
            Size Variants
          </Heading>
          <Stack gap="lg">
            <Stack direction="horizontal" align="center" gap="lg">
              <span className="w-24 text-sm text-foreground-muted">Small:</span>
              <ToggleGroup
                size="sm"
                options={filterOptionsWithIcons}
                value={singleValue}
                onChange={(value) => value && setSingleValue(value)}
                aria-label="Small size"
              />
            </Stack>
            <Stack direction="horizontal" align="center" gap="lg">
              <span className="w-24 text-sm text-foreground-muted">Medium:</span>
              <ToggleGroup
                size="md"
                options={filterOptionsWithIcons}
                value={singleValue}
                onChange={(value) => value && setSingleValue(value)}
                aria-label="Medium size"
              />
            </Stack>
            <Stack direction="horizontal" align="center" gap="lg">
              <span className="w-24 text-sm text-foreground-muted">Large:</span>
              <ToggleGroup
                size="lg"
                options={filterOptionsWithIcons}
                value={singleValue}
                onChange={(value) => value && setSingleValue(value)}
                aria-label="Large size"
              />
            </Stack>
          </Stack>
        </section>

        {/* Indicators Section */}
        <section>
          <Heading level={2} size="lg" className="mb-base">
            Selection Indicators
          </Heading>
          <Stack gap="lg">
            <Stack direction="horizontal" align="center" gap="lg">
              <span className="w-24 text-sm text-foreground-muted">Background:</span>
              <ToggleGroup
                indicator="background"
                options={filterOptions}
                value={singleValue}
                onChange={(value) => value && setSingleValue(value)}
                aria-label="Background indicator"
              />
            </Stack>
            <Stack direction="horizontal" align="center" gap="lg">
              <span className="w-24 text-sm text-foreground-muted">Underline:</span>
              <ToggleGroup
                indicator="underline"
                variant="ghost"
                options={filterOptions}
                value={singleValue}
                onChange={(value) => value && setSingleValue(value)}
                aria-label="Underline indicator"
              />
            </Stack>
            <Stack direction="horizontal" align="center" gap="lg">
              <span className="w-24 text-sm text-foreground-muted">Dot:</span>
              <ToggleGroup
                indicator="dot"
                variant="ghost"
                options={filterOptions}
                value={singleValue}
                onChange={(value) => value && setSingleValue(value)}
                aria-label="Dot indicator"
              />
            </Stack>
          </Stack>
        </section>

        {/* Multi-Select Section */}
        <section>
          <Heading level={2} size="lg" className="mb-base">
            Multiple Selection
          </Heading>
          <Stack gap="lg">
            <Stack direction="horizontal" align="center" gap="lg">
              <span className="w-24 text-sm text-foreground-muted">Default:</span>
              <ToggleGroup
                type="multiple"
                options={filterOptions}
                value={multiValue}
                onChange={setMultiValue}
                aria-label="Multi-select default"
              />
            </Stack>
            <Stack direction="horizontal" align="center" gap="lg">
              <span className="w-24 text-sm text-foreground-muted">Solid:</span>
              <ToggleGroup
                type="multiple"
                variant="solid"
                options={filterOptionsWithIcons}
                value={multiValue}
                onChange={setMultiValue}
                aria-label="Multi-select solid"
              />
            </Stack>
          </Stack>
        </section>

        {/* Display Modes Section */}
        <section>
          <Heading level={2} size="lg" className="mb-base">
            Display Modes
          </Heading>
          <Stack gap="lg">
            <Stack direction="horizontal" align="center" gap="lg">
              <span className="w-24 text-sm text-foreground-muted">Text + Icon:</span>
              <ToggleGroup
                displayMode="text"
                options={viewModeOptions}
                value={viewMode}
                onChange={(value) => value && setViewMode(value)}
                aria-label="Text with icons"
              />
            </Stack>
            <Stack direction="horizontal" align="center" gap="lg">
              <span className="w-24 text-sm text-foreground-muted">Icon Only:</span>
              <ToggleGroup
                displayMode="icon"
                options={viewModeOptions}
                value={viewMode}
                onChange={(value) => value && setViewMode(value)}
                aria-label="Icon only"
              />
            </Stack>
          </Stack>
        </section>

        {/* Orientation Section */}
        <section>
          <Heading level={2} size="lg" className="mb-base">
            Orientations
          </Heading>
          <Stack direction="horizontal" gap="xl">
            <Stack>
              <span className="text-sm text-foreground-muted mb-sm block">Horizontal:</span>
              <ToggleGroup
                orientation="horizontal"
                options={filterOptions}
                value={singleValue}
                onChange={(value) => value && setSingleValue(value)}
                aria-label="Horizontal orientation"
              />
            </Stack>
            <Stack>
              <span className="text-sm text-foreground-muted mb-sm block">Vertical:</span>
              <ToggleGroup
                orientation="vertical"
                options={filterOptions}
                value={singleValue}
                onChange={(value) => value && setSingleValue(value)}
                aria-label="Vertical orientation"
              />
            </Stack>
          </Stack>
        </section>

        {/* Real-World Examples */}
        <section>
          <Heading level={2} size="lg" className="mb-base">
            Real-World Examples
          </Heading>
          <Stack gap="lg" className="p-lg bg-surface-subtle rounded-lg">
            <div>
              <p className="text-sm text-foreground-muted mb-sm">
                View Switcher (Icon only, solid)
              </p>
              <ToggleGroup
                variant="solid"
                displayMode="icon"
                options={viewModeOptions}
                value={viewMode}
                onChange={(value) => value && setViewMode(value)}
                aria-label="Switch view mode"
              />
            </div>
            <div>
              <p className="text-sm text-foreground-muted mb-sm">Tab Navigation</p>
              <ToggleGroup
                variant="tabs"
                options={tabOptions}
                value={activeTab}
                onChange={(value) => value && setActiveTab(value)}
                aria-label="Navigate tabs"
                size="md"
              />
            </div>
            <div>
              <p className="text-sm text-foreground-muted mb-sm">Filter Options (Multi-select)</p>
              <ToggleGroup
                type="multiple"
                variant="ghost"
                options={filterOptionsWithIcons}
                value={multiValue}
                onChange={setMultiValue}
                aria-label="Filter by type"
              />
            </div>
          </Stack>
        </section>
      </Stack>
    )
  },
}

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<FilterValue>('all')
    return (
      <ToggleGroup
        options={filterOptions}
        value={value}
        onChange={(v) => v && setValue(v)}
        aria-label="Filter by type"
      />
    )
  },
}

export const AppearanceVariants: Story = {
  render: () => {
    const [value, setValue] = useState<FilterValue>('all')
    return (
      <Stack gap="lg">
        <div>
          <p className="mb-sm text-sm text-foreground-muted">Default (Outline)</p>
          <ToggleGroup
            variant="default"
            options={filterOptionsWithIcons}
            value={value}
            onChange={(value) => value && setValue(value)}
            aria-label="Default variant"
          />
        </div>
        <div>
          <p className="mb-sm text-sm text-foreground-muted">Solid (Segmented Control)</p>
          <ToggleGroup
            variant="solid"
            options={filterOptionsWithIcons}
            value={value}
            onChange={(value) => value && setValue(value)}
            aria-label="Solid variant"
          />
        </div>
        <div>
          <p className="mb-sm text-sm text-foreground-muted">Ghost (Minimal)</p>
          <ToggleGroup
            variant="ghost"
            options={filterOptionsWithIcons}
            value={value}
            onChange={(value) => value && setValue(value)}
            aria-label="Ghost variant"
          />
        </div>
        <div>
          <p className="mb-sm text-sm text-foreground-muted">Tabs (Underline)</p>
          <ToggleGroup
            variant="tabs"
            options={filterOptionsWithIcons}
            value={value}
            onChange={(value) => value && setValue(value)}
            aria-label="Tabs variant"
          />
        </div>
      </Stack>
    )
  },
}

export const WithIndicators: Story = {
  render: () => {
    const [value, setValue] = useState<FilterValue>('all')
    return (
      <Stack gap="lg">
        <div>
          <p className="mb-sm text-sm text-foreground-muted">Background Indicator (Default)</p>
          <ToggleGroup
            indicator="background"
            options={filterOptions}
            value={value}
            onChange={(value) => value && setValue(value)}
            aria-label="Background indicator"
          />
        </div>
        <div>
          <p className="mb-sm text-sm text-foreground-muted">Underline Indicator</p>
          <ToggleGroup
            indicator="underline"
            variant="ghost"
            options={filterOptions}
            value={value}
            onChange={(value) => value && setValue(value)}
            aria-label="Underline indicator"
          />
        </div>
        <div>
          <p className="mb-sm text-sm text-foreground-muted">Dot Indicator</p>
          <ToggleGroup
            indicator="dot"
            variant="ghost"
            options={filterOptions}
            value={value}
            onChange={(value) => value && setValue(value)}
            aria-label="Dot indicator"
          />
        </div>
      </Stack>
    )
  },
}

export const MultiSelect: Story = {
  render: () => {
    const [values, setValues] = useState<FilterValue[]>(['all', 'external'])
    return (
      <Stack gap="lg">
        <div>
          <p className="mb-sm text-sm text-foreground-muted">
            Multiple Selection Enabled - Selected: {values.join(', ')}
          </p>
          <ToggleGroup
            type="multiple"
            options={filterOptionsWithIcons}
            value={values}
            onChange={setValues}
            aria-label="Multi-select example"
          />
        </div>
        <div>
          <p className="mb-sm text-sm text-foreground-muted">Multi-select with Solid Variant</p>
          <ToggleGroup
            type="multiple"
            variant="solid"
            options={filterOptionsWithIcons}
            value={values}
            onChange={setValues}
            aria-label="Multi-select solid"
          />
        </div>
        <div>
          <p className="mb-sm text-sm text-foreground-muted">Multi-select with Ghost Variant</p>
          <ToggleGroup
            type="multiple"
            variant="ghost"
            options={filterOptionsWithIcons}
            value={values}
            onChange={setValues}
            aria-label="Multi-select ghost"
          />
        </div>
      </Stack>
    )
  },
}

export const Vertical: Story = {
  render: () => {
    const [value, setValue] = useState<FilterValue>('all')
    return (
      <Stack direction="horizontal" gap="lg">
        <Stack>
          <p className="mb-sm text-sm text-foreground-muted">Vertical Default</p>
          <ToggleGroup
            orientation="vertical"
            options={filterOptions}
            value={value}
            onChange={(value) => value && setValue(value)}
            aria-label="Vertical default"
          />
        </Stack>
        <Stack>
          <p className="mb-sm text-sm text-foreground-muted">Vertical Solid</p>
          <ToggleGroup
            orientation="vertical"
            variant="solid"
            options={filterOptionsWithIcons}
            value={value}
            onChange={(value) => value && setValue(value)}
            aria-label="Vertical solid"
          />
        </Stack>
        <Stack>
          <p className="mb-sm text-sm text-foreground-muted">Vertical Ghost</p>
          <ToggleGroup
            orientation="vertical"
            variant="ghost"
            options={filterOptionsWithIcons}
            value={value}
            onChange={(value) => value && setValue(value)}
            aria-label="Vertical ghost"
          />
        </Stack>
      </Stack>
    )
  },
}

export const RealWorldExamples: Story = {
  render: () => {
    const [filter, setFilter] = useState<FilterValue>('all')
    const [viewMode, setViewMode] = useState<ViewMode>('grid')
    const [activeTab, setActiveTab] = useState<TabValue>('overview')
    const [features, setFeatures] = useState<string[]>(['feature1', 'feature2'])

    const featureOptions: ToggleGroupOption<string>[] = [
      { value: 'feature1', label: 'Feature 1' },
      { value: 'feature2', label: 'Feature 2' },
      { value: 'feature3', label: 'Feature 3' },
      { value: 'feature4', label: 'Feature 4' },
    ]

    return (
      <Stack gap="lg">
        <div className="p-base bg-surface-subtle rounded-lg">
          <Heading level={3} className="mb-base">
            View Switcher
          </Heading>
          <ToggleGroup
            variant="solid"
            displayMode="icon"
            options={viewModeOptions}
            value={viewMode}
            onChange={(value) => value && setViewMode(value)}
            aria-label="Switch view mode"
          />
        </div>

        <div className="p-base bg-surface-subtle rounded-lg">
          <Heading level={3} className="mb-base">
            Filter Bar
          </Heading>
          <ToggleGroup
            options={filterOptionsWithIcons}
            value={filter}
            onChange={(value) => value && setFilter(value)}
            aria-label="Filter items"
          />
        </div>

        <div className="p-base bg-surface-subtle rounded-lg">
          <Heading level={3} className="mb-base">
            Tab Navigation
          </Heading>
          <ToggleGroup
            variant="tabs"
            options={tabOptions}
            value={activeTab}
            onChange={(value) => value && setActiveTab(value)}
            aria-label="Navigate sections"
            size="md"
          />
        </div>

        <div className="p-base bg-surface-subtle rounded-lg">
          <Heading level={3} className="mb-base">
            Feature Toggles
          </Heading>
          <ToggleGroup
            type="multiple"
            variant="ghost"
            options={featureOptions}
            value={features}
            onChange={setFeatures}
            aria-label="Toggle features"
          />
        </div>
      </Stack>
    )
  },
}

export const DifferentSizes: Story = {
  render: () => {
    const [value, setValue] = useState<FilterValue>('all')
    return (
      <Stack gap="lg">
        <div>
          <p className="mb-sm text-sm text-foreground-muted">Small (sm)</p>
          <ToggleGroup
            options={filterOptionsWithIcons}
            value={value}
            onChange={(value) => value && setValue(value)}
            aria-label="Small size"
            size="sm"
          />
        </div>
        <div>
          <p className="mb-sm text-sm text-foreground-muted">Medium (md)</p>
          <ToggleGroup
            options={filterOptionsWithIcons}
            value={value}
            onChange={(value) => value && setValue(value)}
            aria-label="Medium size"
            size="md"
          />
        </div>
        <div>
          <p className="mb-sm text-sm text-foreground-muted">Large (lg)</p>
          <ToggleGroup
            options={filterOptionsWithIcons}
            value={value}
            onChange={(value) => value && setValue(value)}
            aria-label="Large size"
            size="lg"
          />
        </div>
      </Stack>
    )
  },
}

export const IconOnlyMode: Story = {
  render: () => {
    const [value, setValue] = useState<ViewMode>('grid')
    return (
      <Stack gap="lg">
        <div>
          <p className="mb-sm text-sm text-foreground-muted">Icon Only Display</p>
          <ToggleGroup
            displayMode="icon"
            options={viewModeOptions}
            value={value}
            onChange={(value) => value && setValue(value)}
            aria-label="Icon only mode"
          />
        </div>
        <div>
          <p className="mb-sm text-sm text-foreground-muted">Icon Only - All Sizes</p>
          <Stack gap="md">
            <ToggleGroup
              displayMode="icon"
              options={viewModeOptions}
              value={value}
              onChange={(value) => value && setValue(value)}
              aria-label="Icon only small"
              size="sm"
            />
            <ToggleGroup
              displayMode="icon"
              options={viewModeOptions}
              value={value}
              onChange={(value) => value && setValue(value)}
              aria-label="Icon only medium"
              size="md"
            />
            <ToggleGroup
              displayMode="icon"
              options={viewModeOptions}
              value={value}
              onChange={(value) => value && setValue(value)}
              aria-label="Icon only large"
              size="lg"
            />
          </Stack>
        </div>
      </Stack>
    )
  },
}

export const Accessibility: Story = {
  render: () => {
    const [value, setValue] = useState<FilterValue>('all')
    const [disabled, setDisabled] = useState(false)
    const [loop, setLoop] = useState(false)
    const [rovingFocus, setRovingFocus] = useState(true)

    const optionsWithDisabled: ToggleGroupOption<FilterValue>[] = [
      { value: 'all', label: 'All', icon: 'components' },
      { value: 'external', label: 'External', icon: 'external', disabled: true },
      { value: 'local', label: 'Local', icon: 'internal' },
    ]

    return (
      <Stack gap="lg">
        <Stack direction="horizontal" gap="base" className="mb-base">
          <button
            className="px-md py-xs bg-interactive-primary text-foreground-inverted rounded text-sm"
            onClick={() => setDisabled(!disabled)}
          >
            Toggle Disabled: {disabled ? 'ON' : 'OFF'}
          </button>
          <button
            className="px-md py-xs bg-interactive-primary text-foreground-inverted rounded text-sm"
            onClick={() => setLoop(!loop)}
          >
            Keyboard Loop: {loop ? 'ON' : 'OFF'}
          </button>
          <button
            className="px-md py-xs bg-interactive-primary text-foreground-inverted rounded text-sm"
            onClick={() => setRovingFocus(!rovingFocus)}
          >
            Roving Focus: {rovingFocus ? 'ON' : 'OFF'}
          </button>
        </Stack>

        <div>
          <p className="mb-sm text-sm text-foreground-muted">
            Try keyboard navigation (Arrow keys) - External option is disabled
          </p>
          <ToggleGroup
            options={optionsWithDisabled}
            value={value}
            onChange={(value) => value && setValue(value)}
            aria-label="Accessibility demo"
            disabled={disabled}
            loop={loop}
            rovingFocus={rovingFocus}
          />
        </div>

        <div className="p-base bg-surface-subtle rounded text-sm">
          <p className="font-medium mb-sm">Keyboard Navigation:</p>
          <ul className="list-disc list-inside space-y-xs text-foreground-muted">
            <li>Arrow keys to navigate between options</li>
            <li>Space or Enter to select</li>
            <li>Tab to enter/exit the group</li>
            <li>{loop ? 'Navigation loops at ends' : 'Navigation stops at ends'}</li>
            <li>{rovingFocus ? 'Roving tabindex enabled' : 'Static tabindex'}</li>
          </ul>
        </div>
      </Stack>
    )
  },
}
