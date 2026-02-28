---
name: refine
description: Refine a Linear issue to make it implementation-ready. Use when the user wants to analyze, plan, and prepare a Linear issue for implementation.
argument-hint: "[issue-identifier]"
---

# Refine Issue

Refine a Linear issue for the Traceframe design system to make it implementation-ready.

**Issue identifier:** `$ARGUMENTS`

## Workflow

### 1. Fetch Issue Context

Use Linear MCP tools:

```
get_issue(id: "$ARGUMENTS", includeRelations: true)
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

**Decision tree:**

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

#### Step 4: Check Existing Components, Tokens, Utilities, and Icons

**Use MCP tools to discover what's available:**
- `list_components` / `get_component` - Existing UI components
- `get_design_tokens` - Semantic tokens (colors, typography, sizing, spacing)
- `get_tailwind_utilities` - Tailwind CSS utility classes by category
- `search_icons` / `list_icons` / `get_icon` - Available icons

**Also read** `packages/ui-library/README.md` for component patterns.

#### Step 5: Propose New Semantic Tokens (If Needed)

If a UI feature needs a color that should be theme-aware but doesn't exist, propose adding it.

**When to propose:** The color changes between light/dark themes, appears 3+ times, and represents a semantic concept.

Include a "Design Token Proposal" section in the implementation plan with:
- Token name and justification
- Proposed light/dark values (referencing OKLCH palette vars)
- Files to modify: `modes/light.css`, `modes/dark.css`, `theme-registration.css`, `token-metadata.ts`
- **Important:** Use `var()` references only, never `rgb()`

#### Step 6: Propose New Icons (If Needed)

If a UI feature needs an icon not in the registry, propose adding it.

Include an "Icon Proposal" section with:
- Icon name, justification, and suggested Tabler icon
- Category and metadata (description, usage, aliases)
- Files to modify: `icons/icons.ts`, `icons/metadata.ts`, `icons/types.ts`

### 4. Identify Options and Trade-offs

**If multiple valid approaches exist:**

1. List each option with pros/cons
2. Note which aligns better with existing patterns
3. **Ask the user to choose** before proceeding

### 5. Create Implementation Plan

```markdown
## Implementation Plan

### Design System Impact

**ui-library components needed:**
- [ ] New component: `<ComponentName>` - <reason it should be shared>
- [ ] Extend existing: `<ComponentName>` with `<new variant>` - <reason>

**Design tokens needed:**
- [ ] New semantic token: `<name>` - <purpose> (see Design Token Proposal below)
- [ ] Uses existing: `<token>` for <purpose>
- [ ] None - uses existing tokens

### Design Token Proposal (if applicable)

**New semantic token:** `<token-name>`

**Justification:** ...

**Values:**

| Variant | Light | Dark |
|---------|-------|------|
| DEFAULT | `<value>` | `<value>` |

### Icon Proposal (if applicable)

**New icon:** `<icon-name>` ...

### Files to Create/Modify

**New files:**
- `src/components/MyComponent.tsx` - Component
- `src/components/MyComponent.test.tsx` - Colocated tests
- `src/components/MyComponent.stories.tsx` - Stories

**Modified files:**
- `src/index.ts` - Export new component (ui-library only)

### Component Interface

```typescript
interface MyComponentProps { ... }
```

### Implementation Steps

1. ...
2. ...

### Acceptance Criteria
- [ ] Component renders correctly
- [ ] Tests pass with good coverage
- [ ] Storybook stories document all variants
- [ ] Meets accessibility requirements
```

### 6. Propose Refined Issue Body

```markdown
## Summary
<Clear, concise description>

## Context
<Why this is needed>

## Design

### Variants
- `variant`: primary, secondary, ...
- `size`: sm, md, lg

### Accessibility
- Role: <button, listbox, etc.>
- Keyboard: <Tab, Enter, Arrow keys, etc.>
- ARIA: <aria-label, aria-expanded, etc.>

## Implementation Plan
<From step 5 above>

## Acceptance Criteria
- [ ] ...

## Dependencies
**Blocked by:** TRA-X (if applicable)

---
*Refined by Claude Code*
```

### 7. Update the Issue

Update the issue on Linear with the refined body:
```
update_issue(id: "$ARGUMENTS", description: "<refined-body>")
```

Then summarize to the user:
1. Key decisions made
2. Component location choice
3. Accessibility considerations

**Important:** Do NOT manually update Linear issue statuses. Status transitions are handled automatically by the Linear-GitHub integration.

## When to Ask Questions

- Component location unclear (ui-library vs package-specific)
- Multiple valid styling approaches
- Accessibility requirements ambiguous
- Design spec incomplete
- Interactivity level unclear
- Icon selection unclear
