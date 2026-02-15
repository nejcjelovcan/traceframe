# Claude Code Guide

Instructions for AI agents working on Traceframe.

## Repository Info

**GitHub Remote:** `nejcjelovcan/traceframe`

When using GitHub MCP tools, always use:

- `owner: "nejcjelovcan"`
- `repo: "traceframe"`

When using Git MCP tools, the working directory is automatically set via SessionStart hook.

## Tool Usage: MCP First

**ALWAYS use MCP tools instead of Bash for git, GitHub, and development operations.** Do NOT use `git` CLI commands or `gh` CLI via Bash when an equivalent MCP tool exists. This applies to all git operations (status, diff, log, add, commit, push, checkout, branch, etc.), all GitHub operations (creating PRs, reading PRs, adding comments, etc.), and all build/test/lint operations (use mcp-dev tools instead of `pnpm` CLI).

**Only use Bash for:** operations without an MCP equivalent (e.g., `pnpm generate:tokens`).

## MCP Servers

This workspace uses domain-specific MCP servers plus external integrations:

| Server        | Package                           | Purpose                               |
| ------------- | --------------------------------- | ------------------------------------- |
| mcp-dev       | `@nejcjelovcan/mcp-dev`           | Development tools (build, test, lint) |
| mcp-ui        | `@nejcjelovcan/traceframe-mcp-ui` | UI tooling (components, Storybook)    |
| github        | `github/github-mcp-server`        | GitHub PRs and code review            |
| git           | `@cyanheads/git-mcp-server`       | Git operations                        |
| linear-server | Linear HTTP MCP                   | Linear issues and projects            |

### mcp-dev Tools

| Tool                    | Use Instead Of                  | Purpose                                  |
| ----------------------- | ------------------------------- | ---------------------------------------- |
| `autofix`               | `pnpm autofix`                  | Run lint:fix and format across workspace |
| `build_package`         | `pnpm --filter <pkg> build`     | Build a package with dependencies        |
| `test_package`          | `pnpm --filter <pkg> test`      | Run tests for a package                  |
| `test_package_coverage` | `pnpm --filter <pkg> test:ci`   | Run tests with coverage                  |
| `typecheck_package`     | `pnpm --filter <pkg> typecheck` | Type-check a package                     |
| `lint_fix_package`      | `pnpm --filter <pkg> lint:fix`  | Run lint:fix for a package               |
| `format_package`        | `pnpm --filter <pkg> format`    | Run prettier for a package               |
| `run_single_test`       | `pnpm vitest run <file>`        | Run a specific test file                 |
| `get_changed_packages`  | -                               | List packages with uncommitted changes   |
| `list_package_scripts`  | -                               | List scripts in a package.json (or root) |
| `run_pnpm_script`       | `pnpm --filter <pkg> <script>`  | Run any pnpm script (package or root)    |
| `pnpm_add`              | `pnpm add <dep>`                | Add dependency to a package or root      |
| `pnpm_remove`           | `pnpm remove <dep>`             | Remove dependency from a package or root |
| `pnpm_install`          | `pnpm install`                  | Install all workspace dependencies       |
| `pnpm_query`            | `pnpm list/why/outdated`        | Query dependency information             |
| `create_changeset`      | `pnpm changeset`                | Create changeset file non-interactively  |

### mcp-ui Tools

| Tool                     | Use Instead Of  | Purpose                                           |
| ------------------------ | --------------- | ------------------------------------------------- |
| `run_or_open_playroom`   | `pnpm playroom` | Start Playroom or open browser if already running |
| `stop_playroom`          | -               | Stop a running Playroom process                   |
| `list_components`        | -               | List all ui-library components with summaries     |
| `get_component`          | -               | Get detailed component info (props, usage, a11y)  |
| `get_design_tokens`      | -               | Get design tokens (colors, typography, spacing)   |
| `get_tailwind_utilities` | -               | Get Tailwind CSS utility classes by category      |
| `search_icons`           | -               | Search icons by name, description, or aliases     |
| `list_icons`             | -               | List all icons with optional category filter      |
| `get_icon`               | -               | Get full metadata for a specific icon             |
| `validate_tokens`        | -               | Validate design token definitions                 |

### Package Names

Tools accept package names in multiple formats:

- Full scoped name: `@nejcjelovcan/traceframe-ui-library`
- Bare name: `ui-library`, `mcp-ui`

## Claude Code Commands

| Command      | Purpose                                               |
| ------------ | ----------------------------------------------------- |
| `/refine`    | Refine a Linear issue to make it implementation-ready |
| `/implement` | Implement a refined Linear issue                      |

## Development Workflow

### After Writing Code

1. **Autofix** - Use `autofix` mcp-dev tool to fix formatting and lint issues
2. **Build** - Use `build_package` mcp-dev tool to verify build
3. **Tests** - Use `test_package` mcp-dev tool for the modified package
4. **Typecheck** - Use `typecheck_package` mcp-dev tool if types changed

### Before Committing

1. Ensure autofix has been run
2. Ensure tests pass
3. Use git MCP tools (`git_add`, `git_commit`, `git_push`) for commits - NEVER use git CLI via Bash

### Changesets (Versioning & Releases)

This project uses [Changesets](https://github.com/changesets/changesets) for semantic versioning and changelog generation. When a PR includes changes to publishable packages, add a changeset file using the `create_changeset` mcp-dev tool:

```
create_changeset(packages: ["ui-library"], bump: "minor", summary: "Add new component")
```

This creates a `.changeset/<random-name>.md` file. Commit this file with your PR.

**When to add a changeset:**

- Any PR that changes code in a publishable package
- Bug fixes, new features, breaking changes, dependency updates

**When NOT to add a changeset:**

- Changes to private packages (`mcp-ui`, `playroom`)
- CI/config-only changes that don't affect published code
- Documentation-only changes

**Release flow:**

1. PRs with changeset files merge to `main`
2. The release workflow creates a "Version Packages" PR that bumps versions and updates CHANGELOGs
3. When that PR is merged, packages are published to GitHub Packages

### Previewing UI Changes

1. Run Storybook with `pnpm --filter ui-library storybook`
2. Verify component renders correctly with all variants

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

**GitHub is used for Pull Requests, code review, and repository operations. All issue tracking and project management lives in Linear.**

**Important:** Always use `owner: "nejcjelovcan"` and `repo: "traceframe"` for this repository.

### User & Auth

| Tool        | Purpose                  |
| ----------- | ------------------------ |
| `get_me`    | Check authenticated user |
| `get_teams` | Get user's teams         |

### Pull Requests

| Tool                            | Purpose                                   |
| ------------------------------- | ----------------------------------------- |
| `create_pull_request`           | Create a pull request                     |
| `pull_request_read`             | Get PR details, diff, files, comments     |
| `list_pull_requests`            | List repository PRs                       |
| `search_pull_requests`          | Search PRs with query syntax              |
| `update_pull_request`           | Update PR title, body, reviewers          |
| `update_pull_request_branch`    | Update PR branch with base branch changes |
| `merge_pull_request`            | Merge a pull request                      |
| `pull_request_review_write`     | Create, submit, or delete PR reviews      |
| `add_comment_to_pending_review` | Add line comment to pending review        |
| `request_copilot_review`        | Request GitHub Copilot review             |

### Repository

| Tool                    | Purpose                           |
| ----------------------- | --------------------------------- |
| `get_file_contents`     | Get file or directory contents    |
| `create_or_update_file` | Create or update a file           |
| `delete_file`           | Delete a file                     |
| `push_files`            | Push multiple files in one commit |
| `list_branches`         | List repository branches          |
| `create_branch`         | Create a new branch               |
| `list_commits`          | List commits on a branch          |
| `get_commit`            | Get commit details with diff      |
| `list_tags`             | List git tags                     |
| `get_tag`               | Get tag details                   |

### Releases

| Tool                 | Purpose                  |
| -------------------- | ------------------------ |
| `list_releases`      | List repository releases |
| `get_latest_release` | Get latest release       |
| `get_release_by_tag` | Get release by tag name  |

### Search

| Tool                   | Purpose                         |
| ---------------------- | ------------------------------- |
| `search_code`          | Search code across repositories |
| `search_issues`        | Search issues                   |
| `search_pull_requests` | Search pull requests            |
| `search_repositories`  | Search repositories             |
| `search_users`         | Search users                    |

## Linear MCP Tools

**Linear is the single source of truth for all issue tracking and project management.** All issues, planning, status tracking, and project organization live in Linear. GitHub is only used for PRs and code review.

**Team:** `Traceframe` (prefix: `TRA`)

### Issues

| Tool                  | Purpose                                             |
| --------------------- | --------------------------------------------------- |
| `get_issue`           | Get issue details by ID or identifier (e.g. TRA-42) |
| `list_issues`         | List issues with filters (team, status, assignee)   |
| `create_issue`        | Create a new issue                                  |
| `update_issue`        | Update issue status, description, assignee, etc.    |
| `search_issues`       | Search issues with query                            |
| `list_issue_statuses` | List workflow states for a team                     |
| `list_issue_labels`   | List available labels                               |

### Comments

| Tool             | Purpose                   |
| ---------------- | ------------------------- |
| `list_comments`  | List comments on an issue |
| `create_comment` | Add a comment to an issue |

### Projects & Organization

| Tool              | Purpose              |
| ----------------- | -------------------- |
| `list_projects`   | List Linear projects |
| `get_project`     | Get project details  |
| `list_teams`      | List Linear teams    |
| `get_team`        | Get team details     |
| `list_users`      | List Linear users    |
| `list_milestones` | List milestones      |

### Common Workflows

**Fetching an issue with relations:**

```
get_issue(id: "TRA-42", includeRelations: true)
```

**Important:** Do NOT manually update Linear issue statuses (e.g., "In Review", "Done"). Status transitions are handled automatically by the Linear-GitHub integration when PRs are created, merged, or closed.

## CLI Commands Reference

> **Note:** Prefer mcp-dev tools over CLI commands. Use CLI only when no MCP equivalent exists.

| Operation             | Command                             | mcp-dev Tool        |
| --------------------- | ----------------------------------- | ------------------- |
| Build all packages    | `pnpm build`                        | -                   |
| Build one package     | `pnpm --filter <package> build`     | `build_package`     |
| Run all tests         | `pnpm test`                         | -                   |
| Run package tests     | `pnpm --filter <package> test`      | `test_package`      |
| Typecheck all         | `pnpm typecheck`                    | -                   |
| Typecheck one package | `pnpm --filter <package> typecheck` | `typecheck_package` |
| Fix lint + format     | `pnpm autofix`                      | `autofix`           |
| Lint                  | `pnpm lint`                         | `lint_fix_package`  |
| Format check          | `pnpm format:check`                 | `format_package`    |
| Add dependency        | `pnpm add <dep>`                    | `pnpm_add`          |
| Remove dependency     | `pnpm remove <dep>`                 | `pnpm_remove`       |
| Install deps          | `pnpm install`                      | `pnpm_install`      |
| Query deps            | `pnpm list/why/outdated`            | `pnpm_query`        |
| Create changeset      | `pnpm changeset`                    | `create_changeset`  |
| Validate tokens       | `pnpm validate:tokens`              | -                   |
| Validate token defs   | `pnpm validate:token-definitions`   | -                   |

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
import { Icon } from '@nejcjelovcan/traceframe-ui-library'

<Icon name="search" />
<Icon name="package" size="lg" />
<Icon name="alert-circle" className="text-error-500" />
```

### Discovering Icons

Use the `mcp-ui` tools to discover and search icons at runtime:

- `list_icons` - List all icons, optionally filter by category
- `search_icons` - Search icons by name, description, or aliases
- `get_icon` - Get full metadata for a specific icon

**Categories:** Navigation, Actions, Status & Feedback, Sorting, Theme, Entities, Code & Props, Data & Metrics, Agentic Workflows, Brand & Integrations, Developer Tools

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

| Type          | Filter       | Description                                                                   |
| ------------- | ------------ | ----------------------------------------------------------------------------- |
| Colors        | `colors`     | Palettes (primary, neutral, success, warning, error) with RGB/hex values      |
| Semantic      | `colors`     | Theme-aware tokens (surface, foreground, border, ring) with light/dark values |
| Typography    | `typography` | Font families (sans, mono) and font sizes with line heights                   |
| Spacing       | `spacing`    | Semantic spacing tokens (xs, sm, md, lg, xl, 2xl) plus custom values (18, 22) |
| Shadows       | -            | Elevation, interactive states, highlight, and inset shadows (per theme)       |
| Border Styles | -            | Composite border style tokens (width + line style, per theme)                 |
| Gradients     | -            | Background gradient tokens for emphasis surfaces (per theme)                  |

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

### Shadow Tokens (Per Theme)

Shadow tokens are defined per theme in `tokens/themes/*.json` and vary by theme personality.

| Category    | Tokens                                                    | Tailwind Classes                                                               | Usage                             |
| ----------- | --------------------------------------------------------- | ------------------------------------------------------------------------------ | --------------------------------- |
| Elevation   | `sm`, `md`, `lg`                                          | `shadow-sm`, `shadow-md`, `shadow-lg`                                          | Static elevation (cards, modals)  |
| Interactive | `interactive`, `interactive-hover`, `interactive-pressed` | `shadow-interactive`, `shadow-interactive-hover`, `shadow-interactive-pressed` | Clickable elements (cards, rows)  |
| Highlight   | `highlight`, `highlight-hover`, `highlight-pressed`       | `shadow-highlight`, `shadow-highlight-hover`, `shadow-highlight-pressed`       | Prominent clickable elements      |
| Inset       | `inset-sm`, `inset-md`, `inset-underline`                 | `shadow-inset-sm`, `shadow-inset-md`, `shadow-inset-underline`                 | Pressed/active states, underlines |

### Border Style Tokens (Per Theme)

Border style tokens combine width + line style and are consumed via custom Tailwind utilities (using `@utility` directives). They are defined per theme in `tokens/themes/*.json`.

| Token       | Value        | Tailwind Class     | Usage                                        |
| ----------- | ------------ | ------------------ | -------------------------------------------- |
| `line`      | `1px solid`  | `border-line`      | Standard borders (cards, inputs, containers) |
| `thick`     | `2px solid`  | `border-thick`     | Emphasis or structural separation            |
| `highlight` | `2px dashed` | `border-highlight` | Selection, CTAs, highlighting                |

**Directional variants:** `border-t-line`, `border-r-line`, `border-b-line`, `border-l-line` (same for `thick` and `highlight`).

**Custom color:** `border-line-*` accepts any color token, e.g., `border-line-status-error-border`, `border-highlight-accent-1-border`. Without a color suffix, they default to `--color-border`.

### Gradient Tokens (Per Theme)

Gradient tokens provide subtle background gradients for emphasis surfaces. They are theme-level tokens (vary by theme personality, not by light/dark mode). Consumed via `bg-gradient-*` Tailwind utilities.

| Category    | Tokens                                | Tailwind Classes                                                                                                  | Usage                       |
| ----------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------------- |
| Interactive | `primary`, `secondary`, `destructive` | `bg-gradient-interactive-primary`, `bg-gradient-interactive-secondary`, `bg-gradient-interactive-destructive`     | Buttons, CTAs               |
| Status      | `info`, `success`, `warning`, `error` | `bg-gradient-status-info`, `bg-gradient-status-success`, `bg-gradient-status-warning`, `bg-gradient-status-error` | Status emphasis areas       |
| Accent      | `1` through `5`                       | `bg-gradient-accent-1` through `bg-gradient-accent-5`                                                             | Data visualization emphasis |
| Surface     | `inverted`                            | `bg-gradient-surface-inverted`                                                                                    | Dark background areas       |

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

// Shadow tokens (interactive states)
<div className="shadow-interactive hover:shadow-interactive-hover active:shadow-interactive-pressed transition-shadow" />
<div className="shadow-highlight hover:shadow-highlight-hover" />
<div className="shadow-inset-sm" />

// Border style tokens
<div className="border-line" />                           // 1px solid with default border color
<div className="border-thick" />                          // 2px solid with default border color
<div className="border-line-status-error-border" />       // 1px solid with error border color
<div className="border-b-line" />                         // Bottom border only

// Gradient tokens
<button className="bg-gradient-interactive-primary text-white" />
<div className="bg-gradient-status-success" />
<div className="bg-gradient-surface-inverted text-foreground-inverted" />
```

### When to Propose New Semantic Tokens

Use `/refine` to propose new semantic tokens when:

- A color usage pattern appears 3+ times across components
- The color should change between light/dark themes
- The color represents a semantic concept (not just a visual preference)

New semantic tokens are added to `packages/ui-library/tokens/semantic/light.json` and `dark.json` (source definitions), then regenerated with `pnpm generate:tokens`.
