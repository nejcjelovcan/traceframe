import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import {
  CollapsibleContent,
  CollapsibleHeader,
  Collapsible,
  CollapsibleTrigger,
} from './Collapsible'

/**
 * Collapsible tests focus on integration with our styling layer.
 *
 * We DO NOT test:
 * - Radix's accessibility implementation (aria attributes)
 * - Radix's keyboard handling internals
 *
 * Radix UI already has comprehensive tests for these features.
 *
 * We DO test:
 * - Open/close state changes on click
 * - Keyboard interaction (Enter/Space)
 * - Our variant styling is applied
 * - Custom classNames are merged
 * - Chevron visibility is controlled by our prop
 * - Controlled and uncontrolled modes
 * - Disabled state
 */

// Helper to create a basic collapsible
function renderCollapsible(
  triggerProps: React.ComponentProps<typeof CollapsibleTrigger> = {},
  rootProps: React.ComponentProps<typeof Collapsible> = {}
) {
  return render(
    <Collapsible data-testid="collapsible-root" {...rootProps}>
      <CollapsibleTrigger data-testid="collapsible-trigger" {...triggerProps}>
        Toggle Section
      </CollapsibleTrigger>
      <CollapsibleContent data-testid="collapsible-content">
        <div data-testid="content-inner">Content inside collapsible</div>
      </CollapsibleContent>
    </Collapsible>
  )
}

describe('Collapsible', () => {
  describe('rendering', () => {
    it('renders trigger element', () => {
      renderCollapsible()
      expect(screen.getByTestId('collapsible-trigger')).toBeDefined()
      expect(screen.getByText('Toggle Section')).toBeDefined()
    })

    it('content is hidden when collapsed (default)', () => {
      renderCollapsible()
      // Content should have data-state=closed
      const content = screen.getByTestId('collapsible-content')
      expect(content.getAttribute('data-state')).toBe('closed')
    })

    it('content is visible when defaultOpen is true', () => {
      renderCollapsible({}, { defaultOpen: true })
      const content = screen.getByTestId('collapsible-content')
      expect(content.getAttribute('data-state')).toBe('open')
    })
  })

  describe('interaction', () => {
    it('clicking trigger toggles state', async () => {
      const user = userEvent.setup()
      renderCollapsible()

      const trigger = screen.getByTestId('collapsible-trigger')
      const content = screen.getByTestId('collapsible-content')

      // Initially closed
      expect(content.getAttribute('data-state')).toBe('closed')

      // Click to open
      await user.click(trigger)
      expect(content.getAttribute('data-state')).toBe('open')

      // Click to close
      await user.click(trigger)
      expect(content.getAttribute('data-state')).toBe('closed')
    })

    it('Enter key toggles state', async () => {
      const user = userEvent.setup()
      renderCollapsible()

      const trigger = screen.getByTestId('collapsible-trigger')
      const content = screen.getByTestId('collapsible-content')

      // Focus the trigger
      trigger.focus()

      // Press Enter to open
      await user.keyboard('{Enter}')
      expect(content.getAttribute('data-state')).toBe('open')

      // Press Enter to close
      await user.keyboard('{Enter}')
      expect(content.getAttribute('data-state')).toBe('closed')
    })

    it('Space key toggles state', async () => {
      const user = userEvent.setup()
      renderCollapsible()

      const trigger = screen.getByTestId('collapsible-trigger')
      const content = screen.getByTestId('collapsible-content')

      // Focus the trigger
      trigger.focus()

      // Press Space to open
      await user.keyboard(' ')
      expect(content.getAttribute('data-state')).toBe('open')

      // Press Space to close
      await user.keyboard(' ')
      expect(content.getAttribute('data-state')).toBe('closed')
    })
  })

  describe('controlled mode', () => {
    it('respects open prop', () => {
      const { rerender } = render(
        <Collapsible open={false}>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent data-testid="content">Content</CollapsibleContent>
        </Collapsible>
      )

      expect(screen.getByTestId('content').getAttribute('data-state')).toBe('closed')

      rerender(
        <Collapsible open={true}>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent data-testid="content">Content</CollapsibleContent>
        </Collapsible>
      )

      expect(screen.getByTestId('content').getAttribute('data-state')).toBe('open')
    })

    it('calls onOpenChange when toggled', async () => {
      const onOpenChange = vi.fn()
      const user = userEvent.setup()

      function ControlledCollapsible() {
        const [open, setOpen] = useState(false)
        return (
          <Collapsible
            open={open}
            onOpenChange={(value: boolean) => {
              setOpen(value)
              onOpenChange(value)
            }}
          >
            <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>
            <CollapsibleContent>Content</CollapsibleContent>
          </Collapsible>
        )
      }

      render(<ControlledCollapsible />)

      await user.click(screen.getByTestId('trigger'))
      expect(onOpenChange).toHaveBeenCalledWith(true)

      await user.click(screen.getByTestId('trigger'))
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  describe('disabled state', () => {
    it('disabled trigger prevents interaction', async () => {
      const user = userEvent.setup()
      renderCollapsible({ disabled: true })

      const trigger = screen.getByTestId('collapsible-trigger')
      const content = screen.getByTestId('collapsible-content')

      // Click should not toggle
      await user.click(trigger)
      expect(content.getAttribute('data-state')).toBe('closed')
    })

    it('applies disabled styling', () => {
      renderCollapsible({ disabled: true })
      const trigger = screen.getByTestId('collapsible-trigger')
      expect(trigger.className).toContain('disabled:cursor-not-allowed')
      expect(trigger.className).toContain('disabled:opacity-50')
    })
  })

  describe('chevron', () => {
    it('renders chevron by default', () => {
      renderCollapsible()
      const trigger = screen.getByTestId('collapsible-trigger')
      // Chevron is an SVG element
      expect(trigger.querySelector('svg')).not.toBeNull()
    })

    it('hides chevron when hideChevron is true', () => {
      renderCollapsible({ hideChevron: true })
      const trigger = screen.getByTestId('collapsible-trigger')
      expect(trigger.querySelector('svg')).toBeNull()
    })

    it('chevron has rotation class for open state', () => {
      renderCollapsible()

      const trigger = screen.getByTestId('collapsible-trigger')
      const chevron = trigger.querySelector('svg')

      expect(chevron).not.toBeNull()
      // The rotation is applied via CSS selector [[data-state=open]>&]:rotate-90
      // Note: SVG elements use getAttribute('class') instead of className (which is SVGAnimatedString)
      expect(chevron?.getAttribute('class')).toContain('[[data-state=open]>&]:rotate-90')
    })
  })

  describe('size variants', () => {
    it('applies sm size styles', () => {
      renderCollapsible({ size: 'sm' })
      const trigger = screen.getByTestId('collapsible-trigger')
      expect(trigger.className).toContain('px-sm')
      expect(trigger.className).toContain('py-xs')
      expect(trigger.className).toContain('text-sm')
    })

    it('applies md size styles (default)', () => {
      renderCollapsible()
      const trigger = screen.getByTestId('collapsible-trigger')
      expect(trigger.className).toContain('px-md')
      expect(trigger.className).toContain('py-sm')
      expect(trigger.className).toContain('text-base')
    })

    it('applies lg size styles', () => {
      renderCollapsible({ size: 'lg' })
      const trigger = screen.getByTestId('collapsible-trigger')
      expect(trigger.className).toContain('px-base')
      expect(trigger.className).toContain('py-md')
      expect(trigger.className).toContain('text-lg')
    })
  })

  describe('visual variants', () => {
    it('applies default variant styles', () => {
      renderCollapsible({ variant: 'default' })
      const trigger = screen.getByTestId('collapsible-trigger')
      expect(trigger.className).toContain('hover:bg-surface-subtle')
    })

    it('applies ghost variant styles', () => {
      renderCollapsible({ variant: 'ghost' })
      const trigger = screen.getByTestId('collapsible-trigger')
      expect(trigger.className).toContain('hover:bg-transparent')
    })

    it('applies bordered variant styles', () => {
      renderCollapsible({ variant: 'bordered' })
      const trigger = screen.getByTestId('collapsible-trigger')
      expect(trigger.className).toContain('border')
      expect(trigger.className).toContain('border-border')
      expect(trigger.className).toContain('hover:bg-surface-subtle')
    })

    it('applies filled variant styles', () => {
      renderCollapsible({ variant: 'filled' })
      const trigger = screen.getByTestId('collapsible-trigger')
      expect(trigger.className).toContain('bg-surface-muted')
      expect(trigger.className).toContain('hover:bg-surface-subtle')
    })
  })

  describe('accent variants', () => {
    it('applies no accent by default', () => {
      renderCollapsible()
      const trigger = screen.getByTestId('collapsible-trigger')
      expect(trigger.className).not.toContain('border-l-4')
    })

    it('applies accent 1 styles', () => {
      renderCollapsible({ accent: 1 })
      const trigger = screen.getByTestId('collapsible-trigger')
      expect(trigger.className).toContain('border-l-4')
      expect(trigger.className).toContain('border-l-accent-1-border')
    })

    it('applies accent 2 styles', () => {
      renderCollapsible({ accent: 2 })
      const trigger = screen.getByTestId('collapsible-trigger')
      expect(trigger.className).toContain('border-l-4')
      expect(trigger.className).toContain('border-l-accent-2-border')
    })

    it('applies accent 3 styles', () => {
      renderCollapsible({ accent: 3 })
      const trigger = screen.getByTestId('collapsible-trigger')
      expect(trigger.className).toContain('border-l-4')
      expect(trigger.className).toContain('border-l-accent-3-border')
    })
  })

  describe('indent levels', () => {
    it('applies no indent by default', () => {
      renderCollapsible()
      const trigger = screen.getByTestId('collapsible-trigger')
      expect(trigger.className).not.toContain('ml-')
    })

    it('applies sm indent', () => {
      renderCollapsible({ indent: 'sm' })
      const trigger = screen.getByTestId('collapsible-trigger')
      expect(trigger.className).toContain('ml-base')
    })

    it('applies md indent', () => {
      renderCollapsible({ indent: 'md' })
      const trigger = screen.getByTestId('collapsible-trigger')
      expect(trigger.className).toContain('ml-lg')
    })

    it('applies lg indent', () => {
      renderCollapsible({ indent: 'lg' })
      const trigger = screen.getByTestId('collapsible-trigger')
      expect(trigger.className).toContain('ml-xl')
    })
  })

  describe('content indent', () => {
    it('applies indent to content', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent data-testid="content" indent="md">
            Content
          </CollapsibleContent>
        </Collapsible>
      )
      const content = screen.getByTestId('content')
      expect(content.className).toContain('ml-lg')
    })
  })

  describe('className merging', () => {
    it('merges custom className on trigger', () => {
      renderCollapsible({ className: 'custom-trigger-class' })
      const trigger = screen.getByTestId('collapsible-trigger')
      expect(trigger.className).toContain('custom-trigger-class')
    })

    it('merges custom className on content', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent data-testid="content" className="custom-content-class">
            Content
          </CollapsibleContent>
        </Collapsible>
      )
      const content = screen.getByTestId('content')
      expect(content.className).toContain('custom-content-class')
    })
  })

  describe('content animation', () => {
    it('applies open animation class', () => {
      renderCollapsible({}, { defaultOpen: true })
      const content = screen.getByTestId('collapsible-content')
      expect(content.className).toContain('data-[state=open]:animate-collapsible-down')
    })

    it('applies close animation class', () => {
      renderCollapsible()
      const content = screen.getByTestId('collapsible-content')
      expect(content.className).toContain('data-[state=closed]:animate-collapsible-up')
    })
  })

  describe('CollapsibleHeader', () => {
    it('renders header content', () => {
      render(<CollapsibleHeader data-testid="header">Section Header</CollapsibleHeader>)
      expect(screen.getByTestId('header')).toBeDefined()
      expect(screen.getByText('Section Header')).toBeDefined()
    })

    it('applies size variant styles', () => {
      render(
        <CollapsibleHeader data-testid="header" size="lg">
          Large Header
        </CollapsibleHeader>
      )
      const header = screen.getByTestId('header')
      expect(header.className).toContain('text-lg')
      expect(header.className).toContain('py-md')
    })

    it('applies accent styles', () => {
      render(
        <CollapsibleHeader data-testid="header" accent={2}>
          Accented Header
        </CollapsibleHeader>
      )
      const header = screen.getByTestId('header')
      expect(header.className).toContain('border-l-4')
      expect(header.className).toContain('border-l-accent-2-border')
      expect(header.className).toContain('pl-sm')
    })

    it('is not interactive (not a button)', () => {
      render(<CollapsibleHeader data-testid="header">Non-interactive Header</CollapsibleHeader>)
      const header = screen.getByTestId('header')
      expect(header.tagName.toLowerCase()).toBe('div')
      expect(header.getAttribute('role')).toBeNull()
    })

    it('merges custom className', () => {
      render(
        <CollapsibleHeader data-testid="header" className="custom-header-class">
          Header
        </CollapsibleHeader>
      )
      const header = screen.getByTestId('header')
      expect(header.className).toContain('custom-header-class')
    })
  })
})
