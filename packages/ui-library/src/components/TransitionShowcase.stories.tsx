import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { Badge } from './Badge.js'
import { Button } from './Button.js'
import { Card, CardContent, CardHeader } from './Card.js'
import { Input } from './Input.js'
import { Link } from './Link.js'
import { Select } from './Select.js'
import { ToggleGroup } from './ToggleGroup.js'
import { Heading } from './Heading.js'
import { Icon } from '../icons/Icon.js'
import { cn } from '../utils/cn.js'

/**
 * Transition Token System Showcase
 *
 * This story demonstrates the theme-specific transition system.
 * Each theme has unique motion characteristics:
 * - Arctic: Sharp, crisp transitions (150ms)
 * - Mist: Smooth, flowing transitions (250ms)
 * - Forge: Bold, snappy transitions (50ms)
 * - Aura: Gentle, elegant transitions (350ms)
 */

const meta: Meta = {
  title: 'Tokens/Transitions',
  parameters: {
    docs: {
      description: {
        component: `
The transition token system provides theme-specific animations and transitions for interactive elements.

## Theme Personalities

### Arctic
- **Duration**: Fast (150ms)
- **Easing**: Standard in-out
- **Scale**: 1.02 hover / 0.98 active
- **Character**: Sharp, crisp, precise

### Mist
- **Duration**: Moderate (250ms)
- **Easing**: Spring effect on transforms
- **Scale**: 1.03 hover / 0.97 active
- **Character**: Smooth, flowing, refined

### Forge
- **Duration**: Instant (50ms)
- **Easing**: Linear (no easing)
- **Scale**: 1.05 hover / 0.95 active
- **Character**: Bold, snappy, immediate

### Aura
- **Duration**: Slow (350ms)
- **Easing**: Bounce effect on transforms
- **Scale**: 1.01 hover / 0.99 active
- **Character**: Gentle, elegant, graceful

## Usage

Components automatically use theme-specific transition tokens:

\`\`\`tsx
// Button uses transition-all-token and scale tokens
<Button>Click me</Button>

// Card uses transition-shadow-token for hover states
<Card actionable>Interactive card</Card>

// Badge can pulse for status indicators
<Badge variant="error" pulse>Critical</Badge>
\`\`\`
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj

function TransitionShowcase() {
  const [selectedOption, setSelectedOption] = useState('all')
  const [selectValue, setSelectValue] = useState('option1')

  return (
    <div className="space-y-xl">
      {/* Interactive Elements Section */}
      <section className="space-y-lg">
        <Heading level={2}>Interactive Elements</Heading>
        <p className="text-foreground-muted">
          Hover and click to see theme-specific transitions. Switch themes to compare motion
          characteristics.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          {/* Buttons */}
          <div className="space-y-md">
            <Heading level={3} size="sm">
              Buttons
            </Heading>
            <div className="flex flex-wrap gap-sm">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
            <div className="flex flex-wrap gap-sm">
              <Button size="sm" leftIcon="package">
                Small
              </Button>
              <Button size="md" leftIcon="search">
                Medium
              </Button>
              <Button size="lg" rightIcon="arrow-right">
                Large
              </Button>
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-md">
            <Heading level={3} size="sm">
              Cards
            </Heading>
            <Card actionable variant="outlined">
              <CardHeader>Interactive Card</CardHeader>
              <CardContent>
                Click or hover to see shadow transitions. Each theme has unique shadow depths and
                transition speeds.
              </CardContent>
            </Card>
          </div>

          {/* Links */}
          <div className="space-y-md">
            <Heading level={3} size="sm">
              Links
            </Heading>
            <div className="flex flex-col gap-sm">
              <Link href="#">Default link with color transition</Link>
              <Link href="#" variant="subtle">
                Subtle link variant
              </Link>
              <Link href="#" variant="standalone">
                Standalone link with outline
              </Link>
              <Link href="#" variant="nav">
                Navigation link
              </Link>
            </div>
          </div>

          {/* Form Controls */}
          <div className="space-y-md">
            <Heading level={3} size="sm">
              Form Controls
            </Heading>
            <Input placeholder="Focus to see border transition" />
            <Select.Root value={selectValue} onValueChange={setSelectValue}>
              <Select.Trigger>
                <Select.Value placeholder="Select an option" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="option1">Option 1</Select.Item>
                <Select.Item value="option2">Option 2</Select.Item>
                <Select.Item value="option3">Option 3</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
        </div>
      </section>

      {/* Toggle Groups */}
      <section className="space-y-lg">
        <Heading level={2}>Toggle Groups</Heading>
        <p className="text-foreground-muted">
          Toggle items transition between states with theme-specific timing.
        </p>
        <div className="space-y-md">
          <ToggleGroup
            value={selectedOption}
            onChange={setSelectedOption}
            options={[
              { value: 'all', label: 'All Items', icon: 'package' },
              { value: 'active', label: 'Active', icon: 'check-circle' },
              { value: 'archived', label: 'Archived', icon: 'archive' },
            ]}
          />
          <ToggleGroup
            variant="tabs"
            value={selectedOption}
            onChange={setSelectedOption}
            options={[
              { value: 'all', label: 'Overview' },
              { value: 'active', label: 'Details' },
              { value: 'archived', label: 'History' },
            ]}
          />
        </div>
      </section>

      {/* Animated Elements */}
      <section className="space-y-lg">
        <Heading level={2}>Animated Elements</Heading>
        <p className="text-foreground-muted">
          Elements with continuous animations that vary by theme.
        </p>

        <div className="space-y-md">
          <Heading level={3} size="sm">
            Pulsing Status Badges
          </Heading>
          <div className="flex flex-wrap gap-sm">
            <Badge variant="error" pulse>
              Critical
            </Badge>
            <Badge variant="warning" pulse>
              Warning
            </Badge>
            <Badge variant="info" pulse>
              Processing
            </Badge>
            <Badge variant="success" pulse compact icon="check-circle" />
          </div>
        </div>

        <div className="space-y-md">
          <Heading level={3} size="sm">
            Collapsible Elements
          </Heading>
          <Card accordion defaultOpen>
            <CardHeader>Click to toggle (uses theme transition timing)</CardHeader>
            <CardContent>
              The collapsible animation uses theme-specific duration and easing tokens. Notice how
              the animation speed changes with each theme.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Transition Scale Demo */}
      <section className="space-y-lg">
        <Heading level={2}>Scale Transitions</Heading>
        <p className="text-foreground-muted">
          Interactive elements scale on hover/active with theme-specific values.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
          {(['arctic', 'mist', 'forge', 'aura'] as const).map((theme) => (
            <div key={theme} className="space-y-sm">
              <div className="text-sm font-medium capitalize">{theme}</div>
              <div className="text-xs text-foreground-muted">
                {theme === 'arctic' && 'Hover: 1.02 / Active: 0.98'}
                {theme === 'mist' && 'Hover: 1.03 / Active: 0.97'}
                {theme === 'forge' && 'Hover: 1.05 / Active: 0.95'}
                {theme === 'aura' && 'Hover: 1.01 / Active: 0.99'}
              </div>
              <Button variant="outline" className="w-full">
                Test Scale
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Transition Utilities */}
      <section className="space-y-lg">
        <Heading level={2}>Available Utilities</Heading>
        <p className="text-foreground-muted">
          Tailwind utilities for applying transition tokens directly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <div className="space-y-sm">
            <Heading level={3} size="sm">
              Transition Properties
            </Heading>
            <ul className="space-y-xs text-sm">
              <li>
                <code className="text-xs bg-surface-muted px-xs py-2xs rounded">
                  transition-colors-fast
                </code>{' '}
                - Color transitions
              </li>
              <li>
                <code className="text-xs bg-surface-muted px-xs py-2xs rounded">
                  transition-opacity-fast
                </code>{' '}
                - Opacity transitions
              </li>
              <li>
                <code className="text-xs bg-surface-muted px-xs py-2xs rounded">
                  transition-transform-fast
                </code>{' '}
                - Transform transitions
              </li>
              <li>
                <code className="text-xs bg-surface-muted px-xs py-2xs rounded">
                  transition-shadow-fast
                </code>{' '}
                - Shadow transitions
              </li>
              <li>
                <code className="text-xs bg-surface-muted px-xs py-2xs rounded">
                  transition-all-fast
                </code>{' '}
                - All properties
              </li>
            </ul>
          </div>

          <div className="space-y-sm">
            <Heading level={3} size="sm">
              Scale & Animation
            </Heading>
            <ul className="space-y-xs text-sm">
              <li>
                <code className="text-xs bg-surface-muted px-xs py-2xs rounded">
                  scale-hover-on-hover
                </code>{' '}
                - Theme hover scale
              </li>
              <li>
                <code className="text-xs bg-surface-muted px-xs py-2xs rounded">
                  scale-active-on-active
                </code>{' '}
                - Theme active scale
              </li>
              <li>
                <code className="text-xs bg-surface-muted px-xs py-2xs rounded">
                  scale-interactive
                </code>{' '}
                - Combined hover/active
              </li>
              <li>
                <code className="text-xs bg-surface-muted px-xs py-2xs rounded">
                  animate-pulse-token
                </code>{' '}
                - Theme pulse animation
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}

export const Default: Story = {
  render: () => <TransitionShowcase />,
}

export const CompareThemes: Story = {
  name: 'Compare Themes Side-by-Side',
  render: () => (
    <div className="space-y-lg">
      <Heading level={2}>Theme Comparison</Heading>
      <p className="text-foreground-muted">
        Switch between themes using the toolbar to see how transition characteristics change.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        <Card actionable variant="outlined">
          <CardHeader icon="sparkle">Interactive Card</CardHeader>
          <CardContent>
            Hover to see shadow transitions. Click to see active state. Each theme has unique
            transition timing and scale values.
          </CardContent>
        </Card>

        <div className="space-y-md">
          <Button variant="primary" leftIcon="zap" fullWidth>
            Primary Button
          </Button>
          <Button variant="secondary" rightIcon="arrow-right" fullWidth>
            Secondary Button
          </Button>
          <Badge variant="error" pulse className="inline-flex">
            Status Badge
          </Badge>
        </div>
      </div>
    </div>
  ),
}
