import type { Snippet } from './types'

export const collapsibleSnippets: Snippet[] = [
  // Basic
  {
    group: 'Collapsible',
    name: 'Basic',
    code: `<Collapsible>
  <CollapsibleTrigger>Click</CollapsibleTrigger>
  <CollapsibleContent>
    
  </CollapsibleContent>
</Collapsible>`,
  },

  // Sizes
  {
    group: 'Collapsible',
    name: 'Small',
    code: `<Collapsible>
  <CollapsibleTrigger size="sm">Small Trigger</CollapsibleTrigger>
  <CollapsibleContent>
    
  </CollapsibleContent>
</Collapsible>`,
  },
  {
    group: 'Collapsible',
    name: 'Large',
    code: `<Collapsible>
  <CollapsibleTrigger size="lg">Large Trigger</CollapsibleTrigger>
  <CollapsibleContent>
    
  </CollapsibleContent>
</Collapsible>`,
  },

  // Variants
  {
    group: 'Collapsible',
    name: 'Ghost Variant',
    code: `<Collapsible>
  <CollapsibleTrigger variant="ghost">Ghost Trigger</CollapsibleTrigger>
  <CollapsibleContent>
    
  </CollapsibleContent>
</Collapsible>`,
  },
  {
    group: 'Collapsible',
    name: 'Bordered Variant',
    code: `<Collapsible>
  <CollapsibleTrigger variant="bordered">Bordered Trigger</CollapsibleTrigger>
  <CollapsibleContent>
    Bordered variant with border styling
  </CollapsibleContent>
</Collapsible>`,
  },
  {
    group: 'Collapsible',
    name: 'Filled Variant',
    code: `<Collapsible>
  <CollapsibleTrigger variant="filled">Filled Trigger</CollapsibleTrigger>
  <CollapsibleContent>
    
  </CollapsibleContent>
</Collapsible>`,
  },

  // Options
  {
    group: 'Collapsible',
    name: 'Without Chevron',
    code: `<Collapsible>
  <CollapsibleTrigger hideChevron>No Chevron</CollapsibleTrigger>
  <CollapsibleContent>
    
  </CollapsibleContent>
</Collapsible>`,
  },
  {
    group: 'Collapsible',
    name: 'Disabled',
    code: `<Collapsible>
  <CollapsibleTrigger disabled>Disabled Trigger</CollapsibleTrigger>
  <CollapsibleContent>
    
  </CollapsibleContent>
</Collapsible>`,
  },
]
