import { z } from 'zod'

import {
  type PackageScriptResult,
  resolvePackage,
  runTurboTaskForPackage,
} from '@nejcjelovcan/mcp-shared'

/**
 * Input schema for format_package tool.
 */
export const formatPackageInputSchema = {
  package: z
    .string()
    .describe('Package to format. Accepts: full scoped name (@scope/pkg) or bare package name'),
}

/**
 * Description for the format_package tool.
 */
export const formatPackageDescription =
  'Format code for a single package using turbo. Runs prettier on source files.'

/**
 * Input arguments for formatPackage function.
 */
export interface FormatPackageInput {
  package: string
}

/**
 * Result type for formatPackage.
 */
export type FormatPackageResult =
  | PackageScriptResult
  | { resolved: false; error: string; validPackages: string[] }

/**
 * Format code for a single package using turbo.
 *
 * @param args - Input arguments containing package identifier
 * @returns Result with exit code, output, and summary
 */
export async function formatPackage(args: FormatPackageInput): Promise<FormatPackageResult> {
  // Resolve the package name
  const resolution = await resolvePackage(args.package)

  if (!resolution.resolved) {
    return {
      resolved: false,
      error: resolution.error ?? 'Unknown package',
      validPackages: resolution.validPackages ?? [],
    }
  }

  // Run turbo format
  return runTurboTaskForPackage(resolution.package!, 'format')
}
