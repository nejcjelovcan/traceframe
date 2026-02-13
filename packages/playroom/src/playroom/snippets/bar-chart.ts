import type { Snippet } from './types'

export const barChartSnippets: Snippet[] = [
  {
    group: 'BarChart',
    name: 'Basic Horizontal',
    code: `<BarChart
  data={[
    { label: 'Button', value: 45 },
    { label: 'Card', value: 30 },
    { label: 'Badge', value: 25 },
    { label: 'Input', value: 18 },
  ]}
  ariaLabel="Component usage"
/>`,
  },
  {
    group: 'BarChart',
    name: 'Vertical',
    code: `<BarChart
  data={[
    { label: 'A', value: 85 },
    { label: 'B', value: 60 },
    { label: 'C', value: 40 },
    { label: 'D', value: 25 },
  ]}
  orientation="vertical"
  ariaLabel="Vertical chart"
/>
`,
  },
  {
    group: 'BarChart',
    name: 'Semantic Colors (Coverage)',
    code: `<BarChart
  data={[
    { label: 'High', value: 90 },
    { label: 'Medium', value: 50 },
    { label: 'Low', value: 20 },
  ]}
  colorScheme="semantic"
  thresholds={{ warning: 60, error: 30 }}
  formatValue={(v) => \`\${v}%\`}
  showValues
  ariaLabel="Code coverage"
/>`,
  },
  {
    group: 'BarChart',
    name: 'With Inline Values',
    code: `<BarChart
  data={[
    { label: 'TypeScript', value: 85 },
    { label: 'JavaScript', value: 60 },
    { label: 'CSS', value: 42 },
  ]}
  showValues
  formatValue={(v) => \`\${v}%\`}
  ariaLabel="Language distribution"
/>`,
  },
]
