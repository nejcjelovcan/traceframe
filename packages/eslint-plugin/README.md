# @nejcjelovcan/eslint-plugin-traceframe

ESLint plugin that enforces semantic token usage in Traceframe projects. Catches direct palette color classes (like `bg-primary-500`) and suggests semantic alternatives (like `bg-interactive-primary`).

## Install

```bash
npm install -D @nejcjelovcan/eslint-plugin-traceframe
```

**Peer dependencies:** `eslint@^8 || ^9`

## Setup

### Flat Config (ESLint 9+)

```javascript
// eslint.config.js
import traceframePlugin from '@nejcjelovcan/eslint-plugin-traceframe'

export default [
  {
    plugins: {
      '@nejcjelovcan/traceframe': traceframePlugin,
    },
    rules: {
      '@nejcjelovcan/traceframe/no-non-semantic-colors': 'error',
      '@nejcjelovcan/traceframe/no-non-semantic-spacing': 'warn',
      '@nejcjelovcan/traceframe/no-non-semantic-sizing': 'warn',
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

**Severity in recommended config:** `error`

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

### `no-non-semantic-spacing`

Enforces semantic spacing tokens instead of numeric spacing values.

**Severity in recommended config:** `warn`

**Bad:**

```tsx
<div className="p-2 gap-4 m-8" />
```

**Good:**

```tsx
<div className="p-sm gap-md m-lg" />
```

#### Options

```javascript
'@nejcjelovcan/traceframe/no-non-semantic-spacing': ['warn', {
  // File paths exempt from this rule
  exceptions: [],
}]
```

| Option       | Type       | Default | Description                               |
| ------------ | ---------- | ------- | ----------------------------------------- |
| `exceptions` | `string[]` | `[]`    | File paths that are exempt from this rule |

### `no-non-semantic-sizing`

Enforces semantic sizing tokens instead of numeric sizing values.

**Severity in recommended config:** `warn`

**Bad:**

```tsx
<div className="h-10 w-10" />
```

**Good:**

```tsx
<div className="h-size-md w-size-md" />
```

#### Options

```javascript
'@nejcjelovcan/traceframe/no-non-semantic-sizing': ['warn', {
  // File paths exempt from this rule
  exceptions: [],
}]
```

| Option       | Type       | Default | Description                               |
| ------------ | ---------- | ------- | ----------------------------------------- |
| `exceptions` | `string[]` | `[]`    | File paths that are exempt from this rule |

## Recommended Config

The `recommended` config enables all rules with default options:

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
    '@nejcjelovcan/traceframe/no-non-semantic-spacing': ['warn'],
    '@nejcjelovcan/traceframe/no-non-semantic-sizing': ['warn'],
  },
}
```
