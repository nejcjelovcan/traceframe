import type { Snippet } from './types'

export const stackSnippets: Snippet[] = [
  // Vertical (default)
  {
    group: 'Stack',
    name: 'Vertical gap-sm',
    code: `
<Stack gap="sm">
  
</Stack>
    `.trim(),
  },
  {
    group: 'Stack',
    name: 'Vertical gap-base',
    code: `
<Stack gap="base">
  
</Stack>
    `.trim(),
  },
  {
    group: 'Stack',
    name: 'Vertical gap-lg',
    code: `
<Stack gap="lg">
  
</Stack>
    `.trim(),
  },

  // Horizontal
  {
    group: 'Stack',
    name: 'Horizontal gap-sm',
    code: `
<Stack direction="horizontal" gap="sm">
  
</Stack>
    `.trim(),
  },
  {
    group: 'Stack',
    name: 'Horizontal gap-base',
    code: `
<Stack direction="horizontal" gap="base">
  
</Stack>
    `.trim(),
  },
  {
    group: 'Stack',
    name: 'Horizontal gap-lg',
    code: `
<Stack direction="horizontal" gap="lg">
  
</Stack>
    `.trim(),
  },
]
