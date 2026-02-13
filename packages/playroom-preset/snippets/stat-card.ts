import type { Snippet } from './types'

export const statCardSnippets: Snippet[] = [
  {
    group: 'StatCard',
    name: 'Basic',
    code: `<StatCard label="Components" value={42} />`,
  },
  {
    group: 'StatCard',
    name: 'With Trend',
    code: `<StatCard
  label="Downloads"
  value={1250}
  trend={{ value: 12, direction: 'up' }}
/>`,
  },
  {
    group: 'StatCard',
    name: 'With Icon',
    code: `<StatCard
  label="Packages"
  value={8}
  icon="package"
/>`,
  },
  {
    group: 'StatCard',
    name: 'Formatted Value',
    code: `<StatCard
  label="Coverage"
  value={84.5}
  formatValue={(v) => \`\${v}%\`}
  trend={{ value: 5, direction: 'up' }}
/>`,
  },
  {
    group: 'StatCard',
    name: 'Grid of Stats',
    code: `<Grid cols={{ md: 4 }} gap="base">
  <StatCard label="Components" value={142} icon="components" trend={{ value: 12, direction: 'up' }} />
  <StatCard label="Dependencies" value={48} icon="hierarchy" trend={{ value: 3, direction: 'down' }} />
  <StatCard label="Issues" value={7} icon="alert-circle" />
  <StatCard label="Coverage" value={84} formatValue={(v) => \`\${v}%\`} />
</Grid>`,
  },
]
