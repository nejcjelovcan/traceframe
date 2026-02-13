import type { Snippet } from './types'

export const navigationSnippets: Snippet[] = [
  {
    group: 'Navigation',
    name: 'Horizontal',
    code: `<Navigation orientation="horizontal">
  <NavItem href="#" active>Dashboard</NavItem>
  <NavItem href="#">Reports</NavItem>
  <NavItem href="#">Settings</NavItem>
</Navigation>`,
  },
  {
    group: 'Navigation',
    name: 'Horizontal with Icons',
    code: `<Navigation orientation="horizontal">
  <NavItem href="#" icon="dashboard" active>Dashboard</NavItem>
  <NavItem href="#" icon="file-description">Reports</NavItem>
  <NavItem href="#" icon="toggle">Settings</NavItem>
</Navigation>`,
  },
  {
    group: 'Navigation',
    name: 'Vertical Sidebar',
    code: `<Navigation orientation="vertical">
  <NavItem href="#" icon="dashboard" active>Overview</NavItem>
  <NavItem href="#" icon="components">Components</NavItem>
  <NavItem href="#" icon="hierarchy">Dependencies</NavItem>
  <NavItem href="#" icon="alert-circle">Issues</NavItem>
  <NavItem href="#" icon="toggle">Settings</NavItem>
</Navigation>`,
  },
  {
    group: 'Navigation',
    name: 'Sidebar with Sections',
    code: `<div className="w-64 border-r border-border bg-surface p-base">
  <h3 className="mb-md text-sm font-semibold uppercase tracking-wider text-foreground-muted">
    Main Menu
  </h3>
  <Navigation orientation="vertical">
    <NavItem href="#" icon="dashboard" active>Dashboard</NavItem>
    <NavItem href="#" icon="package">Packages</NavItem>
    <NavItem href="#" icon="components">Components</NavItem>
  </Navigation>
  <h3 className="mb-md mt-lg text-sm font-semibold uppercase tracking-wider text-foreground-muted">
    Tools
  </h3>
  <Navigation orientation="vertical">
    <NavItem href="#" icon="search">Search</NavItem>
    <NavItem href="#" icon="chart">Reports</NavItem>
  </Navigation>
</div>`,
  },
]
