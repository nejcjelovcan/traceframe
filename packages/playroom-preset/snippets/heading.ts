import type { Snippet } from './types'

export const headingSnippets: Snippet[] = [
  // Levels (semantic)
  {
    group: 'Heading',
    name: 'Level 1',
    code: `<Heading level={1}>Page Title</Heading>`,
  },
  {
    group: 'Heading',
    name: 'Level 2',
    code: `<Heading level={2}>Section Title</Heading>`,
  },
  {
    group: 'Heading',
    name: 'Level 3',
    code: `<Heading level={3}>Subsection Title</Heading>`,
  },

  // Size overrides
  {
    group: 'Heading',
    name: 'Size Override (large h2)',
    code: `<Heading level={2} size="2xl">Large Section</Heading>`,
  },
  {
    group: 'Heading',
    name: 'Size Override (small h1)',
    code: `<Heading level={1} size="lg">Compact Page Title</Heading>`,
  },

  // Color variants
  {
    group: 'Heading',
    name: 'Muted',
    code: `<Heading level={2} color="muted">Muted Section</Heading>`,
  },

  // Tracking
  {
    group: 'Heading',
    name: 'Tight Tracking',
    code: `<Heading level={1} size="4xl" tracking="tight">Hero Title</Heading>`,
  },

  // Composition
  {
    group: 'Heading',
    name: 'Section with Content',
    code: `
<Flex gap="md">
  <Heading level={2}>Section Title</Heading>
  <p>Section content goes here.</p>
</Flex>
    `.trim(),
  },
]
