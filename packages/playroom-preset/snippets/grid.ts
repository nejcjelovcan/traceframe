import type { Snippet } from './types'

export const gridSnippets: Snippet[] = [
  // Basic columns
  {
    group: 'Grid',
    name: '2 columns gap-base',
    code: `
<Grid cols={2} gap="base">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</Grid>
    `.trim(),
  },
  {
    group: 'Grid',
    name: '3 columns gap-base',
    code: `
<Grid cols={3} gap="base">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
  <div>Item 5</div>
  <div>Item 6</div>
</Grid>
    `.trim(),
  },
  {
    group: 'Grid',
    name: '4 columns gap-base',
    code: `
<Grid cols={4} gap="base">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</Grid>
    `.trim(),
  },

  // Responsive
  {
    group: 'Grid',
    name: 'Responsive (1→2→3)',
    code: `
<Grid cols={{ sm: 1, md: 2, lg: 3 }} gap="base">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
  <div>Item 5</div>
  <div>Item 6</div>
</Grid>
    `.trim(),
  },
]
