import { z } from 'zod'

import {
  execCommand,
  getWorkspaceRoot,
  resolvePackage,
  truncateOutput,
} from '@nejcjelovcan/mcp-shared'

/**
 * Regex for valid npm package names (prevents command injection).
 * Allows: package names and scoped packages (no version specifiers needed for remove).
 */
const PACKAGE_NAME_RE = /^@?[a-z0-9][\w./-]*$/i

/**
 * Validate a single package name.
 */
function validatePackageName(name: string): boolean {
  return PACKAGE_NAME_RE.test(name)
}

/**
 * Input schema for pnpm_remove tool.
 */
export const pnpmRemoveInputSchema = {
  dependency: z
    .string()
    .describe('Package name(s) to remove, space-separated (e.g. "react", "react @types/react")'),
  package: z
    .string()
    .optional()
    .describe(
      'Target workspace package. Accepts bare name or full scoped name. If omitted, removes from workspace root.'
    ),
}

/**
 * Description for the pnpm_remove tool.
 */
export const pnpmRemoveDescription =
  'Remove one or more npm dependencies from a workspace package or the workspace root.'

/**
 * Input arguments for pnpmRemove function.
 */
export interface PnpmRemoveInput {
  dependency: string
  package?: string
}

/**
 * Result type for pnpmRemove.
 */
export type PnpmRemoveResult =
  | {
      dependency: string
      package: string | null
      exitCode: number
      passed: boolean
      output: string
      summary: string
    }
  | { resolved: false; error: string; validPackages: string[] }

/**
 * Remove one or more npm dependencies from a workspace package or the workspace root.
 *
 * @param args - Input arguments containing dependency name(s) and optional target package
 * @returns Result with exit code, output, and summary
 */
export async function pnpmRemove(args: PnpmRemoveInput): Promise<PnpmRemoveResult> {
  const { dependency } = args

  // Validate dependency names
  const deps = dependency.trim().split(/\s+/)
  if (deps.length === 0 || deps[0] === '') {
    return {
      resolved: false,
      error: 'dependency is required',
      validPackages: [],
    }
  }

  for (const dep of deps) {
    if (!validatePackageName(dep)) {
      return {
        resolved: false,
        error: `Invalid package name: "${dep}". Must be a valid npm package name.`,
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

  parts.push('remove')

  if (resolvedPackage === null) {
    parts.push('-w')
  }

  parts.push(...deps)

  const command = parts.join(' ')

  // Execute the command
  const { stdout, stderr, exitCode } = await execCommand(command, workspaceRoot, {
    timeout: 120000,
  })

  const output = truncateOutput((stdout + stderr).trim())
  const passed = exitCode === 0
  const target = resolvedPackage ?? 'workspace root'
  const summary = passed
    ? `Removed ${dependency} from ${target}`
    : `Failed to remove ${dependency} from ${target} (exit code ${exitCode})`

  return {
    dependency,
    package: resolvedPackage,
    exitCode,
    passed,
    output,
    summary,
  }
}
