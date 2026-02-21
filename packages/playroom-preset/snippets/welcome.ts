import type { Snippet } from './types'

export const welcomeSnippets: Snippet[] = [
  {
    group: '🏠 Welcome',
    name: 'Traceframe Playroom',
    code: `<PageLayout
  variant="colorful"
  sidebar={
    <div className="p-base">
      <Flex gap="md" className="pt-sm">
        <Heading level="1" className="block text-lg p-xs">Traceframe playroom</Heading>
        <Navigation orientation="vertical">
          <NavItem href="#" icon="components" active>Components</NavItem>
          <NavItem href="#" icon="palette">Themes</NavItem>
          <NavItem href="#" icon="code">Snippets</NavItem>
          <NavItem href="#" icon="file">Documentation</NavItem>
        </Navigation>
      </Flex>
    </div>
  }
  sidebarWidth="sm"
  sidebarSticky
>
  <Flex gap="lg">
    <div>
      <h1 className="text-2xl font-bold mb-sm">Welcome to Traceframe Playroom</h1>
      <p className="text-foreground-muted">
        Explore and experiment with UI components. Use the snippets menu (⌘K) to load examples.
      </p>
    </div>

    <Grid cols={{sm: 3}} gap="md">
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
      <Flex gap="sm">
        <div className="flex items-start gap-sm">
          <Icon name="chevron-right" size="sm" className="mt-xs text-status-info-foreground" />
          <div>
            <strong className="text-sm">Load Snippets:</strong>
            <span className="text-sm text-foreground-muted ml-xs">Press ⌘K to open the snippets menu</span>
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
      </Flex>
    </div>

    <div className="mt-md pt-md border-t border-border">
      <h2 className="text-lg font-semibold mb-sm">Featured Components</h2>
      <Grid cols={{default:2, md:4}} gap="sm">
        <Button variant="primary" size="sm">Primary</Button>
        <Button variant="secondary" size="sm">Secondary</Button>
        <Badge variant="info">Info Badge</Badge>
        <Badge variant="success">Success</Badge>
      </Grid>
    </div>
  </Flex>
</PageLayout>`,
  },
]
