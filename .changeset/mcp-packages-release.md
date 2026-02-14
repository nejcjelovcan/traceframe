---
"@nejcjelovcan/mcp-shared": minor
"@nejcjelovcan/mcp-dev": minor
---

Initial public release of MCP packages for pnpm/turbo monorepo development

**@nejcjelovcan/mcp-shared:**
- Shared utilities for building MCP servers in pnpm/turbo monorepos
- Workspace detection, package resolution, turbo task runner, CLI runner
- Scope-agnostic design works with any npm scope

**@nejcjelovcan/mcp-dev:**
- MCP server providing development tools (build, test, lint, typecheck)
- Tools: autofix, build_package, test_package, test_package_coverage, typecheck_package, lint_fix_package, format_package, run_single_test, get_changed_packages
