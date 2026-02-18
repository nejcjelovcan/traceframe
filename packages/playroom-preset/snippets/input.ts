import type { Snippet } from './types'

export const inputSnippets: Snippet[] = [
  // Basic
  {
    group: 'Input',
    name: 'Default',
    code: `<Input placeholder="Enter text..." />`,
  },

  // Sizes
  {
    group: 'Input',
    name: 'Small',
    code: `<Input size="sm" placeholder="Small input" />`,
  },
  {
    group: 'Input',
    name: 'Large',
    code: `<Input size="lg" placeholder="Large input" />`,
  },

  // Variants
  {
    group: 'Input',
    name: 'Error',
    code: `<Input variant="error" placeholder="Error state" />`,
  },
  {
    group: 'Input',
    name: 'Success',
    code: `<Input variant="success" placeholder="Success state" />`,
  },

  // With Icons
  {
    group: 'Input',
    name: 'With Left Icon',
    code: `<Input leftIcon="search" placeholder="Search..." />`,
  },
  {
    group: 'Input',
    name: 'With Right Icon',
    code: `<Input rightIcon="check" placeholder="Verified input" />`,
  },
  {
    group: 'Input',
    name: 'With Both Icons',
    code: `<Input leftIcon="package" rightIcon="external" placeholder="Package name" />`,
  },

  // States
  {
    group: 'Input',
    name: 'Disabled',
    code: `<Input disabled placeholder="Disabled input" />`,
  },

  // With Helper Text
  {
    group: 'Input',
    name: 'With Helper Text',
    code: `<Input placeholder="Enter value" helperText="This is a helpful hint" />`,
  },
  {
    group: 'Input',
    name: 'Error with Helper',
    code: `<Input variant="error" placeholder="Email" helperText="Please enter a valid email" />`,
  },
  {
    group: 'Input',
    name: 'Success with Helper',
    code: `<Input variant="success" placeholder="Username" helperText="Username is available" />`,
  },

  // With Status Icons
  {
    group: 'Input',
    name: 'Error with Status Icon',
    code: `<Input variant="error" showStatusIcon placeholder="Invalid input" helperText="This field has an error" />`,
  },
  {
    group: 'Input',
    name: 'Success with Status Icon',
    code: `<Input variant="success" showStatusIcon placeholder="Valid input" helperText="Looks good!" />`,
  },

  // Form Field Pattern
  {
    group: 'Input',
    name: 'Form Field with Label',
    code: `
<Flex gap="1">
  <label className="text-sm font-medium">Email address</label>
  <Input type="email" placeholder="name@example.com" />
</Flex>
    `.trim(),
  },
  {
    group: 'Input',
    name: 'Form Field with Error',
    code: `
<Flex gap="1">
  <label className="text-sm font-medium">Email address</label>
  <Input
    type="email"
    variant="error"
    showStatusIcon
    placeholder="name@example.com"
    helperText="Please enter a valid email address"
  />
</Flex>
    `.trim(),
  },
]
