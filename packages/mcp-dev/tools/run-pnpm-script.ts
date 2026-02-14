import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { z } from 'zod'

import {
  execCommand,
  getWorkspaceRoot,
  resolvePackage,
  truncateOutput,
} from '@nejcjelovcan/mcp-shared'

/**
 * Regex for valid script names (prevents command injection).
 */
const SCRIPT_NAME_RE = /^[a-zA-Z0-9:_-]+$/

/**
 * Regex for valid extra args (prevents command injection).
 */
const ARGS_RE = /^[a-zA-Z0-9 =._:/-]+$/

/**
 * Input schema for run_pnpm_script tool.
 */
export const runPnpmScriptInputSchema = {
  script: z
    .string()
    .describe('The npm script name to run (e.g. "generate:component-metadata", "build", "dev")'),
  package: z
    .string()
    .optional()
    .describe(
      'Package to target via pnpm --filter. Accepts bare name or full scoped name. If omitted, runs at workspace root.'
    ),
  args: z.string().optional().describe('Extra arguments appended after -- (e.g. "--watch")'),
}

/**
 * Description for the run_pnpm_script tool.
 */
export const runPnpmScriptDescription =
  'Run any pnpm script defined in a package or root package.json. Use this for scripts not covered by dedicated tools (build, test, typecheck, etc.).'

/**
 * Input arguments for runPnpmScript function.
 */
export interface RunPnpmScriptInput {
  script: string
  package?: string
  args?: string
}

/**
 * Result type for runPnpmScript.
 */
export type RunPnpmScriptResult =
  | {
      script: string
      package: string | null
      exitCode: number
      passed: boolean
      output: string
      summary: string
    }
  | { resolved: false; error: string; validPackages: string[] }

/**
 * Read and parse a package.json file, returning its scripts field.
 */
async function readScripts(packageJsonPath: string): Promise<Record<string, string> | undefined> {
  const raw = await readFile(packageJsonPath, 'utf-8')
  const parsed = JSON.parse(raw) as { scripts?: Record<string, string> }
  return parsed.scripts
}

/**
 * Run any pnpm script defined in a package or root package.json.
 *
 * @param args - Input arguments containing script name, optional package, and optional extra args
 * @returns Result with exit code, output, and summary
 */
export async function runPnpmScript(args: RunPnpmScriptInput): Promise<RunPnpmScriptResult> {
  const { script, args: extraArgs } = args

  // Validate script name format
  if (!SCRIPT_NAME_RE.test(script)) {
    return {
      resolved: false,
      error: `Invalid script name: "${script}". Must match ${SCRIPT_NAME_RE.source}`,
      validPackages: [],
    }
  }

  // Validate extra args format if provided
  if (extraArgs !== undefined && extraArgs !== '' && !ARGS_RE.test(extraArgs)) {
    return {
      resolved: false,
      error: `Invalid args: "${extraArgs}". Must match ${ARGS_RE.source}`,
      validPackages: [],
    }
  }

  const workspaceRoot = getWorkspaceRoot()
  let resolvedPackage: string | null = null
  const cwd = workspaceRoot

  if (args.package !== undefined && args.package !== '') {
    // Resolve the package name
    const resolution = await resolvePackage(args.package)

    if (!resolution.resolved) {
      return {
        resolved: false,
        error: resolution.error ?? 'Unknown package',
        validPackages: resolution.validPackages ?? [],
      }
    }

    resolvedPackage = resolution.package!

    // Verify the script exists in the package's package.json
    const packageJsonPath = join(workspaceRoot, resolution.path!, 'package.json')
    const scripts = await readScripts(packageJsonPath)

    if (scripts === undefined || !(script in scripts)) {
      const available = scripts !== undefined ? Object.keys(scripts).join(', ') : 'none'
      return {
        resolved: false,
        error: `Script "${script}" not found in ${resolvedPackage}. Available scripts: ${available}`,
        validPackages: [],
      }
    }
  } else {
    // Verify the script exists in the root package.json
    const rootPackageJsonPath = join(workspaceRoot, 'package.json')
    const scripts = await readScripts(rootPackageJsonPath)

    if (scripts === undefined || !(script in scripts)) {
      const available = scripts !== undefined ? Object.keys(scripts).join(', ') : 'none'
      return {
        resolved: false,
        error: `Script "${script}" not found in root package.json. Available scripts: ${available}`,
        validPackages: [],
      }
    }
  }

  // Construct the command
  let command: string
  if (resolvedPackage !== null) {
    command = `pnpm --filter ${resolvedPackage} run ${script}`
  } else {
    command = `pnpm run ${script}`
  }

  if (extraArgs !== undefined && extraArgs !== '') {
    command += ` -- ${extraArgs}`
  }

  // Execute the command
  const { stdout, stderr, exitCode } = await execCommand(command, cwd, { timeout: 120000 })

  const output = truncateOutput((stdout + stderr).trim())
  const passed = exitCode === 0
  const target = resolvedPackage ?? 'workspace root'
  const summary = passed
    ? `Script "${script}" passed for ${target}`
    : `Script "${script}" failed for ${target} (exit code ${exitCode})`

  return {
    script,
    package: resolvedPackage,
    exitCode,
    passed,
    output,
    summary,
  }
}
