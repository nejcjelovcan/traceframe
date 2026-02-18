import type { Snippet } from './types'

export const flexSnippets: Snippet[] = [
  // Vertical (default)
  {
    group: 'Flex',
    name: 'Vertical gap-sm',
    code: `
<Flex gap="sm">
  
</Flex>
    `.trim(),
  },
  {
    group: 'Flex',
    name: 'Vertical gap-base',
    code: `
<Flex gap="base">
  
</Flex>
    `.trim(),
  },
  {
    group: 'Flex',
    name: 'Vertical gap-lg',
    code: `
<Flex gap="lg">
  
</Flex>
    `.trim(),
  },

  // Horizontal
  {
    group: 'Flex',
    name: 'Horizontal gap-sm',
    code: `
<Flex direction="horizontal" gap="sm">
  
</Flex>
    `.trim(),
  },
  {
    group: 'Flex',
    name: 'Horizontal gap-base',
    code: `
<Flex direction="horizontal" gap="base">
  
</Flex>
    `.trim(),
  },
  {
    group: 'Flex',
    name: 'Horizontal gap-lg',
    code: `
<Flex direction="horizontal" gap="lg">
  
</Flex>
    `.trim(),
  },
]
