import type { Snippet } from './types'

export const welcomeSnippets: Snippet[] = [
  {
    group: '🏠 Welcome',
    name: 'Traceframe Playroom',
    code: `<PageLayout
  header={
    <PageHeader title="Traceframe Playroom">
      <Navigation orientation="horizontal">
        <NavItem href="#" active>Components</NavItem>
        <NavItem href="#">Examples</NavItem>
        <NavItem href="#">Documentation</NavItem>
      </Navigation>
    </PageHeader>
  }
>
  <Stack gap="lg">
    <div>
      <h1 className="text-2xl font-bold mb-sm">Welcome to Traceframe Playroom</h1>
      <p className="text-foreground-muted">
        Explore and experiment with UI components. Use the snippets menu (⌃⌥Space or Ctrl+Alt+Space) to load examples.
      </p>
    </div>

    <Grid cols={3} gap="md">
      <Card>
        <CardHeader icon="components">Components</CardHeader>
        <CardContent>
          <p className="text-sm text-foreground-muted">Browse and test individual components with interactive props</p>
        </CardContent>
      </Card>
      <Card variant="accent1">
        <CardHeader icon="palette">Themes</CardHeader>
        <CardContent>
          <p className="text-sm text-foreground-muted">Switch between Arctic, Forge, and Mist themes in light/dark modes</p>
        </CardContent>
      </Card>
      <Card variant="accent2">
        <CardHeader icon="code">Snippets</CardHeader>
        <CardContent>
          <p className="text-sm text-foreground-muted">Load pre-built examples from the snippets toolbar menu</p>
        </CardContent>
      </Card>
    </Grid>

    <div className="mt-md">
      <h2 className="text-lg font-semibold mb-sm">Quick Start Tips</h2>
      <Stack gap="sm">
        <div className="flex items-start gap-sm">
          <Icon name="chevron-right" size="sm" className="mt-xs text-status-info-foreground" />
          <div>
            <strong className="text-sm">Load Snippets:</strong>
            <span className="text-sm text-foreground-muted ml-xs">Press ⌃⌥Space (Mac) or Ctrl+Alt+Space (PC) to open the snippets menu</span>
          </div>
        </div>
        <div className="flex items-start gap-sm">
          <Icon name="chevron-right" size="sm" className="mt-xs text-status-info-foreground" />
          <div>
            <strong className="text-sm">Change Themes:</strong>
            <span className="text-sm text-foreground-muted ml-xs">Use the theme selector in the toolbar to switch between themes</span>
          </div>
        </div>
        <div className="flex items-start gap-sm">
          <Icon name="chevron-right" size="sm" className="mt-xs text-status-info-foreground" />
          <div>
            <strong className="text-sm">Responsive Preview:</strong>
            <span className="text-sm text-foreground-muted ml-xs">Add more viewports using the viewport controls</span>
          </div>
        </div>
      </Stack>
    </div>

    <div className="mt-md pt-md border-t border-border">
      <h2 className="text-lg font-semibold mb-sm">Featured Components</h2>
      <Grid cols={4} gap="sm">
        <Button variant="primary" size="sm">Primary</Button>
        <Button variant="secondary" size="sm">Secondary</Button>
        <Badge variant="info">Info Badge</Badge>
        <Badge variant="success">Success</Badge>
      </Grid>
    </div>
  </Stack>
</PageLayout>`,
  },
]
