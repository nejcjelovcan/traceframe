import type { Snippet } from './types'

export const dataTableSnippets: Snippet[] = [
  {
    group: 'DataTable',
    name: 'Basic',
    code: `<DataTable
  columns={[
    { key: 'name', header: 'Name' },
    { key: 'value', header: 'Value' },
  ]}
  data={[
    { name: 'Button', value: 45 },
    { name: 'Card', value: 30 },
    { name: 'Input', value: 25 },
  ]}
/>`,
  },
  {
    group: 'DataTable',
    name: 'With Custom Render',
    code: `<DataTable
  columns={[
    { key: 'name', header: 'Component' },
    { key: 'status', header: 'Status', render: (row) => (
      <Badge variant={row.status === 'Active' ? 'success' : 'warning'}>
        {row.status}
      </Badge>
    )},
  ]}
  data={[
    { name: 'Button', status: 'Active' },
    { name: 'Card', status: 'Beta' },
    { name: 'Modal', status: 'Active' },
  ]}
/>`,
  },
  {
    group: 'DataTable',
    name: 'Sortable',
    code: `<DataTable
  columns={[
    { key: 'name', header: 'Package', sortable: true },
    { key: 'version', header: 'Version' },
    { key: 'downloads', header: 'Downloads', sortable: true },
  ]}
  data={[
    { name: '@traceframe/ui', version: '1.0.0', downloads: 1250 },
    { name: '@traceframe/scanner', version: '0.5.0', downloads: 840 },
    { name: '@traceframe/cli', version: '0.2.0', downloads: 620 },
  ]}
/>`,
  },
  {
    group: 'DataTable',
    name: 'Empty State',
    code: `<DataTable
  columns={[
    { key: 'name', header: 'Name' },
    { key: 'value', header: 'Value' },
  ]}
  data={[]}
  emptyMessage="No data available"
/>`,
  },
]
