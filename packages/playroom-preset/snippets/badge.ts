import type { Snippet } from './types'

export const badgeSnippets: Snippet[] = [
  // Status Variants
  {
    group: 'Badge',
    name: 'Default',
    code: `<Badge>12 usages</Badge>`,
  },
  {
    group: 'Badge',
    name: 'Secondary',
    code: `<Badge variant="secondary">Local</Badge>`,
  },
  {
    group: 'Badge',
    name: 'Info',
    code: `<Badge variant="info">Information</Badge>`,
  },
  {
    group: 'Badge',
    name: 'Success',
    code: `<Badge variant="success">Resolved</Badge>`,
  },
  {
    group: 'Badge',
    name: 'Warning',
    code: `<Badge variant="warning">Deprecated</Badge>`,
  },
  {
    group: 'Badge',
    name: 'Error',
    code: `<Badge variant="error">3 errors</Badge>`,
  },

  // With Icons
  {
    group: 'Badge',
    name: 'With Icon',
    code: `<Badge variant="success" icon="check">Resolved</Badge>`,
  },
  {
    group: 'Badge',
    name: 'With Icon Right',
    code: `<Badge variant="error" icon="close" iconPosition="right">3 errors</Badge>`,
  },

  // Outline Variants
  {
    group: 'Badge',
    name: 'Outline Success',
    code: `<Badge variant="outline-success" icon="check">CI Passing</Badge>`,
  },
  {
    group: 'Badge',
    name: 'Outline Warning',
    code: `<Badge variant="outline-warning" icon="alert-circle">Deprecated</Badge>`,
  },

  // Sizes
  {
    group: 'Badge',
    name: 'Extra Small',
    code: `<Badge size="xs" variant="success">XS</Badge>`,
  },
  {
    group: 'Badge',
    name: 'Small',
    code: `<Badge size="sm" variant="success">Small</Badge>`,
  },
  {
    group: 'Badge',
    name: 'Large',
    code: `<Badge size="lg" variant="success">Large</Badge>`,
  },

  // Status Row
  {
    group: 'Badge',
    name: 'Status Row',
    code: `
<Flex direction="row" gap="2">
  <Badge variant="success">Active</Badge>
  <Badge variant="warning">Pending</Badge>
  <Badge variant="error">Failed</Badge>
</Flex>
    `.trim(),
  },
]
