import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'

/**
 * Workspace root markers to search for.
 * These files indicate the root of a pnpm/turbo monorepo.
 *
 * Note: .git is excluded to avoid incorrect detection in git submodules.
 * The monorepo structure (pnpm-workspace.yaml, turbo.json) is more reliable.
 */
const WORKSPACE_MARKERS = ['pnpm-workspace.yaml', 'turbo.json'] as const

/**
 * Find the workspace root by searching upward for marker files.
 * Starts from the current directory and walks up the directory tree.
 *
 * @throws {Error} If workspace root cannot be found
 */
function findWorkspaceRoot(startDir: string = import.meta.dirname): string {
  let currentDir = startDir

  // Limit search to 10 levels to prevent infinite loops
  for (let i = 0; i < 10; i++) {
    // Check if any workspace marker exists in the current directory
    for (const marker of WORKSPACE_MARKERS) {
      if (existsSync(join(currentDir, marker))) {
        return currentDir
      }
    }

    // Move up one directory
    const parentDir = dirname(currentDir)

    // If we've reached the root, stop
    if (parentDir === currentDir) {
      break
    }

    currentDir = parentDir
  }

  throw new Error(
    `Workspace root not found. Searched upward from ${startDir} for markers: ${WORKSPACE_MARKERS.join(', ')}`
  )
}

/**
 * Cached workspace root path.
 * Computed once on first access from import.meta.dirname.
 *
 * Note: This cache is never invalidated and always searches from the same start directory.
 * This is intentional for the MCP server context where the workspace location is stable.
 * For testing scenarios that require different workspace roots, tests should mock this module
 * or use separate test processes.
 */
let cachedWorkspaceRoot: string | undefined

/**
 * Get the absolute path to the workspace root directory.
 * Searches upward for workspace markers (pnpm-workspace.yaml, turbo.json).
 *
 * This function caches the result on first call and always searches from the
 * directory containing this config module (import.meta.dirname). The cache is
 * never invalidated, which is appropriate for the MCP server's stable runtime context.
 *
 * @throws {Error} If workspace root cannot be found
 */
export function getWorkspaceRoot(): string {
  if (cachedWorkspaceRoot === undefined) {
    cachedWorkspaceRoot = findWorkspaceRoot()
  }
  return cachedWorkspaceRoot
}
