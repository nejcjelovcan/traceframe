# @nejcjelovcan/traceframe-eslint-plugin

ESLint plugin that enforces semantic token usage in Traceframe projects. Catches direct palette color classes (like `bg-primary-500`) and suggests semantic alternatives (like `bg-interactive-primary`).

## Install

```bash
npm install -D @nejcjelovcan/traceframe-eslint-plugin
```

**Peer dependencies:** `eslint@^8 || ^9`

## Setup

### Flat Config (ESLint 9+)

```javascript
// eslint.config.js
import traceframePlugin from '@nejcjelovcan/traceframe-eslint-plugin'

export default [
  {
    plugins: {
      '@nejcjelovcan/traceframe': traceframePlugin,
    },
    rules: {
      '@nejcjelovcan/traceframe/no-non-semantic-colors': 'error',
    },
  },
]
```

### Legacy Config (ESLint 8)

```json
{
  "plugins": ["@nejcjelovcan/traceframe"],
  "extends": ["plugin:@nejcjelovcan/traceframe/recommended"]
}
```

## Rules

### `no-non-semantic-colors`

Detects non-semantic Tailwind color classes and suggests semantic token alternatives.

**Bad:**

```tsx
<div className="bg-primary-500 text-neutral-800 border-neutral-200" />
```

**Good:**

```tsx
<div className="bg-interactive-primary text-foreground border-border" />
```

The rule analyzes `className` strings (including template literals) and reports any direct palette color usage such as `bg-primary-500`, `text-neutral-50`, or `border-error-300`.

#### Options

```javascript
'@nejcjelovcan/traceframe/no-non-semantic-colors': ['error', {
  // Palettes to allow (skip enforcement for these)
  allowedPalettes: [],

  // Valid semantic token prefixes
  semanticTokens: [
    'surface', 'foreground', 'border', 'ring',
    'interactive', 'status', 'code', 'tooltip', 'badge',
  ],

  // File paths exempt from this rule
  exceptions: [],
}]
```

| Option            | Type       | Default   | Description                                                           |
| ----------------- | ---------- | --------- | --------------------------------------------------------------------- |
| `allowedPalettes` | `string[]` | `[]`      | Palette names to allow (e.g., `['primary']` permits `bg-primary-500`) |
| `semanticTokens`  | `string[]` | See above | Valid semantic token prefixes used in suggestions                     |
| `exceptions`      | `string[]` | `[]`      | File paths that are exempt from this rule                             |

## Recommended Config

The `recommended` config enables the rule with default options:

```javascript
// Equivalent to:
{
  rules: {
    '@nejcjelovcan/traceframe/no-non-semantic-colors': ['error', {
      allowedPalettes: [],
      semanticTokens: [
        'surface', 'foreground', 'border', 'ring',
        'interactive', 'status', 'code', 'tooltip', 'badge',
      ],
    }],
  },
}
```
