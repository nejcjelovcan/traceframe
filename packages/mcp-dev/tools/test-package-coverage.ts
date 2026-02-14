import { z } from 'zod'

import {
  type PackageScriptResult,
  resolvePackage,
  runTurboTaskForPackage,
} from '@nejcjelovcan/mcp-shared'

/**
 * Input schema for test_package_coverage tool.
 */
export const testPackageCoverageInputSchema = {
  package: z
    .string()
    .describe(
      'Package to test with coverage. Accepts: full scoped name (@scope/pkg) or bare package name'
    ),
}

/**
 * Description for the test_package_coverage tool.
 */
export const testPackageCoverageDescription =
  'Run tests with coverage report for a single package using turbo (test:ci). Useful before PRs.'

/**
 * Input arguments for testPackageCoverage function.
 */
export interface TestPackageCoverageInput {
  package: string
}

/**
 * Result type for testPackageCoverage.
 */
export type TestPackageCoverageResult =
  | PackageScriptResult
  | { resolved: false; error: string; validPackages: string[] }

/**
 * Run tests with coverage for a single package using turbo.
 *
 * @param args - Input arguments containing package identifier
 * @returns Result with exit code, output, and summary
 */
export async function testPackageCoverage(
  args: TestPackageCoverageInput
): Promise<TestPackageCoverageResult> {
  // Resolve the package name
  const resolution = await resolvePackage(args.package)

  if (!resolution.resolved) {
    return {
      resolved: false,
      error: resolution.error ?? 'Unknown package',
      validPackages: resolution.validPackages ?? [],
    }
  }

  // Run turbo test:ci
  return runTurboTaskForPackage(resolution.package!, 'test:ci')
}
