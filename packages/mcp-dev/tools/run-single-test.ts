import { access } from 'node:fs/promises'
import { join } from 'node:path'

import { z } from 'zod'

import {
  execCommand,
  getWorkspaceRoot,
  resolvePackage,
  truncateOutput,
} from '@nejcjelovcan/mcp-shared'

/**
 * Input schema for run_single_test tool.
 */
export const runSingleTestInputSchema = {
  package: z.string().describe('Target package (e.g., "my-pkg" or "@scope/my-pkg")'),
  file: z
    .string()
    .describe(
      'Test file path relative to package root (e.g., "parser.test.ts" or "utils/helper.test.ts")'
    ),
  grep: z.string().optional().describe('Pattern to filter test names (vitest -t flag)'),
  reporter: z
    .string()
    .optional()
    .describe(
      'Vitest reporter to use (e.g., "verbose", "dot", "json", "junit"). Defaults to vitest default reporter.'
    ),
}

/**
 * Description for the run_single_test tool.
 */
export const runSingleTestDescription =
  'Run a specific test file, enabling faster iteration when debugging or developing individual tests'

/**
 * Input arguments for runSingleTest function.
 */
export interface RunSingleTestInput {
  package: string
  file: string
  grep?: string
  reporter?: string
}

/**
 * Result type for runSingleTest.
 */
export interface RunSingleTestResult {
  success: boolean
  package: string
  file: string
  grep?: string | undefined
  reporter?: string | undefined
  passed: number
  failed: number
  skipped: number
  exitCode: number
  output: string
  summary: string
  validPackages?: string[] | undefined
}

/**
 * Parse vitest output to extract test counts.
 *
 * @param output - The vitest output to parse
 * @returns Object with passed, failed, and skipped counts
 */
export function parseVitestOutput(output: string): {
  passed: number
  failed: number
  skipped: number
} {
  // Look for lines like: "Tests  5 passed | 2 failed | 1 skipped (8)"
  // Also handles: "Tests  5 passed (5)" or "Tests  2 failed (2)"
  const testLineRegex =
    /Tests\s+(?:(\d+)\s+passed)?(?:\s*\|\s*)?(?:(\d+)\s+failed)?(?:\s*\|\s*)?(?:(\d+)\s+skipped)?/

  const match = testLineRegex.exec(output)

  if (match) {
    return {
      passed: match[1] !== undefined ? parseInt(match[1], 10) : 0,
      failed: match[2] !== undefined ? parseInt(match[2], 10) : 0,
      skipped: match[3] !== undefined ? parseInt(match[3], 10) : 0,
    }
  }

  return { passed: 0, failed: 0, skipped: 0 }
}

/**
 * Run a specific test file within a package.
 *
 * @param args - Input arguments containing package, file, and optional grep pattern
 * @returns Result with test counts, output, and summary
 */
export async function runSingleTest(args: RunSingleTestInput): Promise<RunSingleTestResult> {
  const workspaceRoot = getWorkspaceRoot()

  // Resolve the package name
  const resolution = await resolvePackage(args.package)

  if (!resolution.resolved) {
    return {
      success: false,
      package: args.package,
      file: args.file,
      grep: args.grep,
      reporter: args.reporter,
      passed: 0,
      failed: 0,
      skipped: 0,
      exitCode: 1,
      output: '',
      summary: resolution.error ?? 'Unknown package',
      validPackages: resolution.validPackages,
    }
  }

  const packageName = resolution.package!
  const packagePath = resolution.path!

  // Construct full file path and check if it exists
  const fullFilePath = join(workspaceRoot, packagePath, args.file)

  try {
    await access(fullFilePath)
  } catch {
    return {
      success: false,
      package: packageName,
      file: args.file,
      grep: args.grep,
      reporter: args.reporter,
      passed: 0,
      failed: 0,
      skipped: 0,
      exitCode: 1,
      output: '',
      summary: `Test file not found: ${args.file} (looked in ${packagePath}/${args.file})`,
    }
  }

  // Build the command
  // Use pnpm --filter to run the test for the specific file
  // Note: vitest flags must come after -- to pass through pnpm
  let command = `pnpm --filter ${packageName} test ${args.file}`
  const vitestFlags: string[] = []
  if (args.grep !== undefined && args.grep !== '') {
    // Escape quotes in grep pattern for shell safety
    const escapedGrep = args.grep.replace(/"/g, '\\"')
    vitestFlags.push(`-t "${escapedGrep}"`)
  }
  if (args.reporter !== undefined && args.reporter !== '') {
    // Escape quotes in reporter for shell safety
    const escapedReporter = args.reporter.replace(/"/g, '\\"')
    vitestFlags.push(`--reporter="${escapedReporter}"`)
  }
  if (vitestFlags.length > 0) {
    command += ` -- ${vitestFlags.join(' ')}`
  }

  // Execute the command
  const { stdout, stderr, exitCode } = await execCommand(command, workspaceRoot)
  const combinedOutput = stdout + stderr

  // Parse test counts from output
  const { passed, failed, skipped } = parseVitestOutput(combinedOutput)

  // Determine success and generate summary
  const success = exitCode === 0

  let summary: string
  if (success) {
    summary = `Tests passed: ${passed} passed`
    if (skipped > 0) {
      summary += `, ${skipped} skipped`
    }
  } else {
    summary = `Tests failed: ${passed} passed, ${failed} failed`
    if (skipped > 0) {
      summary += `, ${skipped} skipped`
    }
  }

  return {
    success,
    package: packageName,
    file: args.file,
    grep: args.grep,
    reporter: args.reporter,
    passed,
    failed,
    skipped,
    exitCode,
    output: truncateOutput(combinedOutput.trim()),
    summary,
  }
}
