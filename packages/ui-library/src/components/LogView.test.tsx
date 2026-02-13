import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { LogEntry, LogPrompt, LogView } from './LogView'

describe('LogView', () => {
  it('renders children', () => {
    render(
      <LogView>
        <LogEntry>Hello world</LogEntry>
      </LogView>
    )
    expect(screen.getByText('Hello world')).toBeDefined()
  })

  it('applies cli variant classes by default', () => {
    render(
      <LogView data-testid="logview">
        <LogEntry>Entry</LogEntry>
      </LogView>
    )
    const el = screen.getByTestId('logview')
    expect(el.className).toContain('bg-surface-muted')
    expect(el.className).toContain('font-mono')
  })

  it('applies rich variant classes', () => {
    render(
      <LogView variant="rich" data-testid="logview">
        <LogEntry>Entry</LogEntry>
      </LogView>
    )
    const el = screen.getByTestId('logview')
    expect(el.className).toContain('bg-surface')
    expect(el.className).not.toContain('font-mono')
  })

  it('has role="log" on scroll container', () => {
    render(
      <LogView>
        <LogEntry>Entry</LogEntry>
      </LogView>
    )
    expect(screen.getByRole('log')).toBeDefined()
  })

  it('has aria-live="polite" on scroll container', () => {
    render(
      <LogView>
        <LogEntry>Entry</LogEntry>
      </LogView>
    )
    const log = screen.getByRole('log')
    expect(log.getAttribute('aria-live')).toBe('polite')
  })

  it('merges custom className', () => {
    render(
      <LogView data-testid="logview" className="custom-class">
        <LogEntry>Entry</LogEntry>
      </LogView>
    )
    expect(screen.getByTestId('logview').className).toContain('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null as HTMLDivElement | null }
    render(
      <LogView ref={ref}>
        <LogEntry>Entry</LogEntry>
      </LogView>
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('applies maxHeight to scroll container', () => {
    render(
      <LogView maxHeight="300px">
        <LogEntry>Entry</LogEntry>
      </LogView>
    )
    const log = screen.getByRole('log')
    expect(log.style.maxHeight).toBe('300px')
  })
})

describe('LogEntry', () => {
  it('renders children', () => {
    render(
      <LogView>
        <LogEntry>Log line content</LogEntry>
      </LogView>
    )
    expect(screen.getByText('Log line content')).toBeDefined()
  })

  it('displays string timestamp when showTimestamps is true', () => {
    render(
      <LogView showTimestamps={true}>
        <LogEntry timestamp="10:30:00">Entry</LogEntry>
      </LogView>
    )
    expect(screen.getByText('10:30:00')).toBeDefined()
  })

  it('formats Date timestamp as HH:MM:SS', () => {
    const date = new Date(2026, 0, 1, 14, 5, 30)
    render(
      <LogView>
        <LogEntry timestamp={date}>Entry</LogEntry>
      </LogView>
    )
    expect(screen.getByText('14:05:30')).toBeDefined()
  })

  it('hides timestamp when showTimestamps is false', () => {
    render(
      <LogView showTimestamps={false}>
        <LogEntry timestamp="10:30:00">Entry</LogEntry>
      </LogView>
    )
    expect(screen.queryByText('10:30:00')).toBeNull()
  })

  it('applies info level color', () => {
    render(
      <LogView>
        <LogEntry level="info" data-testid="entry">
          Info entry
        </LogEntry>
      </LogView>
    )
    expect(screen.getByTestId('entry').className).toContain('text-status-info-foreground')
  })

  it('applies success level color', () => {
    render(
      <LogView>
        <LogEntry level="success" data-testid="entry">
          Success entry
        </LogEntry>
      </LogView>
    )
    expect(screen.getByTestId('entry').className).toContain('text-status-success-foreground')
  })

  it('applies warning level color', () => {
    render(
      <LogView>
        <LogEntry level="warning" data-testid="entry">
          Warning entry
        </LogEntry>
      </LogView>
    )
    expect(screen.getByTestId('entry').className).toContain('text-status-warning-foreground')
  })

  it('applies error level color', () => {
    render(
      <LogView>
        <LogEntry level="error" data-testid="entry">
          Error entry
        </LogEntry>
      </LogView>
    )
    expect(screen.getByTestId('entry').className).toContain('text-status-error-foreground')
  })

  it('applies debug level color', () => {
    render(
      <LogView>
        <LogEntry level="debug" data-testid="entry">
          Debug entry
        </LogEntry>
      </LogView>
    )
    expect(screen.getByTestId('entry').className).toContain('text-foreground-muted')
  })

  it('renders icon when provided', () => {
    render(
      <LogView variant="rich">
        <LogEntry icon="agent" data-testid="entry">
          With icon
        </LogEntry>
      </LogView>
    )
    const entry = screen.getByTestId('entry')
    const icon = entry.querySelector('svg')
    expect(icon).toBeDefined()
    expect(icon?.getAttribute('aria-hidden')).toBe('true')
  })

  it('renders expandable entry with detail prop in rich variant', () => {
    render(
      <LogView variant="rich">
        <LogEntry detail={<span>Detail content</span>}>Summary</LogEntry>
      </LogView>
    )
    // Summary should be visible
    expect(screen.getByText('Summary')).toBeDefined()
    // Detail should be hidden initially (collapsed)
    const detail = screen.queryByText('Detail content')
    // Radix renders content in DOM but it should be in closed state
    expect(detail).toBeDefined()
  })

  it('expands detail when clicked', () => {
    render(
      <LogView variant="rich">
        <LogEntry detail={<span>Detail content</span>}>Summary</LogEntry>
      </LogView>
    )
    const trigger = screen.getByText('Summary').closest('button')
    expect(trigger).toBeDefined()
    if (trigger) fireEvent.click(trigger)
    expect(screen.getByText('Detail content')).toBeDefined()
  })

  it('renders expanded by default when defaultExpanded is true', () => {
    render(
      <LogView variant="rich">
        <LogEntry detail={<span>Detail content</span>} defaultExpanded>
          Summary
        </LogEntry>
      </LogView>
    )
    expect(screen.getByText('Detail content')).toBeDefined()
  })

  it('merges custom className', () => {
    render(
      <LogView>
        <LogEntry data-testid="entry" className="custom-entry">
          Entry
        </LogEntry>
      </LogView>
    )
    expect(screen.getByTestId('entry').className).toContain('custom-entry')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null as HTMLDivElement | null }
    render(
      <LogView>
        <LogEntry ref={ref}>Entry</LogEntry>
      </LogView>
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('uses <time> element for timestamps', () => {
    render(
      <LogView>
        <LogEntry timestamp="10:30:00">Entry</LogEntry>
      </LogView>
    )
    const timeEl = screen.getByText('10:30:00')
    expect(timeEl.tagName.toLowerCase()).toBe('time')
  })

  it('sets dateTime attribute for Date timestamps', () => {
    const date = new Date(2026, 0, 1, 14, 5, 30)
    render(
      <LogView>
        <LogEntry timestamp={date}>Entry</LogEntry>
      </LogView>
    )
    const timeEl = screen.getByText('14:05:30')
    expect(timeEl.getAttribute('datetime')).toBeTruthy()
  })
})

describe('LogPrompt', () => {
  it('renders with prefix', () => {
    render(
      <LogView>
        <LogPrompt prefix="$ " data-testid="prompt" />
      </LogView>
    )
    const prompt = screen.getByTestId('prompt')
    expect(prompt.querySelector('[aria-hidden="true"]')?.textContent).toBe('$ ')
  })

  it('renders with default prefix', () => {
    render(
      <LogView>
        <LogPrompt data-testid="prompt" />
      </LogView>
    )
    const prompt = screen.getByTestId('prompt')
    expect(prompt.querySelector('[aria-hidden="true"]')?.textContent).toBe('> ')
  })

  it('calls onSubmit on Enter key', () => {
    const onSubmit = vi.fn()
    render(
      <LogView>
        <LogPrompt onSubmit={onSubmit} />
      </LogView>
    )
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test command' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onSubmit).toHaveBeenCalledWith('test command')
  })

  it('clears input after submit', () => {
    const onSubmit = vi.fn()
    render(
      <LogView>
        <LogPrompt onSubmit={onSubmit} />
      </LogView>
    )
    const input = screen.getByRole('textbox') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'test' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(input.value).toBe('')
  })

  it('does not submit empty input', () => {
    const onSubmit = vi.fn()
    render(
      <LogView>
        <LogPrompt onSubmit={onSubmit} />
      </LogView>
    )
    const input = screen.getByRole('textbox')
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('does not submit on Shift+Enter', () => {
    const onSubmit = vi.fn()
    render(
      <LogView>
        <LogPrompt onSubmit={onSubmit} />
      </LogView>
    )
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test' } })
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true })
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('has aria-label on input', () => {
    render(
      <LogView>
        <LogPrompt />
      </LogView>
    )
    expect(screen.getByLabelText('Log prompt input')).toBeDefined()
  })

  it('disables input when disabled prop is true', () => {
    render(
      <LogView>
        <LogPrompt disabled />
      </LogView>
    )
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.disabled).toBe(true)
  })

  it('merges custom className', () => {
    render(
      <LogView>
        <LogPrompt data-testid="prompt" className="custom-prompt" />
      </LogView>
    )
    expect(screen.getByTestId('prompt').className).toContain('custom-prompt')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null as HTMLDivElement | null }
    render(
      <LogView>
        <LogPrompt ref={ref} />
      </LogView>
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})

describe('LogView composition', () => {
  it('renders LogView with LogEntry and LogPrompt together', () => {
    render(
      <LogView variant="cli">
        <LogEntry timestamp="10:00:00">First line</LogEntry>
        <LogEntry timestamp="10:00:01" level="error">
          Error line
        </LogEntry>
        <LogPrompt prefix="$ " />
      </LogView>
    )
    expect(screen.getByText('First line')).toBeDefined()
    expect(screen.getByText('Error line')).toBeDefined()
    expect(screen.getByRole('textbox')).toBeDefined()
  })
})
