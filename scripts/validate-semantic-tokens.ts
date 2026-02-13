#!/usr/bin/env tsx
/**
 * CI script for validating semantic token usage across the codebase.
 * Wraps the mcp-ui validateTokensTool for use outside of MCP context.
 */

import { validateTokensTool } from '../packages/mcp-ui/tools/validate-tokens.js'

async function main() {
  const args = process.argv.slice(2)
  const report = args.includes('--report=detailed') ? 'detailed' : 'summary'

  const result = await validateTokensTool({ report })

  if (result.summary.totalViolations > 0) {
    console.log(`Found ${result.summary.totalViolations} non-semantic token violation(s) in ${result.summary.filesWithViolations} file(s).`)

    if (result.suggestions.length > 0) {
      console.log('\nTop suggestions:')
      for (const s of result.suggestions.slice(0, 10)) {
        console.log(`  ${s.from} -> ${s.to} (${s.count} occurrences)`)
      }
    }

    // display all violations if detailed report is requested
    if (report === 'detailed') {
      console.log('\nViolations:')
      for (const v of result.violations) {
        console.log(`  ${v.file}:${v.line}:${v.column} - ${v.className} (${v.context})${v.suggestion ? ` - Suggestion: ${v.suggestion}` : ''}`)
      }
    }


    console.log("\nRun 'pnpm tsx scripts/migrate-semantic-tokens.ts' to migrate automatically.")
    process.exit(1)
  }

  console.log(
    `Checked ${result.summary.totalFiles} files - all semantic token checks passed.`
  )
}

main().catch((err: unknown) => {
  console.error(err)
  process.exit(1)
})
