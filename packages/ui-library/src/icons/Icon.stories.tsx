import { useState } from 'react'

import { Icon } from './Icon.js'
import { getAllIconNames, getIconsByCategory, ICON_METADATA, searchIcons } from './metadata.js'
import { CATEGORY_LABELS, SIZE_MAP, type IconCategory } from './types.js'
import { Heading } from '../components/Heading.js'
import { SearchInput } from '../components/SearchInput.js'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta<typeof Icon> = {
  title: 'Foundation/Icons',
  component: Icon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Icon component providing a standardized interface for using icons throughout the application.

**Tier:** 1 (Tailwind + CVA) - Uses @tabler/icons-react internally

**Usage:** Always use this Icon component instead of importing directly from @tabler/icons-react. This ensures consistent sizing, stroke widths, and accessibility attributes.

**Size Presets:**
| Size | Pixels | Use Case |
|------|--------|----------|
| xs | 12 | Inline badges, small indicators |
| sm | 16 | Buttons, inline text |
| md | 20 | Default size |
| lg | 24 | Headers, prominent elements |
| xl | 32 | Feature sections |
| 2xl | 48 | Empty states, hero areas |

**Icon Categories:**
- Navigation: chevrons, arrows
- Actions: search, close, check, copy
- Status: alert, info, resolved, unresolved
- Entity: package, component, file
- Code: code, element, brackets
- Data: database, chart, users

See \`packages/ui-library/ICONS.md\` for full reference and how to add new icons.

**Accessibility:**
- Decorative icons (default): \`aria-hidden="true"\`
- Meaningful icons: Pass \`aria-label\` to add \`role="img"\` and label
        `.trim(),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      description: 'Icon name from the registry (see categories below for all options)',
      control: 'select',
      options: getAllIconNames(),
    },
    size: {
      description: 'Size preset (or pass number for custom pixel size)',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    stroke: {
      description: 'Stroke width override (default: 2, or 1.5 for xl/2xl)',
      control: { type: 'number', min: 0.5, max: 3, step: 0.5 },
    },
    'aria-label': {
      description: 'Accessibility label for meaningful icons (removes aria-hidden)',
    },
    className: {
      description: 'Additional CSS classes (e.g., for colors)',
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: 'search',
    size: 'md',
  },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-base">
      {(Object.keys(SIZE_MAP) as Array<keyof typeof SIZE_MAP>).map((size) => (
        <div key={size} className="flex flex-col items-center gap-sm">
          <Icon name="search" size={size} />
          <span className="text-xs text-foreground-muted">
            {size} ({SIZE_MAP[size]}px)
          </span>
        </div>
      ))}
    </div>
  ),
}

export const WithColors: Story = {
  render: () => (
    <div className="flex gap-base">
      <Icon name="check" size="lg" className="text-status-success-foreground" />
      <Icon name="alert-circle" size="lg" className="text-status-error-foreground" />
      <Icon name="info-circle" size="lg" className="text-interactive-accent" />
      <Icon name="search" size="lg" className="text-foreground-muted" />
    </div>
  ),
}

export const WithAriaLabel: Story = {
  args: {
    name: 'alert-circle',
    size: 'lg',
    'aria-label': 'Error indicator',
  },
}

export const CustomStroke: Story = {
  render: () => (
    <div className="flex gap-base">
      <div className="flex flex-col items-center gap-sm">
        <Icon name="search" size="lg" stroke={1} />
        <span className="text-xs text-foreground-muted">stroke: 1</span>
      </div>
      <div className="flex flex-col items-center gap-sm">
        <Icon name="search" size="lg" stroke={1.5} />
        <span className="text-xs text-foreground-muted">stroke: 1.5</span>
      </div>
      <div className="flex flex-col items-center gap-sm">
        <Icon name="search" size="lg" stroke={2} />
        <span className="text-xs text-foreground-muted">stroke: 2</span>
      </div>
      <div className="flex flex-col items-center gap-sm">
        <Icon name="search" size="lg" stroke={2.5} />
        <span className="text-xs text-foreground-muted">stroke: 2.5</span>
      </div>
    </div>
  ),
}

export const ByCategory: Story = {
  render: () => (
    <div className="flex flex-col gap-lg">
      {(Object.keys(CATEGORY_LABELS) as IconCategory[]).map((category) => (
        <div key={category}>
          <Heading level={3} className="mb-base">
            {CATEGORY_LABELS[category]}
          </Heading>
          <div className="grid grid-cols-2 gap-md sm:grid-cols-3 lg:grid-cols-4">
            {getIconsByCategory(category).map((iconName) => {
              const meta = ICON_METADATA[iconName]
              return (
                <div
                  key={iconName}
                  className="flex flex-col items-center gap-sm rounded-lg border border-border p-base text-center dark:border-border"
                >
                  <div className="flex h-size-lg w-size-lg items-center justify-center rounded-lg bg-surface-subtle">
                    <Icon name={iconName} size="lg" />
                  </div>
                  <span className="font-mono text-sm font-medium">{iconName}</span>
                  <span className="text-xs text-foreground-muted">{meta.description}</span>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}

export const MetadataReference: Story = {
  render: () => {
    const iconName = 'package' as const
    const iconMeta = ICON_METADATA[iconName]
    return (
      <div className="flex max-w-2xl flex-col gap-lg">
        <section>
          <Heading level={3} className="mb-md">
            Available Utility Functions
          </Heading>
          <div className="flex flex-col gap-sm rounded-lg bg-surface-subtle p-base font-mono text-sm">
            <div>
              <span className="text-interactive-accent">getIconsByCategory</span>
              <span className="text-foreground-muted">(category)</span>
              <span className="ml-sm text-foreground-muted">// Get icons in a category</span>
            </div>
            <div>
              <span className="text-interactive-accent">searchIcons</span>
              <span className="text-foreground-muted">(query)</span>
              <span className="ml-sm text-foreground-muted">
                // Search by name, description, or alias
              </span>
            </div>
            <div>
              <span className="text-interactive-accent">getAllIconNames</span>
              <span className="text-foreground-muted">()</span>
              <span className="ml-sm text-foreground-muted">
                // Get all {getAllIconNames().length} icon names
              </span>
            </div>
            <div>
              <span className="text-interactive-accent">ICON_METADATA</span>
              <span className="text-foreground-muted">[name]</span>
              <span className="ml-sm text-foreground-muted">// Get metadata for an icon</span>
            </div>
            <div>
              <span className="text-interactive-accent">CATEGORY_LABELS</span>
              <span className="text-foreground-muted">[category]</span>
              <span className="ml-sm text-foreground-muted">// Get display label for category</span>
            </div>
          </div>
        </section>

        <section>
          <Heading level={3} className="mb-md">
            Metadata Structure
          </Heading>
          <div className="flex flex-col gap-base rounded-lg border border-border p-base dark:border-border">
            <div className="flex items-center gap-md">
              <Icon name={iconName} size="xl" />
              <div>
                <Heading level={4}>ICON_METADATA[&apos;{iconName}&apos;]</Heading>
                <p className="text-sm text-foreground-muted">{iconMeta.description}</p>
              </div>
            </div>
            <dl className="grid grid-cols-[auto_1fr] gap-x-base gap-y-sm text-sm">
              <dt className="font-medium">description:</dt>
              <dd className="font-mono text-foreground-muted">
                &quot;{iconMeta.description}&quot;
              </dd>
              <dt className="font-medium">category:</dt>
              <dd className="font-mono text-foreground-muted">&quot;{iconMeta.category}&quot;</dd>
              <dt className="font-medium">usage:</dt>
              <dd className="font-mono text-foreground-muted">&quot;{iconMeta.usage}&quot;</dd>
              <dt className="font-medium">aliases:</dt>
              <dd className="font-mono text-foreground-muted">
                [{iconMeta.aliases?.map((a) => `"${a}"`).join(', ')}]
              </dd>
            </dl>
          </div>
        </section>

        <section>
          <Heading level={3} className="mb-md">
            Categories
          </Heading>
          <div className="grid grid-cols-2 gap-sm">
            {(Object.keys(CATEGORY_LABELS) as IconCategory[]).map((cat) => (
              <div
                key={cat}
                className="flex items-center justify-between rounded border border-border px-md py-sm dark:border-border"
              >
                <span className="font-mono text-sm">{cat}</span>
                <span className="text-sm text-foreground-muted">
                  {getIconsByCategory(cat).length} icons
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    )
  },
  parameters: {
    layout: 'padded',
  },
}

function SearchableIcons() {
  const [query, setQuery] = useState('')
  const results = query ? searchIcons(query) : getAllIconNames()

  return (
    <div className="flex w-full max-w-2xl flex-col gap-base">
      <SearchInput
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search icons by name, description, or alias..."
      />
      <p className="text-sm text-foreground-muted">
        {results.length} icon{results.length !== 1 ? 's' : ''} found
      </p>
      <div className="grid grid-cols-2 gap-md sm:grid-cols-3">
        {results.map((name) => {
          const iconMeta = ICON_METADATA[name]
          return (
            <div
              key={name}
              className="flex items-start gap-md rounded-lg border border-border p-md dark:border-border"
            >
              <div className="flex h-size-sm w-size-sm shrink-0 items-center justify-center rounded bg-surface-subtle">
                <Icon name={name} size="md" />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate font-mono text-sm font-medium">{name}</span>
                <span className="truncate text-xs text-foreground-muted">
                  {iconMeta.description}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const Searchable: Story = {
  render: () => <SearchableIcons />,
  parameters: {
    layout: 'padded',
  },
}

export const Accessibility: Story = {
  render: () => (
    <div className="flex max-w-xl flex-col gap-lg">
      <section className="flex flex-col gap-md">
        <Heading level={4} size="lg">
          Decorative (default)
        </Heading>
        <div className="flex items-center gap-base rounded-lg border border-border p-base dark:border-border">
          <Icon name="search" size="lg" />
          <div className="flex flex-col gap-xs">
            <code className="rounded bg-surface-subtle px-sm py-xs text-sm">
              aria-hidden=&quot;true&quot;
            </code>
            <span className="text-sm text-foreground-muted">
              Ignored by screen readers. Use when icon is purely decorative or adjacent to
              descriptive text.
            </span>
          </div>
        </div>
        <div className="rounded bg-surface-muted p-md font-mono text-sm dark:bg-surface">
          {'<Icon name="search" />'}
          <br />
          {'<button><Icon name="close" /> Close</button>'}
        </div>
      </section>

      <section className="flex flex-col gap-md">
        <Heading level={4} size="lg">
          Meaningful (with aria-label)
        </Heading>
        <div className="flex items-center gap-base rounded-lg border border-border p-base dark:border-border">
          <Icon name="alert-circle" size="lg" aria-label="Warning" />
          <div className="flex flex-col gap-xs">
            <code className="rounded bg-surface-subtle px-sm py-xs text-sm">
              role=&quot;img&quot; aria-label=&quot;Warning&quot;
            </code>
            <span className="text-sm text-foreground-muted">
              Announced by screen readers. Use when icon conveys meaning not provided by surrounding
              text.
            </span>
          </div>
        </div>
        <div className="rounded bg-surface-muted p-md font-mono text-sm dark:bg-surface">
          {'<Icon name="alert-circle" aria-label="Warning" />'}
          <br />
          {'<button aria-label="Close dialog"><Icon name="close" /></button>'}
        </div>
      </section>

      <section className="flex flex-col gap-md">
        <Heading level={4} size="lg">
          Best Practices
        </Heading>
        <ul className="list-inside list-disc space-y-sm text-sm text-foreground-muted">
          <li>
            <strong>Decorative:</strong> Icon next to text that describes it (button with label)
          </li>
          <li>
            <strong>Meaningful:</strong> Icon-only button, status indicator without text
          </li>
          <li>
            <strong>Forms:</strong> Use <code className="text-xs">aria-describedby</code> to link
            icons to form fields
          </li>
          <li>
            <strong>Interactive:</strong> Ensure icon buttons have visible focus indicators
          </li>
        </ul>
      </section>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}
