import { useVirtualizer } from '@tanstack/react-virtual'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type TableHTMLAttributes,
} from 'react'

import { Icon } from '../icons/index.js'
import { cn } from '../utils/cn.js'

const dataTableVariants = cva('w-full border-collapse text-left', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
    variant: {
      default: '',
      striped: '',
      bordered: '',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
})

const cellVariants = cva('', {
  variants: {
    size: {
      sm: 'px-sm py-xs',
      md: 'px-md py-sm',
      lg: 'px-base py-md',
    },
    variant: {
      default: '',
      striped: '',
      bordered: 'border-r border-border-muted last:border-r-0',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
})

const rowVariants = cva('border-b border-border-muted', {
  variants: {
    variant: {
      default: '',
      striped: '',
      bordered: 'border-b border-border',
    },
    clickable: {
      true: 'cursor-pointer hover:bg-interactive-hover',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    clickable: false,
  },
})

export interface SortState {
  column: string
  direction: 'asc' | 'desc'
}

export interface Column<T> {
  key: keyof T | string
  header: string
  width?: number | string
  render?: (row: T, index: number) => ReactNode
  sortable?: boolean
}

export interface DataTableProps<T>
  extends
    Omit<TableHTMLAttributes<HTMLTableElement>, 'children'>,
    VariantProps<typeof dataTableVariants> {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (row: T, index: number) => void
  emptyState?: ReactNode
  sortState?: SortState | null
  onSort?: (column: string) => void
  /** Callback to get a unique key for each row (used for virtualization identity and tree expand state) */
  getRowKey?: (row: T, index: number) => string | number
  /** Enable virtualization for large datasets */
  virtualized?: boolean
  /** Container height when virtualized (required when virtualized=true) */
  maxHeight?: number | string
  /** Row height in pixels for virtualization (defaults to --size-sm/md/lg CSS variable based on size) */
  rowHeight?: number
  /** Size variant for table cells */
  size?: 'sm' | 'md' | 'lg'
  /** Visual variant for table styling */
  variant?: 'default' | 'striped' | 'bordered'
  /** Get child rows for tree data. Return array for expandable rows, undefined for leaf rows. */
  getSubRows?: (row: T) => T[] | undefined
  /** Set of expanded row keys (controlled mode). Requires getRowKey. */
  expandedRows?: Set<string | number>
  /** Called when a row's expanded state changes (controlled mode). */
  onExpandChange?: (expandedRows: Set<string | number>) => void
  /** Row keys expanded by default (uncontrolled mode). */
  defaultExpandedRows?: Set<string | number>
}

const SIZE_TO_CSS_VAR: Record<string, string> = {
  sm: '--size-sm',
  md: '--size-md',
  lg: '--size-lg',
}

const DEFAULT_ROW_HEIGHT: Record<string, number> = {
  sm: 32,
  md: 40,
  lg: 48,
}

// Indent CSS variable per size variant for tree data
const INDENT_CSS_VAR: Record<string, string> = {
  sm: '--spacing-base', // 1rem (16px)
  md: '--spacing-lg', // 2rem (32px)
  lg: '--spacing-lg', // 2rem (32px)
}

const DEFAULT_INDENT: Record<string, number> = {
  sm: 16,
  md: 32,
  lg: 32,
}

/** Internal row with depth tracking for tree data */
interface FlattenedRow<T> {
  row: T
  depth: number
  originalIndex: number
  hasChildren: boolean
  key: string | number
}

function resolveCssPixels(cssVar: string, fallback: number): number {
  if (typeof document === 'undefined') return fallback
  const value = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim()
  if (!value) return fallback
  if (value.endsWith('rem')) {
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    return Math.round(parseFloat(value) * rootFontSize) || fallback
  }
  return Math.round(parseFloat(value)) || fallback
}

const SortIcon = ({ direction }: { direction: 'asc' | 'desc' | undefined }) => {
  if (!direction) {
    return (
      <span className="text-foreground-muted" aria-hidden="true">
        <Icon name="sort-none" size="sm" />
      </span>
    )
  }
  return (
    <span aria-hidden="true">
      {direction === 'asc' ? (
        <Icon name="sort-asc" size="sm" />
      ) : (
        <Icon name="sort-desc" size="sm" />
      )}
    </span>
  )
}

function DataTableInner<T>(
  {
    columns,
    data,
    onRowClick,
    emptyState,
    sortState,
    onSort,
    getRowKey,
    virtualized = false,
    maxHeight,
    rowHeight,
    size = 'md',
    variant = 'default',
    className,
    getSubRows,
    expandedRows: controlledExpandedRows,
    onExpandChange,
    defaultExpandedRows,
    ...props
  }: DataTableProps<T>,
  ref: React.ForwardedRef<HTMLTableElement>
) {
  const [announcement, setAnnouncement] = useState('')
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Uncontrolled expand state
  const [internalExpandedRows, setInternalExpandedRows] = useState<Set<string | number>>(
    () => defaultExpandedRows ?? new Set()
  )

  // Use controlled or uncontrolled expand state
  const isControlled = controlledExpandedRows !== undefined
  const expandedRows = isControlled ? controlledExpandedRows : internalExpandedRows

  const isTreeTable = getSubRows !== undefined

  // Get row key helper
  const getKey = useCallback(
    (row: T, index: number): string | number => {
      return getRowKey?.(row, index) ?? index
    },
    [getRowKey]
  )

  // Toggle expand state for a row
  const toggleExpand = useCallback(
    (key: string | number) => {
      const newExpanded = new Set(expandedRows)
      if (newExpanded.has(key)) {
        newExpanded.delete(key)
      } else {
        newExpanded.add(key)
      }

      if (isControlled) {
        onExpandChange?.(newExpanded)
      } else {
        setInternalExpandedRows(newExpanded)
      }
    },
    [expandedRows, isControlled, onExpandChange]
  )

  // Flatten tree data into visible rows
  const flattenedRows = useMemo((): FlattenedRow<T>[] => {
    if (!isTreeTable) {
      // No tree structure, return flat rows
      return data.map((row, index) => ({
        row,
        depth: 0,
        originalIndex: index,
        hasChildren: false,
        key: getKey(row, index),
      }))
    }

    const result: FlattenedRow<T>[] = []
    let flatIndex = 0

    const flatten = (rows: T[], depth: number, _parentIndex: number) => {
      rows.forEach((row, localIndex) => {
        const index = depth === 0 ? localIndex : flatIndex
        const key = getKey(row, index)
        const children = getSubRows(row)
        const hasChildren = children !== undefined && children.length > 0

        result.push({
          row,
          depth,
          originalIndex: index,
          hasChildren,
          key,
        })
        flatIndex++

        // Recursively add children if expanded
        if (hasChildren && expandedRows.has(key)) {
          flatten(children, depth + 1, index)
        }
      })
    }

    flatten(data, 0, 0)
    return result
  }, [data, isTreeTable, getSubRows, expandedRows, getKey])

  // Get indent width from CSS variable
  const indentWidth = useMemo(() => {
    return resolveCssPixels(INDENT_CSS_VAR[size] ?? '--spacing-lg', DEFAULT_INDENT[size] ?? 32)
  }, [size])

  useEffect(() => {
    if (sortState) {
      const column = columns.find((col) => String(col.key) === sortState.column)
      const columnName = column?.header ?? sortState.column
      setAnnouncement(
        `Sorted by ${columnName}, ${sortState.direction === 'asc' ? 'ascending' : 'descending'}`
      )
    }
  }, [sortState, columns])

  const effectiveRowHeight =
    rowHeight ??
    resolveCssPixels(SIZE_TO_CSS_VAR[size] ?? '--size-md', DEFAULT_ROW_HEIGHT[size] ?? 40)

  const virtualizer = useVirtualizer({
    count: flattenedRows.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => effectiveRowHeight,
    overscan: 5,
    getItemKey: (index) => {
      const flatRow = flattenedRows[index]
      return flatRow !== undefined ? flatRow.key : index
    },
    enabled: virtualized,
  })

  const renderCell = (row: T, column: Column<T>, index: number): ReactNode => {
    if (column.render) {
      return column.render(row, index)
    }
    const value = row[column.key as keyof T]
    return value != null ? String(value) : ''
  }

  // Render the expand toggle button for tree data
  const renderExpandToggle = (flatRow: FlattenedRow<T>, isExpanded: boolean): ReactNode => {
    if (!flatRow.hasChildren) {
      // Return empty placeholder to maintain alignment
      return <span className="inline-block w-size-xs" aria-hidden="true" />
    }

    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          toggleExpand(flatRow.key)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            e.stopPropagation()
            toggleExpand(flatRow.key)
          }
        }}
        className={cn(
          'mr-xs inline-flex h-size-xs w-size-xs items-center justify-center rounded-sm',
          'hover:bg-interactive-hover focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring'
        )}
        aria-expanded={isExpanded}
        aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
      >
        <Icon
          name="chevron-right"
          size="sm"
          className={cn('transform transition-transform duration-150', isExpanded && 'rotate-90')}
        />
      </button>
    )
  }

  // Render first cell content with expand toggle and indentation
  const renderFirstCellContent = (
    flatRow: FlattenedRow<T>,
    column: Column<T>,
    isExpanded: boolean
  ): ReactNode => {
    const cellContent = renderCell(flatRow.row, column, flatRow.originalIndex)

    if (!isTreeTable) {
      return cellContent
    }

    return (
      <span className="flex items-center">
        {flatRow.depth > 0 && (
          <span
            style={{ width: flatRow.depth * indentWidth }}
            className="inline-block flex-shrink-0"
            aria-hidden="true"
          />
        )}
        {renderExpandToggle(flatRow, isExpanded)}
        <span className="flex-1 min-w-0">{cellContent}</span>
      </span>
    )
  }

  const getColumnStyle = (column: Column<T>): React.CSSProperties | undefined => {
    if (column.width === undefined) return undefined
    return {
      width: typeof column.width === 'number' ? `${column.width}px` : column.width,
    }
  }

  const handleSortKeyDown = (e: KeyboardEvent<HTMLButtonElement>, columnKey: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSort?.(columnKey)
    }
  }

  const renderHeader = (column: Column<T>) => {
    const columnKey = String(column.key)
    const isSorted = sortState?.column === columnKey
    const direction = isSorted ? sortState.direction : undefined
    const ariaSort = isSorted ? (direction === 'asc' ? 'ascending' : 'descending') : undefined

    const headerClasses = cn(
      'border-b border-border font-medium text-foreground-muted',
      cellVariants({ size, variant })
    )

    if (!column.sortable) {
      return (
        <th key={columnKey} scope="col" className={headerClasses} style={getColumnStyle(column)}>
          {column.header}
        </th>
      )
    }

    return (
      <th
        key={columnKey}
        scope="col"
        className={headerClasses}
        style={getColumnStyle(column)}
        aria-sort={ariaSort}
      >
        <button
          type="button"
          onClick={() => onSort?.(columnKey)}
          onKeyDown={(e) => handleSortKeyDown(e, columnKey)}
          className={cn(
            'flex w-full items-center gap-xs text-left',
            'hover:text-foreground focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-surface',
            isSorted && 'font-semibold text-foreground'
          )}
        >
          {column.header}
          <SortIcon direction={direction} />
        </button>
      </th>
    )
  }

  if (data.length === 0) {
    return <div className="py-lg text-center text-foreground-muted">{emptyState ?? 'No data'}</div>
  }

  // Warn if virtualized is true but maxHeight is not provided
  if (virtualized && !maxHeight) {
    console.warn('DataTable: maxHeight is required when virtualized=true')
  }

  // Non-virtualized rendering
  if (!virtualized) {
    return (
      <>
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {announcement}
        </div>
        <table
          className={cn(dataTableVariants({ size, variant, className }))}
          ref={ref}
          {...(isTreeTable && { role: 'treegrid' })}
          {...props}
        >
          <thead>
            <tr>{columns.map(renderHeader)}</tr>
          </thead>
          <tbody>
            {flattenedRows.map((flatRow, visibleIndex) => {
              const isEven = visibleIndex % 2 === 0
              const isExpanded = expandedRows.has(flatRow.key)
              const rowClasses = cn(
                rowVariants({ variant, clickable: !!onRowClick }),
                variant === 'striped' && !isEven && 'bg-surface-muted'
              )

              return (
                <tr
                  key={flatRow.key}
                  onClick={
                    onRowClick ? () => onRowClick(flatRow.row, flatRow.originalIndex) : undefined
                  }
                  className={rowClasses}
                  {...(isTreeTable && { 'aria-level': flatRow.depth + 1 })}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={String(column.key)}
                      className={cellVariants({ size, variant })}
                      style={getColumnStyle(column)}
                    >
                      {colIndex === 0
                        ? renderFirstCellContent(flatRow, column, isExpanded)
                        : renderCell(flatRow.row, column, flatRow.originalIndex)}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </>
    )
  }

  // Virtualized rendering
  const virtualItems = virtualizer.getVirtualItems()

  return (
    <>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
      <div
        ref={scrollContainerRef}
        className="overflow-auto"
        style={{
          maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
        }}
      >
        <table
          className={cn(dataTableVariants({ size, variant, className }))}
          ref={ref}
          {...(isTreeTable && { role: 'treegrid' })}
          {...props}
        >
          <thead className="sticky top-0 z-10 bg-surface">
            <tr>{columns.map(renderHeader)}</tr>
          </thead>
          <tbody
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              position: 'relative',
            }}
          >
            {virtualItems.map((virtualRow) => {
              const flatRow = flattenedRows[virtualRow.index]
              if (flatRow === undefined) return null

              const isEven = virtualRow.index % 2 === 0
              const isExpanded = expandedRows.has(flatRow.key)
              const rowClasses = cn(
                rowVariants({ variant, clickable: !!onRowClick }),
                variant === 'striped' && !isEven && 'bg-surface-muted'
              )

              return (
                <tr
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  onClick={
                    onRowClick ? () => onRowClick(flatRow.row, flatRow.originalIndex) : undefined
                  }
                  className={rowClasses}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                    display: 'flex',
                  }}
                  {...(isTreeTable && { 'aria-level': flatRow.depth + 1 })}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={String(column.key)}
                      className={cn('flex items-center', cellVariants({ size, variant }))}
                      style={{
                        ...getColumnStyle(column),
                        flexShrink: column.width !== undefined ? 0 : 1,
                        flexGrow: column.width !== undefined ? 0 : 1,
                      }}
                    >
                      {colIndex === 0
                        ? renderFirstCellContent(flatRow, column, isExpanded)
                        : renderCell(flatRow.row, column, flatRow.originalIndex)}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export const DataTable = forwardRef(DataTableInner) as <T>(
  props: DataTableProps<T> & { ref?: React.ForwardedRef<HTMLTableElement> }
) => ReturnType<typeof DataTableInner>
;(DataTable as { displayName?: string }).displayName = 'DataTable'

export { dataTableVariants, cellVariants, rowVariants }
