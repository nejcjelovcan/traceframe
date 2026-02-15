import { Badge } from './Badge'
import { Grid } from './Grid'
import { Heading } from './Heading'
import { Stack } from './Stack'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A small label component for displaying status, categories, or counts.

**Tier:** 1 (Tailwind + CVA)

**Usage:** Use badges to highlight metadata, status indicators, tags, or counts. Common use cases include displaying item counts, category labels, or status flags.

**Accessibility:**
- Uses semantic \`<span>\` element
- Color is not the only indicator of meaning - text content provides context
- Sufficient color contrast ratios for all variants
        `.trim(),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      description: 'Visual style variant indicating semantic meaning',
      control: 'select',
      options: [
        'default',
        'secondary',
        'info',
        'success',
        'warning',
        'error',
        'accent1',
        'accent2',
        'accent3',
        'accent4',
        'accent5',
        'outline-default',
        'outline-info',
        'outline-success',
        'outline-warning',
        'outline-error',
        'outline-accent1',
        'outline-accent2',
        'outline-accent3',
        'outline-accent4',
        'outline-accent5',
        'emphasis-info',
        'emphasis-success',
        'emphasis-warning',
        'emphasis-error',
      ],
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      description: 'Size preset affecting padding and font size',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    children: {
      description: 'Badge content (text or number)',
    },
    icon: {
      description: 'Icon name from ui-library Icon component',
      control: 'text',
    },
    iconPosition: {
      description: 'Icon position relative to text',
      control: 'select',
      options: ['left', 'right'],
      table: {
        defaultValue: { summary: 'left' },
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: 'default',
    children: '12 usages',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Local',
  },
}

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'Information',
  },
}

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Resolved',
  },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Deprecated',
  },
}

export const Error: Story = {
  args: {
    variant: 'error',
    children: '3 errors',
  },
}

export const ExtraSmall: Story = {
  args: {
    size: 'xs',
    children: 'Extra Small',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small',
  },
}

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Medium',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large',
  },
}

export const WithIcon: Story = {
  args: {
    variant: 'success',
    icon: 'check',
    children: 'Resolved',
  },
}

export const WithIconRight: Story = {
  args: {
    variant: 'error',
    icon: 'close',
    iconPosition: 'right',
    children: '3 errors',
  },
}

export const OutlineVariant: Story = {
  args: {
    variant: 'outline-success',
    icon: 'check',
    children: 'CI Passing',
  },
}

export const EmphasisInfo: Story = {
  args: {
    variant: 'emphasis-info',
    icon: 'info-circle',
    children: 'New',
  },
}

export const EmphasisSuccess: Story = {
  args: {
    variant: 'emphasis-success',
    icon: 'check',
    children: 'Deployed',
  },
}

export const EmphasisWarning: Story = {
  args: {
    variant: 'emphasis-warning',
    icon: 'alert-circle',
    children: 'Beta',
  },
}

export const EmphasisError: Story = {
  args: {
    variant: 'emphasis-error',
    children: 'Critical',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-base">
      <div className="flex gap-sm">
        <Badge variant="default">Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="info">Info</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="error">Error</Badge>
      </div>
      <div className="flex gap-sm">
        <Badge variant="accent1">Accent 1</Badge>
        <Badge variant="accent2">Accent 2</Badge>
        <Badge variant="accent3">Accent 3</Badge>
        <Badge variant="accent4">Accent 4</Badge>
        <Badge variant="accent5">Accent 5</Badge>
      </div>
      <div className="flex gap-sm">
        <Badge variant="emphasis-info" icon="info-circle">
          New
        </Badge>
        <Badge variant="emphasis-success" icon="check">
          Deployed
        </Badge>
        <Badge variant="emphasis-warning" icon="alert-circle">
          Beta
        </Badge>
        <Badge variant="emphasis-error">Critical</Badge>
      </div>
      <div className="flex items-center gap-sm">
        <Badge size="xs">Extra Small</Badge>
        <Badge size="sm">Small</Badge>
        <Badge size="md">Medium</Badge>
        <Badge size="lg">Large</Badge>
      </div>
    </div>
  ),
}

export const Showcase: Story = {
  render: () => (
    <Stack gap="lg">
      {/* All variants grid */}
      <section>
        <Heading level={3} className="mb-base">
          All Variants
        </Heading>
        <Grid cols={4} gap="md">
          {/* Filled variants */}
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          {/* Status variants */}
          <Badge variant="info">Info</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          {/* Accent variants */}
          <Badge variant="accent1">Accent 1</Badge>
          <Badge variant="accent2">Accent 2</Badge>
          <Badge variant="accent3">Accent 3</Badge>
          <Badge variant="accent4">Accent 4</Badge>
          <Badge variant="accent5">Accent 5</Badge>
          {/* Outline variants */}
          <Badge variant="outline-default">Outline</Badge>
          <Badge variant="outline-info">Info</Badge>
          <Badge variant="outline-success">Success</Badge>
          <Badge variant="outline-warning">Warning</Badge>
          <Badge variant="outline-error">Error</Badge>
          {/* Outline accent variants */}
          <Badge variant="outline-accent1">Accent 1</Badge>
          <Badge variant="outline-accent2">Accent 2</Badge>
          <Badge variant="outline-accent3">Accent 3</Badge>
          <Badge variant="outline-accent4">Accent 4</Badge>
          <Badge variant="outline-accent5">Accent 5</Badge>
          {/* Emphasis variants */}
          <Badge variant="emphasis-info">Info</Badge>
          <Badge variant="emphasis-success">Success</Badge>
          <Badge variant="emphasis-warning">Warning</Badge>
          <Badge variant="emphasis-error">Error</Badge>
        </Grid>
      </section>

      {/* Sizes */}
      <section>
        <Heading level={3} className="mb-base">
          Sizes
        </Heading>
        <Grid cols={4} gap="md">
          <Badge size="xs">Extra Small</Badge>
          <Badge size="sm">Small</Badge>
          <Badge size="md">Medium</Badge>
          <Badge size="lg">Large</Badge>
        </Grid>
      </section>

      {/* With Icons */}
      <section>
        <Heading level={3} className="mb-base">
          With Icons
        </Heading>
        <Grid cols={4} gap="md">
          <Badge variant="success" icon="check">
            Resolved
          </Badge>
          <Badge variant="warning" icon="alert-circle">
            Warning
          </Badge>
          <Badge variant="error" icon="close" iconPosition="right">
            3 errors
          </Badge>
          <Badge variant="default" icon="package">
            npm package
          </Badge>
        </Grid>
      </section>

      {/* Real-world Examples */}
      <section>
        <Heading level={3} className="mb-base">
          Real-world Examples
        </Heading>
        <Grid cols={4} gap="md">
          <Badge size="xs" variant="accent1">
            v2.0.0
          </Badge>
          <Badge variant="outline-success" icon="check">
            CI Passing
          </Badge>
          <Badge variant="accent4">12 usages</Badge>
          <Badge variant="error" icon="alert-circle">
            3 errors
          </Badge>
          <Badge variant="secondary" icon="external">
            External
          </Badge>
          <Badge variant="accent3" size="sm" icon="package">
            @mui/material
          </Badge>
          <Badge variant="outline-warning" icon="alert-circle">
            Deprecated
          </Badge>
          <Badge variant="info" icon="info-circle">
            Beta
          </Badge>
          <Badge variant="emphasis-error">Critical</Badge>
          <Badge variant="emphasis-success" icon="check">
            Deployed
          </Badge>
          <Badge variant="emphasis-warning" icon="alert-circle">
            Beta Feature
          </Badge>
          <Badge variant="emphasis-info" size="sm">
            New
          </Badge>
          <Badge variant="emphasis-error" size="lg" icon="close">
            System Down
          </Badge>
          <Badge variant="emphasis-success" size="xs">
            Live
          </Badge>
        </Grid>
      </section>
    </Stack>
  ),
}
