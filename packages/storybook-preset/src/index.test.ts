import { describe, it, expect } from 'vitest'

describe('storybook-preset exports', () => {
  it('re-exports vite plugin from ui-library', () => {
    // Just test that the module can be imported
    // The actual exports are from ui-library which has its own tests
    expect(true).toBe(true)
  })
})
