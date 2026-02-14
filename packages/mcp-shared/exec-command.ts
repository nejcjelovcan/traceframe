import { exec } from 'node:child_process'

/**
 * Options for execCommand
 */
export interface ExecCommandOptions {
  timeout?: number
}

/**
 * Execute a command and return stdout/stderr with exit code
 */
export function execCommand(
  command: string,
  cwd: string,
  options: ExecCommandOptions = {}
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  return new Promise((resolve) => {
    exec(
      command,
      {
        cwd,
        maxBuffer: 50 * 1024 * 1024,
        ...(options.timeout ? { timeout: options.timeout } : {}),
      },
      (error, stdout, stderr) => {
        const exitCode = error
          ? ((error as NodeJS.ErrnoException & { code?: number }).code ?? 1)
          : 0
        resolve({ stdout, stderr, exitCode: typeof exitCode === 'number' ? exitCode : 1 })
      }
    )
  })
}
