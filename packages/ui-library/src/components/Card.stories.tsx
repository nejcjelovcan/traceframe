import { useState } from 'react'

import { Card, CardContent, CardFooter, CardHeader } from './Card'
import { Heading } from './Heading'
import { ToggleGroup } from './ToggleGroup'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A container component for grouping related content with optional header and footer.

**Tier:** 1 (Tailwind + CVA)

**Subcomponents:**
- \`Card\` - Main container with variant styling
- \`CardHeader\` - Optional header section with bottom border (supports icons)
- \`CardContent\` - Main content area with standard padding
- \`CardFooter\` - Optional footer section with top border

**Usage:** Use for displaying grouped content like statistics, previews, form sections, or list items. Choose variant based on visual hierarchy needs.

**Variant Guide:**
- \`outlined\` (default) - Standard cards, list items
- \`elevated\` - Featured or highlighted content with shadow
- \`info\` - Informational callouts
- \`success\` - Success states, positive feedback
- \`warning\` - Warning states, caution indicators
- \`error\` - Error states, critical alerts
- \`accent1-5\` - Categorical cards for visual grouping

**Actionable Prop:**
- \`actionable\` - Makes the card clickable with interactive shadow states
- Works with all variants for hover/active feedback
- Adds cursor-pointer and smooth shadow transitions

**Icon Support:**
- \`CardHeader\` accepts an \`icon\` prop with any icon name from ui-library
- \`iconPosition\` can be \`left\` (default) or \`right\`

**Accessibility:**
- Uses semantic \`<div>\` elements
- Header content should use appropriate heading levels
- Consider adding \`role="region"\` and \`aria-labelledby\` for significant cards
- Icons in headers have \`aria-hidden="true"\` (they are decorative)
        `.trim(),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      description: 'Visual style variant affecting background, text, and border colors',
      control: 'select',
      options: [
        'outlined',
        'elevated',
        'info',
        'success',
        'warning',
        'error',
        'accent1',
        'accent2',
        'accent3',
        'accent4',
        'accent5',
      ],
      table: {
        defaultValue: { summary: 'outlined' },
      },
    },
    actionable: {
      description: 'Makes the card clickable with interactive shadow states',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    children: {
      description: 'Card content (typically CardHeader, CardContent, CardFooter)',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: 'outlined',
    actionable: false,
  },
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>Package Details</CardHeader>
      <CardContent>
        <p>Component usage information goes here</p>
      </CardContent>
      <CardFooter>
        <button className="text-sm text-interactive-accent hover:underline">View All</button>
      </CardFooter>
    </Card>
  ),
}

export const Outlined: Story = {
  render: () => (
    <Card variant="outlined" className="w-80">
      <CardHeader>Default Card</CardHeader>
      <CardContent>
        <p>This is the outlined (default) variant with a neutral background.</p>
      </CardContent>
    </Card>
  ),
}

export const Elevated: Story = {
  render: () => (
    <Card variant="elevated" className="w-80">
      <CardHeader>Featured</CardHeader>
      <CardContent>
        <p>This card pops with a subtle shadow for visual hierarchy.</p>
      </CardContent>
    </Card>
  ),
}

export const Info: Story = {
  render: () => (
    <Card variant="info" className="w-80">
      <CardHeader icon="info-circle">Information</CardHeader>
      <CardContent>
        <p>This card highlights informational content with a blue tint.</p>
      </CardContent>
    </Card>
  ),
}

export const Success: Story = {
  render: () => (
    <Card variant="success" className="w-80">
      <CardHeader icon="check">Success</CardHeader>
      <CardContent>
        <p>This card indicates a successful state or positive outcome.</p>
      </CardContent>
    </Card>
  ),
}

export const Warning: Story = {
  render: () => (
    <Card variant="warning" className="w-80">
      <CardHeader icon="alert-circle">Warning</CardHeader>
      <CardContent>
        <p>This card indicates a warning or requires attention.</p>
      </CardContent>
    </Card>
  ),
}

export const Error: Story = {
  render: () => (
    <Card variant="error" className="w-80">
      <CardHeader icon="alert-circle">Error</CardHeader>
      <CardContent>
        <p>This card indicates an error or critical state.</p>
      </CardContent>
    </Card>
  ),
}

export const WithIcon: Story = {
  name: 'With Header Icon',
  render: () => (
    <div className="flex flex-col gap-base">
      <Card className="w-80">
        <CardHeader icon="package">Left Icon (Default)</CardHeader>
        <CardContent>
          <p>The icon appears on the left side of the header text.</p>
        </CardContent>
      </Card>
      <Card className="w-80">
        <CardHeader icon="chevron-right" iconPosition="right">
          Right Icon
        </CardHeader>
        <CardContent>
          <p>The icon appears on the right side of the header text.</p>
        </CardContent>
      </Card>
    </div>
  ),
}

export const HeaderAndContent: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>Summary</CardHeader>
      <CardContent>
        <p>No footer needed here. Just a header and content.</p>
      </CardContent>
    </Card>
  ),
}

export const ContentOnly: Story = {
  render: () => (
    <Card className="w-80">
      <CardContent>
        <p>Simple card with just content. No header or footer.</p>
      </CardContent>
    </Card>
  ),
}

export const FullCard: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader icon="chart">Component Stats</CardHeader>
      <CardContent>
        <ul className="space-y-sm text-sm">
          <li>Total usages: 42</li>
          <li>Unique imports: 12</li>
          <li>Last modified: Today</li>
        </ul>
      </CardContent>
      <CardFooter>
        <button className="text-sm text-interactive-accent hover:underline">View Details</button>
      </CardFooter>
    </Card>
  ),
}

export const StatusVariants: Story = {
  name: 'All Status Variants',
  render: () => (
    <div className="flex flex-wrap gap-base">
      <Card variant="info" className="w-56">
        <CardHeader icon="info-circle">Info</CardHeader>
        <CardContent>
          <p className="text-sm">Informational callout with blue tint.</p>
        </CardContent>
      </Card>
      <Card variant="success" className="w-56">
        <CardHeader icon="check">Success</CardHeader>
        <CardContent>
          <p className="text-sm">Success state with green tint.</p>
        </CardContent>
      </Card>
      <Card variant="warning" className="w-56">
        <CardHeader icon="alert-circle">Warning</CardHeader>
        <CardContent>
          <p className="text-sm">Warning state with amber tint.</p>
        </CardContent>
      </Card>
      <Card variant="error" className="w-56">
        <CardHeader icon="alert-circle">Error</CardHeader>
        <CardContent>
          <p className="text-sm">Error state with red tint.</p>
        </CardContent>
      </Card>
    </div>
  ),
}

export const AccentVariants: Story = {
  name: 'All Accent Variants',
  render: () => (
    <div className="flex flex-wrap gap-base">
      <Card variant="accent1" className="w-48">
        <CardHeader>Accent 1</CardHeader>
        <CardContent>
          <p className="text-sm">Arctic Blue</p>
        </CardContent>
      </Card>
      <Card variant="accent2" className="w-48">
        <CardHeader>Accent 2</CardHeader>
        <CardContent>
          <p className="text-sm">Lavender Dusk</p>
        </CardContent>
      </Card>
      <Card variant="accent3" className="w-48">
        <CardHeader>Accent 3</CardHeader>
        <CardContent>
          <p className="text-sm">Dusty Rose</p>
        </CardContent>
      </Card>
      <Card variant="accent4" className="w-48">
        <CardHeader>Accent 4</CardHeader>
        <CardContent>
          <p className="text-sm">Fresh Lime</p>
        </CardContent>
      </Card>
      <Card variant="accent5" className="w-48">
        <CardHeader>Accent 5</CardHeader>
        <CardContent>
          <p className="text-sm">Terracotta</p>
        </CardContent>
      </Card>
    </div>
  ),
}

export const InvertedOutlined: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>Inverted Card</CardHeader>
      <CardContent>
        <p>Dark background with light text in light mode, and vice versa in dark mode.</p>
      </CardContent>
    </Card>
  ),
}

export const InvertedElevated: Story = {
  render: () => (
    <Card variant="elevated" className="w-80">
      <CardHeader>Inverted Elevated</CardHeader>
      <CardContent>
        <p>Inverted colors with shadow for extra emphasis.</p>
      </CardContent>
    </Card>
  ),
}

export const InvertedFull: Story = {
  name: 'Inverted with Header, Content, Footer',
  render: () => (
    <Card className="w-80">
      <CardHeader icon="package">Inverted Full Card</CardHeader>
      <CardContent>
        <ul className="space-y-sm text-sm">
          <li>All children inherit colors</li>
          <li>Headers, content, and footers adapt</li>
          <li>Icons and muted text work correctly</li>
        </ul>
      </CardContent>
      <CardFooter>
        <span className="text-sm text-foreground-muted">Footer text</span>
      </CardFooter>
    </Card>
  ),
}

export const InvertedStatusVariants: Story = {
  name: 'Inverted Status Variants',
  render: () => (
    <div className="flex flex-wrap gap-base">
      <Card variant="info" className="w-56">
        <CardHeader icon="info-circle">Info</CardHeader>
        <CardContent>
          <p className="text-sm">Solid info background with white text.</p>
        </CardContent>
      </Card>
      <Card variant="success" className="w-56">
        <CardHeader icon="check">Success</CardHeader>
        <CardContent>
          <p className="text-sm">Solid success background with white text.</p>
        </CardContent>
      </Card>
      <Card variant="warning" className="w-56">
        <CardHeader icon="alert-circle">Warning</CardHeader>
        <CardContent>
          <p className="text-sm">Solid warning background with white text.</p>
        </CardContent>
      </Card>
      <Card variant="error" className="w-56">
        <CardHeader icon="alert-circle">Error</CardHeader>
        <CardContent>
          <p className="text-sm">Solid error background with white text.</p>
        </CardContent>
      </Card>
    </div>
  ),
}

export const InvertedAccentVariants: Story = {
  name: 'Inverted Accent Variants',
  render: () => (
    <div className="flex flex-wrap gap-base">
      <Card variant="accent1" className="w-48">
        <CardHeader>Accent 1</CardHeader>
        <CardContent>
          <p className="text-sm">Solid accent background.</p>
        </CardContent>
      </Card>
      <Card variant="accent2" className="w-48">
        <CardHeader>Accent 2</CardHeader>
        <CardContent>
          <p className="text-sm">Solid accent background.</p>
        </CardContent>
      </Card>
      <Card variant="accent3" className="w-48">
        <CardHeader>Accent 3</CardHeader>
        <CardContent>
          <p className="text-sm">Solid accent background.</p>
        </CardContent>
      </Card>
      <Card variant="accent4" className="w-48">
        <CardHeader>Accent 4</CardHeader>
        <CardContent>
          <p className="text-sm">Solid accent background.</p>
        </CardContent>
      </Card>
      <Card variant="accent5" className="w-48">
        <CardHeader>Accent 5</CardHeader>
        <CardContent>
          <p className="text-sm">Solid accent background.</p>
        </CardContent>
      </Card>
    </div>
  ),
}

export const InvertedComparison: Story = {
  name: 'Normal vs Inverted',
  render: () => (
    <div className="space-y-base">
      <div className="flex flex-wrap gap-base">
        <Card variant="outlined" className="w-64">
          <CardHeader>Normal Outlined</CardHeader>
          <CardContent>
            <p className="text-sm">Standard appearance.</p>
            <p className="text-sm text-foreground-muted">Muted text color.</p>
          </CardContent>
        </Card>
        <Card variant="outlined" className="w-64">
          <CardHeader>Inverted Outlined</CardHeader>
          <CardContent>
            <p className="text-sm">Inverted appearance.</p>
            <p className="text-sm text-foreground-muted">Muted text adapts.</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-wrap gap-base">
        <Card variant="info" className="w-64">
          <CardHeader icon="info-circle">Normal Info</CardHeader>
          <CardContent>
            <p className="text-sm">Muted background.</p>
          </CardContent>
        </Card>
        <Card variant="info" className="w-64">
          <CardHeader icon="info-circle">Inverted Info</CardHeader>
          <CardContent>
            <p className="text-sm">Solid filled background.</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-wrap gap-base">
        <Card variant="accent1" className="w-64">
          <CardHeader>Normal Accent 1</CardHeader>
          <CardContent>
            <p className="text-sm">Muted background.</p>
          </CardContent>
        </Card>
        <Card variant="accent1" className="w-64">
          <CardHeader>Inverted Accent 1</CardHeader>
          <CardContent>
            <p className="text-sm">Solid filled background.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
}

export const Actionable: Story = {
  render: () => (
    <Card actionable className="w-80">
      <CardHeader icon="link">Clickable Card</CardHeader>
      <CardContent>
        <p>This card has interactive shadow states. Hover or click to see the effect.</p>
      </CardContent>
    </Card>
  ),
}

export const ActionableVariants: Story = {
  name: 'All Actionable Variants',
  render: () => (
    <div className="flex flex-wrap gap-base">
      <Card variant="outlined" actionable className="w-56">
        <CardHeader>Outlined</CardHeader>
        <CardContent>
          <p className="text-sm">Click me!</p>
        </CardContent>
      </Card>
      <Card variant="elevated" actionable className="w-56">
        <CardHeader>Elevated</CardHeader>
        <CardContent>
          <p className="text-sm">Click me!</p>
        </CardContent>
      </Card>
      <Card variant="info" actionable className="w-56">
        <CardHeader icon="info-circle">Info</CardHeader>
        <CardContent>
          <p className="text-sm">Click me!</p>
        </CardContent>
      </Card>
      <Card variant="success" actionable className="w-56">
        <CardHeader icon="check">Success</CardHeader>
        <CardContent>
          <p className="text-sm">Click me!</p>
        </CardContent>
      </Card>
      <Card variant="accent1" actionable className="w-56">
        <CardHeader>Accent 1</CardHeader>
        <CardContent>
          <p className="text-sm">Click me!</p>
        </CardContent>
      </Card>
    </div>
  ),
}

export const InteractiveComparison: Story = {
  name: 'Normal vs Actionable',
  render: () => (
    <div className="space-y-base">
      <div className="flex flex-wrap gap-base">
        <Card variant="outlined" className="w-64">
          <CardHeader>Normal Card</CardHeader>
          <CardContent>
            <p className="text-sm">Standard card with no interaction.</p>
          </CardContent>
        </Card>
        <Card variant="outlined" actionable className="w-64">
          <CardHeader>Actionable Card</CardHeader>
          <CardContent>
            <p className="text-sm">Hover or click for shadow feedback.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
}

export const AllVariants: Story = {
  name: 'Core Variants',
  render: () => (
    <div className="flex flex-wrap gap-base">
      <Card variant="outlined" className="w-56">
        <CardHeader>Outlined</CardHeader>
        <CardContent>
          <p className="text-sm">Default background with light border.</p>
        </CardContent>
      </Card>
      <Card variant="elevated" className="w-56">
        <CardHeader>Elevated</CardHeader>
        <CardContent>
          <p className="text-sm">Background with shadow for emphasis.</p>
        </CardContent>
      </Card>
    </div>
  ),
}

function ShowcaseContent() {
  const [actionable, setActionable] = useState(false)

  return (
    <div className="space-y-lg p-base">
      {/* Controls */}
      <div className="flex items-center gap-base">
        <Heading level={2} size="lg">
          Card Showcase
        </Heading>
        <ToggleGroup
          type="single"
          variant="solid"
          size="sm"
          aria-label="Actionable mode"
          options={[
            { value: 'off', label: 'Static' },
            { value: 'on', label: 'Actionable' },
          ]}
          value={actionable ? 'on' : 'off'}
          onChange={(val) => setActionable(val === 'on')}
        />
      </div>

      {/* Core Variants Section */}
      <section>
        <Heading level={3} size="base" className="mb-base">
          Core Variants
        </Heading>
        <div className="flex flex-wrap gap-base">
          <Card variant="outlined" actionable={actionable} className="w-64">
            <CardHeader>Outlined</CardHeader>
            <CardContent>
              <p className="text-sm">Standard card with neutral background and border.</p>
            </CardContent>
          </Card>
          <Card variant="elevated" actionable={actionable} className="w-64">
            <CardHeader>Elevated</CardHeader>
            <CardContent>
              <p className="text-sm">Card with shadow for visual hierarchy.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Status Variants Section */}
      <section>
        <Heading level={3} size="base" className="mb-base">
          Status Variants
        </Heading>
        <div className="flex flex-wrap gap-base">
          <Card variant="info" actionable={actionable} className="w-64">
            <CardHeader icon="info-circle">Info</CardHeader>
            <CardContent>
              <p className="text-sm">Informational content that needs attention.</p>
            </CardContent>
          </Card>
          <Card variant="success" actionable={actionable} className="w-64">
            <CardHeader icon="check">Success</CardHeader>
            <CardContent>
              <p className="text-sm">Positive outcome or successful operation.</p>
            </CardContent>
          </Card>
          <Card variant="warning" actionable={actionable} className="w-64">
            <CardHeader icon="alert-circle">Warning</CardHeader>
            <CardContent>
              <p className="text-sm">Caution required, potential issues ahead.</p>
            </CardContent>
          </Card>
          <Card variant="error" actionable={actionable} className="w-64">
            <CardHeader icon="alert-circle">Error</CardHeader>
            <CardContent>
              <p className="text-sm">Critical issue that needs immediate attention.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Accent Variants Section */}
      <section>
        <Heading level={3} size="base" className="mb-base">
          Accent Variants
        </Heading>
        <div className="flex flex-wrap gap-base">
          <Card variant="accent1" actionable={actionable} className="w-56">
            <CardHeader>Accent 1</CardHeader>
            <CardContent>
              <p className="text-sm">Arctic Blue</p>
            </CardContent>
          </Card>
          <Card variant="accent2" actionable={actionable} className="w-56">
            <CardHeader>Accent 2</CardHeader>
            <CardContent>
              <p className="text-sm">Lavender Dusk</p>
            </CardContent>
          </Card>
          <Card variant="accent3" actionable={actionable} className="w-56">
            <CardHeader>Accent 3</CardHeader>
            <CardContent>
              <p className="text-sm">Dusty Rose</p>
            </CardContent>
          </Card>
          <Card variant="accent4" actionable={actionable} className="w-56">
            <CardHeader>Accent 4</CardHeader>
            <CardContent>
              <p className="text-sm">Fresh Lime</p>
            </CardContent>
          </Card>
          <Card variant="accent5" actionable={actionable} className="w-56">
            <CardHeader>Accent 5</CardHeader>
            <CardContent>
              <p className="text-sm">Terracotta</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Composition Section */}
      <section>
        <Heading level={3} size="base" className="mb-base">
          Compositions
        </Heading>
        <div className="flex flex-wrap gap-base">
          <Card actionable={actionable} className="w-64">
            <CardContent>
              <p className="text-sm">Content only - no header or footer.</p>
            </CardContent>
          </Card>
          <Card actionable={actionable} className="w-64">
            <CardHeader icon="file">Header + Content</CardHeader>
            <CardContent>
              <p className="text-sm">Header with content, no footer.</p>
            </CardContent>
          </Card>
          <Card variant="elevated" actionable={actionable} className="w-64">
            <CardHeader icon="chart">Full Card</CardHeader>
            <CardContent>
              <ul className="space-y-xs text-sm">
                <li>Item one</li>
                <li>Item two</li>
                <li>Item three</li>
              </ul>
            </CardContent>
            <CardFooter>
              <span className="text-sm">Footer content</span>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  )
}

export const Showcase: Story = {
  name: 'Showcase',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'A comprehensive showcase of all Card features. Use the toggles to switch between normal/inverted modes and static/actionable states.',
      },
    },
  },
  render: () => <ShowcaseContent />,
}
