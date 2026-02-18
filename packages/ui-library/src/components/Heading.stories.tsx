import { Flex } from './Flex'
import { Heading } from './Heading'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta<typeof Heading> = {
  title: 'Components/Heading',
  component: Heading,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A typography component for rendering semantic headings (h1-h6) with consistent styling.

**Tier:** 1 (Tailwind + CVA)

**Key design:** The \`level\` prop controls the semantic HTML element (h1-h6), while the \`size\` prop controls visual appearance independently. When \`size\` is omitted, it defaults based on \`level\`.

**Usage:** Use for all heading text in the application. Prefer semantic \`level\` that matches document outline, and override \`size\` only when visual hierarchy differs from semantic hierarchy.

**Accessibility:**
- Renders semantic HTML heading elements (h1-h6)
- No additional ARIA needed (native heading semantics)
- Supports all standard HTML heading attributes
        `.trim(),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    level: {
      description: 'Semantic heading level (1-6), determines which HTML element is rendered',
      control: { type: 'number', min: 1, max: 6, step: 1 },
      table: {
        type: { summary: '1 | 2 | 3 | 4 | 5 | 6' },
      },
    },
    size: {
      description:
        'Visual size override. When omitted, defaults based on level (h1=2xl, h2=xl, h3=lg, h4=base, h5=sm, h6=xs)',
      control: 'select',
      options: ['4xl', '3xl', '2xl', 'xl', 'lg', 'base', 'sm', 'xs'],
      table: {
        defaultValue: { summary: 'based on level' },
      },
    },
    color: {
      description: 'Text color variant',
      control: 'select',
      options: ['default', 'muted'],
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    tracking: {
      description: 'Letter spacing',
      control: 'select',
      options: ['normal', 'tight'],
      table: {
        defaultValue: { summary: 'normal' },
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    level: 1,
    children: 'Heading Level 1',
  },
}

export const Level2: Story = {
  args: {
    level: 2,
    children: 'Heading Level 2',
  },
}

export const Level3: Story = {
  args: {
    level: 3,
    children: 'Heading Level 3',
  },
}

export const Muted: Story = {
  args: {
    level: 2,
    color: 'muted',
    children: 'Muted Heading',
  },
}

export const SizeOverride: Story = {
  args: {
    level: 3,
    size: '2xl',
    children: 'H3 with 2xl size',
  },
}

export const TightTracking: Story = {
  args: {
    level: 1,
    size: '4xl',
    tracking: 'tight',
    children: 'Tight Tracking',
  },
}

export const AllLevels: Story = {
  render: () => (
    <Flex gap="md">
      <Heading level={1}>Heading Level 1 (h1 - 2xl)</Heading>
      <Heading level={2}>Heading Level 2 (h2 - xl)</Heading>
      <Heading level={3}>Heading Level 3 (h3 - lg)</Heading>
      <Heading level={4}>Heading Level 4 (h4 - base)</Heading>
      <Heading level={5}>Heading Level 5 (h5 - sm)</Heading>
      <Heading level={6}>Heading Level 6 (h6 - xs)</Heading>
    </Flex>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <Flex gap="md">
      <Heading level={1} size="4xl">
        Size 4xl
      </Heading>
      <Heading level={1} size="3xl">
        Size 3xl
      </Heading>
      <Heading level={1} size="2xl">
        Size 2xl
      </Heading>
      <Heading level={1} size="xl">
        Size xl
      </Heading>
      <Heading level={1} size="lg">
        Size lg
      </Heading>
      <Heading level={1} size="base">
        Size base
      </Heading>
      <Heading level={1} size="sm">
        Size sm
      </Heading>
      <Heading level={1} size="xs">
        Size xs
      </Heading>
    </Flex>
  ),
}

export const ColorVariants: Story = {
  render: () => (
    <Flex gap="md">
      <Heading level={2} color="default">
        Default color
      </Heading>
      <Heading level={2} color="muted">
        Muted color
      </Heading>
    </Flex>
  ),
}

export const LevelSizeIndependence: Story = {
  name: 'Level/Size Independence',
  render: () => (
    <Flex gap="md">
      <Heading level={1} size="sm">
        h1 rendered at sm size
      </Heading>
      <Heading level={6} size="4xl">
        h6 rendered at 4xl size
      </Heading>
      <Heading level={3} size="2xl">
        h3 rendered at 2xl size
      </Heading>
    </Flex>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <Flex gap="lg">
      <section>
        <Heading level={3} className="mb-sm">
          Default Levels
        </Heading>
        <Flex gap="sm">
          <Heading level={1}>Heading Level 1</Heading>
          <Heading level={2}>Heading Level 2</Heading>
          <Heading level={3}>Heading Level 3</Heading>
          <Heading level={4}>Heading Level 4</Heading>
          <Heading level={5}>Heading Level 5</Heading>
          <Heading level={6}>Heading Level 6</Heading>
        </Flex>
      </section>

      <section>
        <Heading level={3} className="mb-sm">
          Color Variants
        </Heading>
        <Flex gap="sm">
          <Heading level={2} color="default">
            Default color
          </Heading>
          <Heading level={2} color="muted">
            Muted color
          </Heading>
        </Flex>
      </section>

      <section>
        <Heading level={3} className="mb-sm">
          Size Overrides
        </Heading>
        <Flex gap="sm">
          <Heading level={3} size="4xl">
            h3 at 4xl
          </Heading>
          <Heading level={3} size="xl">
            h3 at xl
          </Heading>
          <Heading level={3} size="sm">
            h3 at sm
          </Heading>
        </Flex>
      </section>
    </Flex>
  ),
}
