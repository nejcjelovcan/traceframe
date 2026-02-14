import { z } from 'zod'

import { enumerateWorkspacePackages, execCommand, getWorkspaceRoot } from '@nejcjelovcan/mcp-shared'

/**
 * Input schema for get_changed_packages tool.
 */
export const getChangedPackagesInputSchema = {
  since: z
    .string()
    .optional()
    .describe('Git ref to compare against (default: uncommitted changes only)'),
  includeUntracked: z.boolean().optional().describe('Include untracked files (default: true)'),
}

/**
 * Description for the get_changed_packages tool.
 */
export const getChangedPackagesDescription =
  'List packages affected by uncommitted changes or changes since a specific git ref'

/**
 * Input arguments for getChangedPackages function.
 */
export interface GetChangedPackagesInput {
  since?: string
  includeUntracked?: boolean
}

/**
 * Result type for getChangedPackages.
 */
export interface GetChangedPackagesResult {
  success: boolean
  packages: string[]
  files: Record<string, string[]>
  rootFiles: string[]
  summary: string
  error?: string | undefined
}

/**
 * Get list of changed files from git.
 *
 * @param workspaceRoot - The workspace root directory
 * @param since - Git ref to compare against (optional)
 * @param includeUntracked - Whether to include untracked files
 * @returns Array of changed file paths relative to workspace root
 */
async function getChangedFiles(
  workspaceRoot: string,
  since?: string,
  includeUntracked?: boolean
): Promise<{ files: string[]; error?: string }> {
  const files = new Set<string>()

  if (since !== undefined) {
    // Changes since a specific ref
    const { stdout, exitCode, stderr } = await execCommand(
      `git diff --name-only ${since}`,
      workspaceRoot
    )
    if (exitCode !== 0) {
      return { files: [], error: `git diff failed: ${stderr || stdout}` }
    }
    for (const file of stdout.split('\n').filter((f) => f.trim() !== '')) {
      files.add(file)
    }
  } else {
    // Uncommitted changes: staged
    const stagedResult = await execCommand('git diff --name-only --cached', workspaceRoot)
    if (stagedResult.exitCode !== 0) {
      return {
        files: [],
        error: `git diff --cached failed: ${stagedResult.stderr || stagedResult.stdout}`,
      }
    }
    for (const file of stagedResult.stdout.split('\n').filter((f) => f.trim() !== '')) {
      files.add(file)
    }

    // Uncommitted changes: unstaged
    const unstagedResult = await execCommand('git diff --name-only', workspaceRoot)
    if (unstagedResult.exitCode !== 0) {
      return {
        files: [],
        error: `git diff failed: ${unstagedResult.stderr || unstagedResult.stdout}`,
      }
    }
    for (const file of unstagedResult.stdout.split('\n').filter((f) => f.trim() !== '')) {
      files.add(file)
    }
  }

  // Untracked files (default: include)
  if (includeUntracked !== false) {
    const untrackedResult = await execCommand(
      'git ls-files --others --exclude-standard',
      workspaceRoot
    )
    if (untrackedResult.exitCode !== 0) {
      return {
        files: [],
        error: `git ls-files failed: ${untrackedResult.stderr || untrackedResult.stdout}`,
      }
    }
    for (const file of untrackedResult.stdout.split('\n').filter((f) => f.trim() !== '')) {
      files.add(file)
    }
  }

  return { files: Array.from(files) }
}

/**
 * List packages affected by uncommitted changes or changes since a specific git ref.
 *
 * @param args - Input arguments containing since ref and includeUntracked flag
 * @returns Result with packages, files, rootFiles, and summary
 */
export async function getChangedPackages(
  args: GetChangedPackagesInput
): Promise<GetChangedPackagesResult> {
  const workspaceRoot = getWorkspaceRoot()

  // Get changed files from git
  const { files, error } = await getChangedFiles(workspaceRoot, args.since, args.includeUntracked)

  if (error !== undefined) {
    return {
      success: false,
      packages: [],
      files: {},
      rootFiles: [],
      summary: `Failed to get changed files: ${error}`,
      error,
    }
  }

  // No changes
  if (files.length === 0) {
    return {
      success: true,
      packages: [],
      files: {},
      rootFiles: [],
      summary: 'No changes detected',
    }
  }

  // Get all workspace packages
  const packages = await enumerateWorkspacePackages()

  // Sort packages by path length (longest first) to match most specific package
  const sortedPackages = [...packages].sort((a, b) => b.path.length - a.path.length)

  // Map files to packages
  const packageFiles: Record<string, string[]> = {}
  const rootFiles: string[] = []

  for (const file of files) {
    let matched = false

    for (const pkg of sortedPackages) {
      // Check if file path starts with package path
      if (file.startsWith(pkg.path + '/')) {
        // Store file path relative to package root
        const relativeFile = file.slice(pkg.path.length + 1)
        const existingFiles = packageFiles[pkg.name]
        if (existingFiles !== undefined) {
          existingFiles.push(relativeFile)
        } else {
          packageFiles[pkg.name] = [relativeFile]
        }
        matched = true
        break
      }
    }

    if (!matched) {
      rootFiles.push(file)
    }
  }

  // Get sorted list of affected package names
  const affectedPackages = Object.keys(packageFiles).sort()

  // Build summary
  let summary: string
  if (affectedPackages.length === 0) {
    if (rootFiles.length > 0) {
      summary = `No packages affected, ${rootFiles.length} root file(s) changed`
    } else {
      summary = 'No changes detected'
    }
  } else if (affectedPackages.length === 1) {
    summary = `1 package changed: ${affectedPackages[0]}`
  } else {
    summary = `${affectedPackages.length} packages changed: ${affectedPackages.join(', ')}`
  }

  if (rootFiles.length > 0 && affectedPackages.length > 0) {
    summary += ` (+ ${rootFiles.length} root file(s))`
  }

  return {
    success: true,
    packages: affectedPackages,
    files: packageFiles,
    rootFiles,
    summary,
  }
}
