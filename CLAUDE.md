# Claude Code Guide

Instructions for AI agents working on Traceframe.

## Repository Info

**GitHub Remote:** `nejcjelovcan/traceframe`

When using GitHub MCP tools, always use:

- `owner: "nejcjelovcan"`
- `repo: "traceframe"`

When using Git MCP tools, the working directory is automatically set via SessionStart hook.

## MCP Servers

This workspace uses domain-specific MCP servers plus external integrations:

| Server   | Package              | Purpose                            |
| -------- | -------------------- | ---------------------------------- |
| mcp-ui   | `@traceframe/mcp-ui` | UI tooling (components, Storybook) |
| github   | (external)           | GitHub PRs and issues              |
| git      | (external)           | Git operations                     |

### mcp-ui Tools

| Tool                            | Use Instead Of                       | Purpose                                            |
| ------------------------------- | ------------------------------------ | -------------------------------------------------- |
| `run_or_open_storybook`         | `pnpm --filter ui-library storybook` | Start Storybook or open browser if already running |
| `stop_storybook`                | -                                    | Stop a running Storybook process                   |
| `capture_storybook_screenshots` | -                                    | Capture Storybook screenshots for PRs              |
| `run_or_open_playroom`          | `pnpm playroom`                      | Start Playroom or open browser if already running  |
| `stop_playroom`                 | -                                    | Stop a running Playroom process                    |
| `list_components`               | -                                    | List all ui-library components with summaries      |
| `get_component`                 | -                                    | Get detailed component info (props, usage, a11y)   |
| `get_design_tokens`             | -                                    | Get design tokens (colors, typography, spacing)    |
| `get_tailwind_utilities`        | -                                    | Get Tailwind CSS utility classes by category       |
| `search_icons`                  | -                                    | Search icons by name, description, or aliases      |
| `list_icons`                    | -                                    | List all icons with optional category filter       |
| `get_icon`                      | -                                    | Get full metadata for a specific icon              |
| `validate_tokens`               | -                                    | Validate design token definitions                  |

### Package Names

Tools accept package names in multiple formats:

- Full scoped name: `@traceframe/ui-library`
- Bare name: `ui-library`, `mcp-ui`

## Claude Code Commands

| Command      | Purpose                                              |
| ------------ | ---------------------------------------------------- |
| `/refine`    | Refine a GitHub issue to make it implementation-ready |
| `/implement` | Implement a refined GitHub issue                     |

## Development Workflow

### After Writing Code

1. **Autofix** - Run `pnpm autofix` to fix formatting and lint issues
2. **Build** - Run `pnpm --filter <package> build` to verify build
3. **Tests** - Run `pnpm --filter <package> test` for the modified package
4. **Typecheck** - Run `pnpm --filter <package> typecheck` if types changed

### Before Committing

1. Ensure autofix has been run
2. Ensure tests pass
3. Use git MCP tools (`git_add`, `git_commit`, `git_push`) or git CLI for commits

### Previewing UI Changes

1. `run_or_open_storybook` - Start Storybook or open browser if running
2. Verify component renders correctly with all variants
3. `stop_storybook` - Stop when done (optional)

## Code Conventions

### Directory Structure

- **`src/` folder convention:**
  - **UI/React packages** (e.g., `packages/ui-library`, `packages/playroom`) - Use `src/` folder
  - **Node packages** (e.g., `packages/mcp-ui`, `packages/eslint-plugin`) - No `src/` folder, source files at package root
- **No barrel files** - Import from specific modules, not index re-exports. Exception: `packages/ui-library/src/index.ts` is the published entry point
- **Colocated unit tests** - Unit tests live next to the implementation they test: `foo.ts` -> `foo.test.ts`

### TypeScript

- Strict mode enabled
- Prefer `readonly` for immutability
- Use `interface` for object shapes, `type` for unions/intersections
- Explicit return types on exported functions

## Git Safety

**Critical rules - never violate these:**

- NEVER update git config
- NEVER run destructive commands (`push --force`, `reset --hard`, `checkout .`, `clean -f`) unless explicitly requested
- NEVER skip hooks (`--no-verify`) unless explicitly requested
- NEVER force push to main/master
- ALWAYS create NEW commits, never amend unless explicitly requested
- ALWAYS stage specific files, avoid `git add -A` or `git add .`
- NEVER commit unless explicitly asked

### Commit Format

```bash
git commit -m "$(cat <<'EOF'
Brief description of change

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

## File Operations

- **Read before edit** - Always read a file before modifying it
- **Prefer edits over writes** - Use Edit tool for existing files
- **No unnecessary files** - Don't create documentation unless requested
- **No emojis** - Unless explicitly requested

## Git MCP Tools

The `git` MCP server provides tools for common git operations.

**Important:** Always pass the `path` parameter (use the working directory from the environment) to git MCP tools, or call `git_set_working_dir` first to set the default.

| Tool                  | Purpose                                    |
| --------------------- | ------------------------------------------ |
| `git_status`          | Show working tree status                   |
| `git_diff`            | View differences between commits/branches  |
| `git_log`             | View commit history                        |
| `git_branch`          | List, create, or delete branches           |
| `git_checkout`        | Switch branches or restore files           |
| `git_add`             | Stage files for commit                     |
| `git_commit`          | Create a commit with staged changes        |
| `git_pull`            | Fetch and merge changes from remote        |
| `git_push`            | Push commits to remote                     |
| `git_fetch`           | Fetch updates from remote                  |
| `git_rebase`          | Rebase commits onto another branch         |
| `git_set_working_dir` | Set default repository path for operations |

## GitHub MCP Tools

**GitHub is used for both Issues and Pull Requests.**

**Important:** Always use `owner: "nejcjelovcan"` and `repo: "traceframe"` for this repository.

| Tool                  | Use Instead Of   | Purpose                        |
| --------------------- | ---------------- | ------------------------------ |
| `get_me`              | `gh auth status` | Check authenticated user       |
| `create_pull_request` | `gh pr create`   | Create a pull request          |
| `pull_request_read`   | `gh pr view`     | Get PR details, diff, comments |
| `list_pull_requests`  | `gh pr list`     | List repository PRs            |
| `update_pull_request` | `gh pr edit`     | Update PR title, body, labels  |
| `issue_read`          | `gh issue view`  | Get issue details              |
| `list_issues`         | `gh issue list`  | List repository issues         |
| `issue_write`         | `gh issue create` | Create or update issues       |

## CLI Commands Reference

| Operation                 | Command                                |
| ------------------------- | -------------------------------------- |
| Build all packages        | `pnpm build`                           |
| Build one package         | `pnpm --filter <package> build`        |
| Run all tests             | `pnpm test`                            |
| Run package tests         | `pnpm --filter <package> test`         |
| Typecheck all             | `pnpm typecheck`                       |
| Typecheck one package     | `pnpm --filter <package> typecheck`    |
| Fix lint + format         | `pnpm autofix`                         |
| Lint                      | `pnpm lint`                            |
| Format check              | `pnpm format:check`                    |
| Validate tokens           | `pnpm validate:tokens`                 |
| Validate token defs       | `pnpm validate:token-definitions`      |

## Package Structure

```
packages/
├── ui-library/     # Shared UI components (publishable)
├── playroom/       # Playroom design environment
├── mcp-ui/         # UI tooling MCP server
└── eslint-plugin/  # ESLint plugin for semantic token enforcement
```

## Testing Standards

- Aim for 80%+ coverage on component logic
- Test pure functions thoroughly
- Use vitest assertions and @testing-library/react for component tests

## Icons

Use standardized icons from ui-library:

```typescript
import { Icon } from '@traceframe/ui-library'

<Icon name="search" />
<Icon name="package" size="lg" />
<Icon name="alert-circle" className="text-error-500" />
```

### Icon Categories

| Category   | Icons                                                                                                                                |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Navigation | `chevron-down`, `chevron-up`, `chevron-right`, `chevron-left`, `arrow-left`, `arrow-right`                                           |
| Actions    | `search`, `search-off`, `close`, `check`, `copy`                                                                                     |
| Status     | `alert-circle`, `info-circle`, `resolved`, `unresolved`, `pending`, `empty`                                                          |
| Sorting    | `sort-asc`, `sort-desc`, `sort-none`                                                                                                 |
| Theme      | `sun`, `moon`, `desktop`                                                                                                             |
| Entity     | `package`, `component`, `hierarchy`, `file`, `file-code`, `file-search`, `file-description`, `location-code`, `external`, `internal` |
| Code       | `code`, `element`, `brackets`, `dots`, `toggle`, `percentage`, `prop`, `prop-name`, `prop-value`, `string`, `function`               |
| Data       | `database`, `chart`, `users`, `components`                                                                                           |

### Size Presets

| Size  | Pixels | Use Case             |
| ----- | ------ | -------------------- |
| `xs`  | 12     | Inline badges        |
| `sm`  | 16     | Buttons, inline text |
| `md`  | 20     | Default              |
| `lg`  | 24     | Headers              |
| `xl`  | 32     | Features             |
| `2xl` | 48     | Empty states         |

See `packages/ui-library/ICONS.md` for full reference, accessibility guidelines, and how to add new icons.

**Do NOT import directly from `@tabler/icons-react`.** Always use the `Icon` component.

## Design Tokens

Use the `get_design_tokens` MCP tool to query design tokens from ui-library.

### Token Types

| Type       | Filter       | Description                                                                   |
| ---------- | ------------ | ----------------------------------------------------------------------------- |
| Colors     | `colors`     | Palettes (primary, neutral, success, warning, error) with RGB/hex values      |
| Semantic   | `colors`     | Theme-aware tokens (surface, foreground, border, ring) with light/dark values |
| Typography | `typography` | Font families (sans, mono) and font sizes with line heights                   |
| Spacing    | `spacing`    | Semantic spacing tokens (xs, sm, md, lg, xl, 2xl) plus custom values (18, 22) |

### Color Palettes

| Palette     | Usage                                           |
| ----------- | ----------------------------------------------- |
| `primary`   | Links, buttons, focus states, primary actions   |
| `secondary` | Secondary buttons, accents, alternative actions |
| `neutral`   | Text, backgrounds, borders, disabled states     |
| `success`   | Success messages, positive indicators           |
| `warning`   | Warnings, cautions, pending states              |
| `error`     | Errors, destructive actions, critical alerts    |

### Semantic Tokens (Theme-Aware)

| Token         | Variants                                                                                                                                             | Usage                          |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `surface`     | DEFAULT, muted, subtle                                                                                                                               | Background colors              |
| `foreground`  | DEFAULT, muted, inverted, inverted-muted                                                                                                             | Text colors                    |
| `border`      | DEFAULT, muted                                                                                                                                       | Border colors                  |
| `ring`        | DEFAULT                                                                                                                                              | Focus ring color               |
| `interactive` | hover, active, pressed, primary (with hover/foreground/border), secondary (with hover/foreground/border), destructive (with hover/foreground/border) | Interactive element states     |
| `status`      | info, success, warning, error (each with: DEFAULT, muted, foreground, emphasis, border)                                                              | Status indicators              |
| `disabled`    | DEFAULT, foreground                                                                                                                                  | Disabled state colors          |
| `tooltip`     | DEFAULT, foreground                                                                                                                                  | Tooltip colors                 |
| `accent`      | 1-5 (each with: DEFAULT, muted, foreground, emphasis, border)                                                                                        | Categorical data visualization |

### Semantic Spacing Tokens

| Token | Value   | CSS Value | Usage                            |
| ----- | ------- | --------- | -------------------------------- |
| `xs`  | 0.25rem | 4px       | Tight inline elements, icon gaps |
| `sm`  | 0.5rem  | 8px       | Form inputs, button padding      |
| `md`  | 0.75rem | 12px      | Card padding, section gaps       |
| `lg`  | 2rem    | 32px      | Section separation, major gaps   |
| `xl`  | 4rem    | 64px      | Page sections, major separators  |
| `2xl` | 8rem    | 128px     | Hero sections, major landmarks   |

### Using Tokens in Tailwind

```tsx
// Palette colors (direct shade reference - avoid in components, prefer semantic tokens)
<div className="bg-primary-500 text-neutral-50" />

// Semantic tokens (theme-aware)
<div className="bg-surface text-foreground" />
<div className="bg-surface-muted border-border" />

// Interactive states
<button className="bg-interactive-primary hover:bg-interactive-primary-hover" />

// Status tokens
<div className="bg-status-error-muted text-status-error-foreground border-status-error-border" />

// Data visualization
<div className="bg-accent-1 text-accent-1-foreground" />

// Semantic spacing
<div className="gap-sm p-md" />
<div className="p-xs m-lg space-y-xl" />
```

### When to Propose New Semantic Tokens

Use `/refine` to propose new semantic tokens when:

- A color usage pattern appears 3+ times across components
- The color should change between light/dark themes
- The color represents a semantic concept (not just a visual preference)

New semantic tokens are added to `packages/ui-library/tokens/semantic/light.json` and `dark.json` (source definitions), then regenerated with `pnpm generate:tokens`.
