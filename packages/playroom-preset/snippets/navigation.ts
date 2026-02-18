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
  <NavItem href="#" icon="settings">Settings</NavItem>
</Navigation>`,
  },
  {
    group: 'Navigation',
    name: 'Horizontal Filled Primary',
    code: `<Navigation orientation="horizontal" variant="filled" color="primary">
  <NavItem href="#" icon="dashboard" active>Dashboard</NavItem>
  <NavItem href="#" icon="components">Components</NavItem>
  <NavItem href="#" icon="settings">Settings</NavItem>
</Navigation>`,
  },
  {
    group: 'Navigation',
    name: 'Horizontal Filled Secondary',
    code: `<Navigation orientation="horizontal" variant="filled" color="secondary">
  <NavItem href="#" active>Overview</NavItem>
  <NavItem href="#">Analytics</NavItem>
  <NavItem href="#">Reports</NavItem>
  <NavItem href="#">Settings</NavItem>
</Navigation>`,
  },
  {
    group: 'Navigation',
    name: 'Horizontal Subtle Accent',
    code: `<Flex gap="md">
  <Navigation orientation="horizontal" variant="subtle" color="accent-1">
    <NavItem href="#" active>Accent 1</NavItem>
    <NavItem href="#">Tab 2</NavItem>
    <NavItem href="#">Tab 3</NavItem>
  </Navigation>
  <Navigation orientation="horizontal" variant="subtle" color="accent-2">
    <NavItem href="#" active>Accent 2</NavItem>
    <NavItem href="#">Tab 2</NavItem>
    <NavItem href="#">Tab 3</NavItem>
  </Navigation>
  <Navigation orientation="horizontal" variant="subtle" color="accent-3">
    <NavItem href="#" active>Accent 3</NavItem>
    <NavItem href="#">Tab 2</NavItem>
    <NavItem href="#">Tab 3</NavItem>
  </Navigation>
</Flex>`,
  },
  {
    group: 'Navigation',
    name: 'Vertical Sidebar',
    code: `<Navigation orientation="vertical">
  <NavItem href="#" icon="dashboard" active>Overview</NavItem>
  <NavItem href="#" icon="components">Components</NavItem>
  <NavItem href="#" icon="hierarchy">Dependencies</NavItem>
  <NavItem href="#" icon="alert-circle">Issues</NavItem>
  <NavItem href="#" icon="settings">Settings</NavItem>
</Navigation>`,
  },
  {
    group: 'Navigation',
    name: 'Vertical Filled Primary',
    code: `<div className="w-64">
  <Navigation orientation="vertical" variant="filled" color="primary">
    <NavItem href="#" icon="dashboard" active>Dashboard</NavItem>
    <NavItem href="#" icon="package">Packages</NavItem>
    <NavItem href="#" icon="components">Components</NavItem>
    <NavItem href="#" icon="chart">Analytics</NavItem>
    <NavItem href="#" icon="settings">Settings</NavItem>
  </Navigation>
</div>`,
  },
  {
    group: 'Navigation',
    name: 'Vertical Subtle Secondary',
    code: `<div className="w-64">
  <Navigation orientation="vertical" variant="subtle" color="secondary">
    <NavItem href="#" icon="dashboard" active>Overview</NavItem>
    <NavItem href="#" icon="search">Search</NavItem>
    <NavItem href="#" icon="file-description">Documents</NavItem>
    <NavItem href="#" icon="user">Profile</NavItem>
  </Navigation>
</div>`,
  },
  {
    group: 'Navigation',
    name: 'Vertical Subtle Accent Mix',
    code: `<div className="w-64 space-y-md">
  <Navigation orientation="vertical" variant="subtle" color="accent-1">
    <NavItem href="#" active>Category A</NavItem>
    <NavItem href="#">Item A1</NavItem>
    <NavItem href="#">Item A2</NavItem>
  </Navigation>
  <Navigation orientation="vertical" variant="subtle" color="accent-2">
    <NavItem href="#">Category B</NavItem>
    <NavItem href="#">Item B1</NavItem>
  </Navigation>
</div>`,
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
