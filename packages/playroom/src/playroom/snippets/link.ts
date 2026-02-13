import type { Snippet } from './types'

export const linkSnippets: Snippet[] = [
  {
    group: 'Link',
    name: 'Default',
    code: `<Link href="#">Link text</Link>`,
  },
  {
    group: 'Link',
    name: 'External',
    code: `<Link href="https://example.com" external>External link</Link>`,
  },
  {
    group: 'Link',
    name: 'Subtle',
    code: `<Link href="#" variant="subtle">Subtle link</Link>`,
  },
  {
    group: 'Link',
    name: 'Standalone',
    code: `<Link href="#" variant="standalone">Standalone link</Link>`,
  },
  {
    group: 'Link',
    name: 'With Icon',
    code: `<Link href="#" icon="arrow-right">View details</Link>`,
  },
]
