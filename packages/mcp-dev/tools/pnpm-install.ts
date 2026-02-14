import { z } from 'zod'

import { execCommand, getWorkspaceRoot, truncateOutput } from '@nejcjelovcan/mcp-shared'

/**
 * Input schema for pnpm_install tool.
 */
export const pnpmInstallInputSchema = {
  frozen: z
    .boolean()
    .optional()
    .describe(
      'Use --frozen-lockfile (CI mode, fails if lockfile is out of date). Defaults to false.'
    ),
}

/**
 * Description for the pnpm_install tool.
 */
export const pnpmInstallDescription =
  'Install all workspace dependencies. Optionally use --frozen-lockfile for CI environments.'

/**
 * Input arguments for pnpmInstall function.
 */
export interface PnpmInstallInput {
  frozen?: boolean
}

/**
 * Result type for pnpmInstall.
 */
export interface PnpmInstallResult {
  exitCode: number
  passed: boolean
  output: string
  summary: string
}

/**
 * Install all workspace dependencies.
 *
 * @param args - Input arguments with optional frozen lockfile flag
 * @returns Result with exit code, output, and summary
 */
export async function pnpmInstall(args: PnpmInstallInput): Promise<PnpmInstallResult> {
  const { frozen = false } = args

  const workspaceRoot = getWorkspaceRoot()

  // Construct the command
  const parts: string[] = ['pnpm', 'install']

  if (frozen) {
    parts.push('--frozen-lockfile')
  }

  const command = parts.join(' ')

  // Execute the command
  const { stdout, stderr, exitCode } = await execCommand(command, workspaceRoot, {
    timeout: 120000,
  })

  const output = truncateOutput((stdout + stderr).trim())
  const passed = exitCode === 0
  const summary = passed
    ? `pnpm install completed successfully${frozen ? ' (frozen lockfile)' : ''}`
    : `pnpm install failed (exit code ${exitCode})`

  return {
    exitCode,
    passed,
    output,
    summary,
  }
}
