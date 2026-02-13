import { exec, spawn } from 'node:child_process'

import { z } from 'zod'

import {
  DEFAULT_PLAYROOM_PORT,
  getUiLibraryPackagePath,
  isPlayroomRunning,
} from '../utils/playroom-runner.js'
import { getWorkspaceRoot } from '../utils/workspace.js'

/**
 * Input schema for run_or_open_playroom tool.
 */
export const runOrOpenPlayroomInputSchema = {
  port: z.number().optional().describe(`Playroom port (default: ${DEFAULT_PLAYROOM_PORT})`),
}

/**
 * Description for the run_or_open_playroom tool.
 */
export const runOrOpenPlayroomDescription =
  'Start Playroom design environment or open it in browser if already running'

/**
 * Input arguments for runOrOpenPlayroomTool function.
 */
export interface RunOrOpenPlayroomInput {
  port?: number
}

/**
 * Result type for runOrOpenPlayroomTool.
 */
export interface RunOrOpenPlayroomResult {
  /** Whether the operation succeeded */
  success: boolean
  /** What action was taken */
  action: 'started' | 'opened'
  /** Playroom URL */
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
 * Start Playroom interactively so browser opens automatically.
 * The process is detached so it continues running after this function returns.
 */
function startPlayroomInteractive(packagePath: string, port: number): void {
  const workspaceRoot = getWorkspaceRoot()
  const fullPackagePath = `${workspaceRoot}/${packagePath}`

  const child = spawn('pnpm', ['playroom:start', '--port', String(port)], {
    cwd: fullPackagePath,
    detached: true,
    stdio: 'ignore',
  })

  // Detach the child process so it continues running
  child.unref()
}

/**
 * Run Playroom if not running, or open browser if already running.
 *
 * @param args - Input arguments
 * @returns Result with action taken and URL
 */
export async function runOrOpenPlayroomTool(
  args: RunOrOpenPlayroomInput
): Promise<RunOrOpenPlayroomResult> {
  const port = args.port ?? DEFAULT_PLAYROOM_PORT
  const url = `http://localhost:${port}`

  try {
    const running = await isPlayroomRunning(port)

    if (running) {
      // Playroom is already running, open in browser
      await openInBrowser(url)
      return {
        success: true,
        action: 'opened',
        url,
        summary: `Playroom is already running. Opened ${url} in browser.`,
      }
    }

    // Playroom is not running, start it
    const packagePath = getUiLibraryPackagePath()
    startPlayroomInteractive(packagePath, port)

    return {
      success: true,
      action: 'started',
      url,
      summary: `Started Playroom on ${url}. Browser will open automatically.`,
    }
  } catch (error) {
    return {
      success: false,
      action: 'opened', // Fallback, but success is false
      url,
      summary: 'Failed to run or open Playroom',
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
