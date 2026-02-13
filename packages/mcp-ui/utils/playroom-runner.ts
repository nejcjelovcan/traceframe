import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

export const DEFAULT_PLAYROOM_PORT = 9000

/**
 * Get the relative path to the ui-library package.
 */
export function getUiLibraryPackagePath(): string {
  return 'packages/ui-library'
}

/**
 * Check if Playroom is running on the specified port.
 */
export async function isPlayroomRunning(port = DEFAULT_PLAYROOM_PORT): Promise<boolean> {
  try {
    // Check if the port is in use
    const { stdout } = await execAsync(`lsof -i :${port} | grep LISTEN || true`)
    return stdout.trim().length > 0
  } catch {
    return false
  }
}
