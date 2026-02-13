import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip'

/**
 * Tooltip tests focus on integration with our styling layer.
 *
 * We DO NOT test:
 * - Radix's positioning logic (collision detection, etc.)
 * - Radix's accessibility implementation (aria attributes)
 * - Radix's keyboard handling (Escape to dismiss)
 * - Radix's timing/delay logic
 *
 * Radix UI already has comprehensive tests for these features.
 *
 * We DO test:
 * - Our variant styling is applied
 * - Custom classNames are merged
 * - Arrow visibility is controlled by our prop
 * - Rich content renders
 */

// Helper to create a wrapped tooltip with Provider
function renderTooltip(
  content: React.ReactNode,
  contentProps: React.ComponentProps<typeof TooltipContent> = {}
) {
  return render(
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button>Trigger</button>
        </TooltipTrigger>
        <TooltipContent data-testid="tooltip-content" {...contentProps}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

describe('Tooltip', () => {
  describe('rendering', () => {
    it('renders trigger element', () => {
      renderTooltip('Content')
      expect(screen.getByRole('button', { name: 'Trigger' })).toBeDefined()
    })

    it('shows tooltip content on hover', async () => {
      const user = userEvent.setup()
      renderTooltip('Tooltip text')

      const trigger = screen.getByRole('button', { name: 'Trigger' })
      await user.hover(trigger)

      // Wait for our styled content to appear
      await waitFor(() => {
        expect(screen.getByTestId('tooltip-content')).toBeDefined()
      })
    })
  })

  describe('variants', () => {
    it('applies default variant styles', async () => {
      const user = userEvent.setup()
      renderTooltip('Content')

      await user.hover(screen.getByRole('button'))

      await waitFor(() => {
        const content = screen.getByTestId('tooltip-content')
        expect(content.className).toContain('bg-tooltip')
        expect(content.className).toContain('text-tooltip-foreground')
      })
    })

    it('applies light variant styles', async () => {
      const user = userEvent.setup()
      renderTooltip('Content', { variant: 'light' })

      await user.hover(screen.getByRole('button'))

      await waitFor(() => {
        const content = screen.getByTestId('tooltip-content')
        expect(content.className).toContain('bg-surface')
        expect(content.className).toContain('text-foreground')
      })
    })

    it('merges custom className', async () => {
      const user = userEvent.setup()
      renderTooltip('Content', { className: 'custom-class' })

      await user.hover(screen.getByRole('button'))

      await waitFor(() => {
        const content = screen.getByTestId('tooltip-content')
        expect(content.className).toContain('custom-class')
      })
    })
  })

  describe('arrow', () => {
    it('renders arrow by default', async () => {
      const user = userEvent.setup()
      renderTooltip('Content')

      await user.hover(screen.getByRole('button'))

      await waitFor(() => {
        const content = screen.getByTestId('tooltip-content')
        // Arrow is an SVG element rendered by Radix
        expect(content.querySelector('svg')).not.toBeNull()
      })
    })

    it('hides arrow when showArrow is false', async () => {
      const user = userEvent.setup()
      renderTooltip('Content', { showArrow: false })

      await user.hover(screen.getByRole('button'))

      await waitFor(() => {
        const content = screen.getByTestId('tooltip-content')
        expect(content.querySelector('svg')).toBeNull()
      })
    })
  })

  describe('rich content', () => {
    it('renders JSX children', async () => {
      const user = userEvent.setup()
      renderTooltip(
        <>
          <strong data-testid="bold">Bold text</strong>
          <span data-testid="more">More content</span>
        </>
      )

      await user.hover(screen.getByRole('button'))

      await waitFor(() => {
        const content = screen.getByTestId('tooltip-content')
        expect(content.querySelector('[data-testid="bold"]')).not.toBeNull()
        expect(content.querySelector('[data-testid="more"]')).not.toBeNull()
      })
    })
  })

  describe('provider', () => {
    it('requires TooltipProvider to be present', () => {
      // Radix Tooltip requires a Provider - this is documented behavior
      expect(() => {
        render(
          <Tooltip>
            <TooltipTrigger asChild>
              <button>Trigger</button>
            </TooltipTrigger>
            <TooltipContent>Content</TooltipContent>
          </Tooltip>
        )
      }).toThrow('`Tooltip` must be used within `TooltipProvider`')
    })
  })
})
