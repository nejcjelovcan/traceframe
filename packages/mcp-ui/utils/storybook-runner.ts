import { type ChildProcess, spawn } from 'node:child_process'

import { getWorkspaceRoot } from './workspace.js'

/**
 * Default port for Storybook.
 */
export const DEFAULT_STORYBOOK_PORT = 6006

/**
 * Default timeout for Storybook startup in milliseconds (60 seconds).
 */
export const DEFAULT_STARTUP_TIMEOUT_MS = 60000

/**
 * Interval for checking Storybook availability in milliseconds.
 */
export const STARTUP_CHECK_INTERVAL_MS = 1000

/**
 * Handle for a running Storybook process.
 */
export interface StorybookProcess {
  /** Port Storybook is running on */
  port: number
  /** URL to access Storybook */
  url: string
  /** Whether we started this process (vs found it already running) */
  weStartedIt: boolean
  /** Stop the Storybook process (no-op if we didn't start it) */
  stop: () => Promise<void>
}

/**
 * Options for starting Storybook.
 */
export interface StartStorybookOptions {
  /** Path to the package containing Storybook (e.g., "packages/ui-library") */
  packagePath: string
  /** Port to run Storybook on (default: 6006) */
  port?: number
  /** Timeout for startup in milliseconds (default: 60000) */
  timeout?: number
}

/**
 * Check if Storybook is running on a given port.
 *
 * @param port - Port to check
 * @returns True if Storybook is responding on the port
 */
export async function isStorybookRunning(port: number): Promise<boolean> {
  const url = `http://localhost:${port}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      signal: AbortSignal.timeout(2000),
    })
    return response.ok
  } catch {
    return false
  }
}

/**
 * Wait for Storybook to become available on a port.
 *
 * @param port - Port to check
 * @param timeout - Maximum time to wait in milliseconds
 * @returns True if Storybook became available, false if timed out
 */
async function waitForStorybookReady(port: number, timeout: number): Promise<boolean> {
  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    if (await isStorybookRunning(port)) {
      return true
    }
    await new Promise((resolve) => setTimeout(resolve, STARTUP_CHECK_INTERVAL_MS))
  }

  return false
}

/**
 * Start Storybook in CI mode, wait for it to be ready, return handle to stop it.
 * If Storybook is already running on the port, reuse it.
 *
 * @param options - Storybook start options
 * @returns Handle with port, URL, and stop function
 */
export async function startStorybook(options: StartStorybookOptions): Promise<StorybookProcess> {
  const port = options.port ?? DEFAULT_STORYBOOK_PORT
  const timeout = options.timeout ?? DEFAULT_STARTUP_TIMEOUT_MS
  const url = `http://localhost:${port}`

  // Check if Storybook is already running
  if (await isStorybookRunning(port)) {
    return {
      port,
      url,
      weStartedIt: false,
      stop: async () => {
        // No-op: we didn't start it, so we don't kill it
      },
    }
  }

  const workspaceRoot = getWorkspaceRoot()
  const fullPackagePath = `${workspaceRoot}/${options.packagePath}`

  // Start Storybook in CI mode
  let childProcess: ChildProcess | undefined

  const startPromise = new Promise<ChildProcess>((resolve, reject) => {
    const child = spawn('pnpm', ['storybook', '--ci', '--port', String(port)], {
      cwd: fullPackagePath,
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: true,
    })

    // Collect output for debugging
    let output = ''

    child.stdout?.on('data', (data: Buffer) => {
      output += data.toString()
      // Storybook is ready when we see this message
      if (output.includes('Storybook') && output.includes('started')) {
        resolve(child)
      }
    })

    child.stderr?.on('data', (data: Buffer) => {
      output += data.toString()
    })

    child.on('error', (error) => {
      reject(new Error(`Failed to start Storybook: ${error.message}`))
    })

    child.on('exit', (code) => {
      if (code !== null && code !== 0) {
        reject(new Error(`Storybook exited with code ${code}. Output:\n${output}`))
      }
    })

    // Store the child process for cleanup
    childProcess = child
  })

  // Race between startup and timeout
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Storybook startup timed out after ${timeout}ms`))
    }, timeout)
  })

  // Also wait for HTTP availability as a fallback
  const httpReadyPromise = waitForStorybookReady(port, timeout).then((ready) => {
    if (!ready) {
      throw new Error(`Storybook not responding on port ${port} after ${timeout}ms`)
    }
    return childProcess!
  })

  try {
    await Promise.race([startPromise, httpReadyPromise, timeoutPromise])
  } catch (error) {
    // Cleanup on failure
    if (childProcess) {
      try {
        // Kill the process group
        if (childProcess.pid) {
          process.kill(-childProcess.pid, 'SIGTERM')
        }
      } catch {
        // Ignore cleanup errors
      }
    }
    throw error
  }

  return {
    port,
    url,
    weStartedIt: true,
    stop: async () => {
      if (childProcess?.pid) {
        try {
          // Kill the process group
          process.kill(-childProcess.pid, 'SIGTERM')

          // Wait a bit for graceful shutdown
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // Force kill if still running
          try {
            process.kill(-childProcess.pid, 'SIGKILL')
          } catch {
            // Process already dead
          }
        } catch {
          // Process already dead
        }
      }
    },
  }
}

/**
 * Find the package path for ui-library.
 *
 * @returns Package path relative to workspace root
 */
export function getUiLibraryPackagePath(): string {
  return 'packages/ui-library'
}
