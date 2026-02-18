import type { Snippet } from './types'

export const cardSnippets: Snippet[] = [
  // Basic
  {
    group: 'Card',
    name: 'Basic Card',
    code: `<Card>
  <CardHeader>Title</CardHeader>
  <CardContent>
    <p>Card content goes here.</p>
  </CardContent>
</Card>`,
  },
  {
    group: 'Card',
    name: 'Content Only',
    code: `<Card>
  <CardContent>
    <p>Simple card with just content.</p>
  </CardContent>
</Card>`,
  },
  {
    group: 'Card',
    name: 'Full Card (Header + Content + Footer)',
    code: `<Card>
  <CardHeader>Title</CardHeader>
  <CardContent>
    <p>Main content area.</p>
  </CardContent>
  <CardFooter>
    <Button variant="ghost" size="sm">Action</Button>
  </CardFooter>
</Card>`,
  },

  // Variants
  {
    group: 'Card',
    name: 'Elevated',
    code: `<Card variant="elevated">
  <CardHeader>Featured</CardHeader>
  <CardContent>
    <p>Card with shadow for visual hierarchy.</p>
  </CardContent>
</Card>`,
  },

  // Status Variants
  {
    group: 'Card',
    name: 'Info',
    code: `<Card variant="info">
  <CardHeader icon="info-circle">Information</CardHeader>
  <CardContent>
    <p>Informational content with blue tint.</p>
  </CardContent>
</Card>`,
  },
  {
    group: 'Card',
    name: 'Success',
    code: `<Card variant="success">
  <CardHeader icon="check">Success</CardHeader>
  <CardContent>
    <p>Successful state or positive outcome.</p>
  </CardContent>
</Card>`,
  },
  {
    group: 'Card',
    name: 'Warning',
    code: `<Card variant="warning">
  <CardHeader icon="alert-circle">Warning</CardHeader>
  <CardContent>
    <p>Warning state requiring attention.</p>
  </CardContent>
</Card>`,
  },
  {
    group: 'Card',
    name: 'Error',
    code: `<Card variant="error">
  <CardHeader icon="alert-circle">Error</CardHeader>
  <CardContent>
    <p>Error or critical state.</p>
  </CardContent>
</Card>`,
  },

  // Icons
  {
    group: 'Card',
    name: 'With Left Icon',
    code: `<Card>
  <CardHeader icon="package">Package Details</CardHeader>
  <CardContent>
    <p>Icon appears on the left side.</p>
  </CardContent>
</Card>`,
  },
  {
    group: 'Card',
    name: 'With Right Icon',
    code: `<Card>
  <CardHeader icon="chevron-right" iconPosition="right">
    Navigate
  </CardHeader>
  <CardContent>
    <p>Icon appears on the right side.</p>
  </CardContent>
</Card>`,
  },

  // Primary & Secondary Variants
  {
    group: 'Card',
    name: 'Primary Gradient',
    code: `<Card variant="primary">
  <CardHeader icon="star">Featured</CardHeader>
  <CardContent>
    <p>Primary gradient background for emphasis.</p>
  </CardContent>
</Card>`,
  },
  {
    group: 'Card',
    name: 'Secondary Gradient',
    code: `<Card variant="secondary">
  <CardHeader icon="palette">Alternative</CardHeader>
  <CardContent>
    <p>Secondary gradient for complementary emphasis.</p>
  </CardContent>
</Card>`,
  },

  // Accent Variants
  {
    group: 'Card',
    name: 'Accent 1',
    code: `<Card variant="accent1" className="w-64">
  <CardHeader>Category A</CardHeader>
  <CardContent>
    <p>Accent 1</p>
  </CardContent>
</Card>`,
  },
  {
    group: 'Card',
    name: 'Accent 2',
    code: `<Card variant="accent2" className="w-64">
  <CardHeader>Category B</CardHeader>
  <CardContent>
    <p>Accent 2</p>
  </CardContent>
</Card>`,
  },
  {
    group: 'Card',
    name: 'Accent 3',
    code: `<Card variant="accent3" className="w-64">
  <CardHeader>Category C</CardHeader>
  <CardContent>
    <p>Accent 3</p>
  </CardContent>
</Card>`,
  },
  {
    group: 'Card',
    name: 'Accent 4',
    code: `<Card variant="accent4" className="w-64">
  <CardHeader>Category D</CardHeader>
  <CardContent>
    <p>Accent 4</p>
  </CardContent>
</Card>`,
  },
  {
    group: 'Card',
    name: 'Accent 5',
    code: `<Card variant="accent5" className="w-64">
  <CardHeader>Category E</CardHeader>
  <CardContent>
    <p>Accent 5</p>
  </CardContent>
</Card>`,
  },

  // Data Variants (Deprecated - Use Accent Variants)
  {
    group: 'Card',
    name: 'Data 1',
    code: `<Card variant="data1" className="w-64">
  <CardHeader>Dataset 1</CardHeader>
  <CardContent>
    <p>Data 1</p>
  </CardContent>
</Card>`,
  },
  {
    group: 'Card',
    name: 'Data 2',
    code: `<Card variant="data2" className="w-64">
  <CardHeader>Dataset 2</CardHeader>
  <CardContent>
    <p>Data 2</p>
  </CardContent>
</Card>`,
  },

  // Real-world Examples
  {
    group: 'Card',
    name: 'Stats Card',
    code: `<Card variant="elevated">
  <CardHeader icon="chart">Component Stats</CardHeader>
  <CardContent>
    <ul className="space-y-sm text-sm">
      <li>Total usages: 42</li>
      <li>Unique imports: 12</li>
      <li>Last modified: Today</li>
    </ul>
  </CardContent>
  <CardFooter>
    <Button variant="ghost" size="sm">View Details</Button>
  </CardFooter>
</Card>`,
  },
  {
    group: 'Card',
    name: 'Card Grid',
    code: `<Stack direction="row" wrap gap="sm">
  <Card variant="accent1">
    <CardHeader>Components</CardHeader>
    <CardContent>
      <p className="text-2xl font-bold">24</p>
    </CardContent>
  </Card>
  <Card variant="accent2">
    <CardHeader>Packages</CardHeader>
    <CardContent>
      <p className="text-2xl font-bold">8</p>
    </CardContent>
  </Card>
  <Card variant="accent3">
    <CardHeader>Files</CardHeader>
    <CardContent>
      <p className="text-2xl font-bold">156</p>
    </CardContent>
  </Card>
</Stack>`,
  },
]
