import { readFile, readdir } from 'node:fs/promises'
import { join, relative } from 'node:path'

import { getWorkspaceRoot } from './config.js'

/**
 * Description for the package-resolver utility module.
 */
export const packageResolverDescription =
  'Resolves package names from various shorthand forms to full scoped package names'

/**
 * Package type: either a package in packages directory or an app package in apps directory.
 */
export type PackageType = 'package' | 'app'

/**
 * Information about a workspace package.
 */
export interface PackageInfo {
  /** Full scoped package name (e.g., @myorg/my-package) */
  name: string
  /** Package type: 'package' or 'app' */
  type: PackageType
  /** Relative path from workspace root to the package directory */
  path: string
}

/**
 * Result of resolving a package name.
 */
export interface ResolvePackageResult {
  /** Whether the resolution was successful */
  resolved: boolean
  /** The full scoped package name (if resolved) */
  package?: string
  /** The package type (if resolved) */
  type?: PackageType
  /** The package path relative to workspace root (if resolved) */
  path?: string
  /** Error message (if not resolved) */
  error?: string
  /** List of valid packages (provided when resolution fails) */
  validPackages?: string[]
}

/**
 * Enumerate all workspace packages by scanning package.json files
 * in packages/ and apps/ directories.
 *
 * @returns Array of package information
 */
export async function enumerateWorkspacePackages(): Promise<PackageInfo[]> {
  const workspaceRoot = getWorkspaceRoot()
  const packages: PackageInfo[] = []

  // Scan packages
  const packagesPackages = await scanPackages(workspaceRoot)
  packages.push(...packagesPackages)

  // Scan app packages
  const appPackages = await scanAppPackages(workspaceRoot)
  packages.push(...appPackages)

  // Sort by name for consistent ordering
  return packages.sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Scan app packages in packages directory.
 */
async function scanPackages(workspaceRoot: string): Promise<PackageInfo[]> {
  const packagesDir = join(workspaceRoot, 'packages')
  const packages: PackageInfo[] = []

  // Get all package directories
  let apps: string[]
  try {
    const entries = await readdir(packagesDir, { withFileTypes: true })
    apps = entries
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
      .map((entry) => entry.name)
  } catch {
    return packages
  }

  for (const app of apps) {
    const pkgPath = join(packagesDir, app)
    const pkgJsonPath = join(pkgPath, 'package.json')

    try {
      const content = await readFile(pkgJsonPath, 'utf-8')
      const pkgJson = JSON.parse(content) as { name?: string }

      if (pkgJson.name !== undefined) {
        packages.push({
          name: pkgJson.name,
          type: 'package',
          path: relative(workspaceRoot, pkgPath),
        })
      }
    } catch {
      // Skip if package.json doesn't exist or is invalid
      continue
    }
  }

  return packages
}

/**
 * Scan app packages in apps directory.
 */
async function scanAppPackages(workspaceRoot: string): Promise<PackageInfo[]> {
  const appsDir = join(workspaceRoot, 'apps')
  const packages: PackageInfo[] = []

  // Get all app directories
  let apps: string[]
  try {
    const entries = await readdir(appsDir, { withFileTypes: true })
    apps = entries
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
      .map((entry) => entry.name)
  } catch {
    return packages
  }

  for (const app of apps) {
    const pkgPath = join(appsDir, app)
    const pkgJsonPath = join(pkgPath, 'package.json')

    try {
      const content = await readFile(pkgJsonPath, 'utf-8')
      const pkgJson = JSON.parse(content) as { name?: string }

      if (pkgJson.name !== undefined) {
        packages.push({
          name: pkgJson.name,
          type: 'app',
          path: relative(workspaceRoot, pkgPath),
        })
      }
    } catch {
      // Skip if package.json doesn't exist or is invalid
      continue
    }
  }

  return packages
}

/**
 * Resolve a package identifier to a full scoped package name.
 *
 * Resolution algorithm (applied in order):
 * 1. Full scoped name (exact match): @myorg/my-package
 * 2. Bare package name: my-package → tries @scope/my-package for each detected scope
 * 3. No match → error with list of valid packages
 *
 * @param input - The package identifier to resolve
 * @returns Resolution result with package name or error
 */
export async function resolvePackage(input: string): Promise<ResolvePackageResult> {
  // Handle empty input
  if (input === '') {
    const packages = await enumerateWorkspacePackages()
    return {
      resolved: false,
      error: 'Package name is required',
      validPackages: packages.map((p) => p.name),
    }
  }

  const packages = await enumerateWorkspacePackages()

  // 1. Try exact match (full scoped name)
  const exactMatch = packages.find((p) => p.name === input)
  if (exactMatch !== undefined) {
    return {
      resolved: true,
      package: exactMatch.name,
      type: exactMatch.type,
      path: exactMatch.path,
    }
  }

  // 2. Try bare package name with dynamically detected scopes
  // Extract scopes from enumerated packages
  const scopes = new Set<string>()
  for (const pkg of packages) {
    const match = pkg.name.match(/^(@[^/]+)\//)
    if (match?.[1]) scopes.add(match[1])
  }

  // Try each detected scope
  for (const scope of scopes) {
    const scopedName = `${scope}/${input}`
    const bareMatch = packages.find((p) => p.name === scopedName)
    if (bareMatch !== undefined) {
      return {
        resolved: true,
        package: bareMatch.name,
        type: bareMatch.type,
        path: bareMatch.path,
      }
    }
  }

  // 3. No match found
  return {
    resolved: false,
    error: `Unknown package: "${input}". Use a full scoped name (@scope/pkg) or a bare package name.`,
    validPackages: packages.map((p) => p.name),
  }
}
