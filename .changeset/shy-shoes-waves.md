---
"@nejcjelovcan/traceframe-ui-library": patch
---

Fix broken design tokens in Tailwind v4 theme formatter. The theme CSS now registers all ~81 semantic color tokens instead of only ~22 top-level ones, restoring utility classes for status, accent, interactive, and nested surface/foreground/border variants.
