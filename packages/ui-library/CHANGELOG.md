# @nejcjelovcan/traceframe-ui-library

## 0.4.0

### Minor Changes

- [#34](https://github.com/nejcjelovcan/traceframe/pull/34) [`f7943d0`](https://github.com/nejcjelovcan/traceframe/commit/f7943d0440f126a14038a131fa5eb7a9a0222e6a) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Add inverted prop to Card and StatCard components. Core variants (outlined, elevated) use CSS variable override scoping for full color inversion. Status variants (info, success, warning, error) and accent variants (accent1-5) use filled/solid emphasis backgrounds with inverted text. Includes new semantic tokens for inverted surfaces and borders.

## 0.3.0

### Minor Changes

- [#28](https://github.com/nejcjelovcan/traceframe/pull/28) [`674c747`](https://github.com/nejcjelovcan/traceframe/commit/674c747657b2a29a944f5efe1c9ad4a9f0fb72b2) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Add 34 new icons: status (success, error, warning), brand (github, linear), general actions (plus, minus, trash, settings, menu, filter, link, upload, download, eye-off, lock, help, bookmark, dots-vertical), entities (folder, hash), data (calendar, clock, history), and developer tools (terminal, git-branch, git-merge, git-pull-request, bug, test-tube, rocket, sparkles, bolt, palette)

## 0.2.0

### Minor Changes

- [#24](https://github.com/nejcjelovcan/traceframe/pull/24) [`efde399`](https://github.com/nejcjelovcan/traceframe/commit/efde3998b28b495d830c8d9a81b2ceb937dd4df3) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Add `asChild` prop to Button, NavItem, and Link components for polymorphic rendering via `@radix-ui/react-slot`

## 0.1.1

### Patch Changes

- [#19](https://github.com/nejcjelovcan/traceframe/pull/19) [`244bc1f`](https://github.com/nejcjelovcan/traceframe/commit/244bc1f648d8febfdf68c1d39b7f56ad0633b1ae) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Fix Grid responsive cols prop not applying md/lg/xl breakpoint classes due to dynamic Tailwind class construction

## 0.1.0

### Minor Changes

- [#16](https://github.com/nejcjelovcan/traceframe/pull/16) [`dd2d62b`](https://github.com/nejcjelovcan/traceframe/commit/dd2d62bf4b6f39c6c8c0ac7b5ca0e1286764cabb) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Initial release of all packages. Includes UI component library with design tokens, Icon system, ThemeProvider, and components (StatCard, LogView, etc.); ESLint plugin for semantic token enforcement; Storybook preset with theme switching; and Playroom preset with component exports and snippets.
