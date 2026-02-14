import { Button } from './Button.js'
import { Heading } from './Heading.js'
import { Stack } from './Stack.js'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from './Tooltip.js'
import { Icon } from '../icons/index.js'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta<typeof TooltipContent> = {
  title: 'Components/Tooltip',
  component: TooltipContent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Accessible tooltip component with automatic positioning.

**Tier:** 2 (Radix UI Primitive)

**Radix Handles:**
- Positioning and collision detection (auto-repositions near viewport edges)
- Focus management
- Keyboard navigation (Escape to dismiss)
- Delay timing (configurable via Provider)
- WAI-ARIA compliance (\`role="tooltip"\`)

**Compound Components:**
- \`TooltipProvider\` - Wraps app, configures global delay
- \`Tooltip\` - State management for open/close
- \`TooltipTrigger\` - Element that triggers tooltip (use \`asChild\`)
- \`TooltipContent\` - The tooltip content with styling

**Usage:**
\`\`\`tsx
<TooltipProvider delayDuration={100}>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button>Hover me</Button>
    </TooltipTrigger>
    <TooltipContent>Tooltip text</TooltipContent>
  </Tooltip>
</TooltipProvider>
\`\`\`

**Accessibility:**
- \`role="tooltip"\` with proper ARIA attributes
- Keyboard accessible (Tab to trigger, Escape to dismiss)
- Appears on hover AND focus
- Respects reduced-motion preferences
        `.trim(),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      description: 'Visual style variant',
      control: 'select',
      options: ['default', 'light', 'info', 'success', 'warning', 'error'],
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      description: 'Size variant for padding and text',
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    side: {
      description: 'Preferred side for tooltip placement',
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      table: {
        defaultValue: { summary: 'top' },
      },
    },
    showArrow: {
      description: 'Whether to show arrow pointing to trigger',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    sideOffset: {
      description: 'Distance from trigger in pixels',
      table: {
        defaultValue: { summary: '4' },
      },
    },
    children: {
      description: 'Tooltip content',
    },
  },
  decorators: [
    (Story) => (
      <TooltipProvider delayDuration={100}>
        <div className="flex min-h-32 items-center justify-center p-xl">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent {...args}>Tooltip text</TooltipContent>
    </Tooltip>
  ),
}

export const AllVariants: Story = {
  name: 'All Variants (Comprehensive)',
  render: () => (
    <div className="space-y-xl">
      <div>
        <Heading level={3} size="sm" color="muted" className="mb-lg">
          Style Variants
        </Heading>
        <div className="grid grid-cols-3 gap-lg">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className="w-full">
                Default
              </Button>
            </TooltipTrigger>
            <TooltipContent variant="default">Default tooltip style</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className="w-full">
                Light
              </Button>
            </TooltipTrigger>
            <TooltipContent variant="light">Light background tooltip</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className="w-full">
                Info
              </Button>
            </TooltipTrigger>
            <TooltipContent variant="info">Info status tooltip</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className="w-full">
                Success
              </Button>
            </TooltipTrigger>
            <TooltipContent variant="success">Success status tooltip</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className="w-full">
                Warning
              </Button>
            </TooltipTrigger>
            <TooltipContent variant="warning">Warning status tooltip</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className="w-full">
                Error
              </Button>
            </TooltipTrigger>
            <TooltipContent variant="error">Error status tooltip</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div>
        <Heading level={3} size="sm" color="muted" className="mb-lg">
          Size Variants
        </Heading>
        <div className="flex gap-lg">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Small</Button>
            </TooltipTrigger>
            <TooltipContent size="sm">Small tooltip (sm)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Medium</Button>
            </TooltipTrigger>
            <TooltipContent size="md">Medium tooltip (md)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Large</Button>
            </TooltipTrigger>
            <TooltipContent size="lg">Large tooltip (lg)</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div>
        <Heading level={3} size="sm" color="muted" className="mb-lg">
          With/Without Arrow
        </Heading>
        <div className="flex gap-lg">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">With Arrow</Button>
            </TooltipTrigger>
            <TooltipContent showArrow={true}>Arrow points to trigger</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">No Arrow</Button>
            </TooltipTrigger>
            <TooltipContent showArrow={false}>No arrow shown</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div>
        <Heading level={3} size="sm" color="muted" className="mb-lg">
          Rich Content Examples
        </Heading>
        <div className="grid grid-cols-2 gap-lg">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className="w-full">
                Multi-line
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <div>
                <strong>Component Analysis</strong>
                <br />
                <span className="opacity-90">Used in 45 files</span>
                <br />
                <span className="opacity-90">Last modified: 2 hours ago</span>
              </div>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className="w-full">
                With Icons
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex items-center gap-sm">
                <Icon name="info-circle" size="sm" />
                <span>Additional information</span>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-lg">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" className="w-full">
            Default
          </Button>
        </TooltipTrigger>
        <TooltipContent variant="default">Default dark tooltip</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" className="w-full">
            Light
          </Button>
        </TooltipTrigger>
        <TooltipContent variant="light">Light background tooltip</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" className="w-full">
            Info
          </Button>
        </TooltipTrigger>
        <TooltipContent variant="info">Informational tooltip</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" className="w-full">
            Success
          </Button>
        </TooltipTrigger>
        <TooltipContent variant="success">Success tooltip</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" className="w-full">
            Warning
          </Button>
        </TooltipTrigger>
        <TooltipContent variant="warning">Warning tooltip</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" className="w-full">
            Error
          </Button>
        </TooltipTrigger>
        <TooltipContent variant="error">Error tooltip</TooltipContent>
      </Tooltip>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <Stack direction="horizontal" gap="lg">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">
            Small
          </Button>
        </TooltipTrigger>
        <TooltipContent size="sm">Small tooltip text (xs)</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Medium</Button>
        </TooltipTrigger>
        <TooltipContent size="md">Medium tooltip text (xs)</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="lg">
            Large
          </Button>
        </TooltipTrigger>
        <TooltipContent size="lg">Large tooltip text (sm)</TooltipContent>
      </Tooltip>
    </Stack>
  ),
}

export const StatusTooltips: Story = {
  name: 'Status Tooltips (Contextual)',
  render: () => (
    <div className="flex flex-col gap-lg">
      <Stack direction="horizontal" align="center" gap="base">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="rounded-sm p-xs hover:bg-interactive-hover">
              <Icon name="info-circle" size="md" className="text-status-info" />
            </button>
          </TooltipTrigger>
          <TooltipContent variant="info">Learn more about this feature</TooltipContent>
        </Tooltip>
        <span className="text-sm text-foreground-muted">Info context</span>
      </Stack>

      <Stack direction="horizontal" align="center" gap="base">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="rounded-sm p-xs hover:bg-interactive-hover">
              <Icon name="check" size="md" className="text-status-success" />
            </button>
          </TooltipTrigger>
          <TooltipContent variant="success">Successfully validated</TooltipContent>
        </Tooltip>
        <span className="text-sm text-foreground-muted">Success context</span>
      </Stack>

      <Stack direction="horizontal" align="center" gap="base">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="rounded-sm p-xs hover:bg-interactive-hover">
              <Icon name="alert-circle" size="md" className="text-status-warning" />
            </button>
          </TooltipTrigger>
          <TooltipContent variant="warning">This action requires caution</TooltipContent>
        </Tooltip>
        <span className="text-sm text-foreground-muted">Warning context</span>
      </Stack>

      <Stack direction="horizontal" align="center" gap="base">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="rounded-sm p-xs hover:bg-interactive-hover">
              <Icon name="close" size="md" className="text-status-error" />
            </button>
          </TooltipTrigger>
          <TooltipContent variant="error">This will permanently delete the item</TooltipContent>
        </Tooltip>
        <span className="text-sm text-foreground-muted">Error/Destructive context</span>
      </Stack>
    </div>
  ),
}

export const Placements: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-lg">
      <div />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" className="w-full">
            Top
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Top tooltip</TooltipContent>
      </Tooltip>
      <div />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" className="w-full">
            Left
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">Left tooltip</TooltipContent>
      </Tooltip>
      <div />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" className="w-full">
            Right
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Right tooltip</TooltipContent>
      </Tooltip>

      <div />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" className="w-full">
            Bottom
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Bottom tooltip</TooltipContent>
      </Tooltip>
      <div />
    </div>
  ),
}

export const RichContent: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-lg">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" className="w-full">
            Component Details
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs whitespace-normal">
          <strong>Button Component</strong>
          <br />
          <span className="opacity-90">45 usages across 12 files</span>
          <br />
          <span className="opacity-90">Last updated: 2 hours ago</span>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" className="w-full">
            Keyboard Shortcut
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center gap-sm">
            <kbd className="rounded-sm bg-surface-muted px-xs py-2xs text-xs">⌘</kbd>
            <span>+</span>
            <kbd className="rounded-sm bg-surface-muted px-xs py-2xs text-xs">K</kbd>
          </div>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" className="w-full">
            Status Info
          </Button>
        </TooltipTrigger>
        <TooltipContent variant="success" className="max-w-xs">
          <div className="flex items-center gap-sm">
            <Icon name="check" size="sm" />
            <div>
              <div className="font-medium">Deployment Successful</div>
              <div className="text-xs opacity-90">All tests passed</div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" className="w-full">
            Error Details
          </Button>
        </TooltipTrigger>
        <TooltipContent variant="error" className="max-w-xs">
          <div className="flex items-center gap-sm">
            <Icon name="alert-circle" size="sm" />
            <div>
              <div className="font-medium">Validation Failed</div>
              <div className="text-xs opacity-90">Required fields are missing</div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
}

export const InteractiveTriggers: Story = {
  render: () => (
    <Stack direction="horizontal" align="center" gap="lg">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="primary">Primary Button</Button>
        </TooltipTrigger>
        <TooltipContent>Button trigger</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-pointer underline">Text link</span>
        </TooltipTrigger>
        <TooltipContent>Text trigger</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <button className="rounded-sm p-xs hover:bg-interactive-hover">
            <Icon name="info-circle" size="md" />
          </button>
        </TooltipTrigger>
        <TooltipContent>Icon button trigger</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help rounded-sm border border-border px-md py-xs">
            Custom element
          </div>
        </TooltipTrigger>
        <TooltipContent>Custom element trigger</TooltipContent>
      </Tooltip>
    </Stack>
  ),
}

export const WithoutArrow: Story = {
  render: () => (
    <Stack direction="horizontal" gap="lg">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Default (with arrow)</Button>
        </TooltipTrigger>
        <TooltipContent>Arrow points to trigger</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">No arrow</Button>
        </TooltipTrigger>
        <TooltipContent showArrow={false}>Tooltip without arrow</TooltipContent>
      </Tooltip>
    </Stack>
  ),
}

export const CollisionDetection: Story = {
  render: () => (
    <Stack gap="base">
      <p className="text-sm text-foreground-muted">
        Radix automatically repositions tooltips when they would overflow the viewport. Try hovering
        near the edges.
      </p>
      <div className="flex justify-between">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              Left edge
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">This tooltip would overflow left, so it flips</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              Right edge
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            This tooltip would overflow right, so it flips
          </TooltipContent>
        </Tooltip>
      </div>
    </Stack>
  ),
}

export const CustomDelay: Story = {
  decorators: [
    (Story) => (
      <div className="flex min-h-32 items-center justify-center gap-lg p-xl">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Instant (0ms)</Button>
          </TooltipTrigger>
          <TooltipContent>Appears immediately</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Fast (300ms)</Button>
          </TooltipTrigger>
          <TooltipContent>Appears quickly</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider delayDuration={700}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Default (700ms)</Button>
          </TooltipTrigger>
          <TooltipContent>Radix default delay</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  ),
}

export const KeyboardAccessible: Story = {
  render: () => (
    <Stack gap="base">
      <p className="text-sm text-foreground-muted">
        Tab to focus the button, then press Escape to dismiss the tooltip.
      </p>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Tab to focus, Escape to dismiss</Button>
        </TooltipTrigger>
        <TooltipContent>
          <span>This tooltip appears on focus too!</span>
          <br />
          <span className="opacity-90">Press Escape to dismiss</span>
        </TooltipContent>
      </Tooltip>
    </Stack>
  ),
}
