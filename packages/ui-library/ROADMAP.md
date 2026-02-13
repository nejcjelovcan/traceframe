# UI Library Roadmap

Component development roadmap for `@traceframe/ui-library`. This runs as a parallel track supporting reporter and future Traceframe applications.

## Track Overview

| Track        | Status      | Components                        |
| ------------ | ----------- | --------------------------------- |
| Foundation   | Complete    | Button, cn utility, design tokens |
| Primitives   | Not Started | Badge, Link, Card                 |
| Data Display | Not Started | DataTable, StatCard               |
| Layout       | Not Started | Container, Stack, Grid            |
| Feedback     | Not Started | Spinner, EmptyState, ErrorState   |
| Charts       | Not Started | BarChart (lightweight)            |

---

## Track 1: Foundation (Complete)

Core infrastructure and first component.

### Deliverables

- [x] Package scaffolding with Vite library mode
- [x] Tailwind CSS configuration with design tokens
- [x] Storybook setup for component development
- [x] `cn` utility (clsx + tailwind-merge)
- [x] `Button` component with variants (primary, secondary, outline, ghost, destructive)
- [x] Testing setup with Vitest + Testing Library

---

## Track 2: Primitives

Small, composable building blocks.

### Badge

Status indicator for counts, labels, and tags.

```tsx
<Badge variant="default">12 usages</Badge>
<Badge variant="success">Resolved</Badge>
<Badge variant="warning">Deprecated</Badge>
<Badge variant="error">3 errors</Badge>
```

**Variants**: default, success, warning, error
**Sizes**: sm, md

### Link

Styled anchor for internal and external links.

```tsx
<Link href="/packages">View packages</Link>
<Link href="https://github.com" external>GitHub</Link>
```

**Props**: href, external (opens in new tab with rel attributes)

### Card

Container for grouped content.

```tsx
<Card>
  <CardHeader>Title</CardHeader>
  <CardContent>Body content</CardContent>
</Card>
```

**Subcomponents**: Card, CardHeader, CardContent, CardFooter

### Acceptance Criteria

- [ ] All components have Storybook stories
- [ ] All components have unit tests (render, variants, accessibility)
- [ ] Exported from package index

---

## Track 3: Data Display

Components for presenting data.

### DataTable

Sortable, accessible table for tabular data.

```tsx
<DataTable
  columns={[
    { key: 'name', header: 'Name', sortable: true },
    { key: 'count', header: 'Usage Count', sortable: true },
  ]}
  data={packages}
  onSort={handleSort}
/>
```

**Features**:

- Column definitions with sortable flag
- Sort state management (controlled)
- Row click handler
- Empty state slot
- Accessible table markup (scope, headers)

### StatCard

Metric display card for dashboards.

```tsx
<StatCard label="Components Found" value={142} trend="+12" icon={ComponentIcon} />
```

**Props**: label, value, trend (optional), icon (optional)

### Acceptance Criteria

- [ ] DataTable handles 1000+ rows without jank
- [ ] Keyboard navigation for sortable columns
- [ ] Screen reader announcements for sort changes

---

## Track 4: Layout

Structural components for page composition.

### Container

Max-width wrapper with responsive padding.

```tsx
<Container size="lg">Content</Container>
```

**Sizes**: sm (640px), md (768px), lg (1024px), xl (1280px), full

### Stack

Flexbox layout for vertical/horizontal stacking.

```tsx
<Stack direction="vertical" gap="4">
  <Item />
  <Item />
</Stack>
```

**Props**: direction (vertical, horizontal), gap, align, justify

### Grid

CSS Grid wrapper for dashboard layouts.

```tsx
<Grid cols={3} gap="6">
  <StatCard />
  <StatCard />
  <StatCard />
</Grid>
```

**Props**: cols (1-4 or responsive object), gap

### Acceptance Criteria

- [ ] Responsive behavior documented in Storybook
- [ ] Works with all child component types

---

## Track 5: Feedback

States and loading indicators.

### Spinner

Loading indicator.

```tsx
<Spinner size="md" />
```

**Sizes**: sm, md, lg

### EmptyState

Placeholder for empty data.

```tsx
<EmptyState
  title="No packages found"
  description="Run a scan to see component usage"
  action={<Button>Run Scan</Button>}
/>
```

### ErrorState

Error display with retry option.

```tsx
<ErrorState title="Failed to load data" error={error.message} onRetry={handleRetry} />
```

### Acceptance Criteria

- [ ] Consistent styling across all states
- [ ] Accessible announcements for screen readers

---

## Track 6: Charts (Future)

Lightweight chart components for visualizations.

### BarChart

Horizontal bar chart for usage statistics.

```tsx
<BarChart
  data={[
    { label: 'Button', value: 45 },
    { label: 'Card', value: 32 },
  ]}
  maxBars={10}
/>
```

**Approach**: CSS-based bars (no heavy charting library), accessible with ARIA

### Acceptance Criteria

- [ ] No runtime dependencies (pure CSS + React)
- [ ] Accessible data representation
- [ ] Responsive scaling

---

## Development Guidelines

### Adding Components

1. Create `src/components/ComponentName.tsx`
2. Add tests: `src/components/ComponentName.test.tsx`
3. Add stories: `src/components/ComponentName.stories.tsx`
4. Export from `src/index.ts`

### Component Standards

- Use CVA for variant management
- Props interface extends native element props where applicable
- Forward refs for DOM access
- Accessible by default (ARIA, keyboard nav)

### Testing Requirements

- Render tests for all variants
- Accessibility tests (no violations)
- Interaction tests for interactive components

---

## Dependencies on Reporter

The ui-library development is driven by reporter needs:

| Reporter Phase         | Required ui-library Components  |
| ---------------------- | ------------------------------- |
| Phase 3: Basic UI      | Badge, Card, DataTable          |
| Phase 4: Pages         | StatCard, Stack, Grid           |
| Phase 5: Polish        | Spinner, EmptyState, ErrorState |
| Future: Visualizations | BarChart                        |

Components should be developed just-in-time for reporter phases, not speculatively.
