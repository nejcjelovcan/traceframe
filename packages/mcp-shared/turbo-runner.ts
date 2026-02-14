import { getWorkspaceRoot } from './config.js'
import { execCommand } from './exec-command.js'

/**
 * Default timeout for turbo commands in milliseconds (2 minutes).
 */
export const DEFAULT_TIMEOUT_MS = 120000

/**
 * Maximum number of output lines to keep (rest is truncated).
 */
export const MAX_OUTPUT_LINES = 50

/**
 * Allowed turbo script names (defense-in-depth validation).
 */
export const ALLOWED_SCRIPTS = [
  'build',
  'test',
  'test:ci',
  'typecheck',
  'lint:fix',
  'format',
] as const
export type AllowedScript = (typeof ALLOWED_SCRIPTS)[number]

/**
 * Result from running a turbo task for a single package.
 */
export interface PackageScriptResult {
  /** Resolved full package name */
  package: string
  /** Turbo task name that was run */
  script: string
  /** Exit code from the command */
  exitCode: number
  /** Whether the task passed (exitCode === 0) */
  passed: boolean
  /** Truncated stdout+stderr output */
  output: string
  /** Human-friendly status line */
  summary: string
}

/**
 * Per-package result within a context run.
 *
 * Note: This interface intentionally omits `output` to reduce response size.
 * For detailed output, use the package-level tools instead.
 */
export interface ContextPackageResult {
  /** Package name */
  name: string
  /** Exit code */
  exitCode: number
  /** Whether this package passed */
  passed: boolean
  /** Summary line */
  summary: string
}

/**
 * Result from running a turbo task for all layers of a bounded context.
 */
export interface ContextScriptResult {
  /** Context name */
  context: string
  /** Turbo task name that was run */
  script: string
  /** Per-layer results */
  packages: ContextPackageResult[]
  /** Whether all packages passed */
  allPassed: boolean
  /** Human-friendly overall status */
  summary: string
}

/**
 * Truncate output to last N lines to reduce response size.
 * Keeps errors/warnings which typically appear at the end.
 *
 * @param output - The full output string
 * @param maxLines - Maximum lines to keep (default: MAX_OUTPUT_LINES)
 * @returns Truncated output with indication of removed lines
 */
export function truncateOutput(output: string, maxLines: number = MAX_OUTPUT_LINES): string {
  const lines = output.split('\n')
  if (lines.length <= maxLines) {
    return output
  }

  const truncated = lines.slice(-maxLines).join('\n')
  const removedCount = lines.length - maxLines
  return `[... ${removedCount} lines truncated ...]\n\n${truncated}`
}

/**
 * Parse turbo output to extract per-package results.
 * Turbo prefixes each package's output with its name.
 *
 * @param output - Combined stdout+stderr from turbo
 * @param script - The script that was run
 * @param packageNames - Expected package names
 * @returns Array of per-package results
 */
export function parseContextOutput(
  output: string,
  script: string,
  packageNames: string[]
): ContextPackageResult[] {
  const results: ContextPackageResult[] = []

  for (const pkgName of packageNames) {
    // Match lines that start with the package name and script
    const prefix = `${pkgName}:${script}:`
    const pkgLines = output
      .split('\n')
      .filter((line) => line.includes(prefix))
      .join('\n')

    // Determine if this package failed by looking for error indicators
    const hasError =
      pkgLines.includes('ERROR') ||
      pkgLines.includes('FAIL') ||
      pkgLines.includes('error:') ||
      pkgLines.includes('Error:')

    const passed = !hasError
    const exitCode = passed ? 0 : 1

    // Generate summary
    let summary: string
    if (pkgLines === '') {
      summary = `${pkgName}: completed (no output)`
      results.push({ name: pkgName, exitCode: 0, passed: true, summary })
    } else if (passed) {
      summary = `${pkgName}: passed`
      results.push({ name: pkgName, exitCode, passed, summary })
    } else {
      summary = `${pkgName}: failed`
      results.push({ name: pkgName, exitCode, passed, summary })
    }
  }

  return results
}

/**
 * Validate script name against allowed list (defense-in-depth).
 */
function validateScript(script: string): void {
  if (!ALLOWED_SCRIPTS.includes(script as AllowedScript)) {
    throw new Error(`Invalid script: ${script}. Allowed: ${ALLOWED_SCRIPTS.join(', ')}`)
  }
}

/**
 * Validate package name format (defense-in-depth).
 * Accepts any valid npm scoped package: @scope/package-name
 */
function validatePackageName(packageName: string): void {
  if (!/^@[a-z0-9][a-z0-9._-]*\/[a-z0-9][a-z0-9._-]*$/i.test(packageName)) {
    throw new Error(`Invalid package name format: ${packageName}`)
  }
}

/**
 * Validate context name format (defense-in-depth).
 */
function validateContextName(contextName: string): void {
  if (!/^[a-z][a-z0-9-]*$/.test(contextName)) {
    throw new Error(`Invalid context name format: ${contextName}`)
  }
}

/**
 * Run a turbo task for a single package.
 *
 * @param packageName - Full scoped package name
 * @param script - Turbo task to run (e.g., 'test', 'build', 'typecheck')
 * @returns Result with exit code, output, and summary
 */
export async function runTurboTaskForPackage(
  packageName: string,
  script: string
): Promise<PackageScriptResult> {
  // Defense-in-depth validation
  validateScript(script)
  validatePackageName(packageName)

  const workspaceRoot = getWorkspaceRoot()
  const command = `pnpm turbo run ${script} --filter=${packageName} --no-cache`

  try {
    const { stdout, stderr, exitCode } = await execCommand(command, workspaceRoot)
    const combinedOutput = stdout + stderr
    const passed = exitCode === 0

    // Generate summary
    let summary: string
    if (passed) {
      summary = `${script} completed successfully for ${packageName}`
    } else {
      summary = `${script} failed for ${packageName} (exit code: ${exitCode})`
    }

    return {
      package: packageName,
      script,
      exitCode,
      passed,
      output: truncateOutput(combinedOutput.trim()),
      summary,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    // Check if it's a timeout
    const isTimeout = message.includes('timeout') || message.includes('timed out')

    return {
      package: packageName,
      script,
      exitCode: 1,
      passed: false,
      output: `Command failed: ${message}`,
      summary: isTimeout
        ? `${script} timed out for ${packageName}`
        : `${script} failed for ${packageName}: ${message}`,
    }
  }
}

/**
 * Run a turbo task for all layers of a bounded context.
 *
 * @param contextName - Context name (e.g., 'component-catalog')
 * @param script - Turbo task to run
 * @returns Result with per-package results and overall status
 */
export async function runTurboTaskForContext(
  contextName: string,
  script: string
): Promise<ContextScriptResult> {
  // Defense-in-depth validation
  validateScript(script)
  validateContextName(contextName)

  const workspaceRoot = getWorkspaceRoot()
  // Use glob filter to target all layers in the context
  const filter = `./context/${contextName}/layer/*`
  const command = `pnpm turbo run ${script} --filter='${filter}' --no-cache`

  try {
    const { stdout, stderr, exitCode } = await execCommand(command, workspaceRoot)
    const combinedOutput = stdout + stderr

    // Extract package names from the output by looking for turbo's package prefixes
    const packagePattern = /(@[a-z0-9][a-z0-9._-]*\/[a-z0-9][a-z0-9._-]+):[a-z0-9:_-]+:/gi
    const foundPackages = new Set<string>()
    let match
    while ((match = packagePattern.exec(combinedOutput)) !== null) {
      if (match[1] !== undefined) {
        foundPackages.add(match[1])
      }
    }
    const packageNames = Array.from(foundPackages).sort()

    // Parse per-package results
    const packages =
      packageNames.length > 0
        ? parseContextOutput(combinedOutput, script, packageNames)
        : [
            {
              name: `${contextName}/*`,
              exitCode,
              passed: exitCode === 0,
              summary: 'No packages matched',
            },
          ]

    const allPassed = exitCode === 0

    // Generate summary
    const passedCount = packages.filter((p) => p.passed).length
    const totalCount = packages.length
    const summary = allPassed
      ? `${script} completed for ${contextName}: ${passedCount}/${totalCount} packages passed`
      : `${script} failed for ${contextName}: ${passedCount}/${totalCount} packages passed`

    return {
      context: contextName,
      script,
      packages,
      allPassed,
      summary,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    return {
      context: contextName,
      script,
      packages: [],
      allPassed: false,
      summary: `${script} failed for ${contextName}: ${message}`,
    }
  }
}
