import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Navigation, NavItem } from './Navigation'
import { PageLayout, PageHeader } from './PageLayout'
import { usePageLayoutContext } from './PageLayoutContext'

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
    it('main content is scrollable', () => {
      render(<PageLayout>Content</PageLayout>)
      const main = screen.getByRole('main')
      expect(main.className).toContain('overflow-y-auto')
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
    it('applies filled variant to header', () => {
      render(
        <PageLayout variant="filled" color="primary" header={<div>Header</div>}>
          Content
        </PageLayout>
      )
      const header = screen.getByText('Header').parentElement
      expect(header?.className).toContain('bg-gradient-primary')
    })

    it('applies subtle variant to header', () => {
      render(
        <PageLayout variant="subtle" color="secondary" header={<div>Header</div>}>
          Content
        </PageLayout>
      )
      const header = screen.getByText('Header').parentElement
      expect(header?.className).toContain('bg-gradient-secondary-light')
    })

    it('applies filled variant to sidebar', () => {
      render(
        <PageLayout variant="filled" color="accent-1" sidebar={<div>Sidebar</div>}>
          Content
        </PageLayout>
      )
      const sidebar = screen.getByText('Sidebar').parentElement
      expect(sidebar?.className).toContain('bg-gradient-accent-1')
    })

    it('applies subtle variant to sidebar', () => {
      render(
        <PageLayout variant="subtle" color="accent-2" sidebar={<div>Sidebar</div>}>
          Content
        </PageLayout>
      )
      const sidebar = screen.getByText('Sidebar').parentElement
      expect(sidebar?.className).toContain('bg-gradient-accent-2-light')
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
        <PageLayout variant="filled" color="primary">
          <TestComponent />
        </PageLayout>
      )
      expect(screen.getByText('filled-primary')).toBeDefined()
    })
  })

  describe('context inheritance with Navigation', () => {
    it('Navigation inherits variant from PageLayout', () => {
      render(
        <PageLayout
          variant="filled"
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
      expect(nav.className).not.toContain('bg-gradient-primary')
    })

    it('Navigation can override inherited context', () => {
      render(
        <PageLayout
          variant="filled"
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
      expect(nav.className).toContain('bg-gradient-secondary-light')
    })

    it('PageHeader applies filled text color when variant is filled', () => {
      render(
        <PageLayout variant="filled" color="primary" header={<PageHeader title="Test" />}>
          Content
        </PageLayout>
      )
      const header = screen.getByText('Test').parentElement
      expect(header?.className).toContain('text-foreground-filled')
    })
  })
})
