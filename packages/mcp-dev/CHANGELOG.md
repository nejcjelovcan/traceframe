# @nejcjelovcan/mcp-dev

## 0.2.0

### Minor Changes

- [#22](https://github.com/nejcjelovcan/traceframe/pull/22) [`6757dd4`](https://github.com/nejcjelovcan/traceframe/commit/6757dd47b614b71a1095206e6cadc953430261b9) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Initial public release of MCP packages for pnpm/turbo monorepo development

  **@nejcjelovcan/mcp-shared:**
  - Shared utilities for building MCP servers in pnpm/turbo monorepos
  - Workspace detection, package resolution, turbo task runner, CLI runner
  - Scope-agnostic design works with any npm scope

  **@nejcjelovcan/mcp-dev:**
  - MCP server providing development tools (build, test, lint, typecheck)
  - Tools: autofix, build_package, test_package, test_package_coverage, typecheck_package, lint_fix_package, format_package, run_single_test, get_changed_packages

### Patch Changes

- Updated dependencies [[`6757dd4`](https://github.com/nejcjelovcan/traceframe/commit/6757dd47b614b71a1095206e6cadc953430261b9)]:
  - @nejcjelovcan/mcp-shared@0.2.0
