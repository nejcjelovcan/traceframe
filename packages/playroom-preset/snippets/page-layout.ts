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
  <Flex gap="base">
    <h1 className="text-2xl font-bold">Dashboard</h1>
    <p className="text-foreground-muted">Welcome to your project.</p>
  </Flex>
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
  {
    group: 'PageLayout',
    name: 'Colorful Primary Theme',
    code: `<PageLayout
  variant="colorful"
  color="primary"
  header={
    <PageHeader title="Colorful Primary">
      <Navigation orientation="horizontal" variant="colorful" color="primary">
        <NavItem href="#" active>Dashboard</NavItem>
        <NavItem href="#">Analytics</NavItem>
        <NavItem href="#">Settings</NavItem>
      </Navigation>
    </PageHeader>
  }
  sidebar={
    <div className="w-64 p-base">
      <Navigation orientation="vertical" variant="colorful" color="primary">
        <NavItem href="#" icon="dashboard" active>Overview</NavItem>
        <NavItem href="#" icon="package">Packages</NavItem>
        <NavItem href="#" icon="components">Components</NavItem>
      </Navigation>
    </div>
  }
>
  <Flex gap="lg">
    <h1 className="text-2xl font-bold">Colorful Primary Layout</h1>
    <p className="text-foreground-muted">Header and sidebar use colorful variant with primary color for cohesive theming.</p>
  </Flex>
</PageLayout>`,
  },
  {
    group: 'PageLayout',
    name: 'Subtle Secondary Theme',
    code: `<PageLayout
  variant="subtle"
  color="secondary"
  header={
    <PageHeader title="Subtle Secondary">
      <Navigation orientation="horizontal" variant="subtle" color="secondary">
        <NavItem href="#" active>Home</NavItem>
        <NavItem href="#">Projects</NavItem>
        <NavItem href="#">Team</NavItem>
      </Navigation>
    </PageHeader>
  }
  sidebar={
    <div className="w-64 p-base">
      <Navigation orientation="vertical" variant="subtle" color="secondary">
        <NavItem href="#" icon="folder" active>Projects</NavItem>
        <NavItem href="#" icon="user">Team Members</NavItem>
        <NavItem href="#" icon="chart">Reports</NavItem>
      </Navigation>
    </div>
  }
>
  <Flex gap="lg">
    <h1 className="text-2xl font-bold">Subtle Secondary Layout</h1>
    <p className="text-foreground-muted">Softer visual treatment using subtle variant with secondary color.</p>
  </Flex>
</PageLayout>`,
  },
  {
    group: 'PageLayout',
    name: 'Mixed Accent Themes',
    code: `<PageLayout
  variant="subtle"
  color="accent-1"
  header={
    <PageHeader title="Multi-Accent Design">
      <Navigation orientation="horizontal" variant="subtle" color="accent-1">
        <NavItem href="#" active>Section A</NavItem>
        <NavItem href="#">Section B</NavItem>
        <NavItem href="#">Section C</NavItem>
      </Navigation>
    </PageHeader>
  }
>
  <Flex gap="lg">
    <Grid cols={3} gap="md">
      <Card variant="accent1">
        <CardHeader icon="components">Accent 1</CardHeader>
        <CardContent>Matches header theme</CardContent>
      </Card>
      <Card variant="accent2">
        <CardHeader icon="palette">Accent 2</CardHeader>
        <CardContent>Complementary color</CardContent>
      </Card>
      <Card variant="accent3">
        <CardHeader icon="code">Accent 3</CardHeader>
        <CardContent>Additional variety</CardContent>
      </Card>
    </Grid>
  </Flex>
</PageLayout>`,
  },
]
