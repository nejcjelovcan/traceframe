import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js'

import { autofix, autofixDescription, autofixInputSchema } from './tools/autofix.js'
import {
  buildPackage,
  buildPackageDescription,
  buildPackageInputSchema,
} from './tools/build-package.js'
import {
  formatPackage,
  formatPackageDescription,
  formatPackageInputSchema,
} from './tools/format-package.js'
import {
  getChangedPackages,
  getChangedPackagesDescription,
  getChangedPackagesInputSchema,
} from './tools/get-changed-packages.js'
import {
  lintFixPackage,
  lintFixPackageDescription,
  lintFixPackageInputSchema,
} from './tools/lint-fix-package.js'
import {
  listPackageScripts,
  listPackageScriptsDescription,
  listPackageScriptsInputSchema,
} from './tools/list-package-scripts.js'
import {
  runPnpmScript,
  runPnpmScriptDescription,
  runPnpmScriptInputSchema,
} from './tools/run-pnpm-script.js'
import {
  runSingleTest,
  runSingleTestDescription,
  runSingleTestInputSchema,
} from './tools/run-single-test.js'
import {
  testPackageCoverage,
  testPackageCoverageDescription,
  testPackageCoverageInputSchema,
} from './tools/test-package-coverage.js'
import {
  testPackage,
  testPackageDescription,
  testPackageInputSchema,
} from './tools/test-package.js'
import {
  typecheckPackage,
  typecheckPackageDescription,
  typecheckPackageInputSchema,
} from './tools/typecheck-package.js'

/**
 * Creates and configures the MCP server with all available tools.
 */
export function createServer(): McpServer {
  const server = new McpServer({
    name: 'mcp-dev',
    version: '0.1.0',
  })

  // Register the autofix tool
  server.registerTool(
    'autofix',
    { description: autofixDescription, inputSchema: autofixInputSchema },
    async () => {
      const result = await autofix({})
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    }
  )

  // Register the build_package tool
  server.registerTool(
    'build_package',
    { description: buildPackageDescription, inputSchema: buildPackageInputSchema },
    async (args) => {
      if (typeof args.package !== 'string' || args.package === '') {
        throw new McpError(ErrorCode.InvalidParams, 'package is required and must be a string')
      }
      const result = await buildPackage({ package: args.package })
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    }
  )

  // Register the test_package tool
  server.registerTool(
    'test_package',
    { description: testPackageDescription, inputSchema: testPackageInputSchema },
    async (args) => {
      if (typeof args.package !== 'string' || args.package === '') {
        throw new McpError(ErrorCode.InvalidParams, 'package is required and must be a string')
      }
      const result = await testPackage({ package: args.package })
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    }
  )

  // Register the test_package_coverage tool
  server.registerTool(
    'test_package_coverage',
    { description: testPackageCoverageDescription, inputSchema: testPackageCoverageInputSchema },
    async (args) => {
      if (typeof args.package !== 'string' || args.package === '') {
        throw new McpError(ErrorCode.InvalidParams, 'package is required and must be a string')
      }
      const result = await testPackageCoverage({ package: args.package })
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    }
  )

  // Register the typecheck_package tool
  server.registerTool(
    'typecheck_package',
    { description: typecheckPackageDescription, inputSchema: typecheckPackageInputSchema },
    async (args) => {
      if (typeof args.package !== 'string' || args.package === '') {
        throw new McpError(ErrorCode.InvalidParams, 'package is required and must be a string')
      }
      const result = await typecheckPackage({ package: args.package })
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    }
  )

  // Register the lint_fix_package tool
  server.registerTool(
    'lint_fix_package',
    { description: lintFixPackageDescription, inputSchema: lintFixPackageInputSchema },
    async (args) => {
      if (typeof args.package !== 'string' || args.package === '') {
        throw new McpError(ErrorCode.InvalidParams, 'package is required and must be a string')
      }
      const result = await lintFixPackage({ package: args.package })
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    }
  )

  // Register the format_package tool
  server.registerTool(
    'format_package',
    { description: formatPackageDescription, inputSchema: formatPackageInputSchema },
    async (args) => {
      if (typeof args.package !== 'string' || args.package === '') {
        throw new McpError(ErrorCode.InvalidParams, 'package is required and must be a string')
      }
      const result = await formatPackage({ package: args.package })
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    }
  )

  // Register the run_single_test tool
  server.registerTool(
    'run_single_test',
    { description: runSingleTestDescription, inputSchema: runSingleTestInputSchema },
    async (args) => {
      if (typeof args.package !== 'string' || args.package === '') {
        throw new McpError(ErrorCode.InvalidParams, 'package is required and must be a string')
      }
      if (typeof args.file !== 'string' || args.file === '') {
        throw new McpError(ErrorCode.InvalidParams, 'file is required and must be a string')
      }
      const grep = typeof args.grep === 'string' ? args.grep : undefined
      const reporter = typeof args.reporter === 'string' ? args.reporter : undefined
      const result = await runSingleTest({
        package: args.package,
        file: args.file,
        ...(grep !== undefined ? { grep } : {}),
        ...(reporter !== undefined ? { reporter } : {}),
      })
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    }
  )

  // Register the run_pnpm_script tool
  server.registerTool(
    'run_pnpm_script',
    { description: runPnpmScriptDescription, inputSchema: runPnpmScriptInputSchema },
    async (args) => {
      if (typeof args.script !== 'string' || args.script === '') {
        throw new McpError(ErrorCode.InvalidParams, 'script is required and must be a string')
      }
      const pkg = typeof args.package === 'string' ? args.package : undefined
      const extraArgs = typeof args.args === 'string' ? args.args : undefined
      const result = await runPnpmScript({
        script: args.script,
        ...(pkg !== undefined ? { package: pkg } : {}),
        ...(extraArgs !== undefined ? { args: extraArgs } : {}),
      })
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    }
  )

  // Register the list_package_scripts tool
  server.registerTool(
    'list_package_scripts',
    { description: listPackageScriptsDescription, inputSchema: listPackageScriptsInputSchema },
    async (args) => {
      const pkg = typeof args.package === 'string' ? args.package : undefined
      const result = await listPackageScripts({
        ...(pkg !== undefined ? { package: pkg } : {}),
      })
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    }
  )

  // Register the get_changed_packages tool
  server.registerTool(
    'get_changed_packages',
    { description: getChangedPackagesDescription, inputSchema: getChangedPackagesInputSchema },
    async (args) => {
      const since = typeof args.since === 'string' ? args.since : undefined
      const includeUntracked =
        typeof args.includeUntracked === 'boolean' ? args.includeUntracked : undefined
      const result = await getChangedPackages({
        ...(since !== undefined ? { since } : {}),
        ...(includeUntracked !== undefined ? { includeUntracked } : {}),
      })
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    }
  )

  return server
}
