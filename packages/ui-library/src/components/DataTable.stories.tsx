import { useState } from 'react'

import { Badge } from './Badge'
import { Button } from './Button'
import { DataTable, type Column, type SortState } from './DataTable'
import { EmptyState } from './EmptyState'
import { Heading } from './Heading'
import { Stack } from './Stack'
import { Icon } from '../icons/index.js'

import type { Meta, StoryObj } from '@storybook/react-vite'

interface SampleRow {
  id: number
  name: string
  status: 'active' | 'inactive' | 'pending'
  count: number
}

const sampleData: SampleRow[] = [
  { id: 1, name: 'Button', status: 'active', count: 42 },
  { id: 2, name: 'Card', status: 'active', count: 28 },
  { id: 3, name: 'Badge', status: 'pending', count: 15 },
  { id: 4, name: 'Modal', status: 'inactive', count: 0 },
  { id: 5, name: 'Input', status: 'active', count: 33 },
]

const basicColumns: Column<SampleRow>[] = [
  { key: 'id', header: 'ID' },
  { key: 'name', header: 'Component' },
  { key: 'status', header: 'Status' },
  { key: 'count', header: 'Usage Count' },
]

const meta: Meta<typeof DataTable<SampleRow>> = {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A data table component with sorting and virtualization support for large datasets.

**Tier:** 1 (Tailwind + CVA)

**Features:**
- Column definitions with custom renderers
- Sortable columns with visual indicators
- Row virtualization for large datasets (@tanstack/react-virtual)
- Row click handlers for selection/navigation
- Customizable column widths (fixed or percentage)
- Custom empty state

**Virtualization:**
When \`virtualized={true}\`:
- Only visible rows are rendered in the DOM
- Requires \`maxHeight\` prop for scroll container
- Optional \`rowHeight\` for custom row heights (default: 48px)
- Use \`getRowKey\` for stable row identity during scrolling

**Accessibility:**
- Uses semantic \`<table>\`, \`<thead>\`, \`<tbody>\` elements
- Sortable headers are keyboard accessible (Tab + Enter/Space)
- Sort state announced via live region for screen readers
- Clickable rows have \`cursor-pointer\` visual indicator
        `.trim(),
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <DataTable columns={basicColumns} data={sampleData} />,
}

export const CustomRenderers: Story = {
  render: () => {
    const columnsWithRenderers: Column<SampleRow>[] = [
      { key: 'id', header: 'ID' },
      { key: 'name', header: 'Component' },
      {
        key: 'status',
        header: 'Status',
        render: (row) => {
          const variantMap = {
            active: 'success',
            inactive: 'error',
            pending: 'warning',
          } as const
          return <Badge variant={variantMap[row.status]}>{row.status}</Badge>
        },
      },
      {
        key: 'count',
        header: 'Usage Count',
        render: (row) => (
          <span className={row.count === 0 ? 'text-foreground-muted' : 'font-medium'}>
            {row.count}
          </span>
        ),
      },
    ]

    return <DataTable columns={columnsWithRenderers} data={sampleData} />
  },
}

export const RowClickable: Story = {
  render: () => {
    const handleRowClick = (row: SampleRow, index: number) => {
      alert(`Clicked row ${index}: ${row.name}`)
    }

    return <DataTable columns={basicColumns} data={sampleData} onRowClick={handleRowClick} />
  },
}

export const CustomEmptyState: Story = {
  render: () => (
    <DataTable
      columns={basicColumns}
      data={[]}
      emptyState={
        <Stack align="center" gap="sm">
          <span className="text-2xl">📭</span>
          <span className="text-foreground-muted">No components found</span>
          <span className="text-sm text-foreground-muted">Try adjusting your filters</span>
        </Stack>
      }
    />
  ),
}

export const DefaultEmptyState: Story = {
  render: () => <DataTable columns={basicColumns} data={[]} />,
}

export const ColumnWidths: Story = {
  render: () => {
    const columnsWithWidths: Column<SampleRow>[] = [
      { key: 'id', header: 'ID', width: 60 },
      { key: 'name', header: 'Component', width: '40%' },
      { key: 'status', header: 'Status', width: 120 },
      { key: 'count', header: 'Usage Count' },
    ]

    return <DataTable columns={columnsWithWidths} data={sampleData} />
  },
}

export const AllFeatures: Story = {
  render: () => {
    const columnsWithAll: Column<SampleRow>[] = [
      { key: 'id', header: 'ID', width: 60 },
      { key: 'name', header: 'Component', width: '30%' },
      {
        key: 'status',
        header: 'Status',
        width: 120,
        render: (row) => {
          const variantMap = {
            active: 'success',
            inactive: 'error',
            pending: 'warning',
          } as const
          return <Badge variant={variantMap[row.status]}>{row.status}</Badge>
        },
      },
      {
        key: 'count',
        header: 'Usage Count',
        render: (row) => (
          <span className={row.count === 0 ? 'text-foreground-muted' : 'font-medium'}>
            {row.count}
          </span>
        ),
      },
    ]

    return (
      <DataTable
        columns={columnsWithAll}
        data={sampleData}
        onRowClick={(row) => alert(`Selected: ${row.name}`)}
      />
    )
  },
}

// Size Variant Stories

export const SizeSmall: Story = {
  render: () => (
    <Stack gap="base">
      <p className="text-sm text-foreground-muted">
        Small size variant with compact padding and smaller text.
      </p>
      <DataTable columns={basicColumns} data={sampleData} size="sm" />
    </Stack>
  ),
}

export const SizeMedium: Story = {
  render: () => (
    <Stack gap="base">
      <p className="text-sm text-foreground-muted">
        Medium size variant (default) with balanced padding.
      </p>
      <DataTable columns={basicColumns} data={sampleData} size="md" />
    </Stack>
  ),
}

export const SizeLarge: Story = {
  render: () => (
    <Stack gap="base">
      <p className="text-sm text-foreground-muted">
        Large size variant with comfortable padding and larger text.
      </p>
      <DataTable columns={basicColumns} data={sampleData} size="lg" />
    </Stack>
  ),
}

// Visual Variant Stories

export const VariantDefault: Story = {
  render: () => (
    <Stack gap="base">
      <p className="text-sm text-foreground-muted">Default variant with minimal borders.</p>
      <DataTable columns={basicColumns} data={sampleData} variant="default" />
    </Stack>
  ),
}

export const VariantStriped: Story = {
  render: () => (
    <Stack gap="base">
      <p className="text-sm text-foreground-muted">
        Striped variant with alternating row backgrounds for easier data scanning.
      </p>
      <DataTable columns={basicColumns} data={sampleData} variant="striped" />
    </Stack>
  ),
}

export const VariantBordered: Story = {
  render: () => (
    <Stack gap="base">
      <p className="text-sm text-foreground-muted">
        Bordered variant with full grid lines on all cells.
      </p>
      <DataTable columns={basicColumns} data={sampleData} variant="bordered" />
    </Stack>
  ),
}

// Combined Variant Stories

export const SmallStriped: Story = {
  render: () => (
    <Stack gap="base">
      <p className="text-sm text-foreground-muted">
        Combination of small size and striped variant for compact data tables.
      </p>
      <DataTable columns={basicColumns} data={sampleData} size="sm" variant="striped" />
    </Stack>
  ),
}

export const LargeBordered: Story = {
  render: () => (
    <Stack gap="base">
      <p className="text-sm text-foreground-muted">
        Combination of large size and bordered variant for enhanced readability.
      </p>
      <DataTable columns={basicColumns} data={sampleData} size="lg" variant="bordered" />
    </Stack>
  ),
}

// Sortable Stories

const sortableColumns: Column<SampleRow>[] = [
  { key: 'id', header: 'ID', sortable: true },
  { key: 'name', header: 'Component', sortable: true },
  { key: 'status', header: 'Status', sortable: true },
  { key: 'count', header: 'Usage Count', sortable: true },
]

const SortableTableDemo = ({
  columns,
  initialSort,
}: {
  columns: Column<SampleRow>[]
  initialSort?: SortState | null
}) => {
  const [sortState, setSortState] = useState<SortState | null>(initialSort ?? null)
  const [data, setData] = useState(sampleData)

  const handleSort = (column: string) => {
    const newDirection: 'asc' | 'desc' =
      sortState?.column === column && sortState.direction === 'asc' ? 'desc' : 'asc'

    setSortState({ column, direction: newDirection })

    const sorted = [...sampleData].sort((a, b) => {
      const aValue = a[column as keyof SampleRow]
      const bValue = b[column as keyof SampleRow]

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return newDirection === 'asc' ? aValue - bValue : bValue - aValue
      }

      const aStr = String(aValue)
      const bStr = String(bValue)
      return newDirection === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
    })

    setData(sorted)
  }

  return <DataTable columns={columns} data={data} sortState={sortState} onSort={handleSort} />
}

export const Sortable: Story = {
  render: () => <SortableTableDemo columns={sortableColumns} />,
}

export const SortedAscending: Story = {
  render: () => (
    <SortableTableDemo
      columns={sortableColumns}
      initialSort={{ column: 'name', direction: 'asc' }}
    />
  ),
}

export const SortedDescending: Story = {
  render: () => (
    <SortableTableDemo
      columns={sortableColumns}
      initialSort={{ column: 'count', direction: 'desc' }}
    />
  ),
}

const mixedSortableColumns: Column<SampleRow>[] = [
  { key: 'id', header: 'ID', sortable: true },
  { key: 'name', header: 'Component', sortable: true },
  { key: 'status', header: 'Status' }, // Not sortable
  { key: 'count', header: 'Usage Count', sortable: true },
]

export const MixedSortable: Story = {
  render: () => <SortableTableDemo columns={mixedSortableColumns} />,
}

export const WithKeyboardNavigation: Story = {
  render: () => (
    <Stack gap="base">
      <p className="text-sm text-foreground-muted">
        Use Tab to navigate between sortable headers, then press Enter or Space to sort.
      </p>
      <SortableTableDemo columns={sortableColumns} />
    </Stack>
  ),
}

// Virtualization Stories

interface VirtualizedRow {
  id: number
  name: string
  status: 'active' | 'inactive' | 'pending'
  value: number
}

const generateLargeData = (count: number): VirtualizedRow[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    status: (['active', 'inactive', 'pending'] as const)[i % 3]!,
    value: Math.round(Math.random() * 1000),
  }))

const virtualizedColumns: Column<VirtualizedRow>[] = [
  { key: 'id', header: 'ID', width: 80 },
  { key: 'name', header: 'Name' },
  { key: 'status', header: 'Status', width: 120 },
  { key: 'value', header: 'Value', width: 100 },
]

export const Virtualized: Story = {
  render: () => (
    <DataTable
      columns={virtualizedColumns}
      data={generateLargeData(100)}
      virtualized={true}
      maxHeight={400}
      getRowKey={(row) => row.id}
    />
  ),
}

export const LargeDataset: Story = {
  render: () => {
    const largeData = generateLargeData(5000)
    return (
      <Stack gap="base">
        <p className="text-sm text-foreground-muted">
          Rendering 5,000 rows with virtualization. Only visible rows are rendered in the DOM.
        </p>
        <DataTable
          columns={virtualizedColumns}
          data={largeData}
          virtualized={true}
          maxHeight={400}
          getRowKey={(row) => row.id}
        />
      </Stack>
    )
  },
}

export const CustomRowHeight: Story = {
  render: () => (
    <Stack gap="base">
      <p className="text-sm text-foreground-muted">
        Virtualized table with custom row height of 60px.
      </p>
      <DataTable
        columns={virtualizedColumns}
        data={generateLargeData(100)}
        virtualized={true}
        maxHeight={400}
        rowHeight={60}
        getRowKey={(row) => row.id}
      />
    </Stack>
  ),
}

export const WithGetRowKey: Story = {
  render: () => {
    const getRowKey = (row: VirtualizedRow) => `custom-key-${row.id}`
    return (
      <Stack gap="base">
        <p className="text-sm text-foreground-muted">
          Virtualized table with custom getRowKey function for stable row identity.
        </p>
        <DataTable
          columns={virtualizedColumns}
          data={generateLargeData(100)}
          virtualized={true}
          maxHeight={400}
          getRowKey={getRowKey}
        />
      </Stack>
    )
  },
}

const VirtualizedSortableDemo = () => {
  const [sortState, setSortState] = useState<SortState | null>(null)
  const [data, setData] = useState(() => generateLargeData(1000))
  const baseData = generateLargeData(1000)

  const sortableVirtualizedColumns: Column<VirtualizedRow>[] = [
    { key: 'id', header: 'ID', width: 80, sortable: true },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'status', header: 'Status', width: 120, sortable: true },
    { key: 'value', header: 'Value', width: 100, sortable: true },
  ]

  const handleSort = (column: string) => {
    const newDirection: 'asc' | 'desc' =
      sortState?.column === column && sortState.direction === 'asc' ? 'desc' : 'asc'

    setSortState({ column, direction: newDirection })

    const sorted = [...baseData].sort((a, b) => {
      const aValue = a[column as keyof VirtualizedRow]
      const bValue = b[column as keyof VirtualizedRow]

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return newDirection === 'asc' ? aValue - bValue : bValue - aValue
      }

      const aStr = String(aValue)
      const bStr = String(bValue)
      return newDirection === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
    })

    setData(sorted)
  }

  return (
    <Stack gap="base">
      <p className="text-sm text-foreground-muted">
        Virtualized table with 1,000 rows and sortable columns.
      </p>
      <DataTable
        columns={sortableVirtualizedColumns}
        data={data}
        virtualized={true}
        maxHeight={400}
        sortState={sortState}
        onSort={handleSort}
        getRowKey={(row) => row.id}
      />
    </Stack>
  )
}

export const VirtualizedWithSorting: Story = {
  render: () => <VirtualizedSortableDemo />,
}

export const VirtualizedWithRowClick: Story = {
  render: () => (
    <Stack gap="base">
      <p className="text-sm text-foreground-muted">
        Virtualized table with row click handler. Click any row to see an alert.
      </p>
      <DataTable
        columns={virtualizedColumns}
        data={generateLargeData(100)}
        virtualized={true}
        maxHeight={400}
        getRowKey={(row) => row.id}
        onRowClick={(row) => alert(`Clicked row: ${row.name}`)}
      />
    </Stack>
  ),
}

// Showcase Story

interface ShowcaseRow {
  id: number
  component: string
  status: 'stable' | 'beta' | 'alpha' | 'deprecated'
  version: string
  downloads: number
  size: string
  lastUpdated: string
  hasTypes: boolean
}

const ShowcaseTableDemo = () => {
  const [sortState, setSortState] = useState<SortState | null>({
    column: 'downloads',
    direction: 'desc',
  })
  const [sizeVariant, setSizeVariant] = useState<'sm' | 'md' | 'lg'>('md')
  const [visualVariant, setVisualVariant] = useState<'default' | 'striped' | 'bordered'>('striped')
  const [showEmpty, setShowEmpty] = useState(false)
  const [virtualize, setVirtualize] = useState(false)

  const showcaseData: ShowcaseRow[] = [
    {
      id: 1,
      component: 'Button',
      status: 'stable',
      version: '2.1.0',
      downloads: 45230,
      size: '12.4 KB',
      lastUpdated: '2024-01-15',
      hasTypes: true,
    },
    {
      id: 2,
      component: 'Card',
      status: 'stable',
      version: '1.8.2',
      downloads: 38450,
      size: '8.7 KB',
      lastUpdated: '2024-01-12',
      hasTypes: true,
    },
    {
      id: 3,
      component: 'Modal',
      status: 'beta',
      version: '0.9.5',
      downloads: 22100,
      size: '18.3 KB',
      lastUpdated: '2024-01-10',
      hasTypes: true,
    },
    {
      id: 4,
      component: 'Dropdown',
      status: 'stable',
      version: '1.5.1',
      downloads: 31200,
      size: '15.2 KB',
      lastUpdated: '2024-01-08',
      hasTypes: false,
    },
    {
      id: 5,
      component: 'Tabs',
      status: 'alpha',
      version: '0.3.0',
      downloads: 8900,
      size: '14.1 KB',
      lastUpdated: '2024-01-05',
      hasTypes: true,
    },
    {
      id: 6,
      component: 'Tooltip',
      status: 'stable',
      version: '1.2.3',
      downloads: 27800,
      size: '6.9 KB',
      lastUpdated: '2024-01-03',
      hasTypes: true,
    },
    {
      id: 7,
      component: 'Badge',
      status: 'stable',
      version: '1.0.0',
      downloads: 19500,
      size: '3.2 KB',
      lastUpdated: '2023-12-28',
      hasTypes: true,
    },
    {
      id: 8,
      component: 'Alert',
      status: 'deprecated',
      version: '0.1.0',
      downloads: 450,
      size: '5.1 KB',
      lastUpdated: '2023-11-15',
      hasTypes: false,
    },
    {
      id: 9,
      component: 'Avatar',
      status: 'stable',
      version: '1.3.0',
      downloads: 24300,
      size: '7.8 KB',
      lastUpdated: '2024-01-14',
      hasTypes: true,
    },
    {
      id: 10,
      component: 'Switch',
      status: 'beta',
      version: '0.8.0',
      downloads: 15600,
      size: '9.4 KB',
      lastUpdated: '2024-01-11',
      hasTypes: true,
    },
  ]

  // Generate large dataset for virtualization demo
  const largeShowcaseData: ShowcaseRow[] = virtualize
    ? Array.from({ length: 200 }, (_, i) => ({
        id: i + 1,
        component: `Component ${i + 1}`,
        status: (['stable', 'beta', 'alpha', 'deprecated'] as const)[i % 4]!,
        version: `${(i % 3) + 1}.${i % 10}.${i % 5}`,
        downloads: Math.round(Math.random() * 50000),
        size: `${(Math.random() * 20 + 3).toFixed(1)} KB`,
        lastUpdated: `2024-01-${String((i % 28) + 1).padStart(2, '0')}`,
        hasTypes: i % 3 !== 0,
      }))
    : showcaseData

  const columns: Column<ShowcaseRow>[] = [
    { key: 'id', header: 'ID', width: 60, sortable: true },
    {
      key: 'component',
      header: 'Component',
      sortable: true,
      render: (row) => (
        <a
          href="#"
          className="font-medium text-interactive-primary hover:text-interactive-primary-hover focus:outline-hidden focus:underline"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            alert(`View docs for ${row.component}`)
          }}
        >
          <Icon name="package" size="sm" className="mr-xs inline-block" />
          {row.component}
        </a>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: 120,
      sortable: true,
      render: (row) => {
        const variantMap = {
          stable: 'success',
          beta: 'warning',
          alpha: 'info',
          deprecated: 'error',
        } as const
        return (
          <Badge variant={variantMap[row.status]} size="sm">
            {row.status}
          </Badge>
        )
      },
    },
    { key: 'version', header: 'Version', width: 100, sortable: true },
    {
      key: 'downloads',
      header: 'Downloads',
      width: 120,
      sortable: true,
      render: (row) => <span className="font-mono text-xs">{row.downloads.toLocaleString()}</span>,
    },
    {
      key: 'size',
      header: 'Size',
      width: 90,
      sortable: true,
    },
    {
      key: 'lastUpdated',
      header: 'Last Updated',
      width: 120,
      sortable: true,
    },
    {
      key: 'hasTypes',
      header: 'Types',
      width: 80,
      render: (row) =>
        row.hasTypes ? (
          <Icon name="check" size="sm" className="text-status-success" />
        ) : (
          <Icon name="close" size="sm" className="text-foreground-muted" />
        ),
    },
  ]

  const handleSort = (column: string) => {
    const newDirection: 'asc' | 'desc' =
      sortState?.column === column && sortState.direction === 'asc' ? 'desc' : 'asc'

    setSortState({ column, direction: newDirection })
  }

  const sortedData = [...(showEmpty ? [] : largeShowcaseData)].sort((a, b) => {
    if (!sortState) return 0
    const aValue = a[sortState.column as keyof ShowcaseRow]
    const bValue = b[sortState.column as keyof ShowcaseRow]

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortState.direction === 'asc' ? aValue - bValue : bValue - aValue
    }

    const aStr = String(aValue)
    const bStr = String(bValue)
    return sortState.direction === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
  })

  return (
    <Stack gap="base">
      <Stack
        direction="horizontal"
        gap="base"
        wrap
        className="rounded-lg border border-border bg-surface-muted p-base"
      >
        <Stack gap="sm">
          <label className="text-sm font-medium text-foreground-muted">Size Variant</label>
          <Stack direction="horizontal" gap="sm">
            {(['sm', 'md', 'lg'] as const).map((size) => (
              <Button
                key={size}
                size="sm"
                variant={sizeVariant === size ? 'primary' : 'outline'}
                onClick={() => setSizeVariant(size)}
              >
                {size.toUpperCase()}
              </Button>
            ))}
          </Stack>
        </Stack>

        <Stack gap="sm">
          <label className="text-sm font-medium text-foreground-muted">Visual Variant</label>
          <Stack direction="horizontal" gap="sm">
            {(['default', 'striped', 'bordered'] as const).map((variant) => (
              <Button
                key={variant}
                size="sm"
                variant={visualVariant === variant ? 'primary' : 'outline'}
                onClick={() => setVisualVariant(variant)}
                className="capitalize"
              >
                {variant}
              </Button>
            ))}
          </Stack>
        </Stack>

        <Stack gap="sm">
          <label className="text-sm font-medium text-foreground-muted">Options</label>
          <Stack direction="horizontal" gap="sm">
            <Button
              size="sm"
              variant={showEmpty ? 'secondary' : 'outline'}
              onClick={() => setShowEmpty(!showEmpty)}
            >
              Empty State
            </Button>
            <Button
              size="sm"
              variant={virtualize ? 'secondary' : 'outline'}
              onClick={() => setVirtualize(!virtualize)}
            >
              Virtualize (200 rows)
            </Button>
          </Stack>
        </Stack>
      </Stack>

      <div>
        <Heading level={3} size="sm" className="mb-sm">
          Component Library Statistics
        </Heading>
        <p className="mb-base text-xs text-foreground-muted">
          {virtualize ? 'Virtualized with 200 rows' : `${sortedData.length} components`} • Sorted by{' '}
          {sortState?.column} ({sortState?.direction}) • Size: {sizeVariant} • Variant:{' '}
          {visualVariant}
        </p>
      </div>

      <DataTable
        columns={columns}
        data={sortedData}
        size={sizeVariant}
        variant={visualVariant}
        sortState={sortState}
        onSort={handleSort}
        virtualized={virtualize}
        {...(virtualize && { maxHeight: 500 })}
        onRowClick={(row) => alert(`Selected: ${row.component} v${row.version}`)}
        emptyState={
          <EmptyState
            icon="package"
            title="No components found"
            description="There are no components matching your criteria."
            action={
              <Button size="sm" onClick={() => setShowEmpty(false)}>
                Reset filters
              </Button>
            }
          />
        }
        getRowKey={(row) => row.id}
      />
    </Stack>
  )
}

export const Showcase: Story = {
  render: () => <ShowcaseTableDemo />,
  parameters: {
    docs: {
      description: {
        story: `
Comprehensive showcase demonstrating all DataTable features:

- **Size variants**: Toggle between sm, md, lg sizes
- **Visual variants**: Switch between default, striped, bordered styles
- **Sorting**: Click column headers to sort (downloads sorted by default)
- **Custom renderers**: Links, badges, icons, formatted numbers
- **Row click**: Click any row to see details
- **Empty state**: Toggle to see custom EmptyState component
- **Virtualization**: Toggle to see 200 rows with virtualization
- **Column widths**: Mix of fixed and flexible widths
- **Semantic tokens**: Uses updated hover and border tokens
        `.trim(),
      },
    },
  },
}

// Tree Data Stories

interface TreeRow {
  id: number
  name: string
  type: string
  count: number
  children?: TreeRow[]
}

const treeData: TreeRow[] = [
  {
    id: 1,
    name: 'Components',
    type: 'folder',
    count: 42,
    children: [
      { id: 11, name: 'Button.tsx', type: 'file', count: 15 },
      { id: 12, name: 'Card.tsx', type: 'file', count: 8 },
      { id: 13, name: 'Badge.tsx', type: 'file', count: 19 },
    ],
  },
  {
    id: 2,
    name: 'Utilities',
    type: 'folder',
    count: 28,
    children: [
      { id: 21, name: 'cn.ts', type: 'file', count: 12 },
      { id: 22, name: 'theme.ts', type: 'file', count: 16 },
    ],
  },
  {
    id: 3,
    name: 'index.ts',
    type: 'file',
    count: 5,
  },
]

const treeColumns: Column<TreeRow>[] = [
  { key: 'name', header: 'Name' },
  { key: 'type', header: 'Type', width: 100 },
  { key: 'count', header: 'Usage', width: 100 },
]

const getSubRows = (row: TreeRow): TreeRow[] | undefined => row.children
const getRowKey = (row: TreeRow): number => row.id

export const TreeData: Story = {
  render: () => (
    <Stack gap="base">
      <p className="text-sm text-foreground-muted">
        Basic two-level tree data with expand/collapse toggles.
      </p>
      <DataTable
        columns={treeColumns}
        data={treeData}
        getSubRows={getSubRows}
        getRowKey={getRowKey}
      />
    </Stack>
  ),
}

interface NestedTreeRow {
  id: number
  name: string
  type: string
  children?: NestedTreeRow[]
}

const nestedTreeData: NestedTreeRow[] = [
  {
    id: 1,
    name: 'src',
    type: 'folder',
    children: [
      {
        id: 11,
        name: 'components',
        type: 'folder',
        children: [
          {
            id: 111,
            name: 'ui',
            type: 'folder',
            children: [
              { id: 1111, name: 'Button.tsx', type: 'file' },
              { id: 1112, name: 'Card.tsx', type: 'file' },
            ],
          },
          { id: 112, name: 'App.tsx', type: 'file' },
        ],
      },
      {
        id: 12,
        name: 'utils',
        type: 'folder',
        children: [{ id: 121, name: 'helpers.ts', type: 'file' }],
      },
    ],
  },
  { id: 2, name: 'package.json', type: 'file' },
]

const nestedTreeColumns: Column<NestedTreeRow>[] = [
  {
    key: 'name',
    header: 'Name',
    render: (row) => (
      <span className="flex items-center gap-xs">
        <Icon name={row.type === 'folder' ? 'hierarchy' : 'file'} size="sm" />
        {row.name}
      </span>
    ),
  },
  { key: 'type', header: 'Type', width: 100 },
]

const getNestedSubRows = (row: NestedTreeRow): NestedTreeRow[] | undefined => row.children
const getNestedRowKey = (row: NestedTreeRow): number => row.id

export const NestedTree: Story = {
  render: () => (
    <Stack gap="base">
      <p className="text-sm text-foreground-muted">
        Multi-level nested tree structure with custom icons.
      </p>
      <DataTable
        columns={nestedTreeColumns}
        data={nestedTreeData}
        getSubRows={getNestedSubRows}
        getRowKey={getNestedRowKey}
        defaultExpandedRows={new Set([1])}
      />
    </Stack>
  ),
}

const ControlledExpandDemo = () => {
  const [expandedRows, setExpandedRows] = useState<Set<string | number>>(new Set())

  return (
    <Stack gap="base">
      <p className="text-sm text-foreground-muted">
        Controlled expand state with external controls. Expanded:{' '}
        {expandedRows.size === 0 ? 'none' : Array.from(expandedRows).join(', ')}
      </p>
      <Stack direction="horizontal" gap="sm">
        <Button size="sm" onClick={() => setExpandedRows(new Set([1, 2]))}>
          Expand All
        </Button>
        <Button size="sm" variant="outline" onClick={() => setExpandedRows(new Set())}>
          Collapse All
        </Button>
      </Stack>
      <DataTable
        columns={treeColumns}
        data={treeData}
        getSubRows={getSubRows}
        getRowKey={getRowKey}
        expandedRows={expandedRows}
        onExpandChange={setExpandedRows}
      />
    </Stack>
  )
}

export const ControlledExpand: Story = {
  render: () => <ControlledExpandDemo />,
}

export const DefaultExpanded: Story = {
  render: () => (
    <Stack gap="base">
      <p className="text-sm text-foreground-muted">
        Pre-expanded rows using defaultExpandedRows prop (uncontrolled mode).
      </p>
      <DataTable
        columns={treeColumns}
        data={treeData}
        getSubRows={getSubRows}
        getRowKey={getRowKey}
        defaultExpandedRows={new Set([1, 2])}
      />
    </Stack>
  ),
}

const sortableTreeColumns: Column<TreeRow>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'type', header: 'Type', width: 100, sortable: true },
  { key: 'count', header: 'Usage', width: 100, sortable: true },
]

const TreeWithSortingDemo = () => {
  const [sortState, setSortState] = useState<SortState | null>(null)

  const handleSort = (column: string) => {
    const newDirection: 'asc' | 'desc' =
      sortState?.column === column && sortState.direction === 'asc' ? 'desc' : 'asc'
    setSortState({ column, direction: newDirection })
  }

  // Sort only top-level data (children stay within their parent)
  const sortedData = [...treeData].sort((a, b) => {
    if (!sortState) return 0
    const aValue = a[sortState.column as keyof TreeRow]
    const bValue = b[sortState.column as keyof TreeRow]

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortState.direction === 'asc' ? aValue - bValue : bValue - aValue
    }

    const aStr = String(aValue ?? '')
    const bStr = String(bValue ?? '')
    return sortState.direction === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
  })

  return (
    <Stack gap="base">
      <p className="text-sm text-foreground-muted">
        Sortable tree table. Sorting applies to the current level; children stay under their parent.
      </p>
      <DataTable
        columns={sortableTreeColumns}
        data={sortedData}
        getSubRows={getSubRows}
        getRowKey={getRowKey}
        sortState={sortState}
        onSort={handleSort}
        defaultExpandedRows={new Set([1])}
      />
    </Stack>
  )
}

export const TreeWithSorting: Story = {
  render: () => <TreeWithSortingDemo />,
}

// Generate large tree data for virtualization demo
const generateLargeTreeData = (): TreeRow[] => {
  const data: TreeRow[] = []
  for (let i = 1; i <= 50; i++) {
    const children: TreeRow[] = []
    for (let j = 1; j <= 5; j++) {
      children.push({
        id: i * 100 + j,
        name: `Item ${i}.${j}`,
        type: 'child',
        count: Math.round(Math.random() * 100),
      })
    }
    data.push({
      id: i,
      name: `Category ${i}`,
      type: 'parent',
      count: children.reduce((sum, c) => sum + c.count, 0),
      children,
    })
  }
  return data
}

const largeTreeData = generateLargeTreeData()

export const VirtualizedTree: Story = {
  render: () => (
    <Stack gap="base">
      <p className="text-sm text-foreground-muted">
        Virtualized tree with 50 categories, each with 5 children (300 total rows when fully
        expanded).
      </p>
      <DataTable
        columns={treeColumns}
        data={largeTreeData}
        getSubRows={getSubRows}
        getRowKey={getRowKey}
        virtualized={true}
        maxHeight={400}
        defaultExpandedRows={new Set([1, 2, 3])}
      />
    </Stack>
  ),
}

// Props table example matching the reporter use case
interface PropRow {
  kind: 'prop' | 'value'
  name: string
  type: string
  timesUsed: number
  values: Array<{ value: string; kind: string; count: number }>
}

const propsTableData: PropRow[] = [
  {
    kind: 'prop',
    name: 'variant',
    type: 'string',
    timesUsed: 156,
    values: [
      { value: 'primary', kind: 'literal', count: 89 },
      { value: 'secondary', kind: 'literal', count: 45 },
      { value: 'ghost', kind: 'literal', count: 22 },
    ],
  },
  {
    kind: 'prop',
    name: 'size',
    type: 'string',
    timesUsed: 142,
    values: [
      { value: 'sm', kind: 'literal', count: 38 },
      { value: 'md', kind: 'literal', count: 72 },
      { value: 'lg', kind: 'literal', count: 32 },
    ],
  },
  {
    kind: 'prop',
    name: 'disabled',
    type: 'boolean',
    timesUsed: 67,
    values: [
      { value: 'true', kind: 'literal', count: 23 },
      { value: 'false', kind: 'literal', count: 44 },
    ],
  },
  {
    kind: 'prop',
    name: 'onClick',
    type: 'function',
    timesUsed: 134,
    values: [],
  },
]

const propsTableColumns: Column<PropRow>[] = [
  {
    key: 'name',
    header: 'Prop / Value',
    render: (row) => (
      <span className={row.kind === 'value' ? 'font-mono text-xs text-foreground-muted' : ''}>
        {row.name}
      </span>
    ),
  },
  {
    key: 'type',
    header: 'Type',
    width: 100,
    render: (row) =>
      row.kind === 'value' ? (
        <Badge variant="info" size="sm">
          {row.type}
        </Badge>
      ) : (
        <span className="text-foreground-muted">{row.type}</span>
      ),
  },
  {
    key: 'timesUsed',
    header: 'Count',
    width: 80,
    render: (row) => (
      <span className="font-mono text-xs">
        {row.kind === 'prop' ? row.timesUsed : row.timesUsed}
      </span>
    ),
  },
]

const getPropsSubRows = (row: PropRow): PropRow[] | undefined => {
  if (row.kind === 'prop' && row.values.length > 0) {
    return row.values.map((v) => ({
      kind: 'value' as const,
      name: v.value,
      type: v.kind,
      timesUsed: v.count,
      values: [],
    }))
  }
  return undefined
}

const getPropsRowKey = (row: PropRow, index: number): string => `${row.kind}-${row.name}-${index}`

export const PropsTable: Story = {
  render: () => (
    <Stack gap="base">
      <Heading level={3} size="sm">
        Button Props
      </Heading>
      <p className="text-sm text-foreground-muted">
        Realistic example matching the reporter use case: each prop row expands to show its value
        distribution.
      </p>
      <DataTable
        columns={propsTableColumns}
        data={propsTableData}
        getSubRows={getPropsSubRows}
        getRowKey={getPropsRowKey}
        size="sm"
        variant="striped"
        defaultExpandedRows={new Set(['prop-variant-0'])}
      />
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: `
This example demonstrates the primary use case for tree data: the props table in the reporter.

Each prop row can be expanded to show its value distribution as child rows:
- **Parent rows**: Show prop name, type, and total usage count
- **Child rows**: Show individual values with their kind and occurrence count

This replaces the previous approach of cramming value distributions into a single cell with truncation.
        `.trim(),
      },
    },
  },
}
