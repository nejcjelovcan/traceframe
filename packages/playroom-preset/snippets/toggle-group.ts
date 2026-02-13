import type { Snippet } from './types'

export const toggleGroupSnippets: Snippet[] = [
  {
    group: 'ToggleGroup',
    name: 'Basic',
    code: `<ToggleGroup
  options={[
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ]}
  value="all"
  onChange={(v) => console.log(v)}
  aria-label="Filter items"
/>`,
  },
  {
    group: 'ToggleGroup',
    name: 'With Icons',
    code: `<ToggleGroup
  options={[
    { value: 'all', label: 'All', icon: 'components' },
    { value: 'external', label: 'External', icon: 'external' },
    { value: 'internal', label: 'Internal', icon: 'internal' },
  ]}
  value="all"
  onChange={(v) => console.log(v)}
  aria-label="Filter by type"
/>`,
  },
  {
    group: 'ToggleGroup',
    name: 'Solid Variant',
    code: `<ToggleGroup
  variant="solid"
  options={[
    { value: 'grid', label: 'Grid', icon: 'database' },
    { value: 'list', label: 'List', icon: 'file' },
    { value: 'compact', label: 'Compact', icon: 'dots' },
  ]}
  value="grid"
  onChange={(v) => console.log(v)}
  aria-label="View mode"
/>`,
  },
  {
    group: 'ToggleGroup',
    name: 'Icon Only',
    code: `<ToggleGroup
  variant="solid"
  displayMode="icon"
  options={[
    { value: 'grid', label: 'Grid', icon: 'database' },
    { value: 'list', label: 'List', icon: 'file' },
    { value: 'compact', label: 'Compact', icon: 'dots' },
  ]}
  value="grid"
  onChange={(v) => console.log(v)}
  aria-label="View mode"
/>`,
  },
  {
    group: 'ToggleGroup',
    name: 'Tabs Variant',
    code: `<ToggleGroup
  variant="tabs"
  options={[
    { value: 'overview', label: 'Overview', icon: 'info-circle' },
    { value: 'files', label: 'Files', icon: 'file-code' },
    { value: 'settings', label: 'Settings', icon: 'toggle' },
  ]}
  value="overview"
  onChange={(v) => console.log(v)}
  aria-label="Navigate sections"
/>`,
  },
]
