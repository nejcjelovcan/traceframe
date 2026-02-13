import { execSync } from 'node:child_process'

import { z } from 'zod'

import { DEFAULT_STORYBOOK_PORT, isStorybookRunning } from '../utils/storybook-runner.js'

/**
 * Input schema for stop_storybook tool.
 */
export const stopStorybookInputSchema = {
  port: z.number().optional().describe(`Storybook port (default: ${DEFAULT_STORYBOOK_PORT})`),
}

/**
 * Description for the stop_storybook tool.
 */
export const stopStorybookDescription = 'Stop a running Storybook process'

/**
 * Input arguments for stopStorybookTool function.
 */
export interface StopStorybookInput {
  port?: number
}

/**
 * Result type for stopStorybookTool.
 */
export interface StopStorybookResult {
  /** Whether the operation succeeded */
  success: boolean
  /** What action was taken */
  action: 'stopped' | 'not_running'
  /** Storybook URL/port */
  url: string
  /** Human-readable summary */
  summary: string
  /** Error message if operation failed */
  error?: string
}

/**
 * Kill all processes on a port using shell command.
 * Returns true if processes were found and killed.
 */
function killAllOnPort(port: number): boolean {
  try {
    // First find the PIDs
    const pidsOutput = execSync(`lsof -ti tcp:${port} 2>/dev/null || true`, {
      encoding: 'utf-8',
    }).trim()

    if (!pidsOutput) {
      return false
    }

    // Kill the processes
    execSync(`kill -9 ${pidsOutput} 2>/dev/null || true`, {
      encoding: 'utf-8',
    })

    return true
  } catch {
    return false
  }
}

/**
 * Wait for Storybook to stop responding.
 */
async function waitForStorybookStopped(port: number, maxWaitMs: number = 5000): Promise<boolean> {
  const startTime = Date.now()
  while (Date.now() - startTime < maxWaitMs) {
    if (!(await isStorybookRunning(port))) {
      return true
    }
    await new Promise((resolve) => setTimeout(resolve, 200))
  }
  return false
}

/**
 * Stop a running Storybook process.
 *
 * @param args - Input arguments
 * @returns Result with action taken
 */
export async function stopStorybookTool(args: StopStorybookInput): Promise<StopStorybookResult> {
  const port = args.port ?? DEFAULT_STORYBOOK_PORT
  const url = `http://localhost:${port}`

  try {
    const running = await isStorybookRunning(port)

    if (!running) {
      return {
        success: true,
        action: 'not_running',
        url,
        summary: `Storybook is not running on port ${port}.`,
      }
    }

    // Kill all processes on the port
    const killed = killAllOnPort(port)

    if (!killed) {
      return {
        success: false,
        action: 'not_running',
        url,
        summary: 'Failed to stop Storybook',
        error: `Could not find processes on port ${port}`,
      }
    }

    // Verify Storybook actually stopped
    const stopped = await waitForStorybookStopped(port)

    if (!stopped) {
      return {
        success: false,
        action: 'stopped',
        url,
        summary: 'Failed to stop Storybook',
        error: `Storybook still running on port ${port} after kill attempt`,
      }
    }

    return {
      success: true,
      action: 'stopped',
      url,
      summary: `Stopped Storybook on port ${port}.`,
    }
  } catch (error) {
    return {
      success: false,
      action: 'not_running',
      url,
      summary: 'Failed to stop Storybook',
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
