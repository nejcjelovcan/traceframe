import { render, screen, fireEvent } from '@testing-library/react'
import { useState } from 'react'
import { describe, it, expect, vi } from 'vitest'

import { ActionList } from './ActionList.js'

describe('ActionList', () => {
  describe('Rendering', () => {
    it('renders items correctly', () => {
      render(
        <ActionList.Root>
          <ActionList.Item value="item-1">
            <ActionList.ItemText>Item 1</ActionList.ItemText>
          </ActionList.Item>
          <ActionList.Item value="item-2">
            <ActionList.ItemText>Item 2</ActionList.ItemText>
          </ActionList.Item>
        </ActionList.Root>
      )

      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
    })

    it('renders with descriptions', () => {
      render(
        <ActionList.Root>
          <ActionList.Item value="item-1">
            <ActionList.ItemText>Item 1</ActionList.ItemText>
            <ActionList.ItemDescription>Description 1</ActionList.ItemDescription>
          </ActionList.Item>
        </ActionList.Root>
      )

      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Description 1')).toBeInTheDocument()
    })

    it('renders with groups and labels', () => {
      render(
        <ActionList.Root>
          <ActionList.Group>
            <ActionList.Label>Group 1</ActionList.Label>
            <ActionList.Item value="item-1">
              <ActionList.ItemText>Item 1</ActionList.ItemText>
            </ActionList.Item>
          </ActionList.Group>
          <ActionList.Separator />
          <ActionList.Group>
            <ActionList.Label>Group 2</ActionList.Label>
            <ActionList.Item value="item-2">
              <ActionList.ItemText>Item 2</ActionList.ItemText>
            </ActionList.Item>
          </ActionList.Group>
        </ActionList.Root>
      )

      expect(screen.getByText('Group 1')).toBeInTheDocument()
      expect(screen.getByText('Group 2')).toBeInTheDocument()
      expect(screen.getByRole('separator')).toBeInTheDocument()
    })

    it('renders with status indicators', () => {
      const { container } = render(
        <ActionList.Root>
          <ActionList.Item value="item-1" status="active">
            <ActionList.ItemText>Active Item</ActionList.ItemText>
          </ActionList.Item>
          <ActionList.Item value="item-2" status="completed">
            <ActionList.ItemText>Completed Item</ActionList.ItemText>
          </ActionList.Item>
          <ActionList.Item value="item-3" status="failed">
            <ActionList.ItemText>Failed Item</ActionList.ItemText>
          </ActionList.Item>
          <ActionList.Item value="item-4" status="pending">
            <ActionList.ItemText>Pending Item</ActionList.ItemText>
          </ActionList.Item>
        </ActionList.Root>
      )

      // Check that status classes are applied
      const items = container.querySelectorAll('[role="option"]')
      expect(items[0]).toHaveClass('bg-status-success-muted')
      expect(items[1]).toHaveClass('bg-status-info-muted')
      expect(items[2]).toHaveClass('bg-status-error-muted')
      expect(items[3]).toHaveClass('bg-surface-muted')
    })

    it('applies variant styles', () => {
      const { container, rerender } = render(
        <ActionList.Root variant="card">
          <ActionList.Item value="item-1">
            <ActionList.ItemText>Item</ActionList.ItemText>
          </ActionList.Item>
        </ActionList.Root>
      )

      expect(container.querySelector('[role="listbox"]')).toHaveClass('border')

      rerender(
        <ActionList.Root variant="subtle">
          <ActionList.Item value="item-1">
            <ActionList.ItemText>Item</ActionList.ItemText>
          </ActionList.Item>
        </ActionList.Root>
      )

      expect(container.querySelector('[role="listbox"]')).toHaveClass('bg-surface-subtle')
    })

    it('applies density styles', () => {
      const { container, rerender } = render(
        <ActionList.Root density="compact">
          <ActionList.Item value="item-1">
            <ActionList.ItemText>Item</ActionList.ItemText>
          </ActionList.Item>
        </ActionList.Root>
      )

      expect(container.querySelector('[role="listbox"]')).toHaveClass('p-xs')

      rerender(
        <ActionList.Root density="spacious">
          <ActionList.Item value="item-1">
            <ActionList.ItemText>Item</ActionList.ItemText>
          </ActionList.Item>
        </ActionList.Root>
      )

      expect(container.querySelector('[role="listbox"]')).toHaveClass('p-md')
    })
  })

  describe('Selection', () => {
    it('handles controlled selection', () => {
      const onValueChange = vi.fn()
      const { rerender } = render(
        <ActionList.Root value="item-1" onValueChange={onValueChange}>
          <ActionList.Item value="item-1">
            <ActionList.ItemText>Item 1</ActionList.ItemText>
          </ActionList.Item>
          <ActionList.Item value="item-2">
            <ActionList.ItemText>Item 2</ActionList.ItemText>
          </ActionList.Item>
        </ActionList.Root>
      )

      const item1 = screen.getByRole('option', { name: /Item 1/ })
      const item2 = screen.getByRole('option', { name: /Item 2/ })

      expect(item1).toHaveAttribute('aria-selected', 'true')
      expect(item2).toHaveAttribute('aria-selected', 'false')

      fireEvent.click(item2)
      expect(onValueChange).toHaveBeenCalledWith('item-2')

      rerender(
        <ActionList.Root value="item-2" onValueChange={onValueChange}>
          <ActionList.Item value="item-1">
            <ActionList.ItemText>Item 1</ActionList.ItemText>
          </ActionList.Item>
          <ActionList.Item value="item-2">
            <ActionList.ItemText>Item 2</ActionList.ItemText>
          </ActionList.Item>
        </ActionList.Root>
      )

      expect(item1).toHaveAttribute('aria-selected', 'false')
      expect(item2).toHaveAttribute('aria-selected', 'true')
    })

    it('handles uncontrolled selection', () => {
      render(
        <ActionList.Root defaultValue="item-1">
          <ActionList.Item value="item-1">
            <ActionList.ItemText>Item 1</ActionList.ItemText>
          </ActionList.Item>
          <ActionList.Item value="item-2">
            <ActionList.ItemText>Item 2</ActionList.ItemText>
          </ActionList.Item>
        </ActionList.Root>
      )

      const item1 = screen.getByRole('option', { name: /Item 1/ })
      const item2 = screen.getByRole('option', { name: /Item 2/ })

      expect(item1).toHaveAttribute('aria-selected', 'true')
      expect(item2).toHaveAttribute('aria-selected', 'false')

      fireEvent.click(item2)

      expect(item1).toHaveAttribute('aria-selected', 'false')
      expect(item2).toHaveAttribute('aria-selected', 'true')
    })

    it('shows selection indicator', () => {
      const { container } = render(
        <ActionList.Root value="item-1">
          <ActionList.Item value="item-1">
            <ActionList.ItemText>Item 1</ActionList.ItemText>
          </ActionList.Item>
          <ActionList.Item value="item-2">
            <ActionList.ItemText>Item 2</ActionList.ItemText>
          </ActionList.Item>
        </ActionList.Root>
      )

      // Check for check icon on selected item
      const selectedItem = container.querySelector('[aria-selected="true"]')
      const checkIcon = selectedItem?.querySelector('svg')
      expect(checkIcon).toBeInTheDocument()
    })
  })

  describe('Keyboard Navigation', () => {
    it('navigates with arrow keys', async () => {
      render(
        <ActionList.Root>
          <ActionList.Item value="item-1">
            <ActionList.ItemText>Item 1</ActionList.ItemText>
          </ActionList.Item>
          <ActionList.Item value="item-2">
            <ActionList.ItemText>Item 2</ActionList.ItemText>
          </ActionList.Item>
          <ActionList.Item value="item-3">
            <ActionList.ItemText>Item 3</ActionList.ItemText>
          </ActionList.Item>
        </ActionList.Root>
      )

      const listbox = screen.getByRole('listbox')
      const item1 = screen.getByRole('option', { name: /Item 1/ })
      const item2 = screen.getByRole('option', { name: /Item 2/ })
      const item3 = screen.getByRole('option', { name: /Item 3/ })

      // Focus the first item
      item1.focus()

      // Navigate down
      fireEvent.keyDown(listbox, { key: 'ArrowDown' })
      expect(document.activeElement).toBe(item2)

      // Navigate down again
      fireEvent.keyDown(listbox, { key: 'ArrowDown' })
      expect(document.activeElement).toBe(item3)

      // Navigate down to wrap to first
      fireEvent.keyDown(listbox, { key: 'ArrowDown' })
      expect(document.activeElement).toBe(item1)

      // Navigate up
      fireEvent.keyDown(listbox, { key: 'ArrowUp' })
      expect(document.activeElement).toBe(item3)
    })

    it('navigates to first/last with Home/End', () => {
      render(
        <ActionList.Root>
          <ActionList.Item value="item-1">
            <ActionList.ItemText>Item 1</ActionList.ItemText>
          </ActionList.Item>
          <ActionList.Item value="item-2">
            <ActionList.ItemText>Item 2</ActionList.ItemText>
          </ActionList.Item>
          <ActionList.Item value="item-3">
            <ActionList.ItemText>Item 3</ActionList.ItemText>
          </ActionList.Item>
        </ActionList.Root>
      )

      const listbox = screen.getByRole('listbox')
      const item1 = screen.getByRole('option', { name: /Item 1/ })
      const item3 = screen.getByRole('option', { name: /Item 3/ })

      // Focus middle item
      const item2 = screen.getByRole('option', { name: /Item 2/ })
      item2.focus()

      // Press Home
      fireEvent.keyDown(listbox, { key: 'Home' })
      expect(document.activeElement).toBe(item1)

      // Press End
      fireEvent.keyDown(listbox, { key: 'End' })
      expect(document.activeElement).toBe(item3)
    })

    it('selects with Enter and Space', () => {
      const onValueChange = vi.fn()
      render(
        <ActionList.Root onValueChange={onValueChange}>
          <ActionList.Item value="item-1">
            <ActionList.ItemText>Item 1</ActionList.ItemText>
          </ActionList.Item>
          <ActionList.Item value="item-2">
            <ActionList.ItemText>Item 2</ActionList.ItemText>
          </ActionList.Item>
        </ActionList.Root>
      )

      const listbox = screen.getByRole('listbox')
      const item1 = screen.getByRole('option', { name: /Item 1/ })
      const item2 = screen.getByRole('option', { name: /Item 2/ })

      // Focus first item and press Enter
      item1.focus()
      fireEvent.keyDown(listbox, { key: 'Enter' })
      expect(onValueChange).toHaveBeenCalledWith('item-1')

      // Focus second item and press Space
      item2.focus()
      fireEvent.keyDown(listbox, { key: ' ' })
      expect(onValueChange).toHaveBeenCalledWith('item-2')
    })

    it('supports type-ahead search', async () => {
      render(
        <ActionList.Root>
          <ActionList.Item value="apple">
            <ActionList.ItemText>Apple</ActionList.ItemText>
          </ActionList.Item>
          <ActionList.Item value="banana">
            <ActionList.ItemText>Banana</ActionList.ItemText>
          </ActionList.Item>
          <ActionList.Item value="cherry">
            <ActionList.ItemText>Cherry</ActionList.ItemText>
          </ActionList.Item>
        </ActionList.Root>
      )

      const listbox = screen.getByRole('listbox')
      const banana = screen.getByRole('option', { name: /Banana/ })
      const cherry = screen.getByRole('option', { name: /Cherry/ })

      // Type 'b' to jump to Banana
      fireEvent.keyDown(listbox, { key: 'b' })
      expect(document.activeElement).toBe(banana)

      // Type 'c' to jump to Cherry
      fireEvent.keyDown(listbox, { key: 'c' })
      expect(document.activeElement).toBe(cherry)
    })
  })

  describe('Disabled State', () => {
    it('disables individual items', () => {
      const onValueChange = vi.fn()
      render(
        <ActionList.Root onValueChange={onValueChange}>
          <ActionList.Item value="item-1">
            <ActionList.ItemText>Item 1</ActionList.ItemText>
          </ActionList.Item>
          <ActionList.Item value="item-2" disabled>
            <ActionList.ItemText>Item 2</ActionList.ItemText>
          </ActionList.Item>
        </ActionList.Root>
      )

      const item2 = screen.getByRole('option', { name: /Item 2/ })
      expect(item2).toHaveAttribute('aria-disabled', 'true')

      fireEvent.click(item2)
      expect(onValueChange).not.toHaveBeenCalled()
    })

    it('disables entire list', () => {
      const onValueChange = vi.fn()
      render(
        <ActionList.Root disabled onValueChange={onValueChange}>
          <ActionList.Item value="item-1">
            <ActionList.ItemText>Item 1</ActionList.ItemText>
          </ActionList.Item>
          <ActionList.Item value="item-2">
            <ActionList.ItemText>Item 2</ActionList.ItemText>
          </ActionList.Item>
        </ActionList.Root>
      )

      const listbox = screen.getByRole('listbox')
      expect(listbox).toHaveAttribute('aria-disabled', 'true')

      const item1 = screen.getByRole('option', { name: /Item 1/ })
      fireEvent.click(item1)
      expect(onValueChange).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(
        <ActionList.Root value="item-1" orientation="horizontal">
          <ActionList.Item value="item-1">
            <ActionList.ItemText>Item 1</ActionList.ItemText>
          </ActionList.Item>
          <ActionList.Item value="item-2">
            <ActionList.ItemText>Item 2</ActionList.ItemText>
          </ActionList.Item>
        </ActionList.Root>
      )

      const listbox = screen.getByRole('listbox')
      expect(listbox).toHaveAttribute('aria-orientation', 'horizontal')

      const options = screen.getAllByRole('option')
      expect(options[0]).toHaveAttribute('aria-selected', 'true')
      expect(options[1]).toHaveAttribute('aria-selected', 'false')
    })

    it('manages focus with roving tabindex', () => {
      render(
        <ActionList.Root>
          <ActionList.Item value="item-1">
            <ActionList.ItemText>Item 1</ActionList.ItemText>
          </ActionList.Item>
          <ActionList.Item value="item-2">
            <ActionList.ItemText>Item 2</ActionList.ItemText>
          </ActionList.Item>
        </ActionList.Root>
      )

      const item1 = screen.getByRole('option', { name: /Item 1/ })
      const item2 = screen.getByRole('option', { name: /Item 2/ })

      // Initially all items have tabIndex -1
      expect(item1).toHaveAttribute('tabIndex', '-1')
      expect(item2).toHaveAttribute('tabIndex', '-1')

      // When focused, item gets tabIndex 0
      item1.focus()
      fireEvent.focus(item1)
      expect(item1).toHaveAttribute('tabIndex', '0')
      expect(item2).toHaveAttribute('tabIndex', '-1')
    })
  })

  describe('Icons', () => {
    it('renders left and right icons', () => {
      const { container } = render(
        <ActionList.Root>
          <ActionList.Item value="item-1" leftIcon="file" rightIcon="chevron-right">
            <ActionList.ItemText>Item with Icons</ActionList.ItemText>
          </ActionList.Item>
        </ActionList.Root>
      )

      const icons = container.querySelectorAll('svg')
      // Should have left icon and right icon
      expect(icons).toHaveLength(2)
    })

    it('shows check icon when selected without rightIcon', () => {
      const { container } = render(
        <ActionList.Root value="item-1">
          <ActionList.Item value="item-1">
            <ActionList.ItemText>Selected Item</ActionList.ItemText>
          </ActionList.Item>
        </ActionList.Root>
      )

      const icons = container.querySelectorAll('svg')
      // Should have check icon
      expect(icons).toHaveLength(1)
    })

    it('prefers rightIcon over check icon', () => {
      const { container } = render(
        <ActionList.Root value="item-1">
          <ActionList.Item value="item-1" rightIcon="arrow-right">
            <ActionList.ItemText>Selected Item</ActionList.ItemText>
          </ActionList.Item>
        </ActionList.Root>
      )

      const icons = container.querySelectorAll('svg')
      // Should only have the right icon, not the check
      expect(icons).toHaveLength(1)
    })
  })

  describe('Integration', () => {
    it('works as a controlled component', () => {
      function TestComponent() {
        const [value, setValue] = useState<string>('item-1')

        return (
          <div>
            <ActionList.Root value={value} onValueChange={setValue}>
              <ActionList.Item value="item-1">
                <ActionList.ItemText>Item 1</ActionList.ItemText>
              </ActionList.Item>
              <ActionList.Item value="item-2">
                <ActionList.ItemText>Item 2</ActionList.ItemText>
              </ActionList.Item>
            </ActionList.Root>
            <div data-testid="selected-value">{value}</div>
          </div>
        )
      }

      render(<TestComponent />)

      expect(screen.getByTestId('selected-value')).toHaveTextContent('item-1')

      const item2 = screen.getByRole('option', { name: /Item 2/ })
      fireEvent.click(item2)

      expect(screen.getByTestId('selected-value')).toHaveTextContent('item-2')
    })

    it('maintains selection state across rerenders', () => {
      const { rerender } = render(
        <ActionList.Root defaultValue="item-1">
          <ActionList.Item value="item-1">
            <ActionList.ItemText>Item 1</ActionList.ItemText>
          </ActionList.Item>
          <ActionList.Item value="item-2">
            <ActionList.ItemText>Item 2</ActionList.ItemText>
          </ActionList.Item>
        </ActionList.Root>
      )

      const item2 = screen.getByRole('option', { name: /Item 2/ })
      fireEvent.click(item2)
      expect(item2).toHaveAttribute('aria-selected', 'true')

      rerender(
        <ActionList.Root defaultValue="item-1">
          <ActionList.Item value="item-1">
            <ActionList.ItemText>Item 1 Updated</ActionList.ItemText>
          </ActionList.Item>
          <ActionList.Item value="item-2">
            <ActionList.ItemText>Item 2 Updated</ActionList.ItemText>
          </ActionList.Item>
        </ActionList.Root>
      )

      const updatedItem2 = screen.getByRole('option', { name: /Item 2 Updated/ })
      expect(updatedItem2).toHaveAttribute('aria-selected', 'true')
    })
  })
})
