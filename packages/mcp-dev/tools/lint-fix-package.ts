import { z } from 'zod'

import {
  type PackageScriptResult,
  resolvePackage,
  runTurboTaskForPackage,
} from '@nejcjelovcan/mcp-shared'

/**
 * Input schema for lint_fix_package tool.
 */
export const lintFixPackageInputSchema = {
  package: z
    .string()
    .describe(
      'Package to lint and fix. Accepts: full scoped name (@scope/pkg) or bare package name'
    ),
}

/**
 * Description for the lint_fix_package tool.
 */
export const lintFixPackageDescription =
  'Run lint:fix for a single package using turbo. Automatically fixes linting issues.'

/**
 * Input arguments for lintFixPackage function.
 */
export interface LintFixPackageInput {
  package: string
}

/**
 * Result type for lintFixPackage.
 */
export type LintFixPackageResult =
  | PackageScriptResult
  | { resolved: false; error: string; validPackages: string[] }

/**
 * Run lint:fix for a single package using turbo.
 *
 * @param args - Input arguments containing package identifier
 * @returns Result with exit code, output, and summary
 */
export async function lintFixPackage(args: LintFixPackageInput): Promise<LintFixPackageResult> {
  // Resolve the package name
  const resolution = await resolvePackage(args.package)

  if (!resolution.resolved) {
    return {
      resolved: false,
      error: resolution.error ?? 'Unknown package',
      validPackages: resolution.validPackages ?? [],
    }
  }

  // Run turbo lint:fix
  return runTurboTaskForPackage(resolution.package!, 'lint:fix')
}
