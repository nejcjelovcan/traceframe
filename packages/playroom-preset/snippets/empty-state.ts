import type { Snippet } from './types'

export const emptyStateSnippets: Snippet[] = [
  {
    group: 'EmptyState',
    name: 'Basic',
    code: `<EmptyState title="No items found" />`,
  },
  {
    group: 'EmptyState',
    name: 'With Icon',
    code: `<EmptyState icon="search-off" title="No results" description="Try adjusting your search" />`,
  },
  {
    group: 'EmptyState',
    name: 'With Action',
    code: `
<EmptyState
  icon="empty"
  title="No items yet"
  description="Get started by creating your first item"
  action={<Button>Create Item</Button>}
/>
    `.trim(),
  },
]
