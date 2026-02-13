import { exec } from 'node:child_process'
import { promisify } from 'node:util'

import { z } from 'zod'

import { DEFAULT_PLAYROOM_PORT, isPlayroomRunning } from '../utils/playroom-runner.js'

const execAsync = promisify(exec)

/**
 * Input schema for stop_playroom tool.
 */
export const stopPlayroomInputSchema = {
  port: z.number().optional().describe(`Playroom port (default: ${DEFAULT_PLAYROOM_PORT})`),
}

/**
 * Description for the stop_playroom tool.
 */
export const stopPlayroomDescription = 'Stop a running Playroom process'

/**
 * Input arguments for stopPlayroomTool function.
 */
export interface StopPlayroomInput {
  port?: number
}

/**
 * Result type for stopPlayroomTool.
 */
export interface StopPlayroomResult {
  /** Whether the operation succeeded */
  success: boolean
  /** Human-readable summary */
  summary: string
  /** Error message if operation failed */
  error?: string
}

/**
 * Stop Playroom running on the specified port.
 *
 * @param args - Input arguments
 * @returns Result with success status
 */
export async function stopPlayroomTool(args: StopPlayroomInput): Promise<StopPlayroomResult> {
  const port = args.port ?? DEFAULT_PLAYROOM_PORT

  try {
    const running = await isPlayroomRunning(port)

    if (!running) {
      return {
        success: true,
        summary: `No Playroom process found on port ${port}`,
      }
    }

    // Find and kill the process on the port
    const { stdout } = await execAsync(`lsof -t -i:${port} | head -1`)
    const pid = stdout.trim()

    if (pid) {
      await execAsync(`kill ${pid}`)

      // Wait a moment and verify it's stopped
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const stillRunning = await isPlayroomRunning(port)

      if (!stillRunning) {
        return {
          success: true,
          summary: `Successfully stopped Playroom on port ${port}`,
        }
      } else {
        // Try force kill
        await execAsync(`kill -9 ${pid}`).catch(() => {})
        return {
          success: true,
          summary: `Force stopped Playroom on port ${port}`,
        }
      }
    }

    return {
      success: false,
      summary: `Could not find Playroom process on port ${port}`,
    }
  } catch (error) {
    return {
      success: false,
      summary: 'Failed to stop Playroom',
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
