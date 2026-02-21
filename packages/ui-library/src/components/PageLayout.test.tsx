import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Navigation, NavItem } from './Navigation'
import { PageLayout, PageHeader, SidebarToggle, sidebarWidthMap } from './PageLayout'
import { usePageLayoutContext } from './PageLayoutContext'

import type { SidebarWidth } from './PageLayout'

describe('PageLayout', () => {
  it('renders children in main content area', () => {
    render(<PageLayout>Main Content</PageLayout>)
    expect(screen.getByText('Main Content')).toBeDefined()
  })

  it('renders header when provided', () => {
    render(<PageLayout header={<div>Header Content</div>}>Content</PageLayout>)
    expect(screen.getByText('Header Content')).toBeDefined()
    const header = screen.getByText('Header Content').parentElement
    expect(header?.tagName).toBe('HEADER')
  })

  it('renders sidebar when provided', () => {
    render(<PageLayout sidebar={<div>Sidebar Content</div>}>Content</PageLayout>)
    expect(screen.getByText('Sidebar Content')).toBeDefined()
    const sidebar = screen.getByText('Sidebar Content').parentElement
    expect(sidebar?.tagName).toBe('ASIDE')
  })

  it('renders footer when provided', () => {
    render(<PageLayout footer={<div>Footer Content</div>}>Content</PageLayout>)
    expect(screen.getByText('Footer Content')).toBeDefined()
    const footer = screen.getByText('Footer Content').parentElement
    expect(footer?.tagName).toBe('FOOTER')
  })

  describe('sidebar positioning', () => {
    it('positions sidebar on left by default', () => {
      render(<PageLayout sidebar={<div>Sidebar</div>}>Content</PageLayout>)
      const sidebar = screen.getByText('Sidebar').parentElement
      expect(sidebar?.className).toContain('border-r')
    })

    it('positions sidebar on right when specified', () => {
      render(
        <PageLayout sidebar={<div>Sidebar</div>} sidebarPosition="right">
          Content
        </PageLayout>
      )
      const sidebar = screen.getByText('Sidebar').parentElement
      expect(sidebar?.className).toContain('border-l')
    })
  })

  describe('content width', () => {
    it('applies contained width by default', () => {
      render(<PageLayout>Content</PageLayout>)
      // Container wraps the content, check for mx-auto class from Container
      const main = screen.getByRole('main')
      expect(main.querySelector('.mx-auto')).toBeDefined()
    })

    it('applies full width when contentWidth="full"', () => {
      render(<PageLayout contentWidth="full">Content</PageLayout>)
      const main = screen.getByRole('main')
      // With full width, there's no Container wrapper
      expect(main.querySelector('.mx-auto')).toBeNull()
    })
  })

  describe('header behavior', () => {
    it('header is sticky', () => {
      render(<PageLayout header={<div>Header</div>}>Content</PageLayout>)
      const header = screen.getByText('Header').parentElement
      expect(header?.className).toContain('sticky')
      expect(header?.className).toContain('top-0')
    })
  })

  describe('main content behavior', () => {
    it('main content fills available space', () => {
      render(<PageLayout>Content</PageLayout>)
      const main = screen.getByRole('main')
      expect(main.className).toContain('flex-1')
    })
  })

  describe('sidebar collapsible', () => {
    it('sidebar is hidden on mobile when collapsible (default)', () => {
      render(<PageLayout sidebar={<div>Sidebar</div>}>Content</PageLayout>)
      const sidebar = screen.getByText('Sidebar').parentElement
      expect(sidebar?.className).toContain('hidden')
      expect(sidebar?.className).toContain('md:block')
    })

    it('sidebar is not hidden when sidebarCollapsible is false', () => {
      render(
        <PageLayout sidebar={<div>Sidebar</div>} sidebarCollapsible={false}>
          Content
        </PageLayout>
      )
      const sidebar = screen.getByText('Sidebar').parentElement
      expect(sidebar?.className).not.toContain('hidden')
    })
  })

  it('passes through native div props', () => {
    render(<PageLayout data-testid="page-layout">Content</PageLayout>)
    expect(screen.getByTestId('page-layout')).toBeDefined()
  })

  it('merges custom className', () => {
    render(<PageLayout className="custom-class">Content</PageLayout>)
    const layout = screen.getByRole('main').parentElement?.parentElement
    expect(layout?.className).toContain('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null as HTMLDivElement | null }
    render(<PageLayout ref={ref}>Content</PageLayout>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  describe('skip link', () => {
    it('renders skip link when skipLinkText is provided', () => {
      render(<PageLayout skipLinkText="Skip to main content">Content</PageLayout>)
      expect(screen.getByText('Skip to main content')).toBeDefined()
    })

    it('does not render skip link when skipLinkText is not provided', () => {
      render(<PageLayout>Content</PageLayout>)
      expect(screen.queryByText('Skip to main content')).toBeNull()
    })

    it('skip link points to main content', () => {
      render(<PageLayout skipLinkText="Skip">Content</PageLayout>)
      const link = screen.getByText('Skip')
      expect(link.getAttribute('href')).toBe('#main-content')
    })

    it('main element has correct id and tabIndex', () => {
      render(<PageLayout skipLinkText="Skip">Content</PageLayout>)
      const main = screen.getByRole('main')
      expect(main.getAttribute('id')).toBe('main-content')
      expect(main.getAttribute('tabIndex')).toBe('-1')
    })

    it('main element has id and tabIndex even without skip link', () => {
      render(<PageLayout>Content</PageLayout>)
      const main = screen.getByRole('main')
      expect(main.getAttribute('id')).toBe('main-content')
      expect(main.getAttribute('tabIndex')).toBe('-1')
    })
  })

  describe('variant and color props', () => {
    it('applies colorful variant to header', () => {
      render(
        <PageLayout variant="colorful" color="primary" header={<div>Header</div>}>
          Content
        </PageLayout>
      )
      const header = screen.getByText('Header').parentElement
      expect(header?.className).toContain('bg-interactive-primary')
    })

    it('applies subtle variant to header', () => {
      render(
        <PageLayout variant="subtle" color="secondary" header={<div>Header</div>}>
          Content
        </PageLayout>
      )
      const header = screen.getByText('Header').parentElement
      expect(header?.className).toContain('bg-interactive-secondary-muted')
    })

    it('applies colorful variant to sidebar', () => {
      render(
        <PageLayout variant="colorful" color="accent-1" sidebar={<div>Sidebar</div>}>
          Content
        </PageLayout>
      )
      const sidebar = screen.getByText('Sidebar').parentElement
      expect(sidebar?.className).toContain('bg-accent-1')
    })

    it('applies subtle variant to sidebar', () => {
      render(
        <PageLayout variant="subtle" color="accent-2" sidebar={<div>Sidebar</div>}>
          Content
        </PageLayout>
      )
      const sidebar = screen.getByText('Sidebar').parentElement
      expect(sidebar?.className).toContain('bg-accent-2-muted')
    })

    it('provides variant and color via context', () => {
      const TestComponent = () => {
        const context = usePageLayoutContext()
        return (
          <div>
            {context.variant}-{context.color}
          </div>
        )
      }

      render(
        <PageLayout variant="colorful" color="primary">
          <TestComponent />
        </PageLayout>
      )
      expect(screen.getByText('colorful-primary')).toBeDefined()
    })
  })

  describe('context inheritance with Navigation', () => {
    it('Navigation inherits variant from PageLayout', () => {
      render(
        <PageLayout
          variant="colorful"
          color="primary"
          header={
            <Navigation orientation="horizontal">
              <NavItem href="#">Test</NavItem>
            </Navigation>
          }
        >
          Content
        </PageLayout>
      )
      // Navigation should not have the background class when inheriting from context
      const nav = screen.getByRole('navigation')
      expect(nav.className).not.toContain('bg-interactive-primary')
    })

    it('Navigation can override inherited context', () => {
      render(
        <PageLayout
          variant="colorful"
          color="primary"
          header={
            <Navigation orientation="horizontal" variant="subtle" color="secondary">
              <NavItem href="#">Test</NavItem>
            </Navigation>
          }
        >
          Content
        </PageLayout>
      )
      // Navigation should have its own variant classes when explicitly set
      const nav = screen.getByRole('navigation')
      expect(nav.className).toContain('bg-interactive-secondary-muted')
    })

    it('PageHeader applies foreground text color when variant is colorful', () => {
      render(
        <PageLayout variant="colorful" color="primary" header={<PageHeader title="Test" />}>
          Content
        </PageLayout>
      )
      const header = screen.getByText('Test').parentElement
      expect(header?.className).toContain('text-foreground')
    })
  })

  describe('sidebar width', () => {
    it.each([
      ['xs', 'w-48'],
      ['sm', 'w-56'],
      ['md', 'w-64'],
      ['lg', 'w-72'],
      ['xl', 'w-80'],
    ] as const)('applies %s width class (%s)', (size, expectedClass) => {
      render(
        <PageLayout sidebar={<div>Sidebar</div>} sidebarWidth={size as SidebarWidth}>
          Content
        </PageLayout>
      )
      const sidebar = screen.getByText('Sidebar').parentElement
      expect(sidebar?.className).toContain(expectedClass)
    })

    it('does not apply width class when sidebarWidth is omitted', () => {
      render(<PageLayout sidebar={<div>Sidebar</div>}>Content</PageLayout>)
      const sidebar = screen.getByText('Sidebar').parentElement
      const widthClasses = Object.values(sidebarWidthMap)
      for (const cls of widthClasses) {
        expect(sidebar?.className).not.toContain(cls)
      }
    })
  })

  describe('sidebar sticky', () => {
    it('applies sticky classes when sidebarSticky is true', () => {
      render(
        <PageLayout sidebar={<div>Sidebar</div>} sidebarSticky>
          Content
        </PageLayout>
      )
      const sidebar = screen.getByText('Sidebar').parentElement
      expect(sidebar?.className).toContain('sticky')
      expect(sidebar?.className).toContain('top-0')
      expect(sidebar?.className).toContain('self-start')
    })

    it('applies overflow-y-auto to body when sidebarSticky is true', () => {
      render(
        <PageLayout sidebar={<div>Sidebar</div>} sidebarSticky>
          Content
        </PageLayout>
      )
      const main = screen.getByRole('main')
      const body = main.parentElement
      expect(body?.className).toContain('overflow-y-auto')
    })

    it('does not apply sticky classes by default', () => {
      render(<PageLayout sidebar={<div>Sidebar</div>}>Content</PageLayout>)
      const sidebar = screen.getByText('Sidebar').parentElement
      expect(sidebar?.className).not.toContain('sticky')
      expect(sidebar?.className).not.toContain('self-start')
    })

    it('does not apply overflow-y-auto to body by default', () => {
      render(<PageLayout sidebar={<div>Sidebar</div>}>Content</PageLayout>)
      const main = screen.getByRole('main')
      const body = main.parentElement
      expect(body?.className).not.toContain('overflow-y-auto')
    })
  })

  describe('SidebarToggle', () => {
    it('renders button with menu icon and md:hidden', () => {
      render(
        <PageLayout sidebar={<div>Sidebar</div>}>
          <SidebarToggle data-testid="toggle" />
        </PageLayout>
      )
      const button = screen.getByTestId('toggle')
      expect(button.tagName).toBe('BUTTON')
      expect(button.className).toContain('md:hidden')
    })

    it('has correct aria-label', () => {
      render(
        <PageLayout sidebar={<div>Sidebar</div>}>
          <SidebarToggle data-testid="toggle" />
        </PageLayout>
      )
      const button = screen.getByTestId('toggle')
      expect(button.getAttribute('aria-label')).toBe('Toggle sidebar')
    })

    it('has aria-expanded attribute', () => {
      render(
        <PageLayout sidebar={<div>Sidebar</div>}>
          <SidebarToggle data-testid="toggle" />
        </PageLayout>
      )
      const button = screen.getByTestId('toggle')
      expect(button.getAttribute('aria-expanded')).toBe('false')
    })

    it('returns null when sidebarCollapsible is false', () => {
      render(
        <PageLayout sidebar={<div>Sidebar</div>} sidebarCollapsible={false}>
          <SidebarToggle data-testid="toggle" />
        </PageLayout>
      )
      expect(screen.queryByTestId('toggle')).toBeNull()
    })

    it('returns null when there is no sidebar', () => {
      render(
        <PageLayout>
          <SidebarToggle data-testid="toggle" />
        </PageLayout>
      )
      expect(screen.queryByTestId('toggle')).toBeNull()
    })
  })

  describe('mobile sidebar overlay', () => {
    it('opens overlay when SidebarToggle is clicked', async () => {
      const user = userEvent.setup()
      render(
        <PageLayout sidebar={<div>Sidebar Content</div>}>
          <SidebarToggle data-testid="toggle" />
        </PageLayout>
      )
      await user.click(screen.getByTestId('toggle'))
      // The dialog should render the sidebar content in the overlay
      expect(screen.getByRole('dialog')).toBeDefined()
    })

    it('renders close button in overlay', async () => {
      const user = userEvent.setup()
      render(
        <PageLayout sidebar={<div>Sidebar Content</div>}>
          <SidebarToggle data-testid="toggle" />
        </PageLayout>
      )
      await user.click(screen.getByTestId('toggle'))
      expect(screen.getByLabelText('Close sidebar')).toBeDefined()
    })

    it('closes overlay when close button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <PageLayout sidebar={<div>Sidebar Content</div>}>
          <SidebarToggle data-testid="toggle" />
        </PageLayout>
      )
      await user.click(screen.getByTestId('toggle'))
      expect(screen.getByRole('dialog')).toBeDefined()

      await user.click(screen.getByLabelText('Close sidebar'))
      expect(screen.queryByRole('dialog')).toBeNull()
    })
  })

  describe('controlled mode', () => {
    it('respects controlled sidebarOpen prop', () => {
      render(
        <PageLayout
          sidebar={<div>Sidebar Content</div>}
          sidebarOpen={true}
          onSidebarOpenChange={() => {}}
        >
          Content
        </PageLayout>
      )
      expect(screen.getByRole('dialog')).toBeDefined()
    })

    it('calls onSidebarOpenChange when toggle is clicked', async () => {
      const onOpenChange = vi.fn()
      const user = userEvent.setup()
      render(
        <PageLayout
          sidebar={<div>Sidebar Content</div>}
          sidebarOpen={false}
          onSidebarOpenChange={onOpenChange}
        >
          <SidebarToggle data-testid="toggle" />
        </PageLayout>
      )
      await user.click(screen.getByTestId('toggle'))
      expect(onOpenChange).toHaveBeenCalledWith(true)
    })
  })

  describe('backwards compatibility', () => {
    it('works without any new props', () => {
      render(
        <PageLayout
          header={<div>Header</div>}
          sidebar={<div>Sidebar</div>}
          footer={<div>Footer</div>}
        >
          Content
        </PageLayout>
      )
      expect(screen.getByText('Header')).toBeDefined()
      expect(screen.getByText('Sidebar')).toBeDefined()
      expect(screen.getByText('Footer')).toBeDefined()
      expect(screen.getByText('Content')).toBeDefined()
    })
  })
})
