# Implement Issue

Implement a GitHub issue for the Traceframe design system, following project conventions.

## Configuration

**GitHub:**
- Owner: `nejcjelovcan`
- Repo: `traceframe`

## Usage

`/implement <ISSUE_NUMBER>` - Issue number is required. Example: `/implement 42`

## Prerequisites

The issue should contain an implementation plan. If not refined, suggest running `/refine <ISSUE_NUMBER>` first.

## Workflow

### 1. Fetch Issue Details

Use GitHub MCP tools:

```
issue_read(owner: "nejcjelovcan", repo: "traceframe", issue_number: 42)
```

**Verify:**

- Issue exists and is open
- Issue has an implementation plan (warn if not)
- Extract implementation plan from issue body

### 2. Create Feature Branch

```bash
git checkout main
git pull origin main
git checkout -b feat/<description>
```

**Branch naming:**
- For ui-library: `feat/ui-library-<description>` (e.g., `feat/ui-library-add-card-component`)
- For eslint-plugin: `feat/eslint-plugin-<description>`
- For mcp-ui: `feat/mcp-ui-<description>`
- General: `feat/<description>` or `fix/<description>`

### 3. Load Project Context

**Read these files to understand conventions:**

- `CLAUDE.md` - MCP tools, development workflow, code conventions
- `packages/ui-library/README.md` - Component patterns, CVA usage

### 4. Check Dependencies

**From the issue's "Dependencies" section:**
- If issue has dependencies, verify those issues are closed
- If dependencies are not met, warn user and ask if they want to proceed anyway

### 5. Understand Existing Code

**Explore the target package to understand current state:**

```bash
ls packages/ui-library/src/components/
ls packages/ui-library/src/utils/
```

**Key patterns to follow:**

| Convention                | Details                                |
| ------------------------- | -------------------------------------- |
| Directory                 | UI packages use `src/` folder          |
| No barrel files           | Import directly from component files   |
| Colocated tests           | `Component.tsx` -> `Component.test.tsx` |
| Styling                   | Tailwind CSS + CVA for variants        |
| Class merging             | Use `cn()` utility                     |
| Stories                   | Storybook for component documentation  |
| **Behavioral components** | Use Radix UI Primitives as foundation  |

**Radix UI Primitives:**
Components requiring positioning, focus trapping, or complex keyboard interactions should use [Radix UI Primitives](https://www.radix-ui.com/primitives) as their foundation. This includes:
- Tooltip (`@radix-ui/react-tooltip`)
- Dialog/Modal (`@radix-ui/react-dialog`)
- Popover (`@radix-ui/react-popover`)
- Dropdown Menu (`@radix-ui/react-dropdown-menu`)
- Select (`@radix-ui/react-select`)

Radix handles behavior and accessibility; we add styling with Tailwind + CVA.

### 6. Design System Check

**CRITICAL: Before implementing, evaluate design system impact.**

**Use MCP tools to discover existing components, design tokens, utilities, and icons:**
- `list_components` - See all available components with summaries
- `get_component` with component name - Get props, usage, and accessibility info
- `get_design_tokens` - Get all design tokens (colors, typography, sizing, spacing)
- `get_design_tokens` with `type: "colors"` - Get semantic color tokens (theme-aware)
- `get_design_tokens` with `type: "sizing"` - Get element sizing tokens
- `get_tailwind_utilities` - Get Tailwind CSS utility classes organized by category
- `search_icons` - Search icons by name, description, or aliases
- `list_icons` - List all icons (optionally filter by category)
- `get_icon` - Get full metadata for a specific icon

**Ask these questions:**

1. **Does this pattern exist in ui-library?**
   - Use `list_components` MCP tool to see available components
   - Use `get_component` MCP tool to check if existing component can be extended
   - If yes -> use or extend the existing component

2. **Are the required design tokens available?**
   - Use `get_design_tokens` MCP tool to check available tokens
   - If a new semantic token was proposed in the refined issue -> implement it first
   - Files to modify for new tokens:
     - `packages/ui-library/tokens/semantic/light.json` - Light theme token values
     - `packages/ui-library/tokens/semantic/dark.json` - Dark theme token values
     - Run `pnpm --filter ui-library generate:tokens` to regenerate CSS and metadata

3. **Are the required icons available?**
   - Use `search_icons` to find icons by concept
   - Use `get_icon` to verify an icon exists and check its metadata
   - If a new icon was proposed in the refined issue -> implement it first
   - Files to modify for new icons:
     - `packages/ui-library/src/icons/icons.ts` - Add to ICON_REGISTRY
     - `packages/ui-library/src/icons/metadata.ts` - Add to ICON_METADATA
     - `packages/ui-library/src/icons/types.ts` - Add to IconName type

**Design system priority:**
1. Use existing ui-library component with existing variant
2. Extend ui-library component with new variant
3. Create new ui-library component (if pattern is reusable)
4. Create package-specific code (only if truly specific)

### 7. Execute Implementation Plan

**Follow the issue's "Implementation Steps" section:**

1. Create/modify files as specified
2. Follow code examples from the issue exactly unless they have obvious errors
3. Use CVA patterns for component variants
4. Add accessibility attributes (aria-*, role)

**Component file structure (flat, no nested folders):**
```
src/components/
├── Button.tsx         # Component implementation
├── Button.test.tsx    # Colocated tests
├── Button.stories.tsx # Storybook stories
├── Card.tsx
├── Card.test.tsx
└── Card.stories.tsx
```

**CVA component pattern (simple components):**

```typescript
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type ComponentPropsWithoutRef } from 'react'

import { cn } from '../../utils/cn'

const componentVariants = cva('base-classes', {
  variants: {
    variant: {
      default: 'default-classes',
      alt: 'alt-classes',
    },
    size: {
      sm: 'sm-classes',
      md: 'md-classes',
      lg: 'lg-classes',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})

export interface ComponentProps
  extends ComponentPropsWithoutRef<'div'>,
    VariantProps<typeof componentVariants> {}

export const Component = forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        className={cn(componentVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

Component.displayName = 'Component'
```

**Radix component pattern (behavioral components):**

```typescript
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react'

import { cn } from '../utils/cn'

const tooltipContentVariants = cva(
  'z-50 rounded px-2 py-1 text-xs shadow-md animate-in fade-in-0',
  {
    variants: {
      variant: {
        default: 'bg-neutral-900 text-white',
        light: 'bg-white text-neutral-900 border',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

const TooltipContent = forwardRef<
  ComponentRef<typeof TooltipPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> &
    VariantProps<typeof tooltipContentVariants>
>(({ className, variant, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(tooltipContentVariants({ variant, className }))}
      {...props}
    />
  </TooltipPrimitive.Portal>
))

// Compound component export
export const Tooltip = {
  Provider: TooltipPrimitive.Provider,
  Root: TooltipPrimitive.Root,
  Trigger: TooltipPrimitive.Trigger,
  Content: TooltipContent,
}
```

**After writing code:**
1. Run `pnpm autofix` to fix formatting and lint
2. Run `pnpm --filter <package> build` to build
3. Run `pnpm --filter <package> typecheck` to check types
4. Fix any errors before proceeding

### 8. Export New Components (ui-library only)

**If you added a new component to ui-library:**

Update `packages/ui-library/src/index.ts` to export the component:

```typescript
// Flat component structure - no nested folders
export { MyComponent, type MyComponentProps } from './components/MyComponent'
```

### 9. Create Storybook Stories

**Every component needs stories:**

```typescript
import type { Meta, StoryObj } from '@storybook/react'

import { MyComponent } from './MyComponent'

const meta: Meta<typeof MyComponent> = {
  title: 'Components/MyComponent',
  component: MyComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'alt'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Default content',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <MyComponent variant="default">Default</MyComponent>
      <MyComponent variant="alt">Alt</MyComponent>
    </div>
  ),
}
```

### 10. Create Tests

**All components need tests:**

```typescript
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { MyComponent } from './MyComponent'

describe('MyComponent', () => {
  it('renders children', () => {
    render(<MyComponent>Content</MyComponent>)
    expect(screen.getByText('Content')).toBeDefined()
  })

  it('applies variant classes', () => {
    render(<MyComponent variant="alt">Alt</MyComponent>)
    const element = screen.getByText('Alt')
    expect(element.className).toContain('alt-classes')
  })

  it('merges custom className', () => {
    render(<MyComponent className="custom">Content</MyComponent>)
    const element = screen.getByText('Content')
    expect(element.className).toContain('custom')
  })

  it('forwards ref', () => {
    const ref = { current: null }
    render(<MyComponent ref={ref}>Content</MyComponent>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
```

**Accessibility tests (if applicable):**

```typescript
it('has correct aria attributes', () => {
  render(<MyComponent aria-label="Test label">Content</MyComponent>)
  expect(screen.getByLabelText('Test label')).toBeDefined()
})

it('is keyboard accessible', () => {
  render(<MyComponent>Content</MyComponent>)
  const element = screen.getByText('Content')
  element.focus()
  expect(document.activeElement).toBe(element)
})
```

### 11. Verify Acceptance Criteria

**Check each item in the issue's "Acceptance Criteria" section:**

```bash
# Build the package
pnpm --filter <package> build

# Run tests
pnpm --filter <package> test

# For ui-library: verify Storybook runs
# Use MCP: run_or_open_storybook
```

**Document results:**
- Which criteria passed
- Which criteria failed (and why)
- Any issues discovered

### 12. Final Verification

**Run full verification:**
1. `pnpm autofix` - Fix any remaining lint/format issues
2. `pnpm --filter <package> build` - Verify build succeeds
3. `pnpm --filter <package> typecheck` - Verify types
4. `pnpm --filter <package> test` - Run tests

**For ui-library components:**
- Use `run_or_open_storybook` to start/open Storybook
- Verify component appears in Storybook
- Check all stories render correctly
- Verify controls work as expected
- Use `stop_storybook` when done (optional)

### 13. Summary Report

**Present implementation summary:**

```markdown
## Implementation Complete: #<ISSUE_NUMBER>

### Files Changed

- `packages/ui-library/src/components/MyComponent.tsx` - New component
- `packages/ui-library/src/components/MyComponent.test.tsx` - Tests
- `packages/ui-library/src/components/MyComponent.stories.tsx` - Stories
- `packages/ui-library/src/index.ts` - Export new component

### Acceptance Criteria

- [x] Component renders correctly - Verified by tests
- [x] All variants work - Verified by Storybook
- [x] Accessible - Verified aria attributes in tests

### Tests Added

- `MyComponent.test.tsx` - 5 tests covering rendering, variants, className merging

### Notes

- <Any deviations from the plan>
- <Any issues encountered>
- <Suggestions for follow-up>
```

### 14. Commit and Create Pull Request

**Stage and commit changes:**

```bash
# Stage specific files (avoid git add -A or git add .)
git add <file1> <file2> ...

# Commit with descriptive message
git commit -m "$(cat <<'EOF'
<Brief description> (#<NUMBER>)

<Optional longer description>

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

**Push and create PR on GitHub:**

```bash
# Push branch to remote
git push -u origin <branch-name>

# Create PR using gh CLI
gh pr create --title "<Title> (#<NUMBER>)" --body "$(cat <<'EOF'
## Summary
- <1-3 bullet points describing the changes>

## Test plan
- [x] Build passes
- [x] Tests pass
- [x] Storybook stories render correctly
- [x] <Additional verification>

Closes #<NUMBER>

Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

**Return the PR URL to the user.**

## Quick Reference

**Design system first:**
- Always check ui-library before creating new components
- Prefer extending existing components over creating new ones
- Generic patterns belong in ui-library

**CLI commands:**
- `pnpm autofix` - Fix formatting and lint
- `pnpm --filter ui-library build` - Build package
- `pnpm --filter ui-library typecheck` - Check types
- `pnpm --filter ui-library test` - Run tests

**MCP tools:**
- `list_components` - List all ui-library components (filter by category)
- `get_component` - Get detailed component info (props, usage, accessibility)
- `get_design_tokens` - Get design tokens (colors, typography, sizing, spacing)
- `get_tailwind_utilities` - Get Tailwind CSS utility classes by category
- `search_icons` - Search icons by name, description, or aliases
- `list_icons` - List all icons (optionally filter by category)
- `get_icon` - Get full metadata for a specific icon
- `run_or_open_storybook` - Start Storybook or open browser if running
- `stop_storybook` - Stop a running Storybook process
- `capture_storybook_screenshots` - Capture screenshots of stories

**Git MCP Tools:**
- `git_status` - Show working tree status
- `git_diff` - View changes before committing
- `git_add` - Stage files for commit
- `git_commit` - Create commits
- `git_push` - Push to remote
- `git_fetch` - Fetch updates from remote
- `git_log` - View commit history

**GitHub MCP Tools:**
- `issue_read` - Get issue details
- `create_pull_request` - Create a PR
- `update_pull_request` - Update PR
- `add_issue_comment` - Add comment to issue

**Key conventions:**
- UI packages use `src/` folder
- NO barrel files - import directly from component files
- Colocated tests (`Component.tsx` -> `Component.test.tsx`)
- CVA for component variants
- `cn()` for className merging
- forwardRef for DOM element components
- Explicit TypeScript types
- Storybook stories for all components
- Use Tabler Icons via the `Icon` component (`@tabler/icons-react`)

**Component checklist:**
- [ ] TypeScript props interface
- [ ] CVA variants (if applicable)
- [ ] forwardRef for DOM elements
- [ ] cn() for className merging
- [ ] Accessibility attributes (aria-*, role)
- [ ] Colocated unit tests
- [ ] Storybook stories with all variants
- [ ] Exported directly from src/index.ts (no barrel files)

**Accessibility checklist:**
- [ ] Semantic HTML elements
- [ ] ARIA labels/roles where needed
- [ ] Keyboard navigable (if interactive)
- [ ] Focus visible styles
- [ ] Color contrast (4.5:1 for text)

**CVA pattern:**
```typescript
const variants = cva('base', {
  variants: {
    variant: { default: '...', alt: '...' },
    size: { sm: '...', md: '...', lg: '...' },
  },
  defaultVariants: { variant: 'default', size: 'md' },
})
```

**Icon usage (standardized icons):**
```typescript
import { Icon } from '@nejcjelovcan/traceframe-ui-library'

// Use semantic icon names with size presets
<Icon name="search" size="lg" />
<Icon name="alert-circle" size="2xl" />

// Colors via Tailwind
<Icon name="search" className="text-primary-500" />
```

**Icon guidelines:**
- Always use the `Icon` component, NOT direct Tabler imports
- Use semantic names from the registry (see `packages/ui-library/ICONS.md`)
- Size presets: `xs` (12), `sm` (16), `md` (20), `lg` (24), `xl` (32), `2xl` (48)
- For icon-only buttons, provide `aria-label` for accessibility

**When stuck:**
- Re-read the issue's Technical Notes section
- Check existing components in `src/components/` for patterns
- Reference `packages/ui-library/README.md` for conventions
- Ask user for clarification if requirements are ambiguous

**Do NOT:**
- Create barrel files (index.ts in component folders)
- Modify files outside target package unless explicitly needed
- Skip verification steps
- Add features not in the issue
- Force push or use destructive git commands
- Skip the PR creation step
- Skip Storybook stories for components
- Attach screenshots to GitHub PRs or comments (image attachments don't work)
