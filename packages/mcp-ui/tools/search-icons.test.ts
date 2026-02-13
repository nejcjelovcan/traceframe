import { describe, expect, it, vi } from 'vitest'

import { searchIconsTool } from './search-icons'

// Mock the ui-library module
vi.mock('@traceframe/ui-library', () => ({
  searchIcons: vi.fn(),
}))

describe('searchIconsTool', () => {
  it('returns error when query is empty', async () => {
    const result = await searchIconsTool({ query: '' })

    expect(result.success).toBe(false)
    expect(result.error).toContain('required')
  })

  it('returns error when query is whitespace only', async () => {
    const result = await searchIconsTool({ query: '   ' })

    expect(result.success).toBe(false)
    expect(result.error).toContain('required')
  })

  it('returns matching icons', async () => {
    const { searchIcons } = await import('@traceframe/ui-library')
    vi.mocked(searchIcons).mockReturnValue(['search', 'search-off', 'file-search'])

    const result = await searchIconsTool({ query: 'search' })

    expect(result.success).toBe(true)
    expect(result.icons).toEqual(['search', 'search-off', 'file-search'])
    expect(result.count).toBe(3)
    expect(result.summary).toContain('3 icon(s)')
    expect(result.summary).toContain('"search"')
  })

  it('returns empty list when no matches', async () => {
    const { searchIcons } = await import('@traceframe/ui-library')
    vi.mocked(searchIcons).mockReturnValue([])

    const result = await searchIconsTool({ query: 'nonexistent' })

    expect(result.success).toBe(true)
    expect(result.icons).toEqual([])
    expect(result.count).toBe(0)
    expect(result.summary).toContain('No icons found')
  })

  it('trims whitespace from query', async () => {
    const { searchIcons } = await import('@traceframe/ui-library')
    vi.mocked(searchIcons).mockReturnValue(['check'])

    await searchIconsTool({ query: '  check  ' })

    expect(searchIcons).toHaveBeenCalledWith('check')
  })

  it('returns error on failure', async () => {
    const { searchIcons } = await import('@traceframe/ui-library')
    vi.mocked(searchIcons).mockImplementation(() => {
      throw new Error('Search error')
    })

    const result = await searchIconsTool({ query: 'test' })

    expect(result.success).toBe(false)
    expect(result.error).toBe('Search error')
  })
})
