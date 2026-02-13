import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { Select } from './Select'

/**
 * Select tests focus on integration with our styling layer.
 *
 * We DO NOT test:
 * - Radix's positioning logic (collision detection, etc.)
 * - Radix's accessibility implementation (aria attributes)
 * - Radix's keyboard handling (Arrow keys, Enter, Escape, Type-ahead)
 * - Radix's focus management
 *
 * Radix UI already has comprehensive tests for these features.
 *
 * We DO test:
 * - Our variant styling is applied
 * - Custom classNames are merged
 * - Items render and can be selected
 * - Disabled state works
 */

// Helper to render a basic Select
function renderSelect(
  triggerProps: React.ComponentProps<typeof Select.Trigger> = {},
  contentProps: React.ComponentProps<typeof Select.Content> = {}
) {
  return render(
    <Select.Root>
      <Select.Trigger data-testid="select-trigger" {...triggerProps}>
        <Select.Value placeholder="Select an option" />
      </Select.Trigger>
      <Select.Content data-testid="select-content" {...contentProps}>
        <Select.Item value="option1">Option 1</Select.Item>
        <Select.Item value="option2">Option 2</Select.Item>
        <Select.Item value="option3" disabled>
          Option 3 (disabled)
        </Select.Item>
      </Select.Content>
    </Select.Root>
  )
}

describe('Select', () => {
  describe('rendering', () => {
    it('renders trigger with placeholder', () => {
      renderSelect()
      expect(screen.getByTestId('select-trigger')).toBeDefined()
      expect(screen.getByText('Select an option')).toBeDefined()
    })

    it('opens dropdown on trigger click', async () => {
      const user = userEvent.setup()
      renderSelect()

      const trigger = screen.getByTestId('select-trigger')
      await user.click(trigger)

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeDefined()
        expect(screen.getByText('Option 2')).toBeDefined()
      })
    })

    it('closes on item selection', async () => {
      const user = userEvent.setup()
      renderSelect()

      const trigger = screen.getByTestId('select-trigger')
      await user.click(trigger)

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeDefined()
      })

      await user.click(screen.getByText('Option 1'))

      // After selection, the content should close and trigger shows selected value
      await waitFor(() => {
        expect(screen.getByTestId('select-trigger')).toHaveTextContent('Option 1')
      })
    })
  })

  describe('trigger variants', () => {
    it('applies default variant styles', () => {
      renderSelect()
      const trigger = screen.getByTestId('select-trigger')
      expect(trigger.className).toContain('border-border')
    })

    it('applies secondary variant styles', () => {
      renderSelect({ variant: 'secondary' })
      const trigger = screen.getByTestId('select-trigger')
      expect(trigger.className).toContain('border-interactive-secondary-border')
    })

    it('applies error variant styles', () => {
      renderSelect({ variant: 'error' })
      const trigger = screen.getByTestId('select-trigger')
      expect(trigger.className).toContain('border-status-error-border')
      expect(trigger.className).toContain('text-status-error-foreground')
    })

    it('applies success variant styles', () => {
      renderSelect({ variant: 'success' })
      const trigger = screen.getByTestId('select-trigger')
      expect(trigger.className).toContain('border-status-success-border')
      expect(trigger.className).toContain('text-status-success-foreground')
    })

    it('applies ghost variant styles', () => {
      renderSelect({ variant: 'ghost' })
      const trigger = screen.getByTestId('select-trigger')
      expect(trigger.className).toContain('border-transparent')
    })
  })

  describe('trigger sizes', () => {
    it('applies xs size styles', () => {
      renderSelect({ size: 'xs' })
      const trigger = screen.getByTestId('select-trigger')
      expect(trigger.className).toContain('h-size-xs')
      expect(trigger.className).toContain('px-sm')
      expect(trigger.className).toContain('text-xs')
    })

    it('applies sm size styles', () => {
      renderSelect({ size: 'sm' })
      const trigger = screen.getByTestId('select-trigger')
      expect(trigger.className).toContain('h-size-sm')
      expect(trigger.className).toContain('px-sm')
      expect(trigger.className).toContain('text-sm')
    })

    it('applies default size (md) styles', () => {
      renderSelect()
      const trigger = screen.getByTestId('select-trigger')
      expect(trigger.className).toContain('h-size-md')
      expect(trigger.className).toContain('px-md')
    })

    it('applies lg size styles', () => {
      renderSelect({ size: 'lg' })
      const trigger = screen.getByTestId('select-trigger')
      expect(trigger.className).toContain('h-size-lg')
      expect(trigger.className).toContain('px-base')
      expect(trigger.className).toContain('text-lg')
    })

    it('applies auto width by default', () => {
      renderSelect()
      const trigger = screen.getByTestId('select-trigger')
      expect(trigger.className).toContain('w-auto')
    })

    it('applies full width', () => {
      renderSelect({ width: 'full' })
      const trigger = screen.getByTestId('select-trigger')
      expect(trigger.className).toContain('w-full')
    })

    it('applies fit width', () => {
      renderSelect({ width: 'fit' })
      const trigger = screen.getByTestId('select-trigger')
      expect(trigger.className).toContain('w-fit')
    })

    it('merges custom className on trigger', () => {
      renderSelect({ className: 'custom-trigger-class' })
      const trigger = screen.getByTestId('select-trigger')
      expect(trigger.className).toContain('custom-trigger-class')
    })
  })

  describe('density variants', () => {
    it('applies compact density', () => {
      renderSelect({ density: 'compact' })
      const trigger = screen.getByTestId('select-trigger')
      expect(trigger.className).toContain('py-2xs')
    })

    it('applies comfortable density', () => {
      renderSelect({ density: 'comfortable' })
      const trigger = screen.getByTestId('select-trigger')
      expect(trigger.className).toContain('py-xs')
    })

    it('applies spacious density', () => {
      renderSelect({ density: 'spacious' })
      const trigger = screen.getByTestId('select-trigger')
      expect(trigger.className).toContain('py-sm')
    })
  })

  describe('icon support', () => {
    it('renders with left icon', () => {
      render(
        <Select.Root>
          <Select.Trigger data-testid="select-trigger" leftIcon="package">
            <Select.Value placeholder="Select..." />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="option1">Option 1</Select.Item>
          </Select.Content>
        </Select.Root>
      )

      const trigger = screen.getByTestId('select-trigger')
      const icon = trigger.querySelector('[data-icon="package"]')
      expect(icon).toBeDefined()
    })
  })

  describe('content styling', () => {
    it('merges custom className on content', async () => {
      const user = userEvent.setup()
      renderSelect({}, { className: 'custom-content-class' })

      await user.click(screen.getByTestId('select-trigger'))

      await waitFor(() => {
        const content = screen.getByTestId('select-content')
        expect(content.className).toContain('custom-content-class')
      })
    })
  })

  describe('disabled state', () => {
    it('disables trigger when disabled prop is set', () => {
      renderSelect({ disabled: true })
      const trigger = screen.getByTestId('select-trigger')
      expect(trigger).toBeDisabled()
    })

    it('shows disabled styling on disabled trigger', () => {
      renderSelect({ disabled: true })
      const trigger = screen.getByTestId('select-trigger')
      expect(trigger.className).toContain('disabled:opacity-50')
    })

    it('renders disabled items with opacity', async () => {
      const user = userEvent.setup()
      renderSelect()

      await user.click(screen.getByTestId('select-trigger'))

      await waitFor(() => {
        const disabledItem = screen.getByText('Option 3 (disabled)')
        expect(disabledItem.closest('[data-disabled]')).toBeDefined()
      })
    })
  })

  describe('groups and labels', () => {
    it('renders grouped items with label', async () => {
      const user = userEvent.setup()
      render(
        <Select.Root>
          <Select.Trigger data-testid="select-trigger">
            <Select.Value placeholder="Select..." />
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              <Select.Label>Fruits</Select.Label>
              <Select.Item value="apple">Apple</Select.Item>
              <Select.Item value="banana">Banana</Select.Item>
            </Select.Group>
            <Select.Separator />
            <Select.Group>
              <Select.Label>Vegetables</Select.Label>
              <Select.Item value="carrot">Carrot</Select.Item>
            </Select.Group>
          </Select.Content>
        </Select.Root>
      )

      await user.click(screen.getByTestId('select-trigger'))

      await waitFor(() => {
        expect(screen.getByText('Fruits')).toBeDefined()
        expect(screen.getByText('Vegetables')).toBeDefined()
        expect(screen.getByText('Apple')).toBeDefined()
        expect(screen.getByText('Carrot')).toBeDefined()
      })
    })
  })

  describe('controlled mode', () => {
    it('shows controlled value', () => {
      render(
        <Select.Root value="option2">
          <Select.Trigger data-testid="select-trigger">
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="option1">Option 1</Select.Item>
            <Select.Item value="option2">Option 2</Select.Item>
          </Select.Content>
        </Select.Root>
      )

      expect(screen.getByTestId('select-trigger')).toHaveTextContent('Option 2')
    })
  })
})
