import { useEffect, useState } from 'react'

import { Heading } from './Heading'
import { LogEntry, LogPrompt, LogView } from './LogView'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta<typeof LogView> = {
  title: 'Components/LogView',
  component: LogView,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A compound component for displaying sequential log output - from plain CLI/terminal streams to rich structured agent logs.

**Tier:** 2 (Behavioral) - Uses Radix Collapsible for expandable entries

**Subcomponents:**
- \`LogView\` - Main container with variant styling and auto-scroll
- \`LogEntry\` - Individual log line with timestamp, level, icon, and optional expandable detail
- \`LogPrompt\` - Optional input bar at the bottom

**Variants:**
- \`cli\` (default) - Monospaced font, muted background, terminal-style output
- \`rich\` - Standard font, structured layout with icons and expandable entries

**Log Levels:** \`info\`, \`success\`, \`warning\`, \`error\`, \`debug\` - maps to semantic status tokens

**Accessibility:**
- \`role="log"\` with \`aria-live="polite"\` on scroll container
- Expandable entries use Radix Collapsible for proper ARIA attributes
- Timestamps use \`<time>\` element
        `.trim(),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      description: 'Visual style variant',
      control: 'select',
      options: ['cli', 'rich'],
      table: { defaultValue: { summary: 'cli' } },
    },
    showTimestamps: {
      description: 'Show timestamps on entries',
      control: 'boolean',
      table: { defaultValue: { summary: 'true' } },
    },
    autoScroll: {
      description: 'Auto-scroll to bottom on new entries',
      control: 'boolean',
      table: { defaultValue: { summary: 'true' } },
    },
    maxHeight: {
      description: 'Max height of the scroll area (CSS value)',
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Default CLI
// ---------------------------------------------------------------------------

export const Default: Story = {
  args: {
    variant: 'cli',
    maxHeight: '300px',
  },
  render: (args) => (
    <LogView {...args}>
      <LogEntry timestamp="10:30:00">$ pnpm build</LogEntry>
      <LogEntry timestamp="10:30:01" level="info">
        Compiling 42 files...
      </LogEntry>
      <LogEntry timestamp="10:30:02" level="info">
        Building packages/ui-library
      </LogEntry>
      <LogEntry timestamp="10:30:03" level="warning">
        Warning: Unused variable &apos;temp&apos; in utils.ts:12
      </LogEntry>
      <LogEntry timestamp="10:30:05" level="success">
        Build completed successfully
      </LogEntry>
      <LogEntry timestamp="10:30:05" level="info">
        42 files compiled in 5.2s
      </LogEntry>
    </LogView>
  ),
}

// ---------------------------------------------------------------------------
// Rich Variant
// ---------------------------------------------------------------------------

export const Rich: Story = {
  name: 'Rich Variant',
  render: () => (
    <LogView variant="rich" maxHeight="400px">
      <LogEntry timestamp="10:30:00" icon="agent" level="info">
        Agent started task: Implement LogView component
      </LogEntry>
      <LogEntry timestamp="10:30:02" icon="search">
        Searching codebase for existing patterns...
      </LogEntry>
      <LogEntry timestamp="10:30:05" icon="read">
        Reading Card.tsx for compound component pattern
      </LogEntry>
      <LogEntry timestamp="10:30:08" icon="write" level="success">
        Created LogView.tsx
      </LogEntry>
      <LogEntry timestamp="10:30:10" icon="write" level="success">
        Created LogView.test.tsx
      </LogEntry>
      <LogEntry timestamp="10:30:12" icon="tool">
        Running pnpm build...
      </LogEntry>
      <LogEntry timestamp="10:30:15" icon="check" level="success">
        All tests passed
      </LogEntry>
    </LogView>
  ),
}

// ---------------------------------------------------------------------------
// Expandable Entries
// ---------------------------------------------------------------------------

export const ExpandableEntries: Story = {
  name: 'Expandable Entries',
  render: () => (
    <LogView variant="rich" maxHeight="500px">
      <LogEntry timestamp="10:30:00" icon="agent" level="info">
        Starting implementation
      </LogEntry>
      <LogEntry
        timestamp="10:30:02"
        icon="search"
        detail={
          <div className="space-y-xs font-mono text-xs">
            <div>packages/ui-library/src/components/Card.tsx</div>
            <div>packages/ui-library/src/components/Badge.tsx</div>
            <div>packages/ui-library/src/components/Collapsible.tsx</div>
          </div>
        }
      >
        Found 3 files matching pattern
      </LogEntry>
      <LogEntry
        timestamp="10:30:05"
        icon="read"
        detail={
          <pre className="overflow-x-auto font-mono text-xs">
            {`export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => {
    return <div className={cn(cardVariants({ variant, className }))} ref={ref} {...props} />
  }
)`}
          </pre>
        }
      >
        Reading Card.tsx (107 lines)
      </LogEntry>
      <LogEntry
        timestamp="10:30:08"
        icon="tool"
        level="error"
        detail={
          <div className="font-mono text-xs">
            <div>Error: Cannot find module &apos;./missing-dep&apos;</div>
            <div className="text-foreground-muted">
              at Object.&lt;anonymous&gt; (LogView.tsx:1:1)
            </div>
          </div>
        }
      >
        Build failed with 1 error
      </LogEntry>
      <LogEntry timestamp="10:30:10" icon="edit">
        Fixed import path
      </LogEntry>
      <LogEntry
        timestamp="10:30:12"
        icon="tool"
        level="success"
        defaultExpanded
        detail={
          <div className="font-mono text-xs">
            <div className="text-status-success-foreground">12 tests passed, 0 failed</div>
            <div className="text-foreground-muted">Time: 1.2s</div>
          </div>
        }
      >
        All tests passed
      </LogEntry>
    </LogView>
  ),
}

// ---------------------------------------------------------------------------
// With Prompt
// ---------------------------------------------------------------------------

export const WithPrompt: Story = {
  name: 'With Prompt',
  render: () => {
    const WithPromptExample = () => {
      const [entries, setEntries] = useState([
        { ts: '10:30:00', text: 'Welcome to the CLI. Type a command.' },
      ])

      const handleSubmit = (value: string) => {
        const now = new Date()
        const ts = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
        setEntries((prev) => [
          ...prev,
          { ts, text: `$ ${value}` },
          { ts, text: `Command "${value}" executed.` },
        ])
      }

      return (
        <LogView variant="cli" maxHeight="300px">
          {entries.map((e, i) => (
            <LogEntry key={i} timestamp={e.ts}>
              {e.text}
            </LogEntry>
          ))}
          <LogPrompt prefix="$ " onSubmit={handleSubmit} placeholder="Enter command..." />
        </LogView>
      )
    }

    return <WithPromptExample />
  },
}

// ---------------------------------------------------------------------------
// All Log Levels
// ---------------------------------------------------------------------------

export const AllLevels: Story = {
  name: 'All Log Levels',
  render: () => (
    <div className="flex flex-col gap-base">
      <div>
        <Heading level={3} size="sm" className="mb-sm">
          CLI Variant
        </Heading>
        <LogView variant="cli">
          <LogEntry timestamp="10:30:00">Default (no level)</LogEntry>
          <LogEntry timestamp="10:30:01" level="info">
            Info level entry
          </LogEntry>
          <LogEntry timestamp="10:30:02" level="success">
            Success level entry
          </LogEntry>
          <LogEntry timestamp="10:30:03" level="warning">
            Warning level entry
          </LogEntry>
          <LogEntry timestamp="10:30:04" level="error">
            Error level entry
          </LogEntry>
          <LogEntry timestamp="10:30:05" level="debug">
            Debug level entry
          </LogEntry>
        </LogView>
      </div>
      <div>
        <Heading level={3} size="sm" className="mb-sm">
          Rich Variant
        </Heading>
        <LogView variant="rich">
          <LogEntry timestamp="10:30:00">Default (no level)</LogEntry>
          <LogEntry timestamp="10:30:01" level="info">
            Info level entry
          </LogEntry>
          <LogEntry timestamp="10:30:02" level="success">
            Success level entry
          </LogEntry>
          <LogEntry timestamp="10:30:03" level="warning">
            Warning level entry
          </LogEntry>
          <LogEntry timestamp="10:30:04" level="error">
            Error level entry
          </LogEntry>
          <LogEntry timestamp="10:30:05" level="debug">
            Debug level entry
          </LogEntry>
        </LogView>
      </div>
    </div>
  ),
}

// ---------------------------------------------------------------------------
// Without Timestamps
// ---------------------------------------------------------------------------

export const WithoutTimestamps: Story = {
  name: 'Without Timestamps',
  render: () => (
    <LogView variant="cli" showTimestamps={false}>
      <LogEntry>Starting build...</LogEntry>
      <LogEntry level="info">Compiling files</LogEntry>
      <LogEntry level="success">Build complete</LogEntry>
    </LogView>
  ),
}

// ---------------------------------------------------------------------------
// Auto-scroll Demo
// ---------------------------------------------------------------------------

export const AutoScroll: Story = {
  name: 'Auto-scroll (Live)',
  render: () => {
    interface DemoEntry {
      ts: Date
      text: string
      level: 'info' | 'success' | 'warning' | 'error'
    }

    const AutoScrollDemo = () => {
      const [entries, setEntries] = useState<DemoEntry[]>([])
      const [running, setRunning] = useState(false)

      useEffect(() => {
        if (!running) return
        const messages: { text: string; level: DemoEntry['level'] }[] = [
          { text: 'Processing request...', level: 'info' },
          { text: 'Connecting to database...', level: 'info' },
          { text: 'Query executed successfully', level: 'success' },
          { text: 'Cache miss, fetching from origin', level: 'warning' },
          { text: 'Response sent (200 OK)', level: 'success' },
          { text: 'Connection timeout, retrying...', level: 'error' },
          { text: 'Retry successful', level: 'success' },
          { text: 'Cleaning up resources...', level: 'info' },
        ]
        let i = 0
        const interval = setInterval(() => {
          const msg = messages[i % messages.length]!
          setEntries((prev) => [...prev, { ts: new Date(), text: msg.text, level: msg.level }])
          i++
        }, 800)
        return () => clearInterval(interval)
      }, [running])

      return (
        <div className="space-y-sm">
          <button
            onClick={() => setRunning(!running)}
            className="rounded-sm bg-interactive-primary px-md py-xs text-sm text-interactive-primary-foreground hover:bg-interactive-primary-hover"
          >
            {running ? 'Stop' : 'Start'} streaming
          </button>
          <LogView variant="cli" maxHeight="250px" autoScroll={true}>
            {entries.map((e, i) => (
              <LogEntry key={i} timestamp={e.ts} level={e.level}>
                {e.text}
              </LogEntry>
            ))}
          </LogView>
        </div>
      )
    }

    return <AutoScrollDemo />
  },
}

// ---------------------------------------------------------------------------
// Showcase
// ---------------------------------------------------------------------------

export const Showcase: Story = {
  name: 'Showcase',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'A comprehensive showcase of all LogView features.',
      },
    },
  },
  render: () => (
    <div className="space-y-lg">
      {/* CLI Section */}
      <section>
        <Heading level={2} size="lg" className="mb-base">
          CLI Variant
        </Heading>
        <LogView variant="cli" maxHeight="200px">
          <LogEntry timestamp="10:30:00">$ pnpm test</LogEntry>
          <LogEntry timestamp="10:30:01" level="info">
            Running 42 tests...
          </LogEntry>
          <LogEntry timestamp="10:30:02" level="success">
            PASS src/components/Card.test.tsx (12 tests)
          </LogEntry>
          <LogEntry timestamp="10:30:03" level="success">
            PASS src/components/Badge.test.tsx (8 tests)
          </LogEntry>
          <LogEntry timestamp="10:30:04" level="error">
            FAIL src/components/LogView.test.tsx (2 failures)
          </LogEntry>
          <LogEntry timestamp="10:30:04" level="warning">
            Warning: Missing key prop in list
          </LogEntry>
          <LogEntry timestamp="10:30:05" level="info">
            Tests: 40 passed, 2 failed, 42 total
          </LogEntry>
          <LogPrompt prefix="$ " />
        </LogView>
      </section>

      {/* Rich Section */}
      <section>
        <Heading level={2} size="lg" className="mb-base">
          Rich Variant with Expandable Entries
        </Heading>
        <LogView variant="rich" maxHeight="350px">
          <LogEntry timestamp="14:00:00" icon="agent" level="info">
            Agent started: Implement feature
          </LogEntry>
          <LogEntry
            timestamp="14:00:05"
            icon="search"
            detail={
              <div className="space-y-2xs font-mono text-xs">
                <div>src/components/Button.tsx</div>
                <div>src/components/Card.tsx</div>
                <div>src/components/Input.tsx</div>
              </div>
            }
          >
            Searching for component patterns (3 results)
          </LogEntry>
          <LogEntry timestamp="14:00:10" icon="read">
            Reading Button.tsx
          </LogEntry>
          <LogEntry
            timestamp="14:00:15"
            icon="write"
            level="success"
            detail={
              <div className="font-mono text-xs text-foreground-muted">
                Created 3 files, modified 1 file
              </div>
            }
          >
            Implementation complete
          </LogEntry>
          <LogEntry
            timestamp="14:00:20"
            icon="tool"
            level="success"
            defaultExpanded
            detail={
              <div className="font-mono text-xs">
                <div className="text-status-success-foreground">15 tests passed</div>
                <div className="text-foreground-muted">Coverage: 94%</div>
              </div>
            }
          >
            Tests passed
          </LogEntry>
        </LogView>
      </section>

      {/* No Timestamps */}
      <section>
        <Heading level={2} size="lg" className="mb-base">
          Without Timestamps
        </Heading>
        <LogView variant="cli" showTimestamps={false}>
          <LogEntry level="info">Building project...</LogEntry>
          <LogEntry level="success">Done in 2.3s</LogEntry>
        </LogView>
      </section>
    </div>
  ),
}
