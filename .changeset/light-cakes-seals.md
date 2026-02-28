---
"@nejcjelovcan/traceframe-ui-library": minor
---

Add theme-specific transition token system

- Added transition-duration tokens for each theme (arctic: 150ms, mist: 250ms, forge: 50ms, aura: 350ms)
- Added transition-easing tokens with theme-specific easing functions (arctic: ease-in-out, mist: cubic-bezier, forge: linear, aura: cubic-bezier bounce)
- Added scale tokens for interactive states (hover and active) with theme-specific scale values
- Added pulse animation tokens with theme-specific durations
- Created Tailwind utility classes for applying transition tokens (transition-colors-fast, transition-transform-fast, etc.)
- Added scale utilities for interactive elements (scale-interactive, scale-hover-on-hover, scale-active-on-active)
- Updated all components to use new transition tokens instead of hardcoded Tailwind utilities
- Added TransitionShowcase story to demonstrate theme-specific motion characteristics
