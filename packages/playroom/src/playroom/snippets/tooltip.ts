import type { Snippet } from './types'

export const tooltipSnippets: Snippet[] = [
  {
    group: 'Tooltip',
    name: 'Basic',
    code: `<TooltipProvider>
  <Tooltip content="This is a tooltip">
    <Button>Hover me</Button>
  </Tooltip>
</TooltipProvider>`,
  },
  {
    group: 'Tooltip',
    name: 'On Icon Button',
    code: `<TooltipProvider>
  <Tooltip content="View settings">
    <Button variant="ghost" size="sm">
      <Icon name="toggle" />
    </Button>
  </Tooltip>
</TooltipProvider>`,
  },
]
