# @nejcjelovcan/mcp-shared

Shared utilities for building MCP (Model Context Protocol) servers in pnpm/turbo monorepos.

## Installation

```bash
npm install @nejcjelovcan/mcp-shared
```

Configure your registry first:

```ini
# .npmrc
@nejcjelovcan:registry=https://npm.pkg.github.com
```

## Features

This package provides utilities that are commonly needed when building MCP servers for monorepo development workflows:

- **Workspace detection** - Find the monorepo root from any nested directory
- **Package resolution** - Resolve package names (full scoped or bare) to workspace packages
- **Command execution** - Run shell commands with timeout and output handling
- **Turbo integration** - Run turbo tasks for specific packages with output parsing
- **CLI runner** - Build and run CLI packages in the monorepo

## API

### Workspace Configuration

```typescript
import { getWorkspaceRoot } from '@nejcjelovcan/mcp-shared'

// Find the monorepo root (looks for pnpm-workspace.yaml or turbo.json)
const root = getWorkspaceRoot()
```

### Package Resolution

```typescript
import { resolvePackage, enumerateWorkspacePackages } from '@nejcjelovcan/mcp-shared'

// List all packages in the workspace
const packages = await enumerateWorkspacePackages()
// [{ name: '@myorg/ui', type: 'package', path: 'packages/ui' }, ...]

// Resolve a package name (accepts full scoped name or bare name)
const result = await resolvePackage('ui')
// { resolved: true, package: '@myorg/ui', type: 'package', path: 'packages/ui' }

const result2 = await resolvePackage('@myorg/ui')
// { resolved: true, package: '@myorg/ui', type: 'package', path: 'packages/ui' }

const result3 = await resolvePackage('nonexistent')
// { resolved: false, error: 'Unknown package...', validPackages: [...] }
```

### Command Execution

```typescript
import { execCommand } from '@nejcjelovcan/mcp-shared'

const { stdout, stderr, exitCode } = await execCommand('pnpm build', '/path/to/cwd', {
  timeout: 60000,
})
```

### Turbo Task Runner

```typescript
import { runTurboTaskForPackage } from '@nejcjelovcan/mcp-shared'

// Run a turbo task for a specific package
const result = await runTurboTaskForPackage('@myorg/ui', 'build')
// { success: true, exitCode: 0, output: '...', package: '@myorg/ui', script: 'build' }

const testResult = await runTurboTaskForPackage('@myorg/ui', 'test')
// { success: true, exitCode: 0, output: '...', package: '@myorg/ui', script: 'test' }
```

### CLI Runner

```typescript
import { buildCliAndRun } from '@nejcjelovcan/mcp-shared'

// Build a CLI package and run a command
const result = await buildCliAndRun('scan . -o output.json', {
  cliPackage: '@myorg/cli',
  cliEntry: 'apps/cli/dist/cli.js',
})
// { success: true, exitCode: 0, output: '...' }
```

## Exports

| Export                       | Description                                       |
| ---------------------------- | ------------------------------------------------- |
| `getWorkspaceRoot`           | Find the monorepo root directory                  |
| `execCommand`                | Execute shell commands with timeout               |
| `buildCliAndRun`             | Build and run a CLI package                       |
| `resolvePackage`             | Resolve package name to full scoped name          |
| `enumerateWorkspacePackages` | List all workspace packages                       |
| `packageResolverDescription` | Description for MCP tool schemas                  |
| `runTurboTaskForPackage`     | Run a turbo task for a specific package           |
| `runTurboTaskForContext`     | Run a turbo task with context output parsing      |
| `truncateOutput`             | Truncate long output to a maximum number of lines |
| `parseContextOutput`         | Parse turbo output to extract package results     |
| `ALLOWED_SCRIPTS`            | List of allowed turbo scripts                     |
| `DEFAULT_TIMEOUT_MS`         | Default timeout for turbo tasks (2 minutes)       |
| `MAX_OUTPUT_LINES`           | Maximum output lines before truncation            |

## TypeScript Types

```typescript
import type {
  ExecCommandOptions,
  CliRunnerOptions,
  CliRunnerResult,
  PackageInfo,
  PackageType,
  ResolvePackageResult,
  AllowedScript,
  PackageScriptResult,
  ContextPackageResult,
  ContextScriptResult,
} from '@nejcjelovcan/mcp-shared'
```

## Scope-Agnostic Design

This package is designed to work with any npm scope. Package resolution dynamically detects scopes from your workspace packages, so it works regardless of whether your packages use `@myorg/`, `@company/`, or any other scope.

## Requirements

- Node.js >= 20
- pnpm workspace with `pnpm-workspace.yaml`
- Turbo for task running (optional, but required for turbo-related utilities)

## License

MIT
