import type { Snippet } from './types'

export const logViewSnippets: Snippet[] = [
  // CLI variant
  {
    group: 'LogView',
    name: 'CLI Basic',
    code: `<LogView variant="cli" maxHeight="300px">
  <LogEntry timestamp="10:30:00">$ pnpm build</LogEntry>
  <LogEntry timestamp="10:30:01" level="info">Compiling 42 files...</LogEntry>
  <LogEntry timestamp="10:30:03" level="warning">Warning: Unused variable in utils.ts:12</LogEntry>
  <LogEntry timestamp="10:30:05" level="success">Build completed successfully</LogEntry>
</LogView>`,
  },
  {
    group: 'LogView',
    name: 'CLI with Prompt',
    code: `<LogView variant="cli" maxHeight="300px">
  <LogEntry timestamp="10:30:00">Welcome to the CLI.</LogEntry>
  <LogEntry timestamp="10:30:01" level="info">Type a command to get started.</LogEntry>
  <LogPrompt prefix="$ " />
</LogView>`,
  },
  {
    group: 'LogView',
    name: 'CLI All Levels',
    code: `<LogView variant="cli">
  <LogEntry timestamp="10:30:00">Default (no level)</LogEntry>
  <LogEntry timestamp="10:30:01" level="info">Info level</LogEntry>
  <LogEntry timestamp="10:30:02" level="success">Success level</LogEntry>
  <LogEntry timestamp="10:30:03" level="warning">Warning level</LogEntry>
  <LogEntry timestamp="10:30:04" level="error">Error level</LogEntry>
  <LogEntry timestamp="10:30:05" level="debug">Debug level</LogEntry>
</LogView>`,
  },
  {
    group: 'LogView',
    name: 'CLI Without Timestamps',
    code: `<LogView variant="cli" showTimestamps={false}>
  <LogEntry level="info">Building project...</LogEntry>
  <LogEntry level="success">Done in 2.3s</LogEntry>
</LogView>`,
  },
  {
    group: 'LogView',
    name: 'CLI with MinHeight',
    code: `<LogView variant="cli" minHeight="200px" maxHeight="400px">
  <LogEntry timestamp="10:30:00">$ pnpm test</LogEntry>
  <LogEntry timestamp="10:30:01" level="info">Running test suite...</LogEntry>
  <LogEntry timestamp="10:30:02" level="success">✓ Component renders correctly</LogEntry>
  <LogEntry timestamp="10:30:03" level="success">✓ Props are passed through</LogEntry>
  <LogEntry timestamp="10:30:04" level="success">✓ Events are handled</LogEntry>
  <LogEntry timestamp="10:30:05" level="info">All tests passed!</LogEntry>
</LogView>`,
  },
  {
    group: 'LogView',
    name: 'CLI Constrained Height',
    code: `<div className="flex flex-col h-96 border border-border rounded-md">
  <div className="px-base py-sm border-b border-border bg-surface-muted">
    <span className="text-sm font-medium">Terminal Output</span>
  </div>
  <LogView variant="cli" minHeight="150px" className="flex-1">
    <LogEntry timestamp="10:30:00">Starting development server...</LogEntry>
    <LogEntry timestamp="10:30:01" level="info">Watching for file changes</LogEntry>
    <LogEntry timestamp="10:30:02" level="success">Server running on http://localhost:3000</LogEntry>
    <LogEntry timestamp="10:30:05" level="warning">Warning: Unused import in App.tsx</LogEntry>
    <LogEntry timestamp="10:30:10" level="info">Rebuilding...</LogEntry>
    <LogEntry timestamp="10:30:11" level="success">Build completed</LogEntry>
  </LogView>
</div>`,
  },

  // Rich variant
  {
    group: 'LogView',
    name: 'Rich Basic',
    code: `<LogView variant="rich" maxHeight="400px">
  <LogEntry timestamp="10:30:00" icon="agent" level="info">Agent started</LogEntry>
  <LogEntry timestamp="10:30:02" icon="search">Searching codebase...</LogEntry>
  <LogEntry timestamp="10:30:05" icon="read">Reading Card.tsx</LogEntry>
  <LogEntry timestamp="10:30:08" icon="write" level="success">Created LogView.tsx</LogEntry>
  <LogEntry timestamp="10:30:10" icon="check" level="success">All tests passed</LogEntry>
</LogView>`,
  },
  {
    group: 'LogView',
    name: 'Rich with Expandable Entries',
    code: `<LogView variant="rich" maxHeight="400px">
  <LogEntry timestamp="10:30:00" icon="agent" level="info">
    Starting implementation
  </LogEntry>
  <LogEntry
    timestamp="10:30:02"
    icon="search"
    detail={
      <div className="space-y-xs font-mono text-xs">
        <div>src/components/Card.tsx</div>
        <div>src/components/Badge.tsx</div>
      </div>
    }
  >
    Found 2 matching files
  </LogEntry>
  <LogEntry
    timestamp="10:30:05"
    icon="tool"
    level="success"
    defaultExpanded
    detail={
      <div className="font-mono text-xs">
        <div className="text-status-success-foreground">8 tests passed</div>
        <div className="text-foreground-muted">Coverage: 94%</div>
      </div>
    }
  >
    Tests passed
  </LogEntry>
</LogView>`,
  },
  {
    group: 'LogView',
    name: 'Rich All Levels',
    code: `<LogView variant="rich">
  <LogEntry timestamp="10:30:00">Default (no level)</LogEntry>
  <LogEntry timestamp="10:30:01" level="info">Info level</LogEntry>
  <LogEntry timestamp="10:30:02" level="success">Success level</LogEntry>
  <LogEntry timestamp="10:30:03" level="warning">Warning level</LogEntry>
  <LogEntry timestamp="10:30:04" level="error">Error level</LogEntry>
  <LogEntry timestamp="10:30:05" level="debug">Debug level</LogEntry>
</LogView>`,
  },
  {
    group: 'LogView',
    name: 'Rich with MinHeight',
    code: `<LogView variant="rich" minHeight="250px" maxHeight="500px">
  <LogEntry timestamp="10:30:00" icon="agent" level="info">Agent initialized</LogEntry>
  <LogEntry timestamp="10:30:01" icon="search">Analyzing codebase structure...</LogEntry>
  <LogEntry timestamp="10:30:03" icon="read">Reading configuration files</LogEntry>
  <LogEntry timestamp="10:30:05" icon="tool">Running type checker</LogEntry>
  <LogEntry timestamp="10:30:08" icon="check" level="success">All checks passed</LogEntry>
  <LogEntry timestamp="10:30:10" icon="write" level="info">Generating report</LogEntry>
</LogView>`,
  },
  {
    group: 'LogView',
    name: 'Rich Flex Container',
    code: `<div className="flex flex-col h-[500px] border border-border rounded-lg overflow-hidden">
  <div className="px-base py-sm border-b border-border bg-surface-muted flex items-center gap-sm">
    <Icon name="agent" size="sm" />
    <span className="font-medium">Agent Activity</span>
  </div>
  <LogView variant="rich" minHeight="200px" className="flex-1">
    <LogEntry timestamp="10:30:00" icon="agent" level="info">
      Starting task execution
    </LogEntry>
    <LogEntry
      timestamp="10:30:02"
      icon="search"
      detail={
        <div className="space-y-xs text-xs">
          <div>Scanning 42 files...</div>
          <div className="text-foreground-muted">Pattern: *.tsx</div>
        </div>
      }
    >
      Searching codebase
    </LogEntry>
    <LogEntry timestamp="10:30:05" icon="tool" level="warning">
      Found 3 potential issues
    </LogEntry>
    <LogEntry timestamp="10:30:08" icon="write" level="success">
      Fixed all issues automatically
    </LogEntry>
  </LogView>
  <div className="px-base py-sm border-t border-border bg-surface-muted text-sm text-foreground-muted">
    Status: Idle
  </div>
</div>`,
  },
]
