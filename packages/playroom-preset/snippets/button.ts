import type { Snippet } from './types'

export const buttonSnippets: Snippet[] = [
  // Variants
  {
    group: 'Button',
    name: 'Primary',
    code: `<Button variant="primary">Primary Button</Button>`,
  },
  {
    group: 'Button',
    name: 'Secondary',
    code: `<Button variant="secondary">Secondary Button</Button>`,
  },
  {
    group: 'Button',
    name: 'Outline',
    code: `<Button variant="outline">Outline Button</Button>`,
  },
  {
    group: 'Button',
    name: 'Ghost',
    code: `<Button variant="ghost">Ghost Button</Button>`,
  },
  {
    group: 'Button',
    name: 'Destructive',
    code: `<Button variant="destructive">Delete</Button>`,
  },
  // With Icons
  {
    group: 'Button',
    name: 'With Left Icon',
    code: `<Button leftIcon="search">Search</Button>`,
  },
  {
    group: 'Button',
    name: 'With Right Icon',
    code: `<Button rightIcon="arrow-right">Continue</Button>`,
  },
  {
    group: 'Button',
    name: 'With Both Icons',
    code: `<Button leftIcon="package" rightIcon="external">View Package</Button>`,
  },

  // Icon Only
  {
    group: 'Button',
    name: 'Icon Only',
    code: `<Button leftIcon="close" iconOnly aria-label="Close">Close</Button>`,
  },

  // States
  {
    group: 'Button',
    name: 'Loading with Text',
    code: `<Button loading loadingText="Saving...">Save</Button>`,
  },
  {
    group: 'Button',
    name: 'Disabled',
    code: `<Button disabled>Disabled</Button>`,
  },
  {
    group: 'Button',
    name: 'Full Width',
    code: `<Button fullWidth>Full Width Button</Button>`,
  },

  // Common Patterns
  {
    group: 'Button',
    name: 'Form Actions',
    code: `
<Stack direction="row" gap="sm">
  <Button variant="primary" leftIcon="check">Save Changes</Button>
  <Button variant="secondary">Cancel</Button>
</Stack>
    `.trim(),
  },
  {
    group: 'Button',
    name: 'Destructive Action',
    code: `
<Stack direction="row" gap="sm">
  <Button variant="destructive" leftIcon="close">Delete Item</Button>
  <Button variant="outline">Cancel</Button>
</Stack>
    `.trim(),
  },
  {
    group: 'Button',
    name: 'Navigation',
    code: `
<Stack direction="row" gap="sm">
  <Button variant="ghost" leftIcon="arrow-left">Back</Button>
  <Button rightIcon="arrow-right">Next Step</Button>
</Stack>
    `.trim(),
  },
]
