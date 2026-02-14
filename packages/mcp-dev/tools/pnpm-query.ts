import { z } from 'zod'

import {
  execCommand,
  getWorkspaceRoot,
  resolvePackage,
  truncateOutput,
} from '@nejcjelovcan/mcp-shared'

/**
 * Allowed query commands (defense-in-depth).
 */
const ALLOWED_COMMANDS = ['list', 'why', 'outdated'] as const
type QueryCommand = (typeof ALLOWED_COMMANDS)[number]

/**
 * Regex for valid npm package names (prevents command injection).
 */
const PACKAGE_NAME_RE = /^@?[a-z0-9][\w./-]*$/i

/**
 * Input schema for pnpm_query tool.
 */
export const pnpmQueryInputSchema = {
  command: z
    .enum(['list', 'why', 'outdated'])
    .describe(
      'Query type: "list" to list deps, "why" to show why a dep is installed, "outdated" to check for updates'
    ),
  dependency: z
    .string()
    .optional()
    .describe('Dependency name (required for "why", ignored for other commands)'),
  package: z
    .string()
    .optional()
    .describe(
      'Target workspace package. Accepts bare name or full scoped name. If omitted, queries workspace root.'
    ),
  depth: z
    .number()
    .optional()
    .describe('Depth for "list" command (default: 0). Ignored for other commands.'),
}

/**
 * Description for the pnpm_query tool.
 */
export const pnpmQueryDescription =
  'Query dependency information. Supports "list" (installed deps), "why" (dependency chain), and "outdated" (available updates).'

/**
 * Input arguments for pnpmQuery function.
 */
export interface PnpmQueryInput {
  command: QueryCommand
  dependency?: string
  package?: string
  depth?: number
}

/**
 * Result type for pnpmQuery.
 */
export type PnpmQueryResult =
  | {
      command: QueryCommand
      package: string | null
      exitCode: number
      passed: boolean
      output: string
      summary: string
    }
  | { resolved: false; error: string; validPackages: string[] }

/**
 * Query dependency information for a workspace package or the workspace root.
 *
 * @param args - Input arguments containing command type, optional dependency, and optional target package
 * @returns Result with exit code, output, and summary
 */
export async function pnpmQuery(args: PnpmQueryInput): Promise<PnpmQueryResult> {
  const { command, dependency, depth } = args

  // Validate command
  if (!ALLOWED_COMMANDS.includes(command)) {
    return {
      resolved: false,
      error: `Invalid command: "${command}". Allowed: ${ALLOWED_COMMANDS.join(', ')}`,
      validPackages: [],
    }
  }

  // Validate dependency for "why" command
  if (command === 'why') {
    if (dependency === undefined || dependency === '') {
      return {
        resolved: false,
        error: 'dependency is required for the "why" command',
        validPackages: [],
      }
    }

    if (!PACKAGE_NAME_RE.test(dependency)) {
      return {
        resolved: false,
        error: `Invalid package name: "${dependency}". Must be a valid npm package name.`,
        validPackages: [],
      }
    }
  }

  const workspaceRoot = getWorkspaceRoot()
  let resolvedPackage: string | null = null

  // Resolve target package if specified
  if (args.package !== undefined && args.package !== '') {
    const resolution = await resolvePackage(args.package)

    if (!resolution.resolved) {
      return {
        resolved: false,
        error: resolution.error ?? 'Unknown package',
        validPackages: resolution.validPackages ?? [],
      }
    }

    resolvedPackage = resolution.package!
  }

  // Construct the command
  const parts: string[] = ['pnpm']

  if (resolvedPackage !== null) {
    parts.push('--filter', resolvedPackage)
  }

  parts.push(command)

  // Add command-specific arguments
  if (command === 'list' && depth !== undefined) {
    parts.push('--depth', String(Math.max(0, Math.floor(depth))))
  }

  if (command === 'why' && dependency !== undefined) {
    parts.push(dependency)
  }

  const shellCommand = parts.join(' ')

  // Execute the command
  const { stdout, stderr, exitCode } = await execCommand(shellCommand, workspaceRoot, {
    timeout: 120000,
  })

  const output = truncateOutput((stdout + stderr).trim())
  const passed = exitCode === 0
  const target = resolvedPackage ?? 'workspace root'
  const summary = passed
    ? `pnpm ${command} completed for ${target}`
    : `pnpm ${command} failed for ${target} (exit code ${exitCode})`

  return {
    command,
    package: resolvedPackage,
    exitCode,
    passed,
    output,
    summary,
  }
}
