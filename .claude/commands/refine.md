# Refine Issue

Refine a Linear issue for the Traceframe design system to make it implementation-ready.

## Configuration

**Linear:**
- Team: `Traceframe` (prefix: `TRA`)

## Usage

`/refine <ISSUE_IDENTIFIER>` - Linear issue identifier is required. Example: `/refine TRA-42`

## Workflow

### 1. Fetch Issue Context

Use Linear MCP tools:

```
get_issue(id: "TRA-42", includeRelations: true)
```

**Gather:**
- Title and description
- Labels
- All comments (use `list_comments`)
- Linked/blocked issues (from relations)

### 2. Understand the Request

**Analyze:**
- What is the user trying to achieve? (the "why")
- What UI component or feature is needed? (the "what")
- Are there design constraints or preferences?
- Is there existing discussion that clarifies scope?

**UI-specific questions:**
- Is this a new component or modification to existing?
- Does it need to be in ui-library (shared) or package-specific?
- Are there accessibility requirements?
- Is interactivity needed (client-side JS)?

**If unclear, ask questions before proceeding.**

### 3. Design System Evaluation

**CRITICAL: Always evaluate UI work through a design system lens.**

#### Step 1: Should this be in ui-library?

Ask these questions in order:

| Question | If Yes | If No |
|----------|--------|-------|
| Is it a UI primitive (Button, Input, Card, Badge, Toggle)? | ui-library | Continue |
| Is it a data display pattern (Table, List, Chart, Stats)? | ui-library | Continue |
| Is it a layout component (Stack, Grid, Container)? | ui-library | Continue |
| Is it an interactive pattern (Dropdown, Modal, Tabs, Select)? | ui-library | Continue |
| Could another project reasonably use this component? | ui-library | Continue |
| Is it tied to specific app data/routes/business logic? | package-specific | ui-library |

**When in doubt, prefer ui-library.** It's easier to use a shared component than to extract a specific one later.

#### Step 2: Should this use Radix UI Primitives?

**Two-tier component system:**

| Tier | When to Use | Implementation |
|------|-------------|----------------|
| **Tier 1: Simple** | Visual-only components without complex behavior | Tailwind + CVA |
| **Tier 2: Behavioral** | Components requiring positioning, focus management, or complex interactions | Radix Primitives + Tailwind + CVA |

**Use Radix (Tier 2) when the component needs ANY of these:**

| Behavior | Examples | Radix Package |
|----------|----------|---------------|
| **Positioning with collision detection** | Tooltip, Popover, Dropdown that repositions near viewport edges | `@radix-ui/react-tooltip`, `@radix-ui/react-popover`, `@radix-ui/react-dropdown-menu` |
| **Focus trapping** | Modal dialogs that trap focus inside | `@radix-ui/react-dialog`, `@radix-ui/react-alert-dialog` |
| **Complex keyboard navigation** | Arrow keys between items, roving tabindex | `@radix-ui/react-toggle-group`, `@radix-ui/react-tabs`, `@radix-ui/react-radio-group` |
| **Managed open/close state** | Accordions, collapsibles with animations | `@radix-ui/react-accordion`, `@radix-ui/react-collapsible` |
| **Selection state management** | Single/multi select with proper ARIA | `@radix-ui/react-select`, `@radix-ui/react-toggle-group` |
| **Portal rendering** | Content that needs to escape parent overflow/z-index | Most Radix components support portals |

**Use Tailwind + CVA only (Tier 1) when:**
- Component is purely visual (Badge, Card, Container)
- No positioning logic needed
- Keyboard handling is simple (just Tab, Enter, Space)
- Native HTML elements provide sufficient accessibility (button, input)

**Decision tree for new components:**

```
Is this component purely visual with no complex interactions?
├─ YES -> Tier 1: Tailwind + CVA only
└─ NO -> Does it need positioning that adapts to viewport?
         ├─ YES -> Tier 2: Use Radix (Tooltip, Popover, Dropdown, Select)
         └─ NO -> Does it need focus trapping?
                  ├─ YES -> Tier 2: Use Radix (Dialog, AlertDialog)
                  └─ NO -> Does it need arrow key navigation between items?
                           ├─ YES -> Tier 2: Use Radix (ToggleGroup, Tabs, RadioGroup, Menu)
                           └─ NO -> Tier 1: Tailwind + CVA is likely sufficient
```

#### Step 3: Design system priority order

1. Use existing ui-library component as-is
2. Extend existing component with new variant
3. Create new ui-library component (if reusable pattern)
4. Create package-specific code (only if truly specific)

#### Step 4: Check Design Tokens and Utilities

**Use MCP tools to discover available design tokens and Tailwind utilities:**
- `get_design_tokens` - Get all tokens (colors, typography, sizing, spacing)
- `get_design_tokens` with `type: "colors"` - Get semantic color tokens (theme-aware)
- `get_design_tokens` with `type: "typography"` - Get font families and sizes
- `get_design_tokens` with `type: "sizing"` - Get element sizing tokens (heights, widths)
- `get_design_tokens` with `type: "spacing"` - Get semantic spacing values
- `get_tailwind_utilities` - Get all Tailwind CSS utility classes organized by category
- `get_tailwind_utilities` with `category: "colors"` - Get text, background, and border color classes
- `get_tailwind_utilities` with `category: "spacing"` - Get padding, margin, and gap classes
- `get_tailwind_utilities` with `category: "typography"` - Get font size, weight, and family classes
- `get_tailwind_utilities` with `category: "layout"` - Get display, flex, and grid classes

**Available semantic color tokens (theme-aware):**

| Token | Variants | Purpose |
|-------|----------|---------|
| `surface` | DEFAULT, muted, subtle | Backgrounds |
| `foreground` | DEFAULT, muted, inverted, inverted-muted | Text colors |
| `border` | DEFAULT, muted | Border colors |
| `ring` | DEFAULT | Focus indicators |
| `shadow` | sm, md, lg | Static elevation shadows |
| `shadow` | interactive (DEFAULT, hover, pressed), highlight (DEFAULT, hover, pressed), inset (sm, md, underline) | Interactive and inset shadows |
| `borderStyle` | line, thick, highlight | Composite border styles (via `border-line`, `border-thick`, `border-highlight` utilities) |
| `gradient` | interactive (primary, secondary, destructive), status (info, success, warning, error), accent (1-5), surface (inverted) | Background gradients (via `bg-gradient-*` utilities) |
| `interactive` | hover, active, pressed, primary (with hover/foreground/border), secondary (with hover/foreground/border), destructive (with hover/foreground/border) | Interactive element states |
| `status` | info, success, warning, error (each with: DEFAULT, muted, foreground, emphasis, border) | Status indicators |
| `disabled` | DEFAULT, foreground | Disabled state colors |
| `tooltip` | DEFAULT, foreground | Tooltip colors |
| `accent` | 1-5 (each with: DEFAULT, muted, foreground, emphasis, border) | Categorical data visualization |

**Available semantic spacing tokens:**

| Token | Value | CSS | Usage |
|-------|-------|-----|-------|
| `2xs` | 0.125rem | 2px | Very tight gaps, micro spacing |
| `xs` | 0.25rem | 4px | Tight inline elements, icon gaps |
| `sm` | 0.5rem | 8px | Form inputs, button padding |
| `md` | 0.75rem | 12px | Card padding, section gaps |
| `base` | 1rem | 16px | Component padding, medium element gaps |
| `lg` | 2rem | 32px | Section separation, major gaps |
| `xl` | 4rem | 64px | Page sections, major separators |
| `2xl` | 8rem | 128px | Hero sections, major landmarks |

Usage: `gap-sm`, `p-md`, `m-lg`, `space-y-xs`, etc.

**Available element sizing tokens:**

| Token | Value | CSS | Usage |
|-------|-------|-----|-------|
| `xs` | 1.5rem | 24px | Compact buttons, badges |
| `sm` | 2rem | 32px | Small buttons, inputs |
| `md` | 2.5rem | 40px | Default buttons, inputs |
| `lg` | 3rem | 48px | Large buttons, inputs |
| `xl` | 3.5rem | 56px | Hero buttons, prominent elements |

Usage: `h-size-md`, `w-size-lg`, etc.

#### Step 4b: Check Icons

**Use MCP tools to discover available icons:**
- `search_icons` with `query` - Search icons by name, description, or aliases
- `list_icons` - List all icons (optionally filter by category)
- `get_icon` with `name` - Get full metadata for a specific icon

**Icon categories:**
- `navigation` - Chevrons, arrows
- `action` - Search, close, check, copy
- `status` - Alert, info, resolved, unresolved
- `sorting` - Sort ascending, descending
- `theme` - Sun, moon, desktop
- `entity` - Package, component, file types
- `code` - Code, brackets, function
- `data` - Database, chart, users

#### Step 5: Propose New Semantic Tokens (If Needed)

**CRITICAL: This is how the design system evolves to maturity.**

If a UI feature needs a color that should be theme-aware but doesn't exist as a semantic token, propose adding it.

**When to propose a new semantic token:**
1. The color changes between light/dark themes
2. The usage pattern appears 3+ times (or will likely appear)
3. The color represents a semantic concept (e.g., "accent", "highlight", "interactive")
4. Direct palette references (e.g., `primary-500`) are not appropriate because they don't adapt to theme

**How to propose:**

Add a "Design Token Proposal" section to the implementation plan:

```markdown
### Design Token Proposal

**New semantic token needed:** `<token-name>`

**Justification:**
- <Why this token is needed>
- <Where it will be used>
- <Why existing tokens don't work>

**Proposed values:**

| Variant | Light Theme | Dark Theme |
|---------|-------------|------------|
| DEFAULT | `<palette-shade>` | `<palette-shade>` |

**Files to modify:**
- `packages/ui-library/tokens/semantic/light.json` - Add light theme token values
- `packages/ui-library/tokens/semantic/dark.json` - Add dark theme token values
- Run `pnpm --filter ui-library generate:tokens` to regenerate CSS and metadata
```

#### Step 5b: Propose New Icons (If Needed)

If a UI feature needs an icon that doesn't exist in the registry, propose adding it.

**When to propose a new icon:**
1. The needed visual concept is not represented by any existing icon
2. No existing icon's aliases match the intended meaning
3. The icon will likely be useful in other contexts (not a one-off)

**How to propose:**

Add an "Icon Proposal" section to the implementation plan:

```markdown
### Icon Proposal

**New icon needed:** `<icon-name>`

**Justification:**
- <Why this icon is needed>
- <What it represents semantically>
- <Why existing icons don't work (list icons you checked)>

**Suggested Tabler icon:** `<TablerIconName>` from @tabler/icons-react

**Category:** `<navigation|action|status|sorting|theme|entity|code|data>`

**Metadata:**
- Description: <short description>
- Usage: <when to use this icon>
- Aliases: <alternative search terms>

**Files to modify:**
- `packages/ui-library/src/icons/icons.ts` - Add to ICON_REGISTRY
- `packages/ui-library/src/icons/metadata.ts` - Add to ICON_METADATA
- `packages/ui-library/src/icons/types.ts` - Add to IconName type
```

#### Step 6: Additional considerations

1. **Could existing ui-library components solve this?**
   - Check existing components first
   - Consider composition before creating new components

### 4. Understand Current State

**Use MCP tools to discover existing components and design tokens:**
- `list_components` - List all ui-library components with category, tier, and description
- `list_components` with `category` filter - Filter by: primitives, layout, data, feedback, selection, behavioral, foundation
- `get_component` with `name` - Get detailed component info (props, usage, accessibility)
- `get_design_tokens` - Get all design tokens (colors, typography, sizing, spacing)
- `get_design_tokens` with `type: "colors"` - Get semantic color tokens (theme-aware)

```bash
# Check existing components (or use list_components MCP tool)
ls packages/ui-library/src/components/

# Check utilities
ls packages/ui-library/src/utils/
```

**Key files to read:**
- `packages/ui-library/README.md` - Component patterns, CVA usage

### 5. Identify Affected Areas

**Component types:**

| Type | Location | Description |
|------|----------|-------------|
| UI Primitive | `ui-library/src/components/` | Button, Input, Badge, Card |
| Data Display | `ui-library/src/components/` | DataTable, StatsSummary, Chart |
| Layout | `ui-library/src/components/` | Stack, Grid, Container |
| Utility | `ui-library/src/utils/` | cn(), formatters |

### 6. Check for Reusable Code

**CRITICAL: Identify opportunities to reuse or extend**

Before proposing new code, check:

1. **Existing ui-library components:**
   - Can an existing component be extended with new variants?
   - Can composition solve this without a new component?

2. **Existing utilities:**
   - `cn()` - Class name merging
   - Design tokens in `tailwind.config.ts`

3. **Existing patterns:**
   - Similar variant structure?
   - Similar prop interface?
   - Similar accessibility handling?

**When to extend vs create new:**
- Extend: Adding a variant to existing component
- New: Fundamentally different behavior or structure

### 7. Identify Options and Trade-offs

**If multiple valid approaches exist:**

1. List each option with pros/cons
2. Note which aligns better with existing patterns
3. **Ask the user to choose** before proceeding

**Common UI decision points:**
- Composition vs inheritance: HOC, render props, or composition?
- Styling approach: CVA variants vs conditional cn() calls?
- State management: Local state vs lifted state?
- Accessibility: ARIA requirements, keyboard navigation?

### 8. Create Implementation Plan

```markdown
## Implementation Plan

### Design System Impact

**ui-library components needed:**
- [ ] New component: `<ComponentName>` - <reason it should be shared>
- [ ] Extend existing: `<ComponentName>` with `<new variant>` - <reason>

**Design tokens needed:**
- [ ] New semantic token: `<name>` - <purpose> (see Design Token Proposal below)
- [ ] Uses existing palette: `<palette-shade>` for <purpose>
- [ ] Uses existing semantic: `<token>` for <purpose>
- [ ] None - uses existing tokens

### Design Token Proposal (if applicable)

**New semantic token:** `<token-name>`

**Justification:**
- <Why this token is needed>
- <Where it will be used>

**Values:**

| Variant | Light | Dark |
|---------|-------|------|
| DEFAULT | `<value>` | `<value>` |

**Files to modify:**
- `packages/ui-library/tokens/semantic/light.json` - Light theme values
- `packages/ui-library/tokens/semantic/dark.json` - Dark theme values
- Run `pnpm --filter ui-library generate:tokens` to regenerate

### Files to Create/Modify

**New files:**
- `src/components/MyComponent.tsx` - Component
- `src/components/MyComponent.test.tsx` - Colocated tests
- `src/components/MyComponent.stories.tsx` - Stories

**Modified files:**
- `src/index.ts` - Export new component (ui-library only)

### Component Interface

```typescript
// Variants (if using CVA)
const myComponentVariants = cva('base', {
  variants: {
    variant: { default: '...', alt: '...' },
  },
})

// Props
interface MyComponentProps {
  // ...
}
```

### Implementation Steps

1. Create component with CVA variants
2. Add accessibility attributes (aria-*, role)
3. Write unit tests
4. Create Storybook stories with all variants
5. Export from package index (if ui-library)

### Testing Requirements
- [ ] Renders correctly with default props
- [ ] All variants render correctly
- [ ] Accessibility: proper roles and labels
- [ ] Keyboard navigation (if interactive)
- [ ] Custom className merges correctly

### Storybook Requirements
- [ ] Default story
- [ ] Story for each variant
- [ ] Story showing all variants together
- [ ] Interactive controls (argTypes)

### Acceptance Criteria
- [ ] Component renders correctly
- [ ] All tests pass
- [ ] Stories documented in Storybook
- [ ] Accessible (WCAG 2.1 AA)
```

### 9. Update Issue Description

**Propose a refined issue body:**

```markdown
## Summary
<Clear, concise description of the UI component/feature>

## Context
<Why this is needed, where it will be used>

## Design

### Visual Spec
<Description or link to design, if available>

### Variants
- `variant`: primary, secondary, ...
- `size`: sm, md, lg

### Accessibility
- Role: <button, listbox, etc.>
- Keyboard: <Tab, Enter, Arrow keys, etc.>
- ARIA: <aria-label, aria-expanded, etc.>

## Implementation Plan

### Files to Create/Modify
- `src/components/Name.tsx` - Component
- `src/components/Name.test.tsx` - Colocated tests
- `src/components/Name.stories.tsx` - Stories
- `src/index.ts` - Add export

### Component Interface
```typescript
interface NameProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}
```

### Implementation Steps
1. <step>
2. <step>

## Acceptance Criteria
- [ ] Component renders correctly
- [ ] Tests pass with good coverage
- [ ] Storybook stories document all variants
- [ ] Meets accessibility requirements
- [ ] <additional criteria>

## Technical Notes
- Pattern to follow: see `Button` component
- Design tokens: check `tailwind.config.ts`
- <any other notes>

## Dependencies
**Blocked by:** TRA-X (if applicable)
**Related:** TRA-X (informational)

---
*Refined by Claude Code*
```

### 10. Present for Review

**Show the refined issue to the user:**

1. Summarize key decisions made
2. Highlight component location choice
3. List accessibility considerations
4. Offer to update the issue on Linear

**If approved, update the issue description:**
```
update_issue(id: "TRA-42", description: "<refined-body>")
```

**Important:** Do NOT manually update Linear issue statuses. Status transitions are handled automatically by the Linear-GitHub integration.

## Quick Reference

**Design system decision tree:**
1. Is it a visual/interactive pattern? -> Consider ui-library
2. Does similar component exist? -> Extend with variant
3. Could it be used in other projects? -> ui-library
4. Is it truly package-specific? -> package-specific code

**Fetch issue:**
```
get_issue(id: "TRA-42", includeRelations: true)
```

**Key files to reference:**
- `packages/ui-library/README.md` - Component patterns
- `packages/ui-library/src/styles/generated/token-metadata.ts` - Token metadata (auto-generated)
- `packages/ui-library/tokens/semantic/light.json` - Semantic token definitions (light theme)
- `packages/ui-library/tokens/semantic/dark.json` - Semantic token definitions (dark theme)
- `packages/ui-library/tokens/themes/arctic.json` - Theme token values (arctic)
- `packages/ui-library/src/tailwind-preset.ts` - Tailwind preset config
- `packages/ui-library/src/components/Button.tsx` - Example component

**MCP tools for design system discovery:**
- `list_components` - Available UI components
- `get_component` - Component details (props, usage, a11y)
- `get_design_tokens` - Semantic color tokens, typography, sizing, spacing
- `get_tailwind_utilities` - Tailwind CSS utility classes by category (spacing, colors, typography, layout)
- `search_icons` - Search icons by name, description, or aliases
- `list_icons` - List all icons (optionally filter by category)
- `get_icon` - Get full metadata for a specific icon

**Component checklist:**
- [ ] TypeScript props interface
- [ ] CVA variants (if applicable)
- [ ] forwardRef for DOM elements
- [ ] cn() for className merging
- [ ] Accessibility attributes
- [ ] Colocated unit tests (ComponentName.test.tsx)
- [ ] Storybook stories
- [ ] Exported directly from src/index.ts (no barrel files)

**Accessibility checklist:**
- [ ] Semantic HTML elements
- [ ] ARIA labels/roles where needed
- [ ] Keyboard navigable
- [ ] Focus visible styles
- [ ] Color contrast (4.5:1 for text)
- [ ] Screen reader tested

**When to ask questions:**
- Component location unclear
- Multiple valid styling approaches
- Accessibility requirements ambiguous
- Design spec incomplete
- Interactivity level unclear
- Icon selection unclear

**Icon checklist:**
- [ ] All icons use the standardized `Icon` component (not direct Tabler imports)
- [ ] Icon names are from the registry (use `search_icons` or `list_icons` to verify)
- [ ] Appropriate size presets used (`xs`, `sm`, `md`, `lg`, `xl`, `2xl`)
- [ ] Icon-only buttons have `aria-label` for accessibility
- [ ] If a new icon is needed, include an Icon Proposal section in the implementation plan
