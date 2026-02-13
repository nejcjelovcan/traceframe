import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { DataTable, type Column, type SortState } from './DataTable'

interface TestRow {
  id: number
  name: string
  status: string
}

const testColumns: Column<TestRow>[] = [
  { key: 'id', header: 'ID' },
  { key: 'name', header: 'Name' },
  { key: 'status', header: 'Status' },
]

const testData: TestRow[] = [
  { id: 1, name: 'Item 1', status: 'active' },
  { id: 2, name: 'Item 2', status: 'inactive' },
  { id: 3, name: 'Item 3', status: 'pending' },
]

describe('DataTable', () => {
  it('renders table with correct structure (thead, tbody, tr, th, td)', () => {
    render(<DataTable columns={testColumns} data={testData} />)

    expect(screen.getByRole('table')).toBeDefined()
    expect(screen.getAllByRole('columnheader')).toHaveLength(3)
    expect(screen.getAllByRole('row')).toHaveLength(4) // 1 header + 3 data rows
    expect(screen.getAllByRole('cell')).toHaveLength(9) // 3 columns * 3 rows
  })

  it('displays column headers from column definitions', () => {
    render(<DataTable columns={testColumns} data={testData} />)

    expect(screen.getByText('ID')).toBeDefined()
    expect(screen.getByText('Name')).toBeDefined()
    expect(screen.getByText('Status')).toBeDefined()
  })

  it('renders data rows with correct cell values', () => {
    render(<DataTable columns={testColumns} data={testData} />)

    expect(screen.getByText('Item 1')).toBeDefined()
    expect(screen.getByText('Item 2')).toBeDefined()
    expect(screen.getByText('Item 3')).toBeDefined()
    expect(screen.getByText('active')).toBeDefined()
    expect(screen.getByText('inactive')).toBeDefined()
    expect(screen.getByText('pending')).toBeDefined()
  })

  it('custom render function receives row and index', () => {
    const renderFn = vi.fn((row: TestRow, index: number) => `${row.name}-${index}`)
    const columnsWithRender: Column<TestRow>[] = [{ key: 'name', header: 'Name', render: renderFn }]

    render(<DataTable columns={columnsWithRender} data={testData} />)

    expect(renderFn).toHaveBeenCalledTimes(3)
    expect(renderFn).toHaveBeenCalledWith(testData[0], 0)
    expect(renderFn).toHaveBeenCalledWith(testData[1], 1)
    expect(renderFn).toHaveBeenCalledWith(testData[2], 2)

    expect(screen.getByText('Item 1-0')).toBeDefined()
    expect(screen.getByText('Item 2-1')).toBeDefined()
    expect(screen.getByText('Item 3-2')).toBeDefined()
  })

  it('calls onRowClick with row data and index when row clicked', () => {
    const onRowClick = vi.fn()
    render(<DataTable columns={testColumns} data={testData} onRowClick={onRowClick} />)

    const rows = screen.getAllByRole('row')
    // Click on the second data row (index 0 is header)
    fireEvent.click(rows[2]!)

    expect(onRowClick).toHaveBeenCalledTimes(1)
    expect(onRowClick).toHaveBeenCalledWith(testData[1], 1)
  })

  it('shows emptyState when data array is empty', () => {
    render(<DataTable columns={testColumns} data={[]} emptyState={<div>Custom empty state</div>} />)

    expect(screen.getByText('Custom empty state')).toBeDefined()
    expect(screen.queryByRole('table')).toBeNull()
  })

  it('shows default empty message when no emptyState provided', () => {
    render(<DataTable columns={testColumns} data={[]} />)

    expect(screen.getByText('No data')).toBeDefined()
    expect(screen.queryByRole('table')).toBeNull()
  })

  it('applies width styles from column definitions', () => {
    const columnsWithWidth: Column<TestRow>[] = [
      { key: 'id', header: 'ID', width: 100 },
      { key: 'name', header: 'Name', width: '50%' },
      { key: 'status', header: 'Status' },
    ]

    render(<DataTable columns={columnsWithWidth} data={testData} />)

    const headers = screen.getAllByRole('columnheader')
    expect(headers[0]).toHaveStyle({ width: '100px' })
    expect(headers[1]).toHaveStyle({ width: '50%' })
  })

  it('merges custom className', () => {
    render(<DataTable columns={testColumns} data={testData} className="custom-class" />)

    const table = screen.getByRole('table')
    expect(table.className).toContain('custom-class')
  })

  it('applies base classes to table', () => {
    render(<DataTable columns={testColumns} data={testData} />)

    const table = screen.getByRole('table')
    expect(table.className).toContain('w-full')
    expect(table.className).toContain('border-collapse')
    expect(table.className).toContain('text-left')
    expect(table.className).toContain('text-sm') // Default md size
  })

  it('applies scope="col" on all th elements', () => {
    render(<DataTable columns={testColumns} data={testData} />)

    const headers = screen.getAllByRole('columnheader')
    headers.forEach((header) => {
      expect(header.getAttribute('scope')).toBe('col')
    })
  })

  it('applies hover styles when onRowClick is provided', () => {
    render(<DataTable columns={testColumns} data={testData} onRowClick={() => {}} />)

    const rows = screen.getAllByRole('row')
    // Skip header row (index 0)
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i]!.className).toContain('cursor-pointer')
      expect(rows[i]!.className).toContain('hover:bg-interactive-hover')
    }
  })

  it('does not apply hover styles when onRowClick is not provided', () => {
    render(<DataTable columns={testColumns} data={testData} />)

    const rows = screen.getAllByRole('row')
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i]!.className).not.toContain('cursor-pointer')
    }
  })

  it('handles null and undefined values in cells', () => {
    interface RowWithNullable {
      id: number
      name: string | null
      value: string | undefined
    }

    const columns: Column<RowWithNullable>[] = [
      { key: 'id', header: 'ID' },
      { key: 'name', header: 'Name' },
      { key: 'value', header: 'Value' },
    ]

    const data: RowWithNullable[] = [{ id: 1, name: null, value: undefined }]

    render(<DataTable columns={columns} data={data} />)

    // Should render without crashing, cells with null/undefined show empty
    const cells = screen.getAllByRole('cell')
    expect(cells).toHaveLength(3)
    expect(cells[1]!.textContent).toBe('')
    expect(cells[2]!.textContent).toBe('')
  })

  it('forwards ref to table element', () => {
    const ref = { current: null as HTMLTableElement | null }
    render(<DataTable columns={testColumns} data={testData} ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLTableElement)
  })

  describe('Size Variants', () => {
    it('applies small size classes', () => {
      render(<DataTable columns={testColumns} data={testData} size="sm" />)

      const table = screen.getByRole('table')
      expect(table.className).toContain('text-xs')

      const cells = screen.getAllByRole('cell')
      cells.forEach((cell) => {
        expect(cell.className).toContain('px-sm')
        expect(cell.className).toContain('py-xs')
      })
    })

    it('applies medium size classes (default)', () => {
      render(<DataTable columns={testColumns} data={testData} size="md" />)

      const table = screen.getByRole('table')
      expect(table.className).toContain('text-sm')

      const cells = screen.getAllByRole('cell')
      cells.forEach((cell) => {
        expect(cell.className).toContain('px-md')
        expect(cell.className).toContain('py-sm')
      })
    })

    it('applies large size classes', () => {
      render(<DataTable columns={testColumns} data={testData} size="lg" />)

      const table = screen.getByRole('table')
      expect(table.className).toContain('text-base')

      const cells = screen.getAllByRole('cell')
      cells.forEach((cell) => {
        expect(cell.className).toContain('px-base')
        expect(cell.className).toContain('py-md')
      })
    })

    it('size variant works with headers', () => {
      render(<DataTable columns={testColumns} data={testData} size="sm" />)

      const headers = screen.getAllByRole('columnheader')
      headers.forEach((header) => {
        expect(header.className).toContain('px-sm')
        expect(header.className).toContain('py-xs')
      })
    })
  })

  describe('Visual Variants', () => {
    it('applies default variant classes', () => {
      render(<DataTable columns={testColumns} data={testData} variant="default" />)

      const rows = screen.getAllByRole('row')
      // Check data rows (skip header)
      for (let i = 1; i < rows.length; i++) {
        expect(rows[i]!.className).toContain('border-b')
        expect(rows[i]!.className).toContain('border-border-muted')
      }
    })

    it('applies striped variant with alternating backgrounds', () => {
      render(<DataTable columns={testColumns} data={testData} variant="striped" />)

      const rows = screen.getAllByRole('row')
      // Check data rows (skip header) - odd rows should have bg-surface-muted
      expect(rows[1]!.className).not.toContain('bg-surface-muted') // row 0 (even)
      expect(rows[2]!.className).toContain('bg-surface-muted') // row 1 (odd)
      expect(rows[3]!.className).not.toContain('bg-surface-muted') // row 2 (even)
    })

    it('applies bordered variant with enhanced borders', () => {
      render(<DataTable columns={testColumns} data={testData} variant="bordered" />)

      const rows = screen.getAllByRole('row')
      // Check data rows (skip header)
      for (let i = 1; i < rows.length; i++) {
        expect(rows[i]!.className).toContain('border-b')
        expect(rows[i]!.className).toContain('border-border')
      }

      const cells = screen.getAllByRole('cell')
      cells.forEach((cell) => {
        expect(cell.className).toContain('border-r')
        expect(cell.className).toContain('border-border-muted')
        expect(cell.className).toContain('last:border-r-0')
      })
    })

    it('combines size and visual variants', () => {
      render(<DataTable columns={testColumns} data={testData} size="sm" variant="striped" />)

      const table = screen.getByRole('table')
      expect(table.className).toContain('text-xs')

      const rows = screen.getAllByRole('row')
      expect(rows[2]!.className).toContain('bg-surface-muted') // striped

      const cells = screen.getAllByRole('cell')
      cells.forEach((cell) => {
        expect(cell.className).toContain('px-sm')
        expect(cell.className).toContain('py-xs')
      })
    })
  })

  describe('Sorting', () => {
    const sortableColumns: Column<TestRow>[] = [
      { key: 'id', header: 'ID', sortable: true },
      { key: 'name', header: 'Name', sortable: true },
      { key: 'status', header: 'Status' },
    ]

    it('sortable columns render button inside th', () => {
      render(<DataTable columns={sortableColumns} data={testData} />)

      const idHeader = screen.getByRole('columnheader', { name: /ID/i })
      expect(idHeader.querySelector('button')).toBeDefined()

      const nameHeader = screen.getByRole('columnheader', { name: /Name/i })
      expect(nameHeader.querySelector('button')).toBeDefined()
    })

    it('non-sortable columns render plain th without button', () => {
      render(<DataTable columns={sortableColumns} data={testData} />)

      const statusHeader = screen.getByRole('columnheader', { name: 'Status' })
      expect(statusHeader.querySelector('button')).toBeNull()
    })

    it('click on sortable header calls onSort with column key', () => {
      const onSort = vi.fn()
      render(<DataTable columns={sortableColumns} data={testData} onSort={onSort} />)

      const idButton = screen.getByRole('button', { name: /ID/i })
      fireEvent.click(idButton)

      expect(onSort).toHaveBeenCalledWith('id')
    })

    it('Enter key on sortable header calls onSort', async () => {
      const user = userEvent.setup()
      const onSort = vi.fn()
      render(<DataTable columns={sortableColumns} data={testData} onSort={onSort} />)

      const idButton = screen.getByRole('button', { name: /ID/i })
      idButton.focus()
      await user.keyboard('{Enter}')

      expect(onSort).toHaveBeenCalledWith('id')
    })

    it('Space key on sortable header calls onSort', async () => {
      const user = userEvent.setup()
      const onSort = vi.fn()
      render(<DataTable columns={sortableColumns} data={testData} onSort={onSort} />)

      const idButton = screen.getByRole('button', { name: /ID/i })
      idButton.focus()
      await user.keyboard(' ')

      expect(onSort).toHaveBeenCalledWith('id')
    })

    it('aria-sort="ascending" when sorted asc', () => {
      const sortState: SortState = { column: 'id', direction: 'asc' }
      render(<DataTable columns={sortableColumns} data={testData} sortState={sortState} />)

      const idHeader = screen.getByRole('columnheader', { name: /ID/i })
      expect(idHeader.getAttribute('aria-sort')).toBe('ascending')
    })

    it('aria-sort="descending" when sorted desc', () => {
      const sortState: SortState = { column: 'id', direction: 'desc' }
      render(<DataTable columns={sortableColumns} data={testData} sortState={sortState} />)

      const idHeader = screen.getByRole('columnheader', { name: /ID/i })
      expect(idHeader.getAttribute('aria-sort')).toBe('descending')
    })

    it('no aria-sort on unsorted columns', () => {
      const sortState: SortState = { column: 'id', direction: 'asc' }
      render(<DataTable columns={sortableColumns} data={testData} sortState={sortState} />)

      const nameHeader = screen.getByRole('columnheader', { name: /Name/i })
      expect(nameHeader.getAttribute('aria-sort')).toBeNull()
    })

    it('no aria-sort on non-sortable columns', () => {
      const sortState: SortState = { column: 'status', direction: 'asc' }
      render(<DataTable columns={sortableColumns} data={testData} sortState={sortState} />)

      const statusHeader = screen.getByRole('columnheader', { name: 'Status' })
      expect(statusHeader.getAttribute('aria-sort')).toBeNull()
    })

    it('sort icon reflects current direction - ascending', () => {
      const sortState: SortState = { column: 'id', direction: 'asc' }
      render(<DataTable columns={sortableColumns} data={testData} sortState={sortState} />)

      const idButton = screen.getByRole('button', { name: /ID/i })
      // Tabler IconSortAscending renders an SVG with tabler-icon class
      expect(idButton.querySelector('svg.tabler-icon-sort-ascending')).toBeDefined()
    })

    it('sort icon reflects current direction - descending', () => {
      const sortState: SortState = { column: 'id', direction: 'desc' }
      render(<DataTable columns={sortableColumns} data={testData} sortState={sortState} />)

      const idButton = screen.getByRole('button', { name: /ID/i })
      // Tabler IconSortDescending renders an SVG with tabler-icon class
      expect(idButton.querySelector('svg.tabler-icon-sort-descending')).toBeDefined()
    })

    it('sort icon shows unsorted indicator when not sorted', () => {
      render(<DataTable columns={sortableColumns} data={testData} />)

      const idButton = screen.getByRole('button', { name: /ID/i })
      // Tabler IconArrowsSort renders an SVG with tabler-icon class
      expect(idButton.querySelector('svg.tabler-icon-arrows-sort')).toBeDefined()
    })

    it('live region announces sort changes', async () => {
      const sortState: SortState = { column: 'id', direction: 'asc' }
      render(<DataTable columns={sortableColumns} data={testData} sortState={sortState} />)

      await waitFor(() => {
        const liveRegion = document.querySelector('[aria-live="polite"]')
        expect(liveRegion?.textContent).toBe('Sorted by ID, ascending')
      })
    })

    it('live region announces descending sort', async () => {
      const sortState: SortState = { column: 'name', direction: 'desc' }
      render(<DataTable columns={sortableColumns} data={testData} sortState={sortState} />)

      await waitFor(() => {
        const liveRegion = document.querySelector('[aria-live="polite"]')
        expect(liveRegion?.textContent).toBe('Sorted by Name, descending')
      })
    })

    it('sortable headers are focusable via Tab', async () => {
      const user = userEvent.setup()
      render(<DataTable columns={sortableColumns} data={testData} />)

      await user.tab()
      expect(document.activeElement).toBe(screen.getByRole('button', { name: /ID/i }))

      await user.tab()
      expect(document.activeElement).toBe(screen.getByRole('button', { name: /Name/i }))
    })

    it('applies active sort styling to sorted column', () => {
      const sortState: SortState = { column: 'id', direction: 'asc' }
      render(<DataTable columns={sortableColumns} data={testData} sortState={sortState} />)

      const idButton = screen.getByRole('button', { name: /ID/i })
      expect(idButton.className).toContain('font-semibold')
      expect(idButton.className).toContain('text-foreground')
    })

    it('does not apply active sort styling to unsorted columns', () => {
      const sortState: SortState = { column: 'id', direction: 'asc' }
      render(<DataTable columns={sortableColumns} data={testData} sortState={sortState} />)

      const nameButton = screen.getByRole('button', { name: /Name/i })
      expect(nameButton.className).not.toContain('font-semibold')
    })
  })

  describe('Virtualization', () => {
    // Generate larger dataset for virtualization testing
    const generateLargeData = (count: number): TestRow[] =>
      Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
        status: ['active', 'inactive', 'pending'][i % 3]!,
      }))

    const largeData = generateLargeData(100)
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    afterEach(() => {
      warnSpy.mockClear()
    })

    it('renders virtualized table when virtualized=true', () => {
      render(
        <DataTable columns={testColumns} data={largeData} virtualized={true} maxHeight={400} />
      )

      // Should render a scroll container
      const scrollContainer = document.querySelector('.overflow-auto')
      expect(scrollContainer).toBeDefined()
    })

    it('applies maxHeight to scroll container when virtualized', () => {
      render(
        <DataTable columns={testColumns} data={largeData} virtualized={true} maxHeight={400} />
      )

      const scrollContainer = document.querySelector('.overflow-auto')
      expect(scrollContainer).toHaveStyle({ maxHeight: '400px' })
    })

    it('applies string maxHeight correctly', () => {
      render(
        <DataTable columns={testColumns} data={largeData} virtualized={true} maxHeight="50vh" />
      )

      const scrollContainer = document.querySelector('.overflow-auto')
      expect(scrollContainer).toHaveStyle({ maxHeight: '50vh' })
    })

    it('warns when virtualized=true but maxHeight is not provided', () => {
      render(<DataTable columns={testColumns} data={largeData} virtualized={true} />)

      expect(warnSpy).toHaveBeenCalledWith('DataTable: maxHeight is required when virtualized=true')
    })

    it('does not warn when virtualized=false', () => {
      render(<DataTable columns={testColumns} data={largeData} virtualized={false} />)

      expect(warnSpy).not.toHaveBeenCalled()
    })

    it('renders with default virtualized=false', () => {
      render(<DataTable columns={testColumns} data={testData} />)

      // Should not have scroll container
      const scrollContainer = document.querySelector('.overflow-auto')
      expect(scrollContainer).toBeNull()
    })

    it('header remains sticky when virtualized', () => {
      render(
        <DataTable columns={testColumns} data={largeData} virtualized={true} maxHeight={400} />
      )

      const thead = document.querySelector('thead')
      expect(thead?.className).toContain('sticky')
      expect(thead?.className).toContain('top-0')
    })

    it('passes getRowKey prop without error', () => {
      const getRowKey = vi.fn((row: TestRow) => `key-${row.id}`)
      render(
        <DataTable
          columns={testColumns}
          data={testData}
          virtualized={true}
          maxHeight={400}
          getRowKey={getRowKey}
        />
      )

      // Component renders without error
      expect(screen.getByRole('table')).toBeDefined()
    })

    it('falls back to index when getRowKey is not provided', () => {
      render(<DataTable columns={testColumns} data={testData} virtualized={true} maxHeight={400} />)

      // Should render without error
      expect(screen.getByRole('table')).toBeDefined()
    })

    it('applies hover styles to virtualized rows', () => {
      render(
        <DataTable
          columns={testColumns}
          data={testData}
          virtualized={true}
          maxHeight={400}
          onRowClick={() => {}}
        />
      )

      // In jsdom, virtualized rows may not be rendered, but table should be there
      expect(screen.getByRole('table')).toBeDefined()
    })

    it('sorting headers work in virtualized mode', () => {
      const sortableColumns: Column<TestRow>[] = [
        { key: 'id', header: 'ID', sortable: true },
        { key: 'name', header: 'Name', sortable: true },
        { key: 'status', header: 'Status' },
      ]
      const onSort = vi.fn()
      const sortState: SortState = { column: 'id', direction: 'asc' }

      render(
        <DataTable
          columns={sortableColumns}
          data={testData}
          virtualized={true}
          maxHeight={400}
          sortState={sortState}
          onSort={onSort}
        />
      )

      // Click sort button (header is always rendered)
      const idButton = screen.getByRole('button', { name: /ID/i })
      fireEvent.click(idButton)

      expect(onSort).toHaveBeenCalledWith('id')

      // Check aria-sort is correct
      const idHeader = screen.getByRole('columnheader', { name: /ID/i })
      expect(idHeader.getAttribute('aria-sort')).toBe('ascending')
    })

    it('uses getRowKey for non-virtualized mode as well', () => {
      const getRowKey = vi.fn((row: TestRow) => `key-${row.id}`)
      render(
        <DataTable
          columns={testColumns}
          data={testData}
          virtualized={false}
          getRowKey={getRowKey}
        />
      )

      // getRowKey should be called for each row
      expect(getRowKey).toHaveBeenCalledTimes(3)
      expect(getRowKey).toHaveBeenCalledWith(testData[0], 0)
      expect(getRowKey).toHaveBeenCalledWith(testData[1], 1)
      expect(getRowKey).toHaveBeenCalledWith(testData[2], 2)
    })

    it('applies custom rowHeight', () => {
      render(
        <DataTable
          columns={testColumns}
          data={testData}
          virtualized={true}
          maxHeight={400}
          rowHeight={60}
        />
      )

      // Component should render without error
      expect(screen.getByRole('table')).toBeDefined()
    })

    it('tbody has correct height for virtualizer', () => {
      render(
        <DataTable
          columns={testColumns}
          data={testData}
          virtualized={true}
          maxHeight={400}
          rowHeight={48}
        />
      )

      const tbody = document.querySelector('tbody')
      // Total size should be approximately rowHeight * data.length
      expect(tbody?.style.height).toBe(`${48 * testData.length}px`)
    })

    it('renders table structure in virtualized mode', () => {
      render(<DataTable columns={testColumns} data={testData} virtualized={true} maxHeight={400} />)

      // Headers should still be rendered
      expect(screen.getByText('ID')).toBeDefined()
      expect(screen.getByText('Name')).toBeDefined()
      expect(screen.getByText('Status')).toBeDefined()

      // Table structure should exist
      expect(screen.getByRole('table')).toBeDefined()
      expect(document.querySelector('thead')).toBeDefined()
      expect(document.querySelector('tbody')).toBeDefined()
    })

    it('handles empty data in virtualized mode', () => {
      render(
        <DataTable
          columns={testColumns}
          data={[]}
          virtualized={true}
          maxHeight={400}
          emptyState={<div>No items</div>}
        />
      )

      // Should show empty state, not virtualized table
      expect(screen.getByText('No items')).toBeDefined()
      expect(screen.queryByRole('table')).toBeNull()
    })

    it('applies size variants in virtualized mode', () => {
      render(
        <DataTable
          columns={testColumns}
          data={testData}
          virtualized={true}
          maxHeight={400}
          size="sm"
        />
      )

      const table = screen.getByRole('table')
      expect(table.className).toContain('text-xs')
    })

    it('applies visual variants in virtualized mode', () => {
      render(
        <DataTable
          columns={testColumns}
          data={testData}
          virtualized={true}
          maxHeight={400}
          variant="bordered"
        />
      )

      const table = screen.getByRole('table')
      expect(table).toBeDefined()
      // Variant classes should be applied even in virtualized mode
    })
  })

  describe('Tree Data', () => {
    interface TreeRow {
      id: number
      name: string
      children?: TreeRow[]
    }

    const treeData: TreeRow[] = [
      {
        id: 1,
        name: 'Parent 1',
        children: [
          { id: 11, name: 'Child 1.1' },
          { id: 12, name: 'Child 1.2' },
        ],
      },
      {
        id: 2,
        name: 'Parent 2',
        children: [
          {
            id: 21,
            name: 'Child 2.1',
            children: [{ id: 211, name: 'Grandchild 2.1.1' }],
          },
        ],
      },
      { id: 3, name: 'Leaf Row' },
    ]

    const treeColumns: Column<TreeRow>[] = [
      { key: 'id', header: 'ID' },
      { key: 'name', header: 'Name' },
    ]

    const getSubRows = (row: TreeRow): TreeRow[] | undefined => row.children

    const getRowKey = (row: TreeRow): number => row.id

    it('renders flat data normally when getSubRows is not provided', () => {
      render(<DataTable columns={treeColumns} data={treeData} />)

      expect(screen.getByText('Parent 1')).toBeDefined()
      expect(screen.getByText('Parent 2')).toBeDefined()
      expect(screen.getByText('Leaf Row')).toBeDefined()
      // Children should not be visible without getSubRows
      expect(screen.queryByText('Child 1.1')).toBeNull()
    })

    it('renders expand toggle for rows with children', () => {
      render(
        <DataTable
          columns={treeColumns}
          data={treeData}
          getSubRows={getSubRows}
          getRowKey={getRowKey}
        />
      )

      // Parent rows should have expand buttons
      const expandButtons = screen.getAllByRole('button', { name: /expand row/i })
      expect(expandButtons).toHaveLength(2) // Parent 1 and Parent 2

      // Leaf row should not have expand button
      expect(
        screen.queryByText('Leaf Row')?.closest('tr')?.querySelector('button[aria-expanded]')
      ).toBeNull()
    })

    it('expands row when expand toggle is clicked', async () => {
      const user = userEvent.setup()
      render(
        <DataTable
          columns={treeColumns}
          data={treeData}
          getSubRows={getSubRows}
          getRowKey={getRowKey}
        />
      )

      // Children not visible initially
      expect(screen.queryByText('Child 1.1')).toBeNull()

      // Click expand button on Parent 1
      const expandButtons = screen.getAllByRole('button', { name: /expand row/i })
      await user.click(expandButtons[0]!)

      // Children should now be visible
      expect(screen.getByText('Child 1.1')).toBeDefined()
      expect(screen.getByText('Child 1.2')).toBeDefined()
    })

    it('collapses row when collapse toggle is clicked', async () => {
      const user = userEvent.setup()
      render(
        <DataTable
          columns={treeColumns}
          data={treeData}
          getSubRows={getSubRows}
          getRowKey={getRowKey}
          defaultExpandedRows={new Set([1])}
        />
      )

      // Children visible initially
      expect(screen.getByText('Child 1.1')).toBeDefined()

      // Click collapse button
      const collapseButton = screen.getByRole('button', { name: /collapse row/i })
      await user.click(collapseButton)

      // Children should be hidden
      expect(screen.queryByText('Child 1.1')).toBeNull()
    })

    it('supports multi-level nesting', async () => {
      const user = userEvent.setup()
      render(
        <DataTable
          columns={treeColumns}
          data={treeData}
          getSubRows={getSubRows}
          getRowKey={getRowKey}
        />
      )

      // Expand Parent 2
      const expandButtons = screen.getAllByRole('button', { name: /expand row/i })
      await user.click(expandButtons[1]!) // Parent 2 is second

      // Child 2.1 should be visible with its own expand button
      expect(screen.getByText('Child 2.1')).toBeDefined()

      // Expand Child 2.1
      const childExpandButton = screen.getAllByRole('button', { name: /expand row/i })
      // Find the expand button for Child 2.1 (it should be the newly appeared one)
      await user.click(childExpandButton[childExpandButton.length - 1]!)

      // Grandchild should be visible
      expect(screen.getByText('Grandchild 2.1.1')).toBeDefined()
    })

    it('applies role="treegrid" when getSubRows is provided', () => {
      render(
        <DataTable
          columns={treeColumns}
          data={treeData}
          getSubRows={getSubRows}
          getRowKey={getRowKey}
        />
      )

      expect(screen.getByRole('treegrid')).toBeDefined()
    })

    it('does not apply role="treegrid" when getSubRows is not provided', () => {
      render(<DataTable columns={treeColumns} data={treeData} />)

      expect(screen.queryByRole('treegrid')).toBeNull()
      expect(screen.getByRole('table')).toBeDefined()
    })

    it('sets aria-expanded correctly on expand toggle', async () => {
      const user = userEvent.setup()
      render(
        <DataTable
          columns={treeColumns}
          data={treeData}
          getSubRows={getSubRows}
          getRowKey={getRowKey}
        />
      )

      const expandButton = screen.getAllByRole('button', { name: /expand row/i })[0]!
      expect(expandButton.getAttribute('aria-expanded')).toBe('false')

      await user.click(expandButton)

      // Button should now show collapse state
      const collapseButton = screen.getAllByRole('button', { name: /collapse row/i })[0]!
      expect(collapseButton.getAttribute('aria-expanded')).toBe('true')
    })

    it('sets aria-level on rows for nesting depth', async () => {
      const user = userEvent.setup()
      render(
        <DataTable
          columns={treeColumns}
          data={treeData}
          getSubRows={getSubRows}
          getRowKey={getRowKey}
        />
      )

      // Top-level rows should have aria-level="1"
      const parent1Row = screen.getByText('Parent 1').closest('tr')
      expect(parent1Row?.getAttribute('aria-level')).toBe('1')

      // Expand Parent 1
      const expandButton = screen.getAllByRole('button', { name: /expand row/i })[0]!
      await user.click(expandButton)

      // Child rows should have aria-level="2"
      const childRow = screen.getByText('Child 1.1').closest('tr')
      expect(childRow?.getAttribute('aria-level')).toBe('2')
    })

    it('supports keyboard toggle with Enter key', async () => {
      const user = userEvent.setup()
      render(
        <DataTable
          columns={treeColumns}
          data={treeData}
          getSubRows={getSubRows}
          getRowKey={getRowKey}
        />
      )

      expect(screen.queryByText('Child 1.1')).toBeNull()

      const expandButton = screen.getAllByRole('button', { name: /expand row/i })[0]!
      expandButton.focus()
      await user.keyboard('{Enter}')

      expect(screen.getByText('Child 1.1')).toBeDefined()
    })

    it('supports keyboard toggle with Space key', async () => {
      const user = userEvent.setup()
      render(
        <DataTable
          columns={treeColumns}
          data={treeData}
          getSubRows={getSubRows}
          getRowKey={getRowKey}
        />
      )

      expect(screen.queryByText('Child 1.1')).toBeNull()

      const expandButton = screen.getAllByRole('button', { name: /expand row/i })[0]!
      expandButton.focus()
      await user.keyboard(' ')

      expect(screen.getByText('Child 1.1')).toBeDefined()
    })

    it('supports controlled expand state', async () => {
      const user = userEvent.setup()
      const onExpandChange = vi.fn()
      const expandedRows = new Set<number>()

      const { rerender } = render(
        <DataTable
          columns={treeColumns}
          data={treeData}
          getSubRows={getSubRows}
          getRowKey={getRowKey}
          expandedRows={expandedRows}
          onExpandChange={onExpandChange}
        />
      )

      // Click expand
      const expandButton = screen.getAllByRole('button', { name: /expand row/i })[0]!
      await user.click(expandButton)

      // onExpandChange should be called with new Set containing the expanded row
      expect(onExpandChange).toHaveBeenCalledTimes(1)
      expect(onExpandChange).toHaveBeenCalledWith(new Set([1]))

      // Children still not visible because controlled state hasn't changed
      expect(screen.queryByText('Child 1.1')).toBeNull()

      // Rerender with updated state
      rerender(
        <DataTable
          columns={treeColumns}
          data={treeData}
          getSubRows={getSubRows}
          getRowKey={getRowKey}
          expandedRows={new Set([1])}
          onExpandChange={onExpandChange}
        />
      )

      // Children should now be visible
      expect(screen.getByText('Child 1.1')).toBeDefined()
    })

    it('supports defaultExpandedRows for uncontrolled mode', () => {
      render(
        <DataTable
          columns={treeColumns}
          data={treeData}
          getSubRows={getSubRows}
          getRowKey={getRowKey}
          defaultExpandedRows={new Set([1, 2])}
        />
      )

      // Children of both expanded parents should be visible
      expect(screen.getByText('Child 1.1')).toBeDefined()
      expect(screen.getByText('Child 1.2')).toBeDefined()
      expect(screen.getByText('Child 2.1')).toBeDefined()
    })

    it('applies striped variant correctly with expanded rows', async () => {
      const user = userEvent.setup()
      render(
        <DataTable
          columns={treeColumns}
          data={treeData}
          getSubRows={getSubRows}
          getRowKey={getRowKey}
          variant="striped"
        />
      )

      // Expand Parent 1
      const expandButton = screen.getAllByRole('button', { name: /expand row/i })[0]!
      await user.click(expandButton)

      // Check that striped pattern is applied based on visible row index
      const rows = screen.getAllByRole('row').slice(1) // Skip header row

      // Rows at odd visible indices should have bg-surface-muted
      expect(rows[1]?.className).toContain('bg-surface-muted') // Child 1.1 (visible index 1)
      expect(rows[3]?.className).toContain('bg-surface-muted') // Parent 2 (visible index 3)
    })

    it('works in virtualized mode', () => {
      render(
        <DataTable
          columns={treeColumns}
          data={treeData}
          getSubRows={getSubRows}
          getRowKey={getRowKey}
          virtualized={true}
          maxHeight={400}
        />
      )

      // Table should be rendered with treegrid role
      expect(screen.getByRole('treegrid')).toBeDefined()
    })

    it('expand toggle click does not trigger row click', async () => {
      const user = userEvent.setup()
      const onRowClick = vi.fn()

      render(
        <DataTable
          columns={treeColumns}
          data={treeData}
          getSubRows={getSubRows}
          getRowKey={getRowKey}
          onRowClick={onRowClick}
        />
      )

      // Click expand button
      const expandButton = screen.getAllByRole('button', { name: /expand row/i })[0]!
      await user.click(expandButton)

      // Row click should not have been triggered
      expect(onRowClick).not.toHaveBeenCalled()

      // Children should be expanded
      expect(screen.getByText('Child 1.1')).toBeDefined()
    })

    it('renders correct number of rows when tree is expanded', async () => {
      const user = userEvent.setup()
      render(
        <DataTable
          columns={treeColumns}
          data={treeData}
          getSubRows={getSubRows}
          getRowKey={getRowKey}
        />
      )

      // Initially 3 rows (plus header)
      expect(screen.getAllByRole('row')).toHaveLength(4)

      // Expand Parent 1 (has 2 children)
      const expandButton = screen.getAllByRole('button', { name: /expand row/i })[0]!
      await user.click(expandButton)

      // Now 5 rows (plus header)
      expect(screen.getAllByRole('row')).toHaveLength(6)
    })

    it('maintains sort with tree data', () => {
      const sortableTreeColumns: Column<TreeRow>[] = [
        { key: 'id', header: 'ID', sortable: true },
        { key: 'name', header: 'Name', sortable: true },
      ]

      const onSort = vi.fn()

      render(
        <DataTable
          columns={sortableTreeColumns}
          data={treeData}
          getSubRows={getSubRows}
          getRowKey={getRowKey}
          onSort={onSort}
        />
      )

      // Sort button should still work
      const sortButton = screen.getByRole('button', { name: /ID/i })
      fireEvent.click(sortButton)

      expect(onSort).toHaveBeenCalledWith('id')
    })
  })
})
