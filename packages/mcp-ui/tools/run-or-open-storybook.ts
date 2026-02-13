import { exec, spawn } from 'node:child_process'

import { z } from 'zod'

import {
  DEFAULT_STORYBOOK_PORT,
  getUiLibraryPackagePath,
  isStorybookRunning,
} from '../utils/storybook-runner.js'
import { getWorkspaceRoot } from '../utils/workspace.js'

/**
 * Input schema for run_or_open_storybook tool.
 */
export const runOrOpenStorybookInputSchema = {
  port: z.number().optional().describe(`Storybook port (default: ${DEFAULT_STORYBOOK_PORT})`),
}

/**
 * Description for the run_or_open_storybook tool.
 */
export const runOrOpenStorybookDescription =
  'Start Storybook interactively or open it in browser if already running'

/**
 * Input arguments for runOrOpenStorybookTool function.
 */
export interface RunOrOpenStorybookInput {
  port?: number
}

/**
 * Result type for runOrOpenStorybookTool.
 */
export interface RunOrOpenStorybookResult {
  /** Whether the operation succeeded */
  success: boolean
  /** What action was taken */
  action: 'started' | 'opened'
  /** Storybook URL */
  url: string
  /** Human-readable summary */
  summary: string
  /** Error message if operation failed */
  error?: string
}

/**
 * Open a URL in the default browser (macOS).
 */
function openInBrowser(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(`open "${url}"`, (error) => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

/**
 * Start Storybook interactively (without --ci flag) so browser opens automatically.
 * The process is detached so it continues running after this function returns.
 */
function startStorybookInteractive(packagePath: string, port: number): void {
  const workspaceRoot = getWorkspaceRoot()
  const fullPackagePath = `${workspaceRoot}/${packagePath}`

  const child = spawn('pnpm', ['storybook', '--port', String(port)], {
    cwd: fullPackagePath,
    detached: true,
    stdio: 'ignore',
  })

  // Detach the child process so it continues running
  child.unref()
}

/**
 * Run Storybook if not running, or open browser if already running.
 *
 * @param args - Input arguments
 * @returns Result with action taken and URL
 */
export async function runOrOpenStorybookTool(
  args: RunOrOpenStorybookInput
): Promise<RunOrOpenStorybookResult> {
  const port = args.port ?? DEFAULT_STORYBOOK_PORT
  const url = `http://localhost:${port}`

  try {
    const running = await isStorybookRunning(port)

    if (running) {
      // Storybook is already running, open in browser
      await openInBrowser(url)
      return {
        success: true,
        action: 'opened',
        url,
        summary: `Storybook is already running. Opened ${url} in browser.`,
      }
    }

    // Storybook is not running, start it
    const packagePath = getUiLibraryPackagePath()
    startStorybookInteractive(packagePath, port)

    return {
      success: true,
      action: 'started',
      url,
      summary: `Started Storybook on ${url}. Browser will open automatically.`,
    }
  } catch (error) {
    return {
      success: false,
      action: 'opened', // Fallback, but success is false
      url,
      summary: 'Failed to run or open Storybook',
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
