#!/usr/bin/env tsx
/**
 * CI script for validating token definition files for structural consistency.
 * Wraps the mcp-ui validateTokenDefinitionsTool for use outside of MCP context.
 */

import { validateTokenDefinitionsTool } from '../packages/mcp-ui/tools/validate-token-definitions.js'

async function main() {
  const args = process.argv.slice(2)
  const report = args.includes('--report=detailed') ? 'detailed' : 'summary'

  console.log('Validating token definition files...\n')

  const result = await validateTokenDefinitionsTool({ report })

  // Print results
  for (const validationResult of result.results) {
    const status = validationResult.passed ? '\x1b[32m\u2713\x1b[0m' : '\x1b[31m\u2717\x1b[0m'
    console.log(`${status} ${validationResult.sourceFile} -> ${validationResult.targetFile}`)

    if (!validationResult.passed && validationResult.mismatches.length > 0) {
      if (report === 'detailed') {
        for (const mismatch of validationResult.mismatches) {
          console.log(`    \x1b[33m${mismatch.type}\x1b[0m at ${mismatch.path}`)
          if (mismatch.expected !== undefined) {
            console.log(`      Expected: ${mismatch.expected}`)
          }
          if (mismatch.actual !== undefined) {
            console.log(`      Actual:   ${mismatch.actual}`)
          }
        }
      } else {
        console.log(`    ${validationResult.mismatches.length} mismatch(es) found`)
        const examples = validationResult.mismatches.slice(0, 3)
        for (const mismatch of examples) {
          console.log(`    - ${mismatch.type}: ${mismatch.path}`)
        }
        if (validationResult.mismatches.length > 3) {
          console.log(`    ... and ${validationResult.mismatches.length - 3} more`)
        }
      }
    }
  }

  console.log('')
  console.log(
    `Validated ${result.summary.totalCategories} file pairs: ${result.summary.passedCategories} passed, ${result.summary.totalCategories - result.summary.passedCategories} failed`
  )

  if (!result.passed) {
    console.log(
      `\n\x1b[31mValidation failed with ${result.summary.totalMismatches} total mismatch(es)\x1b[0m`
    )
    process.exit(1)
  } else {
    console.log('\n\x1b[32mAll token definitions are consistent!\x1b[0m')
  }
}

main().catch((error: unknown) => {
  console.error('Error:', error)
  process.exit(1)
})
