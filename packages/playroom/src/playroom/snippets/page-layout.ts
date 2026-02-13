import type { Snippet } from './types'

export const pageLayoutSnippets: Snippet[] = [
  {
    group: 'PageLayout',
    name: 'Basic with Header',
    code: `<PageLayout
  header={
    <PageHeader title="My App">
      <Navigation orientation="horizontal">
        <NavItem href="#" active>Dashboard</NavItem>
        <NavItem href="#">Settings</NavItem>
      </Navigation>
    </PageHeader>
  }
>
  <h1 className="text-2xl font-bold">Welcome</h1>
  <p className="mt-sm text-foreground-muted">Main content goes here.</p>
</PageLayout>`,
  },
  {
    group: 'PageLayout',
    name: 'With Sidebar',
    code: `<PageLayout
  header={
    <PageHeader title="Dashboard" />
  }
  sidebar={
    <div className="w-64 p-base">
      <Navigation orientation="vertical">
        <NavItem href="#" icon="dashboard" active>Overview</NavItem>
        <NavItem href="#" icon="components">Components</NavItem>
        <NavItem href="#" icon="toggle">Settings</NavItem>
      </Navigation>
    </div>
  }
>
  <h1 className="text-2xl font-bold">Overview</h1>
</PageLayout>`,
  },
  {
    group: 'PageLayout',
    name: 'Full Layout',
    code: `<PageLayout
  header={
    <PageHeader title="Traceframe">
      <Navigation orientation="horizontal">
        <NavItem href="#" active>Dashboard</NavItem>
        <NavItem href="#">Reports</NavItem>
      </Navigation>
    </PageHeader>
  }
  sidebar={
    <div className="w-64 p-base">
      <Navigation orientation="vertical">
        <NavItem href="#" icon="dashboard" active>Overview</NavItem>
        <NavItem href="#" icon="package">Packages</NavItem>
      </Navigation>
    </div>
  }
  footer={
    <div className="flex h-size-lg items-center justify-between px-base text-sm text-foreground-muted">
      <span>v1.0.0</span>
      <span>Last updated: Today</span>
    </div>
  }
>
  <Stack gap="base">
    <h1 className="text-2xl font-bold">Dashboard</h1>
    <p className="text-foreground-muted">Welcome to your project.</p>
  </Stack>
</PageLayout>`,
  },
  {
    group: 'PageLayout',
    name: 'Right Sidebar (Docs)',
    code: `<PageLayout
  header={<PageHeader title="Documentation" />}
  sidebar={
    <div className="w-56 p-base">
      <h3 className="mb-md font-semibold">On This Page</h3>
      <Navigation orientation="vertical">
        <NavItem href="#" active>Introduction</NavItem>
        <NavItem href="#">Getting Started</NavItem>
        <NavItem href="#">API Reference</NavItem>
      </Navigation>
    </div>
  }
  sidebarPosition="right"
>
  <h1 className="text-2xl font-bold">Introduction</h1>
  <p className="mt-base text-foreground-muted">Documentation content here.</p>
</PageLayout>`,
  },
]
