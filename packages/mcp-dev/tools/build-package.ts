import { z } from 'zod'

import {
  type PackageScriptResult,
  resolvePackage,
  runTurboTaskForPackage,
} from '@nejcjelovcan/mcp-shared'

/**
 * Input schema for build_package tool.
 */
export const buildPackageInputSchema = {
  package: z
    .string()
    .describe('Package to build. Accepts: full scoped name (@scope/pkg) or bare package name'),
}

/**
 * Description for the build_package tool.
 */
export const buildPackageDescription =
  'Build a single package using turbo. Runs upstream dependencies first via turbo pipeline.'

/**
 * Input arguments for buildPackage function.
 */
export interface BuildPackageInput {
  package: string
}

/**
 * Result type for buildPackage.
 */
export type BuildPackageResult =
  | PackageScriptResult
  | { resolved: false; error: string; validPackages: string[] }

/**
 * Build a single package using turbo.
 *
 * @param args - Input arguments containing package identifier
 * @returns Result with exit code, output, and summary
 */
export async function buildPackage(args: BuildPackageInput): Promise<BuildPackageResult> {
  // Resolve the package name
  const resolution = await resolvePackage(args.package)

  if (!resolution.resolved) {
    return {
      resolved: false,
      error: resolution.error ?? 'Unknown package',
      validPackages: resolution.validPackages ?? [],
    }
  }

  // Run turbo build
  return runTurboTaskForPackage(resolution.package!, 'build')
}
