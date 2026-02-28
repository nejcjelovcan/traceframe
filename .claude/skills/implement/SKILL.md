---
name: implement
description: Implement a Linear issue following project conventions. Use when the user wants to implement a refined Linear issue.
argument-hint: "[issue-identifier]"
---

# Implement Issue

Implement a Linear issue for the Traceframe design system, following project conventions.

**Issue identifier:** `$ARGUMENTS`

## Prerequisites

The issue should contain an implementation plan. If not refined, suggest running `/refine $ARGUMENTS` first.

## Workflow

### 1. Fetch Issue Details

Use Linear MCP tools:

```
get_issue(id: "$ARGUMENTS", includeRelations: true)
```

**Verify:**
- Issue exists and is not completed/cancelled
- Issue has an implementation plan (warn if not)
- Extract implementation plan from issue description

### 2. Create Feature Branch

Use git MCP tools to create the branch:

1. Use `git_checkout` to switch to `main`
2. Use `git_pull` to update
3. Use `git_checkout` to create a new branch

Use the `gitBranchName` from the Linear issue response when available.

**Branch naming (if no `gitBranchName` available):**
- For ui-library: `feat/ui-library-<description>`
- For eslint-plugin: `feat/eslint-plugin-<description>`
- For mcp-ui: `feat/mcp-ui-<description>`
- General: `feat/<description>` or `fix/<description>`

### 3. Check Dependencies

From the issue's relations (blockedBy):
- If issue has `blockedBy` relations, verify those issues are completed
- If dependencies are not met, warn user and ask if they want to proceed anyway

### 4. Design System Check

**CRITICAL: Before implementing, evaluate design system impact.**

Use MCP tools to discover existing components, tokens, utilities, and icons:
- `list_components` / `get_component` - Available UI components
- `get_design_tokens` - Semantic tokens (colors, typography, sizing, spacing)
- `get_tailwind_utilities` - Tailwind CSS utility classes by category
- `search_icons` / `list_icons` / `get_icon` - Available icons

**Design system priority:**
1. Use existing ui-library component with existing variant
2. Extend ui-library component with new variant
3. Create new ui-library component (if pattern is reusable)
4. Create package-specific code (only if truly specific)

**If new tokens or icons were proposed in the refined issue, implement them first:**

New semantic tokens require changes to:
- `packages/ui-library/src/styles/tokens/modes/light.css` and `dark.css`
- `packages/ui-library/src/styles/tokens/theme-registration.css`
- `packages/ui-library/src/styles/token-metadata.ts`
- **Important:** Use `var()` references only, never `rgb()` (palette values are OKLCH)

New icons require changes to:
- `packages/ui-library/src/icons/icons.ts`, `metadata.ts`, `types.ts`

### 5. Execute Implementation Plan

**Follow the issue's "Implementation Steps" section:**

1. Create/modify files as specified
2. Follow code examples from the issue exactly unless they have obvious errors
3. Use CVA patterns for component variants (see CLAUDE.md for patterns)
4. Add accessibility attributes (aria-*, role)

**Component file structure (flat, no nested folders):**
```
src/components/
├── Button.tsx         # Component implementation
├── Button.test.tsx    # Colocated tests
├── Button.stories.tsx # Storybook stories
```

**After writing code:**
1. Use `autofix` mcp-dev tool to fix formatting and lint
2. Use `build_package` mcp-dev tool to build
3. Use `autofix` again (build may generate files needing formatting)
4. Use `typecheck_package` mcp-dev tool to check types
5. Fix any errors before proceeding

### 6. Export New Components (ui-library only)

If you added a **new** component to ui-library, update `packages/ui-library/src/index.ts` to export it.

### 7. Update Storybook Stories and Playroom Snippets

When a ui-library component is **created or modified** (new/changed props, variants, features), update:

1. **Storybook stories** (`packages/ui-library/src/components/<Component>.stories.tsx`) - prefer one story per feature (e.g. one story showing all outline badge variants, not separate stories for each). Many components have a "Showcase" story that demonstrates the full component API at a glance - update it when the component changes.
2. **Playroom snippets** (`packages/playroom-preset/snippets/<component-name>.ts`) - should reflect the current component API with 3-5+ examples showing key variants and usage patterns

For **new** components, also register the snippet file in `packages/playroom-preset/snippets/index.ts`.

### 8. Create Tests

All components need colocated tests covering:
- Renders correctly with default props
- All variants render correctly
- Custom className merges correctly
- Accessibility: proper roles and labels
- Keyboard navigation (if interactive)
- Ref forwarding

### 9. Verify Acceptance Criteria

Check each item in the issue's "Acceptance Criteria" section.

**Run full verification using mcp-dev tools:**
1. `autofix` - Fix any remaining lint/format issues
2. `build_package` - Verify build succeeds
3. `autofix` - Format any build-generated files
4. `typecheck_package` - Verify types
5. `test_package` - Run tests

### 10. Commit Changes

**Stage and commit using git MCP tools:**
1. Use `git_add` to stage specific files (never use `.` or `-A`)
2. Use `git_commit` with a descriptive message including the issue identifier and `Co-Authored-By: Claude <noreply@anthropic.com>`
3. Use `git_push` to push the branch

### 11. Output PR Description

**Your final output message must be the PR description** in the following format. The orchestrator will use this to create the PR automatically.

```markdown
## Summary
- <1-3 bullet points describing the changes>

## Linear Issue
$ARGUMENTS: <issue title>

## Test plan
- [x] Build passes
- [x] Tests pass
- [x] Storybook stories render correctly
- [x] <Additional verification>

Generated with [Claude Code](https://claude.com/claude-code)
```

**Important:** Do NOT manually update Linear issue statuses. Status transitions are handled automatically by the Linear-GitHub integration.

## Do NOT

- Create barrel files (index.ts in component folders)
- Modify files outside target package unless explicitly needed
- Skip verification steps
- Add features not in the issue
- Force push or use destructive git commands
- Skip Storybook stories for components
- Attach screenshots to GitHub PRs or comments (image attachments don't work)
