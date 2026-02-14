import { useState } from 'react'

import { Button } from './Button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './Collapsible'
import { Grid } from './Grid'
import { Heading } from './Heading'
import { Stack } from './Stack'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta<typeof CollapsibleTrigger> = {
  title: 'Components/Collapsible',
  component: CollapsibleTrigger,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Accessible collapsible section component for showing/hiding content.

**Tier:** 2 (Radix UI Primitive)

**Radix Handles:**
- WAI-ARIA disclosure pattern (\`aria-expanded\`, \`aria-controls\`)
- Keyboard support (Enter/Space to toggle)
- State management (controlled/uncontrolled)
- Animation support via data attributes

**Compound Components:**
- \`Collapsible\` - State management, controlled via \`open\`/\`onOpenChange\`
- \`CollapsibleTrigger\` - Button that toggles visibility (includes chevron)
- \`CollapsibleContent\` - Collapsible content area with animation

**Usage:**
\`\`\`tsx
<Collapsible>
  <CollapsibleTrigger>Advanced Options</CollapsibleTrigger>
  <CollapsibleContent>
    <div className="mt-sm">Content here...</div>
  </CollapsibleContent>
</Collapsible>
\`\`\`

**Accessibility:**
- Uses \`aria-expanded\` to indicate state
- \`aria-controls\` links trigger to content
- Keyboard accessible (Tab to focus, Enter/Space to toggle)
- Chevron rotates to indicate state visually
        `.trim(),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      description: 'Size preset affecting padding and font size',
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    hideChevron: {
      description: 'Hide the chevron indicator icon',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      description: 'Disable the trigger, preventing toggle',
      control: 'boolean',
    },
    children: {
      description: 'Trigger label text',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Collapsible>
      <CollapsibleTrigger {...args}>Advanced Filters</CollapsibleTrigger>
      <CollapsibleContent>Filter content goes here...</CollapsibleContent>
    </Collapsible>
  ),
}

export const DefaultOpen: Story = {
  render: () => (
    <Collapsible defaultOpen>
      <CollapsibleTrigger>Advanced Filters</CollapsibleTrigger>
      <CollapsibleContent>This section starts expanded.</CollapsibleContent>
    </Collapsible>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <Stack gap="md">
        <Stack direction="horizontal" gap="sm" align="center">
          <Button onClick={() => setOpen(!open)} size="sm">
            {open ? 'Close' : 'Open'} Externally
          </Button>
          <span className="text-sm text-foreground-muted">State: {open ? 'open' : 'closed'}</span>
        </Stack>
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger>Controlled Section</CollapsibleTrigger>
          <CollapsibleContent>
            This section is controlled. Toggle with the button above or click the trigger.
          </CollapsibleContent>
        </Collapsible>
      </Stack>
    )
  },
}

export const Sizes: Story = {
  render: () => (
    <Stack gap="lg">
      <Stack gap="sm">
        <p className="mb-sm text-sm font-medium text-foreground-muted">Small</p>
        <Collapsible>
          <CollapsibleTrigger size="sm">Small Trigger</CollapsibleTrigger>
          <CollapsibleContent size="sm">Small content</CollapsibleContent>
        </Collapsible>
      </Stack>

      <Stack gap="sm">
        <p className="mb-sm text-sm font-medium text-foreground-muted">Medium (default)</p>
        <Collapsible>
          <CollapsibleTrigger size="md">Medium Trigger</CollapsibleTrigger>
          <CollapsibleContent size="md">Medium content</CollapsibleContent>
        </Collapsible>
      </Stack>

      <Stack gap="sm">
        <p className="mb-sm text-sm font-medium text-foreground-muted">Large</p>
        <Collapsible>
          <CollapsibleTrigger size="lg">Large Trigger</CollapsibleTrigger>
          <CollapsibleContent size="lg">Large content</CollapsibleContent>
        </Collapsible>
      </Stack>
    </Stack>
  ),
}

export const WithoutChevron: Story = {
  render: () => (
    <Collapsible>
      <CollapsibleTrigger hideChevron>Click to toggle (no chevron)</CollapsibleTrigger>
      <CollapsibleContent>Content without chevron indicator.</CollapsibleContent>
    </Collapsible>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-base">
      <Collapsible>
        <CollapsibleTrigger disabled>Disabled Trigger</CollapsibleTrigger>
        <CollapsibleContent>This content cannot be revealed.</CollapsibleContent>
      </Collapsible>

      <Collapsible defaultOpen>
        <CollapsibleTrigger disabled>Disabled but Open</CollapsibleTrigger>
        <CollapsibleContent>This content is visible but cannot be collapsed.</CollapsibleContent>
      </Collapsible>
    </div>
  ),
}

export const WithLongContent: Story = {
  render: () => (
    <Collapsible>
      <CollapsibleTrigger>Show More Details</CollapsibleTrigger>
      <CollapsibleContent>
        <Heading level={4} className="mb-sm">
          Detailed Information
        </Heading>
        <p className="mb-md text-foreground-muted">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <p className="mb-md text-foreground-muted">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
          deserunt mollit anim id est laborum.
        </p>
        <p className="text-foreground-muted">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
          laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
          architecto beatae vitae dicta sunt explicabo.
        </p>
      </CollapsibleContent>
    </Collapsible>
  ),
}

export const NestedCollapsibles: Story = {
  render: () => (
    <Collapsible>
      <CollapsibleTrigger>Parent Section</CollapsibleTrigger>
      <CollapsibleContent>
        <Collapsible>
          <CollapsibleTrigger size="sm">Child Section 1</CollapsibleTrigger>
          <CollapsibleContent>First nested content</CollapsibleContent>
        </Collapsible>

        <Collapsible>
          <CollapsibleTrigger size="sm">Child Section 2</CollapsibleTrigger>
          <CollapsibleContent>Second nested content</CollapsibleContent>
        </Collapsible>
      </CollapsibleContent>
    </Collapsible>
  ),
}

export const Variants: Story = {
  render: () => (
    <Stack gap="lg">
      <div>
        Default Variant
        <Collapsible>
          <CollapsibleTrigger variant="default">Default Trigger</CollapsibleTrigger>
          <CollapsibleContent>Default content with hover background</CollapsibleContent>
        </Collapsible>
      </div>

      <div>
        Ghost Variant
        <Collapsible>
          <CollapsibleTrigger variant="ghost">Ghost Trigger</CollapsibleTrigger>
          <CollapsibleContent>Ghost content with transparent hover</CollapsibleContent>
        </Collapsible>
      </div>

      <div>
        Bordered Variant
        <Collapsible>
          <CollapsibleTrigger variant="bordered">Bordered Trigger</CollapsibleTrigger>
          <CollapsibleContent>Bordered content with border styling</CollapsibleContent>
        </Collapsible>
      </div>

      <div>
        Filled Variant
        <Collapsible>
          <CollapsibleTrigger variant="filled">Filled Trigger</CollapsibleTrigger>
          <CollapsibleContent>Filled content with background color</CollapsibleContent>
        </Collapsible>
      </div>
    </Stack>
  ),
}

export const IndentLevels: Story = {
  render: () => (
    <div className="flex flex-col gap-base">
      <Collapsible>
        <CollapsibleTrigger indent="none">No Indent (Root Level)</CollapsibleTrigger>
        <CollapsibleContent>Root level content</CollapsibleContent>
      </Collapsible>

      <Collapsible>
        <CollapsibleTrigger indent="sm">Small Indent (Level 1)</CollapsibleTrigger>
        <CollapsibleContent indent="sm">Level 1 content with matching indent</CollapsibleContent>
      </Collapsible>

      <Collapsible>
        <CollapsibleTrigger indent="md">Medium Indent (Level 2)</CollapsibleTrigger>
        <CollapsibleContent indent="md">Level 2 content with matching indent</CollapsibleContent>
      </Collapsible>

      <Collapsible>
        <CollapsibleTrigger indent="lg">Large Indent (Level 3)</CollapsibleTrigger>
        <CollapsibleContent indent="lg">Level 3 content with matching indent</CollapsibleContent>
      </Collapsible>
    </div>
  ),
}

export const Showcase: Story = {
  render: () => {
    const [expandAll, setExpandAll] = useState(false)

    return (
      <Stack gap="lg">
        <Stack direction="horizontal" gap="sm" align="center" justify="between">
          <Heading level={2} size="2xl">
            Collapsible Component Showcase
          </Heading>
          <Button onClick={() => setExpandAll(!expandAll)} size="sm">
            {expandAll ? 'Collapse All' : 'Expand All'}
          </Button>
        </Stack>

        <Stack gap="lg">
          <section>
            <Heading level={3} className="mb-base">
              Visual Variants
            </Heading>
            <Grid gap="base" cols={{ md: 2 }}>
              {(['default', 'ghost', 'bordered', 'filled'] as const).map((variant) => (
                <Collapsible key={variant} open={expandAll}>
                  <CollapsibleTrigger variant={variant}>
                    {variant.charAt(0).toUpperCase() + variant.slice(1)} Variant
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    This demonstrates the {variant} variant styling
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </Grid>
          </section>
        </Stack>
      </Stack>
    )
  },
}
