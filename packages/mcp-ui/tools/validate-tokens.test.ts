import { mkdtemp, rm, writeFile, mkdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, it, expect, beforeEach, afterEach } from 'vitest'

import { validateTokensTool } from './validate-tokens'

describe('validateTokensTool', () => {
  let tempDir: string

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'validate-tokens-test-'))
  })

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true })
  })

  it('should detect non-semantic color classes in TSX files', async () => {
    const testFile = join(tempDir, 'component.tsx')
    await writeFile(
      testFile,
      `
import React from 'react'

export function TestComponent() {
  return (
    <div className="bg-neutral-100 text-primary-500 border-error-700">
      <span className="hover:bg-neutral-50 text-neutral-900">Test</span>
    </div>
  )
}
    `.trim(),
      'utf-8'
    )

    const result = await validateTokensTool({ path: tempDir })

    expect(result.summary.totalViolations).toBe(5)
    expect(result.summary.filesWithViolations).toBe(1)
    expect(result.violations).toHaveLength(5)

    const classNames = result.violations.map((v) => v.className)
    expect(classNames).toContain('bg-neutral-100')
    expect(classNames).toContain('text-primary-500')
    expect(classNames).toContain('border-error-700')
    expect(classNames).toContain('hover:bg-neutral-50')
    expect(classNames).toContain('text-neutral-900')

    // All color violations should be errors
    for (const v of result.violations) {
      expect(v.type).toBe('color')
      expect(v.severity).toBe('error')
    }
  })

  it('should provide migration suggestions', async () => {
    const testFile = join(tempDir, 'component.tsx')
    await writeFile(
      testFile,
      `
export function Component() {
  return <div className="bg-neutral-100 text-neutral-500 border-neutral-200" />
}
    `.trim(),
      'utf-8'
    )

    const result = await validateTokensTool({ path: tempDir })

    expect(result.violations[0]!.suggestion).toBeDefined()
    expect(result.violations[1]!.suggestion).toBeDefined()
    expect(result.violations[2]!.suggestion).toBeDefined()
  })

  it('should detect classes in cn/clsx function calls', async () => {
    const testFile = join(tempDir, 'component.tsx')
    await writeFile(
      testFile,
      `
import { cn } from './utils'

export function Component({ active }: { active: boolean }) {
  return (
    <div className={cn('bg-white', active && 'bg-primary-500')}>
      Test
    </div>
  )
}
    `.trim(),
      'utf-8'
    )

    const result = await validateTokensTool({ path: tempDir })

    expect(result.summary.totalViolations).toBe(2)
    const classNames = result.violations.map((v) => v.className)
    expect(classNames).toContain('bg-white')
    expect(classNames).toContain('bg-primary-500')
  })

  it('should detect dark mode prefixed classes', async () => {
    const testFile = join(tempDir, 'component.tsx')
    await writeFile(
      testFile,
      `
export function Component() {
  return <div className="bg-white dark:bg-neutral-950" />
}
    `.trim(),
      'utf-8'
    )

    const result = await validateTokensTool({ path: tempDir })

    expect(result.summary.totalViolations).toBe(2)
    const classNames = result.violations.map((v) => v.className)
    expect(classNames).toContain('bg-white')
    expect(classNames).toContain('dark:bg-neutral-950')
  })

  it('should handle template literals', async () => {
    const testFile = join(tempDir, 'component.tsx')
    await writeFile(
      testFile,
      `
export function Component({ status }: { status: string }) {
  return (
    <div className={\`bg-neutral-100 \${status === 'error' ? 'text-error-700' : 'text-success-700'}\`}>
      Test
    </div>
  )
}
    `.trim(),
      'utf-8'
    )

    const result = await validateTokensTool({ path: tempDir })

    expect(result.summary.totalViolations).toBeGreaterThan(0)
    const classNames = result.violations.map((v) => v.className)
    expect(classNames).toContain('bg-neutral-100')
  })

  it('should exclude test files by default', async () => {
    const componentFile = join(tempDir, 'component.tsx')
    const testFile = join(tempDir, 'component.test.tsx')

    await writeFile(componentFile, '<div className="bg-neutral-100" />', 'utf-8')
    await writeFile(testFile, '<div className="bg-primary-500" />', 'utf-8')

    const result = await validateTokensTool({ path: tempDir })

    expect(result.summary.totalFiles).toBe(1)
    expect(result.violations).toHaveLength(1)
    expect(result.violations[0]!.className).toBe('bg-neutral-100')
  })

  it('should include test files when requested', async () => {
    const componentFile = join(tempDir, 'component.tsx')
    const testFile = join(tempDir, 'component.test.tsx')

    await writeFile(componentFile, '<div className="bg-neutral-100" />', 'utf-8')
    await writeFile(testFile, '<div className="bg-primary-500" />', 'utf-8')

    const result = await validateTokensTool({ path: tempDir, includeTests: true })

    expect(result.summary.totalFiles).toBe(2)
    expect(result.violations).toHaveLength(2)
  })

  it('should ignore semantic tokens', async () => {
    const testFile = join(tempDir, 'component.tsx')
    await writeFile(
      testFile,
      `
export function Component() {
  return (
    <div className="bg-surface text-foreground border-border">
      <span className="bg-surface-muted text-foreground-muted">Test</span>
      <button className="hover:bg-interactive-hover bg-interactive-active">Click</button>
    </div>
  )
}
    `.trim(),
      'utf-8'
    )

    const result = await validateTokensTool({ path: tempDir })

    expect(result.summary.totalViolations).toBe(0)
    expect(result.violations).toHaveLength(0)
  })

  it('should generate migration suggestions summary', async () => {
    const file1 = join(tempDir, 'comp1.tsx')
    const file2 = join(tempDir, 'comp2.tsx')

    await writeFile(file1, '<div className="bg-neutral-100 text-neutral-500" />', 'utf-8')
    await writeFile(file2, '<div className="bg-neutral-100 border-neutral-200" />', 'utf-8')

    const result = await validateTokensTool({ path: tempDir })

    expect(result.suggestions).toHaveLength(3)

    const bgSuggestion = result.suggestions.find((s) => s.from === 'bg-neutral-100')
    expect(bgSuggestion).toBeDefined()
    expect(bgSuggestion?.to).toBeDefined()
    expect(bgSuggestion?.count).toBe(2)
    expect(bgSuggestion?.files).toHaveLength(2)
  })

  it('should return limited violations in summary mode', async () => {
    const testFile = join(tempDir, 'component.tsx')
    const violations = [
      'bg-neutral-50',
      'bg-neutral-100',
      'bg-neutral-200',
      'bg-neutral-300',
      'bg-neutral-400',
      'bg-neutral-500',
      'bg-neutral-600',
      'bg-neutral-700',
      'bg-neutral-800',
      'bg-neutral-900',
      'bg-primary-50',
      'bg-primary-100',
      'bg-primary-200',
      'bg-primary-300',
      'bg-primary-400',
      'bg-primary-500',
      'bg-primary-600',
      'bg-primary-700',
      'bg-primary-800',
      'bg-primary-900',
    ]

    await writeFile(testFile, `<div className="${violations.join(' ')}" />`, 'utf-8')

    const result = await validateTokensTool({ path: tempDir, report: 'summary' })

    expect(result.summary.totalViolations).toBe(20)
    expect(result.violations).toHaveLength(10) // Limited to 10 in summary mode
  })

  it('should return all violations in detailed mode', async () => {
    const testFile = join(tempDir, 'component.tsx')
    const violations = [
      'bg-neutral-50',
      'bg-neutral-100',
      'bg-neutral-200',
      'bg-neutral-300',
      'bg-neutral-400',
      'bg-neutral-500',
      'bg-neutral-600',
      'bg-neutral-700',
      'bg-neutral-800',
      'bg-neutral-900',
      'bg-primary-50',
      'bg-primary-100',
      'bg-primary-200',
      'bg-primary-300',
      'bg-primary-400',
      'bg-primary-500',
      'bg-primary-600',
      'bg-primary-700',
      'bg-primary-800',
      'bg-primary-900',
    ]

    await writeFile(testFile, `<div className="${violations.join(' ')}" />`, 'utf-8')

    const result = await validateTokensTool({ path: tempDir, report: 'detailed' })

    expect(result.summary.totalViolations).toBe(20)
    expect(result.violations).toHaveLength(20) // All violations in detailed mode
  })

  it('should handle nested directories', async () => {
    const nestedDir = join(tempDir, 'components', 'ui')
    await mkdir(nestedDir, { recursive: true })

    const file1 = join(tempDir, 'app.tsx')
    const file2 = join(nestedDir, 'button.tsx')

    await writeFile(file1, '<div className="bg-neutral-100" />', 'utf-8')
    await writeFile(file2, '<button className="text-primary-500" />', 'utf-8')

    const result = await validateTokensTool({ path: tempDir })

    expect(result.summary.totalFiles).toBe(2)
    expect(result.summary.filesWithViolations).toBe(2)
    expect(result.summary.totalViolations).toBe(2)
  })

  it('should detect --palette-* CSS variable usage', async () => {
    const testFile = join(tempDir, 'component.tsx')
    await writeFile(
      testFile,
      `
export function Component() {
  return (
    <div style={{ backgroundColor: 'rgb(var(--palette-primary-500))' }}>
      <span style={{ color: 'var(--palette-neutral-900)' }}>Test</span>
    </div>
  )
}
    `.trim(),
      'utf-8'
    )

    const result = await validateTokensTool({ path: tempDir })

    expect(result.summary.totalViolations).toBe(2)
    const classNames = result.violations.map((v) => v.className)
    expect(classNames).toContain('--palette-primary-500')
    expect(classNames).toContain('--palette-neutral-900')
  })

  it('should detect both Tailwind classes and --palette-* vars in same file', async () => {
    const testFile = join(tempDir, 'component.tsx')
    await writeFile(
      testFile,
      `
export function Component() {
  return (
    <div className="bg-neutral-100" style={{ borderColor: 'rgb(var(--palette-error-500))' }}>
      Test
    </div>
  )
}
    `.trim(),
      'utf-8'
    )

    const result = await validateTokensTool({ path: tempDir })

    expect(result.summary.totalViolations).toBe(2)
    const classNames = result.violations.map((v) => v.className)
    expect(classNames).toContain('bg-neutral-100')
    expect(classNames).toContain('--palette-error-500')
  })

  it('should detect non-semantic spacing classes', async () => {
    const testFile = join(tempDir, 'component.tsx')
    await writeFile(
      testFile,
      `
export function Component() {
  return (
    <div className="p-4 gap-2 mx-8">
      <span className="py-1 space-x-4">Test</span>
    </div>
  )
}
    `.trim(),
      'utf-8'
    )

    const result = await validateTokensTool({ path: tempDir })

    expect(result.summary.totalViolations).toBe(5)
    const classNames = result.violations.map((v) => v.className)
    expect(classNames).toContain('p-4')
    expect(classNames).toContain('gap-2')
    expect(classNames).toContain('mx-8')
    expect(classNames).toContain('py-1')
    expect(classNames).toContain('space-x-4')

    // All spacing violations should be warnings
    for (const v of result.violations) {
      expect(v.type).toBe('spacing')
      expect(v.severity).toBe('warning')
    }
  })

  it('should detect non-semantic sizing classes in element range', async () => {
    const testFile = join(tempDir, 'component.tsx')
    await writeFile(
      testFile,
      `
export function Component() {
  return (
    <div className="h-8 w-10">
      <span className="min-h-6 max-w-12">Test</span>
    </div>
  )
}
    `.trim(),
      'utf-8'
    )

    const result = await validateTokensTool({ path: tempDir })

    expect(result.summary.totalViolations).toBe(4)
    const classNames = result.violations.map((v) => v.className)
    expect(classNames).toContain('h-8')
    expect(classNames).toContain('w-10')
    expect(classNames).toContain('min-h-6')
    expect(classNames).toContain('max-w-12')

    // All sizing violations should be warnings
    for (const v of result.violations) {
      expect(v.type).toBe('sizing')
      expect(v.severity).toBe('warning')
    }
  })

  it('should NOT flag semantic spacing and sizing classes', async () => {
    const testFile = join(tempDir, 'component.tsx')
    await writeFile(
      testFile,
      `
export function Component() {
  return (
    <div className="p-md gap-sm m-lg h-size-sm w-size-md">
      <span className="p-base gap-xs py-2xs">Test</span>
    </div>
  )
}
    `.trim(),
      'utf-8'
    )

    const result = await validateTokensTool({ path: tempDir })
    expect(result.summary.totalViolations).toBe(0)
  })

  it('should NOT flag zero, px, keyword, fractional, or arbitrary spacing/sizing values', async () => {
    const testFile = join(tempDir, 'component.tsx')
    await writeFile(
      testFile,
      `
export function Component() {
  return (
    <div className="p-0 gap-0 m-px w-full h-screen w-auto h-fit w-1/2 h-[50%] p-[20px]">
      Test
    </div>
  )
}
    `.trim(),
      'utf-8'
    )

    const result = await validateTokensTool({ path: tempDir })
    expect(result.summary.totalViolations).toBe(0)
  })

  it('should NOT flag large layout dimensions', async () => {
    const testFile = join(tempDir, 'component.tsx')
    await writeFile(
      testFile,
      `
export function Component() {
  return <div className="w-48 w-64 w-96 h-24 h-32" />
}
    `.trim(),
      'utf-8'
    )

    const result = await validateTokensTool({ path: tempDir })
    expect(result.summary.totalViolations).toBe(0)
  })

  it('should provide spacing suggestions with exact matches', async () => {
    const testFile = join(tempDir, 'component.tsx')
    await writeFile(
      testFile,
      `
export function Component() {
  return <div className="p-4 gap-2 mx-8" />
}
    `.trim(),
      'utf-8'
    )

    const result = await validateTokensTool({ path: tempDir, report: 'detailed' })

    const p4 = result.violations.find((v) => v.className === 'p-4')
    expect(p4?.suggestion).toBe('p-base')

    const gap2 = result.violations.find((v) => v.className === 'gap-2')
    expect(gap2?.suggestion).toBe('gap-sm')

    const mx8 = result.violations.find((v) => v.className === 'mx-8')
    expect(mx8?.suggestion).toBe('mx-lg')
  })

  it('should provide sizing suggestions with exact matches', async () => {
    const testFile = join(tempDir, 'component.tsx')
    await writeFile(
      testFile,
      `
export function Component() {
  return <div className="h-8 w-10 min-h-6" />
}
    `.trim(),
      'utf-8'
    )

    const result = await validateTokensTool({ path: tempDir, report: 'detailed' })

    const h8 = result.violations.find((v) => v.className === 'h-8')
    expect(h8?.suggestion).toBe('h-size-sm')

    const w10 = result.violations.find((v) => v.className === 'w-10')
    expect(w10?.suggestion).toBe('w-size-md')

    const minH6 = result.violations.find((v) => v.className === 'min-h-6')
    expect(minH6?.suggestion).toBe('min-h-size-xs')
  })

  it('should provide nearest-match suggestions for non-exact spacing values', async () => {
    const testFile = join(tempDir, 'component.tsx')
    await writeFile(
      testFile,
      `
export function Component() {
  return <div className="p-5" />
}
    `.trim(),
      'utf-8'
    )

    const result = await validateTokensTool({ path: tempDir, report: 'detailed' })

    const p5 = result.violations.find((v) => v.className === 'p-5')
    expect(p5?.suggestion).toBeDefined()
    expect(p5?.suggestion).toMatch(/^nearest:/)
    expect(p5?.suggestion).toContain('p-base')
  })

  it('should include type/severity breakdown in summary', async () => {
    const testFile = join(tempDir, 'component.tsx')
    await writeFile(
      testFile,
      `
export function Component() {
  return <div className="bg-neutral-100 p-4 h-8" />
}
    `.trim(),
      'utf-8'
    )

    const result = await validateTokensTool({ path: tempDir })

    expect(result.summary.byType).toEqual({ color: 1, spacing: 1, sizing: 1 })
    expect(result.summary.bySeverity).toEqual({ error: 1, warning: 2 })
  })

  it('should detect mixed color, spacing, and sizing violations', async () => {
    const testFile = join(tempDir, 'component.tsx')
    await writeFile(
      testFile,
      `
export function Component() {
  return (
    <div className="bg-neutral-100 p-4 h-8 gap-2 w-10 text-primary-500">
      Test
    </div>
  )
}
    `.trim(),
      'utf-8'
    )

    const result = await validateTokensTool({ path: tempDir, report: 'detailed' })

    expect(result.summary.totalViolations).toBe(6)
    expect(result.summary.byType).toEqual({ color: 2, spacing: 2, sizing: 2 })
    expect(result.summary.bySeverity).toEqual({ error: 2, warning: 4 })
  })

  it('should autofix exact-match spacing violations', async () => {
    const testFile = join(tempDir, 'component.tsx')
    await writeFile(testFile, '<div className="p-4 gap-2" />', 'utf-8')

    await validateTokensTool({ path: tempDir, fix: true })

    const { readFile } = await import('node:fs/promises')
    const content = await readFile(testFile, 'utf-8')
    expect(content).toContain('p-base')
    expect(content).toContain('gap-sm')
  })

  it('should autofix exact-match sizing violations', async () => {
    const testFile = join(tempDir, 'component.tsx')
    await writeFile(testFile, '<div className="h-8 w-10" />', 'utf-8')

    await validateTokensTool({ path: tempDir, fix: true })

    const { readFile } = await import('node:fs/promises')
    const content = await readFile(testFile, 'utf-8')
    expect(content).toContain('h-size-sm')
    expect(content).toContain('w-size-md')
  })

  it('should NOT autofix nearest-match suggestions', async () => {
    const testFile = join(tempDir, 'component.tsx')
    await writeFile(testFile, '<div className="p-5" />', 'utf-8')

    await validateTokensTool({ path: tempDir, fix: true })

    const { readFile } = await import('node:fs/promises')
    const content = await readFile(testFile, 'utf-8')
    // p-5 has no exact match, should remain unchanged
    expect(content).toContain('p-5')
  })

  it('should detect spacing classes with modifiers', async () => {
    const testFile = join(tempDir, 'component.tsx')
    await writeFile(
      testFile,
      `
export function Component() {
  return <div className="hover:p-4 dark:gap-2 md:mx-8" />
}
    `.trim(),
      'utf-8'
    )

    const result = await validateTokensTool({ path: tempDir, report: 'detailed' })

    expect(result.summary.totalViolations).toBe(3)
    const classNames = result.violations.map((v) => v.className)
    expect(classNames).toContain('hover:p-4')
    expect(classNames).toContain('dark:gap-2')
    expect(classNames).toContain('md:mx-8')
  })

  it('should detect negative margin spacing classes', async () => {
    const testFile = join(tempDir, 'component.tsx')
    await writeFile(
      testFile,
      `
export function Component() {
  return <div className="-m-2 -mx-4" />
}
    `.trim(),
      'utf-8'
    )

    const result = await validateTokensTool({ path: tempDir, report: 'detailed' })

    expect(result.summary.totalViolations).toBe(2)
    const classNames = result.violations.map((v) => v.className)
    expect(classNames).toContain('-m-2')
    expect(classNames).toContain('-mx-4')

    const m2 = result.violations.find((v) => v.className === '-m-2')
    expect(m2?.suggestion).toBe('-m-sm')
  })
})
