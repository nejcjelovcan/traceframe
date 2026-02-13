import type { Snippet } from './types'

export const selectSnippets: Snippet[] = [
  {
    group: 'Select',
    name: 'Basic',
    code: `<Select.Root>
  <Select.Trigger>
    <Select.Value placeholder="Select an option..." />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="option1">Option 1</Select.Item>
    <Select.Item value="option2">Option 2</Select.Item>
    <Select.Item value="option3">Option 3</Select.Item>
  </Select.Content>
</Select.Root>`,
  },
  {
    group: 'Select',
    name: 'With Icon',
    code: `<Select.Root>
  <Select.Trigger leftIcon="package">
    <Select.Value placeholder="Select a package..." />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="ui">@traceframe/ui</Select.Item>
    <Select.Item value="scanner">@traceframe/scanner</Select.Item>
    <Select.Item value="cli">@traceframe/cli</Select.Item>
  </Select.Content>
</Select.Root>`,
  },
  {
    group: 'Select',
    name: 'With Groups',
    code: `<Select.Root>
  <Select.Trigger>
    <Select.Value placeholder="Select component..." />
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      <Select.Label>Layout</Select.Label>
      <Select.Item value="stack">Stack</Select.Item>
      <Select.Item value="grid">Grid</Select.Item>
    </Select.Group>
    <Select.Separator />
    <Select.Group>
      <Select.Label>Forms</Select.Label>
      <Select.Item value="input">Input</Select.Item>
      <Select.Item value="button">Button</Select.Item>
    </Select.Group>
  </Select.Content>
</Select.Root>`,
  },
  {
    group: 'Select',
    name: 'With Badges',
    code: `<Select.Root>
  <Select.Trigger>
    <Select.Value placeholder="Select status..." />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="active" badge="12" badgeVariant="success">Active</Select.Item>
    <Select.Item value="pending" badge="5" badgeVariant="warning">Pending</Select.Item>
    <Select.Item value="inactive" badge="3" badgeVariant="error">Inactive</Select.Item>
  </Select.Content>
</Select.Root>`,
  },
  {
    group: 'Select',
    name: 'Full Width',
    code: `<Select.Root>
  <Select.Trigger width="full">
    <Select.Value placeholder="Select a value..." />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="a">First option</Select.Item>
    <Select.Item value="b">Second option</Select.Item>
  </Select.Content>
</Select.Root>`,
  },
]
