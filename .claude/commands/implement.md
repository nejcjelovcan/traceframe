# Implement Issue

Implement a Linear issue for the Traceframe design system, following project conventions.

## Configuration

**Linear:**
- Team: `Traceframe` (prefix: `TRA`)

**GitHub (for PRs only):**
- Owner: `nejcjelovcan`
- Repo: `traceframe`

## Usage

`/implement <ISSUE_IDENTIFIER>` - Linear issue identifier is required. Example: `/implement TRA-42`

## Prerequisites

The issue should contain an implementation plan. If not refined, suggest running `/refine <ISSUE_IDENTIFIER>` first.

## Workflow

### 1. Fetch Issue Details

Use Linear MCP tools:

```
get_issue(id: "TRA-42", includeRelations: true)
```

**Verify:**

- Issue exists and is not completed/cancelled
- Issue has an implementation plan (warn if not)
- Extract implementation plan from issue description

### 2. Create Feature Branch

Use the `gitBranchName` from the Linear issue response when available:

```bash
git checkout main
git pull origin main
git checkout -b <gitBranchName>
```

**Branch naming (if no `gitBranchName` available):**
- For ui-library: `feat/ui-library-<description>` (e.g., `feat/ui-library-add-card-component`)
- For eslint-plugin: `feat/eslint-plugin-<description>`
- For mcp-ui: `feat/mcp-ui-<description>`
- General: `feat/<description>` or `fix/<description>`

### 3. Load Project Context

**Read these files to understand conventions:**

- `CLAUDE.md` - MCP tools, development workflow, code conventions
- `packages/ui-library/README.md` - Component patterns, CVA usage

### 4. Check Dependencies

**From the issue's relations (blockedBy):**
- If issue has `blockedBy` relations, verify those issues are completed
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
     - `packages/ui-library/src/styles/tokens/modes/light.css` - Light mode semantic token values
     - `packages/ui-library/src/styles/tokens/modes/dark.css` - Dark mode semantic token values
     - `packages/ui-library/src/styles/tokens/theme-registration.css` - Register via `@theme inline`
     - `packages/ui-library/src/styles/token-metadata.ts` - Add descriptions for MCP tools
     - **Important:** Palette values are OKLCH. Reference them with `var()` only, never `rgb()`

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
  'z-50 rounded px-2 py-1 text-xs shadow-md animate-in fade-in-0 bg-tooltip text-tooltip-foreground',
  {
    variants: {
      variant: {
        default: '',
        light: 'bg-surface text-foreground border-line',
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
1. Use `autofix` mcp-dev tool to fix formatting and lint
2. Use `build_package` mcp-dev tool to build
3. Use `typecheck_package` mcp-dev tool to check types
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

```
# Build the package
Use build_package mcp-dev tool

# Run tests
Use test_package mcp-dev tool

# For ui-library: verify Storybook runs
Run pnpm --filter ui-library storybook
```

**Document results:**
- Which criteria passed
- Which criteria failed (and why)
- Any issues discovered

### 12. Final Verification

**Run full verification using mcp-dev tools:**
1. `autofix` - Fix any remaining lint/format issues
2. `build_package` - Verify build succeeds
3. `typecheck_package` - Verify types
4. `test_package` - Run tests

**For ui-library components:**
- Run `pnpm --filter ui-library storybook` to start Storybook
- Verify component appears in Storybook
- Check all stories render correctly
- Verify controls work as expected

### 13. Summary Report

**Present implementation summary:**

```markdown
## Implementation Complete: <ISSUE_IDENTIFIER> (e.g., TRA-42)

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
<Brief description> (<ISSUE_IDENTIFIER>)

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
gh pr create --title "<Title> (<ISSUE_IDENTIFIER>)" --body "$(cat <<'EOF'
## Summary
- <1-3 bullet points describing the changes>

## Linear Issue
<ISSUE_IDENTIFIER>: <issue title>

## Test plan
- [x] Build passes
- [x] Tests pass
- [x] Storybook stories render correctly
- [x] <Additional verification>

Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

**After PR is created:**
1. Return the PR URL to the user

**Important:** Do NOT manually update Linear issue statuses. Status transitions (e.g., "In Review", "Done") are handled automatically by the Linear-GitHub integration.

## Quick Reference

**Design system first:**
- Always check ui-library before creating new components
- Prefer extending existing components over creating new ones
- Generic patterns belong in ui-library

**mcp-dev tools (preferred over CLI):**
- `autofix` - Fix formatting and lint
- `build_package` - Build package with dependencies
- `typecheck_package` - Check types
- `test_package` - Run tests
- `run_single_test` - Run a specific test file
- `list_package_scripts` - List available scripts
- `run_pnpm_script` - Run any pnpm script

**mcp-ui tools:**
- `list_components` - List all ui-library components (filter by category)
- `get_component` - Get detailed component info (props, usage, accessibility)
- `get_design_tokens` - Get design tokens (colors, typography, sizing, spacing)
- `get_tailwind_utilities` - Get Tailwind CSS utility classes by category
- `search_icons` - Search icons by name, description, or aliases
- `list_icons` - List all icons (optionally filter by category)
- `get_icon` - Get full metadata for a specific icon
**Git MCP Tools:**
- `git_status` - Show working tree status
- `git_diff` - View changes before committing
- `git_add` - Stage files for commit
- `git_commit` - Create commits
- `git_push` - Push to remote
- `git_fetch` - Fetch updates from remote
- `git_log` - View commit history

**Linear MCP Tools:**
- `get_issue` - Get issue details and relations
- `update_issue` - Update issue status/description
- `list_comments` / `create_comment` - Read/add comments on issues

**GitHub MCP Tools (PRs only):**
- `create_pull_request` - Create a PR
- `update_pull_request` - Update PR

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
