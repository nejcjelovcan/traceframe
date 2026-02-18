---
"@nejcjelovcan/traceframe-ui-library": major
---

Unify responsive props in Grid and Flex components with breaking changes

BREAKING CHANGES:
- Grid: `ResponsiveCols` type replaced with `ResponsiveValue<ColCount>` 
- Grid: `ColsValue` type removed, use `ResponsiveValue<ColCount>` instead
- Grid: Now supports `default` breakpoint in responsive cols

NEW FEATURES:
- Flex: All variant props now accept responsive values (direction, gap, align, justify, wrap)
- New generic `ResponsiveValue<T>` type for consistent responsive prop pattern
- New `generateResponsiveClasses` utility for responsive class generation
- Both components maintain backward compatibility for static values
