# @nejcjelovcan/mcp-dev

## 0.3.1

### Patch Changes

- [#53](https://github.com/nejcjelovcan/traceframe/pull/53) [`4c04234`](https://github.com/nejcjelovcan/traceframe/commit/4c04234a4319a5adfdd291eb80cba61082cd4ee6) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Add lint verification step to autofix tool to catch non-auto-fixable errors

## 0.3.0

### Minor Changes

- [#32](https://github.com/nejcjelovcan/traceframe/pull/32) [`1bbf30e`](https://github.com/nejcjelovcan/traceframe/commit/1bbf30e2c7288fc2d975ae4cc168125623a529bc) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Add pnpm dependency management tools (pnpm_add, pnpm_remove, pnpm_install, pnpm_query) and non-interactive create_changeset tool

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
