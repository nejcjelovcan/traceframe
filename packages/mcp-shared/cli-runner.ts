import { getWorkspaceRoot } from './config.js'
import { execCommand, type ExecCommandOptions } from './exec-command.js'

/**
 * Default timeout for CLI commands (5 minutes - scanning can take a while).
 */
export const CLI_RUNNER_DEFAULT_TIMEOUT_MS = 300000

/**
 * Options for buildCliAndRun.
 */
export interface CliRunnerOptions extends ExecCommandOptions {
  /** Working directory for the CLI command (default: workspace root) */
  cwd?: string
  /** Force rebuild, bypassing turbo cache */
  force?: boolean
  /** CLI package name (e.g., "@myorg/cli"). Required. */
  cliPackage: string
  /** Path to CLI entry point relative to workspace root (e.g., "apps/cli/dist/cli.js") */
  cliEntry: string
}

/**
 * Result from running a CLI command.
 */
export interface CliRunnerResult {
  /** Whether the command succeeded (exitCode === 0) */
  success: boolean
  /** Exit code from the command */
  exitCode: number
  /** Combined stdout and stderr output */
  output: string
}

/**
 * Build the CLI and run a command.
 *
 * This ensures the CLI package is built before executing the command by running
 * `pnpm turbo run build --filter=<cliPackage>` first.
 *
 * @param cliArgs - Arguments to pass to the CLI (e.g., "scan . -o output.json")
 * @param options - Settings including cliPackage and cliEntry (required)
 * @returns Result with success status, exit code, and output
 */
export async function buildCliAndRun(
  cliArgs: string,
  options: CliRunnerOptions
): Promise<CliRunnerResult> {
  const workspaceRoot = getWorkspaceRoot()
  const { cliPackage, cliEntry } = options
  const cwd = options.cwd ?? workspaceRoot
  const timeout = options.timeout ?? CLI_RUNNER_DEFAULT_TIMEOUT_MS
  const forceFlag = options.force ? ' --force' : ''

  // Build the CLI first, then run the command
  const command = `pnpm turbo run build --filter=${cliPackage}${forceFlag} && node ${workspaceRoot}/${cliEntry} ${cliArgs}`

  const { stdout, stderr, exitCode } = await execCommand(command, cwd, { timeout })

  return {
    success: exitCode === 0,
    exitCode,
    output: (stdout + stderr).trim(),
  }
}
