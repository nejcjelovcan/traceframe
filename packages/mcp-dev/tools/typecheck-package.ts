import { z } from 'zod'

import {
  type PackageScriptResult,
  resolvePackage,
  runTurboTaskForPackage,
} from '@nejcjelovcan/mcp-shared'

/**
 * Input schema for typecheck_package tool.
 */
export const typecheckPackageInputSchema = {
  package: z
    .string()
    .describe('Package to typecheck. Accepts: full scoped name (@scope/pkg) or bare package name'),
}

/**
 * Description for the typecheck_package tool.
 */
export const typecheckPackageDescription =
  'Typecheck a single package using turbo. Builds upstream dependencies first.'

/**
 * Input arguments for typecheckPackage function.
 */
export interface TypecheckPackageInput {
  package: string
}

/**
 * Result type for typecheckPackage.
 */
export type TypecheckPackageResult =
  | PackageScriptResult
  | { resolved: false; error: string; validPackages: string[] }

/**
 * Typecheck a single package using turbo.
 *
 * @param args - Input arguments containing package identifier
 * @returns Result with exit code, output, and summary
 */
export async function typecheckPackage(
  args: TypecheckPackageInput
): Promise<TypecheckPackageResult> {
  // Resolve the package name
  const resolution = await resolvePackage(args.package)

  if (!resolution.resolved) {
    return {
      resolved: false,
      error: resolution.error ?? 'Unknown package',
      validPackages: resolution.validPackages ?? [],
    }
  }

  // Run turbo typecheck
  return runTurboTaskForPackage(resolution.package!, 'typecheck')
}
