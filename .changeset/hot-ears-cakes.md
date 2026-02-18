---
"@nejcjelovcan/traceframe-ui-library": major
---

BREAKING CHANGE: Rename Stack to Flex component and update direction prop values

- Renamed `Stack` component to `Flex`
- Renamed `StackProps` to `FlexProps`  
- Renamed `stackVariants` to `flexVariants`
- Changed direction prop values from `vertical`/`horizontal` to `col`/`row`
- Updated all exports and usages throughout the codebase

Migration guide:
- Replace all imports of `Stack` with `Flex`
- Update `direction="vertical"` to `direction="col"`
- Update `direction="horizontal"` to `direction="row"`
