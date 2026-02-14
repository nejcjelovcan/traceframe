import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { z } from 'zod'

import { getWorkspaceRoot, resolvePackage } from '@nejcjelovcan/mcp-shared'

/**
 * Scripts that have dedicated mcp-dev tools.
 * Agents should prefer the specialized tool over run_pnpm_script for these.
 */
const DEDICATED_TOOL_SCRIPTS: Record<string, string> = {
  build: 'build_package',
  test: 'test_package',
  'test:ci': 'test_package',
  typecheck: 'typecheck_package',
  'lint:fix': 'lint_fix_package',
  format: 'format_package',
}

/**
 * Input schema for list_package_scripts tool.
 */
export const listPackageScriptsInputSchema = {
  package: z
    .string()
    .optional()
    .describe(
      'Package to list scripts for. Accepts bare name or full scoped name. If omitted, lists scripts from root package.json.'
    ),
}

/**
 * Description for the list_package_scripts tool.
 */
export const listPackageScriptsDescription =
  'List all scripts defined in a package or root package.json. Shows which scripts have dedicated mcp-dev tools.'

/**
 * Input arguments for listPackageScripts function.
 */
export interface ListPackageScriptsInput {
  package?: string
}

/**
 * A script entry with metadata about dedicated tool availability.
 */
export interface ScriptEntry {
  name: string
  command: string
  dedicatedTool: string | null
}

/**
 * Result type for listPackageScripts.
 */
export type ListPackageScriptsResult =
  | {
      package: string | null
      scripts: ScriptEntry[]
      summary: string
    }
  | { resolved: false; error: string; validPackages: string[] }

/**
 * List all scripts defined in a package or root package.json.
 *
 * @param args - Input arguments containing optional package identifier
 * @returns Result with script entries and metadata
 */
export async function listPackageScripts(
  args: ListPackageScriptsInput
): Promise<ListPackageScriptsResult> {
  const workspaceRoot = getWorkspaceRoot()
  let resolvedPackage: string | null = null
  let packageJsonPath: string

  if (args.package !== undefined && args.package !== '') {
    const resolution = await resolvePackage(args.package)

    if (!resolution.resolved) {
      return {
        resolved: false,
        error: resolution.error ?? 'Unknown package',
        validPackages: resolution.validPackages ?? [],
      }
    }

    resolvedPackage = resolution.package!
    packageJsonPath = join(workspaceRoot, resolution.path!, 'package.json')
  } else {
    packageJsonPath = join(workspaceRoot, 'package.json')
  }

  const raw = await readFile(packageJsonPath, 'utf-8')
  const parsed = JSON.parse(raw) as { scripts?: Record<string, string> }
  const scripts = parsed.scripts ?? {}

  const entries: ScriptEntry[] = Object.entries(scripts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, command]) => ({
      name,
      command,
      dedicatedTool: DEDICATED_TOOL_SCRIPTS[name] ?? null,
    }))

  const target = resolvedPackage ?? 'workspace root'
  const dedicatedCount = entries.filter((e) => e.dedicatedTool !== null).length
  let summary = `${entries.length} script(s) in ${target}`
  if (dedicatedCount > 0) {
    summary += `. ${dedicatedCount} have dedicated mcp-dev tools (prefer those over run_pnpm_script).`
  }

  return {
    package: resolvedPackage,
    scripts: entries,
    summary,
  }
}
