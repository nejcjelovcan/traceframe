import { Grid } from './Grid'
import { Heading } from './Heading'
import { Link } from './Link'
import { Stack } from './Stack'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Link> = {
  title: 'Components/Link',
  component: Link,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A versatile anchor component for navigation with multiple style variants and icon support.

**Tier:** 1 (Tailwind + CVA)

**Usage:** Use for navigation links throughout the application. Choose the variant that best fits your context:
- **default**: Standard links in text content with underline
- **subtle**: Less prominent links that become more visible on hover
- **standalone**: CTA-style links that work like buttons

**External Links:**
When \`external={true}\`:
- Adds \`target="_blank"\` to open in new tab
- Adds \`rel="noopener noreferrer"\` for security
- Automatically shows an external link icon (unless custom icon specified)
- Includes "(opens in new tab)" text for screen readers

**Icon Support:**
- Custom icons via the \`icon\` prop
- Icons can be positioned left or right of text
- Icons automatically scale with text size

**Accessibility:**
- Uses semantic \`<a>\` element
- External links include visual indicator and screen reader text
- Visible focus state for keyboard navigation
- Inherits browser link behaviors (middle-click, right-click menu)
- Meets WCAG contrast requirements for all variants
        `.trim(),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    href: {
      description: 'URL to navigate to',
      control: 'text',
    },
    variant: {
      description: 'Visual style variant',
      control: 'select',
      options: ['default', 'subtle', 'standalone'],
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      description: 'Size of the link text and icon',
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    external: {
      description: 'Whether the link opens in a new tab with external indicator',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    icon: {
      description: 'Icon name from ui-library Icon component',
      control: 'select',
      options: [undefined, 'arrow-right', 'chevron-right', 'external', 'file', 'package'],
    },
    iconPosition: {
      description: 'Position of icon relative to text',
      control: 'radio',
      options: ['left', 'right'],
      table: {
        defaultValue: { summary: 'right' },
      },
    },
    children: {
      description: 'Link text content',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    href: '/packages',
    children: 'View packages',
  },
}

export const Variants: Story = {
  render: () => (
    <Stack gap="md">
      <div>
        <span className="text-foreground-muted mr-sm">Default:</span>
        <Link href="/packages">View packages</Link>
      </div>
      <div>
        <span className="text-foreground-muted mr-sm">Subtle:</span>
        <Link href="/dashboard" variant="subtle">
          Go to Dashboard
        </Link>
      </div>
      <div>
        <span className="text-foreground-muted mr-sm">Standalone:</span>
        <Link href="/new" variant="standalone">
          Create new project
        </Link>
      </div>
    </Stack>
  ),
}

export const Sizes: Story = {
  render: () => (
    <Stack gap="md">
      <Stack direction="horizontal" align="center" gap="base">
        <span className="text-foreground-muted">Small:</span>
        <Link href="/small" size="sm">
          Small link text
        </Link>
      </Stack>
      <Stack direction="horizontal" align="center" gap="base">
        <span className="text-foreground-muted">Medium:</span>
        <Link href="/medium" size="md">
          Medium link text
        </Link>
      </Stack>
      <Stack direction="horizontal" align="center" gap="base">
        <span className="text-foreground-muted">Large:</span>
        <Link href="/large" size="lg">
          Large link text
        </Link>
      </Stack>
    </Stack>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <Stack gap="md">
      <div>
        <Link href="/next" icon="arrow-right">
          Continue to next step
        </Link>
      </div>
      <div>
        <Link href="/back" icon="arrow-left" iconPosition="left">
          Go back
        </Link>
      </div>
      <div>
        <Link href="/packages" icon="package">
          Browse packages
        </Link>
      </div>
      <div>
        <Link href="/files" icon="file" iconPosition="left">
          View files
        </Link>
      </div>
    </Stack>
  ),
}

export const External: Story = {
  render: () => (
    <Stack gap="md">
      <div>
        <span className="text-foreground-muted">Auto external icon: </span>
        <Link href="https://github.com" external>
          GitHub
        </Link>
      </div>
      <div>
        <span className="text-foreground-muted">Custom icon on external: </span>
        <Link href="https://docs.example.com" external icon="file-description">
          Documentation
        </Link>
      </div>
      <div>
        <span className="text-foreground-muted">External with left icon: </span>
        <Link href="https://www.npmjs.com" external icon="package" iconPosition="left">
          NPM Package
        </Link>
      </div>
    </Stack>
  ),
}

export const InlineUsage: Story = {
  render: () => (
    <Stack gap="base" className="max-w-prose">
      <p className="text-foreground">
        Links can be used <Link href="/inline">inline within text</Link> like this. They maintain
        proper alignment with surrounding text.
      </p>
      <p className="text-foreground">
        You can also use{' '}
        <Link href="/subtle" variant="subtle">
          subtle links
        </Link>{' '}
        for less emphasis, or{' '}
        <Link href="/standalone" variant="standalone">
          standalone links
        </Link>{' '}
        for calls to action.
      </p>
      <p className="text-foreground text-sm">
        Small text with{' '}
        <Link href="/small" size="sm">
          matching small links
        </Link>{' '}
        and even{' '}
        <Link href="https://example.com" size="sm" external>
          external links
        </Link>{' '}
        scale appropriately.
      </p>
    </Stack>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <Stack gap="lg">
      {/* Variants Grid */}
      <section>
        <Heading level={3} className="mb-base">
          Variants
        </Heading>
        <Grid cols={4} gap="base">
          <div>
            <p className="text-sm text-foreground-muted mb-sm">Default</p>
            <Link href="/default">Default link</Link>
          </div>
          <div>
            <p className="text-sm text-foreground-muted mb-sm">Subtle</p>
            <Link href="/subtle" variant="subtle">
              Subtle link
            </Link>
          </div>
          <div>
            <p className="text-sm text-foreground-muted mb-sm">Standalone</p>
            <Link href="/standalone" variant="standalone">
              Standalone link
            </Link>
          </div>
        </Grid>
      </section>

      {/* Sizes Grid */}
      <section>
        <Heading level={3} className="mb-base">
          Sizes
        </Heading>
        <Grid cols={3} gap="base">
          <div>
            <p className="text-sm text-foreground-muted mb-sm">Small</p>
            <Link href="/small" size="sm">
              Small link
            </Link>
          </div>
          <div>
            <p className="text-sm text-foreground-muted mb-sm">Medium</p>
            <Link href="/medium" size="md">
              Medium link
            </Link>
          </div>
          <div>
            <p className="text-sm text-foreground-muted mb-sm">Large</p>
            <Link href="/large" size="lg">
              Large link
            </Link>
          </div>
        </Grid>
      </section>

      {/* With Icons */}
      <section>
        <Heading level={3} className="mb-base">
          With Icons
        </Heading>
        <Grid cols={2} gap="base">
          <div>
            <p className="text-sm text-foreground-muted mb-sm">Icon Right</p>
            <Link href="/next" icon="arrow-right">
              Next page
            </Link>
          </div>
          <div>
            <p className="text-sm text-foreground-muted mb-sm">Icon Left</p>
            <Link href="/back" icon="arrow-left" iconPosition="left">
              Previous page
            </Link>
          </div>
        </Grid>
      </section>

      {/* External Links */}
      <section>
        <Heading level={3} className="mb-base">
          External Links
        </Heading>
        <Grid cols={2} gap="base">
          <div>
            <p className="text-sm text-foreground-muted mb-sm">Auto External Icon</p>
            <Link href="https://github.com" external>
              GitHub
            </Link>
          </div>
          <div>
            <p className="text-sm text-foreground-muted mb-sm">Custom Icon</p>
            <Link href="https://docs.example.com" external icon="file-description">
              Documentation
            </Link>
          </div>
        </Grid>
      </section>

      {/* All Combinations Matrix */}
      <section>
        <Heading level={3} className="mb-base">
          All Combinations
        </Heading>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-sm text-foreground-muted">Variant</th>
                <th className="text-left p-sm text-foreground-muted">Small</th>
                <th className="text-left p-sm text-foreground-muted">Medium</th>
                <th className="text-left p-sm text-foreground-muted">Large</th>
                <th className="text-left p-sm text-foreground-muted">With Icon</th>
                <th className="text-left p-sm text-foreground-muted">External</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="p-sm text-foreground-muted">Default</td>
                <td className="p-sm">
                  <Link href="#" size="sm">
                    Link
                  </Link>
                </td>
                <td className="p-sm">
                  <Link href="#">Link</Link>
                </td>
                <td className="p-sm">
                  <Link href="#" size="lg">
                    Link
                  </Link>
                </td>
                <td className="p-sm">
                  <Link href="#" icon="arrow-right">
                    Link
                  </Link>
                </td>
                <td className="p-sm">
                  <Link href="https://example.com" external>
                    Link
                  </Link>
                </td>
              </tr>
              <tr>
                <td className="p-sm text-foreground-muted">Subtle</td>
                <td className="p-sm">
                  <Link href="#" variant="subtle" size="sm">
                    Link
                  </Link>
                </td>
                <td className="p-sm">
                  <Link href="#" variant="subtle">
                    Link
                  </Link>
                </td>
                <td className="p-sm">
                  <Link href="#" variant="subtle" size="lg">
                    Link
                  </Link>
                </td>
                <td className="p-sm">
                  <Link href="#" variant="subtle" icon="chevron-right">
                    Link
                  </Link>
                </td>
                <td className="p-sm">
                  <Link href="https://example.com" variant="subtle" external>
                    Link
                  </Link>
                </td>
              </tr>
              <tr>
                <td className="p-sm text-foreground-muted">Standalone</td>
                <td className="p-sm">
                  <Link href="#" variant="standalone" size="sm">
                    Link
                  </Link>
                </td>
                <td className="p-sm">
                  <Link href="#" variant="standalone">
                    Link
                  </Link>
                </td>
                <td className="p-sm">
                  <Link href="#" variant="standalone" size="lg">
                    Link
                  </Link>
                </td>
                <td className="p-sm">
                  <Link href="#" variant="standalone" icon="arrow-right">
                    Link
                  </Link>
                </td>
                <td className="p-sm">
                  <Link href="https://example.com" variant="standalone" external>
                    Link
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </Stack>
  ),
}
