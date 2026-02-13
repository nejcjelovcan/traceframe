import type { Snippet } from './types'

export const errorStateSnippets: Snippet[] = [
  {
    group: 'ErrorState',
    name: 'Basic',
    code: `<ErrorState title="Something went wrong" />`,
  },
  {
    group: 'ErrorState',
    name: 'With Message',
    code: `<ErrorState title="Failed to load" error="Please check your connection and try again" />`,
  },
  {
    group: 'ErrorState',
    name: 'With Retry',
    code: `<ErrorState title="Failed to load" error="Something went wrong" onRetry={() => {}} />`,
  },
]
