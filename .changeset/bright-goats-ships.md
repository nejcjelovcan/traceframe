---
"@nejcjelovcan/traceframe-ui-library": major
---

Update CSS color format for Tailwind v4 compatibility

BREAKING CHANGE: CSS custom properties for colors no longer require rgb() wrapper.

Migration guide:
- Before: `color: rgb(var(--color-foreground))`
- After: `color: var(--color-foreground)`

The semantic color tokens (--color-surface, --color-foreground, etc.) now contain complete RGB values after the Tailwind v4 migration. If you have custom CSS that uses these variables with rgb() wrappers, remove the rgb() function calls.

This change affects:
- All semantic color variables (--color-surface, --color-foreground, --color-border, etc.)
- The .tf-inverted class implementation
- Any custom CSS using the semantic color tokens

The palette colors and Tailwind utility classes remain unchanged and work as before.
