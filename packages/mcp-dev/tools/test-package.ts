import { z } from 'zod'

import {
  type PackageScriptResult,
  resolvePackage,
  runTurboTaskForPackage,
} from '@nejcjelovcan/mcp-shared'

/**
 * Input schema for test_package tool.
 */
export const testPackageInputSchema = {
  package: z
    .string()
    .describe('Package to test. Accepts: full scoped name (@scope/pkg) or bare package name'),
}

/**
 * Description for the test_package tool.
 */
export const testPackageDescription =
  'Run tests for a single package using turbo. Builds upstream dependencies first.'

/**
 * Input arguments for testPackage function.
 */
export interface TestPackageInput {
  package: string
}

/**
 * Result type for testPackage.
 */
export type TestPackageResult =
  | PackageScriptResult
  | { resolved: false; error: string; validPackages: string[] }

/**
 * Run tests for a single package using turbo.
 *
 * @param args - Input arguments containing package identifier
 * @returns Result with exit code, output, and summary
 */
export async function testPackage(args: TestPackageInput): Promise<TestPackageResult> {
  // Resolve the package name
  const resolution = await resolvePackage(args.package)

  if (!resolution.resolved) {
    return {
      resolved: false,
      error: resolution.error ?? 'Unknown package',
      validPackages: resolution.validPackages ?? [],
    }
  }

  // Run turbo test
  return runTurboTaskForPackage(resolution.package!, 'test')
}
