# @nejcjelovcan/mcp-dev

An MCP (Model Context Protocol) server providing development tools for pnpm/turbo monorepos. Enables AI assistants like Claude to build, test, lint, and manage packages in your monorepo.

## Installation

```bash
npm install @nejcjelovcan/mcp-dev
```

Configure your registry first:

```ini
# .npmrc
@nejcjelovcan:registry=https://npm.pkg.github.com
```

## Usage

### With Claude Code

Add to your Claude Code MCP configuration:

```json
{
  "mcpServers": {
    "mcp-dev": {
      "command": "npx",
      "args": ["@nejcjelovcan/mcp-dev"]
    }
  }
}
```

### Standalone

```bash
# Run the MCP server
npx @nejcjelovcan/mcp-dev

# Or if installed locally
pnpm --filter @nejcjelovcan/mcp-dev start
```

## Available Tools

| Tool                    | Description                                                    |
| ----------------------- | -------------------------------------------------------------- |
| `autofix`               | Run lint:fix and format across the entire workspace            |
| `build_package`         | Build a single package using turbo (builds dependencies first) |
| `test_package`          | Run tests for a single package using turbo                     |
| `test_package_coverage` | Run tests with coverage report (test:ci task)                  |
| `typecheck_package`     | Type-check a single package                                    |
| `lint_fix_package`      | Run lint:fix for a single package                              |
| `format_package`        | Run prettier format for a single package                       |
| `run_single_test`       | Run a specific test file with optional grep filter             |
| `get_changed_packages`  | List packages affected by uncommitted changes or since a ref   |
| `list_package_scripts`  | List all scripts defined in a package's package.json           |
| `run_pnpm_script`       | Run an arbitrary pnpm script for a package                     |

## Tool Details

### autofix

Runs `pnpm lint:fix && pnpm format` across the entire workspace to fix formatting and lint issues.

```json
// No parameters required
{}
```

### build_package

Build a single package. Accepts full scoped name (`@scope/pkg`) or bare package name.

```json
{
  "package": "ui-library"
}
```

### test_package

Run tests for a package using turbo. Builds upstream dependencies first.

```json
{
  "package": "@myorg/ui-library"
}
```

### test_package_coverage

Run tests with coverage report (runs the `test:ci` turbo task).

```json
{
  "package": "ui-library"
}
```

### typecheck_package

Type-check a single package using TypeScript.

```json
{
  "package": "ui-library"
}
```

### lint_fix_package

Run ESLint with auto-fix for a single package.

```json
{
  "package": "ui-library"
}
```

### format_package

Run Prettier formatting for a single package.

```json
{
  "package": "ui-library"
}
```

### run_single_test

Run a specific test file with optional pattern filtering.

```json
{
  "package": "ui-library",
  "file": "Button.test.tsx",
  "grep": "should render",
  "reporter": "verbose"
}
```

### get_changed_packages

List packages affected by uncommitted changes or changes since a git ref.

```json
{
  "since": "HEAD~5",
  "includeUntracked": true
}
```

Returns:

```json
{
  "success": true,
  "packages": ["@myorg/ui-library", "@myorg/utils"],
  "files": {
    "@myorg/ui-library": ["src/Button.tsx", "src/Button.test.tsx"],
    "@myorg/utils": ["src/helpers.ts"]
  },
  "rootFiles": ["package.json"],
  "summary": "2 packages changed: @myorg/ui-library, @myorg/utils (+ 1 root file(s))"
}
```

### list_package_scripts

List all scripts defined in a package's `package.json`. Shows which scripts have dedicated mcp-dev tools.

```json
{
  "package": "ui-library"
}
```

Omit `package` to list scripts from the root `package.json`. The output annotates scripts that have dedicated tools (e.g., `build` -> `build_package`, `test` -> `test_package`).

### run_pnpm_script

Run any pnpm script defined in a package or root `package.json`. Use this for scripts not covered by dedicated tools (build, test, typecheck, etc.).

```json
{
  "script": "generate:component-metadata",
  "package": "ui-library",
  "args": "--watch"
}
```

Parameters:

- `script` (required) - The npm script name to run
- `package` (optional) - Package to target via `pnpm --filter`. Omit to run at workspace root
- `args` (optional) - Extra arguments appended after `--`

## Package Resolution

All package tools accept packages in multiple formats:

- **Full scoped name**: `@myorg/ui-library`
- **Bare package name**: `ui-library`, `utils`
- **Directory name**: `ui-library` matches `packages/ui-library`
- **Suffix match**: `ui-library` matches `@scope/traceframe-ui-library`

The resolver dynamically detects scopes from your workspace packages, so it works with any npm scope. Directory name matching uses the last segment of the package path, and suffix matching checks if the unscoped name ends with `-{input}`.

## Dependencies

This package depends on:

- [`@nejcjelovcan/mcp-shared`](../mcp-shared) - Shared utilities for workspace detection, package resolution, and turbo integration
- `@modelcontextprotocol/sdk` - MCP SDK for server implementation
- `zod` - Schema validation for tool inputs

## Requirements

- Node.js >= 20
- pnpm workspace with `pnpm-workspace.yaml`
- Turbo for task running

## Development

```bash
# Run in development mode
pnpm --filter @nejcjelovcan/mcp-dev dev

# Build
pnpm --filter @nejcjelovcan/mcp-dev build

# Run tests
pnpm --filter @nejcjelovcan/mcp-dev test
```

## License

MIT
