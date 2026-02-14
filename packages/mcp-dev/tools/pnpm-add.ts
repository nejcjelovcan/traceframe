import { z } from 'zod'

import {
  execCommand,
  getWorkspaceRoot,
  resolvePackage,
  truncateOutput,
} from '@nejcjelovcan/mcp-shared'

/**
 * Regex for valid npm dependency specifiers (prevents command injection).
 * Allows: package names, scoped packages, and version specifiers.
 * Examples: "react", "@types/react", "react@^18.0.0", "@scope/pkg@latest"
 */
const DEPENDENCY_RE = /^@?[a-z0-9][\w./-]*(@[^\s]+)?$/i

/**
 * Validate a single dependency specifier.
 */
function validateDependency(dep: string): boolean {
  return DEPENDENCY_RE.test(dep)
}

/**
 * Input schema for pnpm_add tool.
 */
export const pnpmAddInputSchema = {
  dependency: z
    .string()
    .describe(
      'Package name(s) to add, space-separated (e.g. "react", "react @types/react", "lodash@^4.0.0")'
    ),
  package: z
    .string()
    .optional()
    .describe(
      'Target workspace package. Accepts bare name or full scoped name. If omitted, adds to workspace root.'
    ),
  dev: z.boolean().optional().describe('Add as devDependency (-D flag). Defaults to false.'),
  exact: z.boolean().optional().describe('Save exact version (-E flag). Defaults to false.'),
}

/**
 * Description for the pnpm_add tool.
 */
export const pnpmAddDescription =
  'Add one or more npm dependencies to a workspace package or the workspace root. Supports devDependencies and exact versions.'

/**
 * Input arguments for pnpmAdd function.
 */
export interface PnpmAddInput {
  dependency: string
  package?: string
  dev?: boolean
  exact?: boolean
}

/**
 * Result type for pnpmAdd.
 */
export type PnpmAddResult =
  | {
      dependency: string
      package: string | null
      dev: boolean
      exact: boolean
      exitCode: number
      passed: boolean
      output: string
      summary: string
    }
  | { resolved: false; error: string; validPackages: string[] }

/**
 * Add one or more npm dependencies to a workspace package or the workspace root.
 *
 * @param args - Input arguments containing dependency name(s), optional target package, and flags
 * @returns Result with exit code, output, and summary
 */
export async function pnpmAdd(args: PnpmAddInput): Promise<PnpmAddResult> {
  const { dependency, dev = false, exact = false } = args

  // Validate dependency specifiers
  const deps = dependency.trim().split(/\s+/)
  if (deps.length === 0 || deps[0] === '') {
    return {
      resolved: false,
      error: 'dependency is required',
      validPackages: [],
    }
  }

  for (const dep of deps) {
    if (!validateDependency(dep)) {
      return {
        resolved: false,
        error: `Invalid dependency specifier: "${dep}". Must be a valid npm package name with optional version.`,
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

  parts.push('add')

  if (resolvedPackage === null) {
    parts.push('-w')
  }

  if (dev) {
    parts.push('-D')
  }

  if (exact) {
    parts.push('-E')
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
    ? `Added ${dependency} to ${target}${dev ? ' (dev)' : ''}`
    : `Failed to add ${dependency} to ${target} (exit code ${exitCode})`

  return {
    dependency,
    package: resolvedPackage,
    dev,
    exact,
    exitCode,
    passed,
    output,
    summary,
  }
}
