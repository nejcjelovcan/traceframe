import { execCommand, getWorkspaceRoot, truncateOutput } from '@nejcjelovcan/mcp-shared'

/**
 * Input schema for autofix tool (no parameters required)
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const autofixInputSchema: {} = {}

/**
 * Description for the autofix tool
 */
export const autofixDescription =
  'Automatically fix code quality issues by running lint:fix and format'

/**
 * Lint results from running lint:fix
 */
export interface LintResults {
  ran: boolean
  fixed: number
  errors: number
  output: string
}

/**
 * Format results from running format
 */
export interface FormatResults {
  ran: boolean
  formatted: number
  output: string
}

/**
 * Result type for autofix
 */
export interface AutofixResult {
  lintResults: LintResults
  formatResults: FormatResults
  ready: boolean
  nextSteps: string
}

/**
 * Parse lint:fix output to count fixed files
 */
function parseLintFixed(output: string): number {
  // ESLint outputs something like "✔ 3 problems (3 errors, 0 warnings) - 3 auto-fixable"
  // or when files are fixed, it may not output specific counts
  // We'll look for patterns in the output
  const fixedMatch = output.match(/(\d+)\s+(?:problem|error|warning)s?\s+.*fixed/i)
  if (fixedMatch?.[1]) {
    return parseInt(fixedMatch[1], 10)
  }

  // Alternative pattern: "✔ 3 files fixed"
  const filesFixedMatch = output.match(/(\d+)\s+files?\s+(?:auto-)?fixed/i)
  if (filesFixedMatch?.[1]) {
    return parseInt(filesFixedMatch[1], 10)
  }

  return 0
}

/**
 * Parse lint:fix stderr to count remaining errors
 */
function parseLintErrors(stderr: string): number {
  // Look for error count in stderr
  const errorMatch = stderr.match(/(\d+)\s+errors?/i)
  if (errorMatch?.[1]) {
    return parseInt(errorMatch[1], 10)
  }

  return 0
}

/**
 * Parse format output to count formatted files
 */
function parseFormatted(output: string): number {
  // Prettier doesn't always output counts in a standard format
  // We'll count lines that end with timestamp/file info
  // or look for explicit counts if available
  const lines = output.split('\n').filter((line) => line.trim().length > 0)

  // If output contains specific file paths, count them
  const fileCount = lines.filter((line) => {
    // Prettier typically outputs file paths or "Checking formatting..."
    return line.match(/\.(ts|tsx|js|jsx|json|md)/) !== null
  }).length

  if (fileCount > 0) {
    return fileCount
  }

  // Fallback: check for "X files formatted" or similar
  const formattedMatch = output.match(/(\d+)\s+files?\s+formatted/i)
  if (formattedMatch?.[1]) {
    return parseInt(formattedMatch[1], 10)
  }

  return 0
}

/**
 * Run lint:fix and format to automatically fix code quality issues
 *
 * Runs both commands sequentially, continuing even if linting has unfixable errors.
 * Returns structured results indicating whether code is ready to commit.
 *
 * @param _args - Tool input arguments (currently unused)
 */
export async function autofix(_args: object): Promise<AutofixResult> {
  const workspaceRoot = getWorkspaceRoot()

  const result: AutofixResult = {
    lintResults: {
      ran: false,
      fixed: 0,
      errors: 0,
      output: '',
    },
    formatResults: {
      ran: false,
      formatted: 0,
      output: '',
    },
    ready: false,
    nextSteps: '',
  }

  // Step 1: Run lint:fix
  try {
    const { stdout, stderr, exitCode } = await execCommand('pnpm lint:fix', workspaceRoot)

    const output = stdout + stderr
    const fixed = parseLintFixed(output)
    const errors = exitCode === 0 ? 0 : parseLintErrors(stderr)

    result.lintResults = {
      ran: true,
      fixed,
      errors,
      output: truncateOutput(output.trim(), 50),
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    result.lintResults = {
      ran: true,
      fixed: 0,
      errors: 1,
      output: `Failed to run lint:fix: ${message}`,
    }
  }

  // Step 2: Run format (even if linting failed)
  try {
    const { stdout, stderr, exitCode } = await execCommand('pnpm format', workspaceRoot)

    const output = stdout + stderr
    const formatted = parseFormatted(output)

    result.formatResults = {
      ran: true,
      formatted,
      output: truncateOutput(output.trim(), 50),
    }

    // If format failed but lint succeeded, mark as not ready
    if (exitCode !== 0 && result.lintResults.errors === 0) {
      result.lintResults.errors = 1
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    result.formatResults = {
      ran: true,
      formatted: 0,
      output: `Failed to run format: ${message}`,
    }
  }

  // Determine if code is ready to commit
  result.ready = result.lintResults.errors === 0

  // Generate helpful next steps
  if (result.ready) {
    const changes = []
    if (result.lintResults.fixed > 0) {
      changes.push(`${result.lintResults.fixed} linting issue(s) auto-fixed`)
    }
    if (result.formatResults.formatted > 0) {
      changes.push(`${result.formatResults.formatted} file(s) formatted`)
    }

    if (changes.length > 0) {
      result.nextSteps = `Code is ready. ${changes.join(', ')}. Stage changes with \`git add\` and commit.`
    } else {
      result.nextSteps = 'Code is ready. No issues found.'
    }
  } else {
    result.nextSteps = `Fix ${result.lintResults.errors} linting error(s) manually before committing. Run \`pnpm lint\` to see details.`
  }

  return result
}
