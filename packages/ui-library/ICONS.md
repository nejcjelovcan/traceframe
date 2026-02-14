# Icons

Standardized icon system for elementex applications.

## Usage

```typescript
import { Icon } from '@nejcjelovcan/traceframe-ui-library'

<Icon name="search" />
<Icon name="package" size="lg" />
<Icon name="alert-circle" className="text-error-500" />
```

## Icon Component API

| Prop         | Type                 | Default                   | Description                                     |
| ------------ | -------------------- | ------------------------- | ----------------------------------------------- |
| `name`       | `IconName`           | Required                  | Icon identifier from the registry               |
| `size`       | `IconSize \| number` | `'md'`                    | Size preset or custom pixel value               |
| `stroke`     | `number`             | `2` (or `1.5` for xl/2xl) | SVG stroke width                                |
| `className`  | `string`             | -                         | Additional CSS classes for styling              |
| `aria-label` | `string`             | -                         | Accessibility label (makes icon non-decorative) |

## Sizes

| Size  | Pixels | Use Case                       |
| ----- | ------ | ------------------------------ |
| `xs`  | 12     | Inline badges, very compact UI |
| `sm`  | 16     | Buttons, inline with text      |
| `md`  | 20     | Default size, general use      |
| `lg`  | 24     | Headers, emphasis              |
| `xl`  | 32     | Features, section headers      |
| `2xl` | 48     | Empty states, hero sections    |

Larger sizes (`xl`, `2xl`) automatically use a lighter stroke (1.5) for better appearance.

## Available Icons

### Navigation

| Name            | Use Case                         |
| --------------- | -------------------------------- |
| `chevron-down`  | Dropdowns, expand sections       |
| `chevron-up`    | Collapse sections                |
| `chevron-right` | Navigation forward, nested items |
| `chevron-left`  | Navigation back                  |
| `arrow-left`    | Back navigation links            |
| `arrow-right`   | Forward navigation, CTAs         |

### Actions

| Name            | Use Case                             |
| --------------- | ------------------------------------ |
| `search`        | Search inputs and actions            |
| `search-off`    | "No results found" empty states      |
| `close`         | Close buttons, dismiss, clear        |
| `check`         | Success states, selected items       |
| `copy`          | Copy-to-clipboard actions            |
| `plus`          | Add/create actions, increment        |
| `minus`         | Remove actions, decrement, collapse  |
| `trash`         | Destructive delete actions           |
| `settings`      | Settings, preferences, configuration |
| `menu`          | Hamburger menu, sidebar toggles      |
| `filter`        | Filtering, faceted search            |
| `link`          | Hyperlinks, URL references           |
| `upload`        | File upload, data import             |
| `download`      | File download, data export           |
| `eye-off`       | Toggle visibility off, hide content  |
| `lock`          | Locked/protected content, security   |
| `help`          | Help tooltips, documentation links   |
| `bookmark`      | Saved/favorited items                |
| `dots-vertical` | Vertical "more" menu (kebab)         |

### Status & Feedback

| Name           | Use Case                                        |
| -------------- | ----------------------------------------------- |
| `alert-circle` | Errors, warnings, important alerts              |
| `info-circle`  | Informational tooltips, help text               |
| `resolved`     | Resolved/verified imports, confirmed references |
| `unresolved`   | Unresolved imports, broken references           |
| `pending`      | In-progress states                              |
| `empty`        | Empty/null/unset states                         |
| `success`      | Success states, completed operations            |
| `error`        | Error states, failed operations                 |
| `warning`      | Warning states, caution indicators              |

### Sorting

| Name        | Use Case                     |
| ----------- | ---------------------------- |
| `sort-asc`  | Table header ascending sort  |
| `sort-desc` | Table header descending sort |
| `sort-none` | Sortable but unsorted column |

### Theme

| Name      | Use Case                 |
| --------- | ------------------------ |
| `sun`     | Light theme option       |
| `moon`    | Dark theme option        |
| `desktop` | System/auto theme option |

### Entities (Domain-specific)

| Name               | Use Case                                   |
| ------------------ | ------------------------------------------ |
| `package`          | npm packages, library dependencies         |
| `component`        | React components                           |
| `hierarchy`        | Component hierarchy, tree structures       |
| `file`             | Generic source files                       |
| `file-code`        | Code files (.ts, .tsx, .js)                |
| `file-search`      | Search in files features                   |
| `file-description` | Documentation, props/interface definitions |
| `location-code`    | Code locations, line numbers               |
| `external`         | External dependencies (node_modules)       |
| `internal`         | Local/internal imports                     |
| `folder`           | Directories, file system organization      |
| `hash`             | Tags, channels, ID references              |

### Code & Props

| Name         | Use Case                          |
| ------------ | --------------------------------- |
| `code`       | Literal code values, generic code |
| `element`    | JSX elements, component instances |
| `brackets`   | Arrays, indexed access            |
| `dots`       | Spread props, "more" indicators   |
| `toggle`     | Boolean props, toggle states      |
| `percentage` | Percentage metrics, scores        |
| `prop`       | Component props/attributes        |
| `prop-name`  | Prop names, identifiers           |
| `prop-value` | Prop values, expressions          |
| `string`     | String literal values             |
| `function`   | Function props, callbacks         |

### Data & Metrics

| Name         | Use Case                          |
| ------------ | --------------------------------- |
| `database`   | Data-related features, storage    |
| `chart`      | Statistics, analytics, metrics    |
| `users`      | User counts, team metrics         |
| `components` | Component counts, component lists |
| `calendar`   | Date pickers, scheduling          |
| `clock`      | Time display, timestamps          |
| `history`    | Version history, recent items     |

### Agentic Workflows

| Name           | Use Case                                   |
| -------------- | ------------------------------------------ |
| `agent`        | AI agent or autonomous process             |
| `orchestrator` | Orchestrator coordinating agents/workflows |
| `write`        | Write/compose actions                      |
| `read`         | Read/inspect actions                       |
| `edit`         | Edit/modify actions                        |
| `tool`         | Tool calls or tool invocations             |
| `text`         | Text content or output                     |
| `prompt`       | Prompts or command inputs                  |
| `idle`         | Idle/inactive agent state                  |
| `waiting`      | Waiting/blocked agent state                |
| `implement`    | Implementation/building actions            |
| `refine`       | Refining/polishing actions                 |
| `working`      | Active/in-progress agent state             |
| `watching`     | Watching/monitoring state                  |
| `message`      | Messages between agents                    |
| `polling`      | Polling or repeated checking               |
| `start`        | Starting workflows or processes            |
| `stop`         | Stopping workflows or processes            |

### Brand & Integrations

| Name     | Use Case                              |
| -------- | ------------------------------------- |
| `github` | GitHub integrations, repository links |
| `linear` | Linear integrations, issue tracking   |

### Developer Tools

| Name               | Use Case                              |
| ------------------ | ------------------------------------- |
| `terminal`         | CLI, command execution, console       |
| `git-branch`       | Branch visualization, version control |
| `git-merge`        | Merge operations, combining branches  |
| `git-pull-request` | Pull request references, code review  |
| `bug`              | Bug reports, debugging                |
| `test-tube`        | Testing, test runs, experiments       |
| `rocket`           | Deployment, launches, releases        |
| `sparkles`         | AI features, magic/auto actions       |
| `bolt`             | Performance, speed, instant actions   |
| `palette`          | Design tokens, theming, color config  |

## Applying Colors

Use Tailwind classes via `className`:

```typescript
<Icon name="alert-circle" className="text-error-500" />
<Icon name="check" className="text-success-500" />
<Icon name="search" className="text-neutral-400" />
<Icon name="package" className="text-primary-500" />
```

## Accessibility

Icons are **decorative by default** (`aria-hidden="true"`).

For meaningful icons (e.g., icon-only buttons), provide an `aria-label`:

```typescript
// Decorative icon (next to text) - default behavior
<Button>
  <Icon name="search" /> Search
</Button>

// Meaningful icon (icon-only button) - provide aria-label
<button aria-label="Close dialog">
  <Icon name="close" aria-label="Close" />
</button>
```

## Adding New Icons

1. **Check if an existing icon can serve the purpose** - see aliases in metadata
2. **If not, open an issue** with label `agent:tool-request`
3. **Add to registry** in `src/icons/icons.ts`
4. **Add to types** in `src/icons/types.ts`
5. **Add metadata** in `src/icons/metadata.ts`
6. **Update this documentation**
7. **Update CLAUDE.md** if needed

## Guidelines

- Use semantic names (not Tabler icon names)
- Prefer existing icons over adding new ones
- Domain icons for elementex-specific concepts only
- Core icons for general UI patterns
- **Do NOT import directly from `@tabler/icons-react`** - always use the `Icon` component

## Programmatic Access

The icon system provides utilities for programmatic access:

```typescript
import {
  getAllIconNames,
  getIconsByCategory,
  searchIcons,
  ICON_METADATA,
  CATEGORY_LABELS,
} from '@nejcjelovcan/traceframe-ui-library'

// Get all icon names
const allIcons = getAllIconNames()

// Get icons by category
const entityIcons = getIconsByCategory('entity')

// Search icons by name, description, or aliases
const results = searchIcons('error') // Returns ['alert-circle', 'unresolved']

// Access icon metadata
const meta = ICON_METADATA['package']
// { description: 'Package/box icon', category: 'entity', usage: '...', aliases: [...] }
```

## Storybook

View all icons with interactive controls in Storybook:

```bash
pnpm --filter ui-library storybook
```

Navigate to **Icons > Icon** to see all icons organized by category with live controls.
