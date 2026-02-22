# @nejcjelovcan/traceframe-ui-library

## 2.2.0

### Minor Changes

- [#110](https://github.com/nejcjelovcan/traceframe/pull/110) [`ade8550`](https://github.com/nejcjelovcan/traceframe/commit/ade855072312f1334e2a83660088a7b91e29efe8) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Add compact mode to Badge component for space-constrained UIs

### Patch Changes

- [#109](https://github.com/nejcjelovcan/traceframe/pull/109) [`e3e1564`](https://github.com/nejcjelovcan/traceframe/commit/e3e1564e393b607542d73b75455559f325d09853) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Fix className forwarding to accordion wrapper in Card component

- [#111](https://github.com/nejcjelovcan/traceframe/pull/111) [`5738d7d`](https://github.com/nejcjelovcan/traceframe/commit/5738d7d9749ac06a9961b3eea401be5cdaea3b7c) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Update semantic shades for secondary and -border

## 2.1.0

### Minor Changes

- [#106](https://github.com/nejcjelovcan/traceframe/pull/106) [`edc63de`](https://github.com/nejcjelovcan/traceframe/commit/edc63debbe9bb1145b88060cce3c4e297894bb64) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Replace emphasis color tokens with muted-border tokens for status and accent categories, update Badge and Navigation subtle variant to use muted-border for borders on muted backgrounds

- [#106](https://github.com/nejcjelovcan/traceframe/pull/106) [`edc63de`](https://github.com/nejcjelovcan/traceframe/commit/edc63debbe9bb1145b88060cce3c4e297894bb64) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Add fixed sidebar support to PageLayout: sidebarWidth prop for predefined widths, sidebarSticky for sticky positioning, mobile sidebar overlay with SidebarToggle sub-component

- [#106](https://github.com/nejcjelovcan/traceframe/pull/106) [`edc63de`](https://github.com/nejcjelovcan/traceframe/commit/edc63debbe9bb1145b88060cce3c4e297894bb64) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Rename "filled" variant to "colorful" in Navigation and PageLayout, add NavHeading subcomponent, improve nav item styling with surface-based active/hover states

- [#105](https://github.com/nejcjelovcan/traceframe/pull/105) [`679d39b`](https://github.com/nejcjelovcan/traceframe/commit/679d39bcbe6c06c60ee11a7c85505e33678cc493) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Add "Aura" theme with deep indigo primary, aqua-cyan secondary, soft diffused shadows, and the most rounded radii in the system

- [#106](https://github.com/nejcjelovcan/traceframe/pull/106) [`edc63de`](https://github.com/nejcjelovcan/traceframe/commit/edc63debbe9bb1145b88060cce3c4e297894bb64) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Overhaul shadow system: move text shadows to per-theme definitions, remove highlight shadows, fix interactive shadow tokens, add text-shadow-light and text-shadow-dark utilities

### Patch Changes

- [#103](https://github.com/nejcjelovcan/traceframe/pull/103) [`eab32be`](https://github.com/nejcjelovcan/traceframe/commit/eab32becbb3c73f458c78f5d0906da646ad18598) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Simplify palette definitions to 5 key OKLCH shades per color group with 6 intermediate shades derived via color-mix(), reducing maintenance burden while preserving all CSS custom property names

- [#106](https://github.com/nejcjelovcan/traceframe/pull/106) [`edc63de`](https://github.com/nejcjelovcan/traceframe/commit/edc63debbe9bb1145b88060cce3c4e297894bb64) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Fix icon sizing in Button and Select, fix PageLayout background color, make gradient the default Card variant for actionable cards, update light/dark token mappings and spacing

## 2.0.0

### Major Changes

- [#99](https://github.com/nejcjelovcan/traceframe/pull/99) [`ba9565e`](https://github.com/nejcjelovcan/traceframe/commit/ba9565ead720bc330340eeeba37e3463c600e16e) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - BREAKING CHANGE: Rename Stack to Flex component and update direction prop values
  - Renamed `Stack` component to `Flex`
  - Renamed `StackProps` to `FlexProps`
  - Renamed `stackVariants` to `flexVariants`
  - Changed direction prop values from `vertical`/`horizontal` to `col`/`row`
  - Updated all exports and usages throughout the codebase

  Migration guide:
  - Replace all imports of `Stack` with `Flex`
  - Update `direction="vertical"` to `direction="col"`
  - Update `direction="horizontal"` to `direction="row"`

- [#100](https://github.com/nejcjelovcan/traceframe/pull/100) [`d0c5e13`](https://github.com/nejcjelovcan/traceframe/commit/d0c5e13ba4dfbdc0764cb5332f492544426ee1c1) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Unify responsive props in Grid and Flex components with breaking changes

  BREAKING CHANGES:
  - Grid: `ResponsiveCols` type replaced with `ResponsiveValue<ColCount>`
  - Grid: `ColsValue` type removed, use `ResponsiveValue<ColCount>` instead
  - Grid: Now supports `default` breakpoint in responsive cols

  NEW FEATURES:
  - Flex: All variant props now accept responsive values (direction, gap, align, justify, wrap)
  - New generic `ResponsiveValue<T>` type for consistent responsive prop pattern
  - New `generateResponsiveClasses` utility for responsive class generation
  - Both components maintain backward compatibility for static values

### Minor Changes

- [#94](https://github.com/nejcjelovcan/traceframe/pull/94) [`7d8a579`](https://github.com/nejcjelovcan/traceframe/commit/7d8a57968eb82907a7d8afa0edd186e8739df61a) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Add auto-generated token metadata with generate-token-metadata script

- [`35ac47c`](https://github.com/nejcjelovcan/traceframe/commit/35ac47c05642c64d63eeba5d968dc6ef8185476e) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Update playroom preset, remove PageLayout overflow, add 2xl to responsive values

- [`dfb8bfd`](https://github.com/nejcjelovcan/traceframe/commit/dfb8bfdb5dc0f0309a3e67a06f51a5e53b28de5b) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Add rightContent and truncate props to CardHeader component

- [#96](https://github.com/nejcjelovcan/traceframe/pull/96) [`9c41cac`](https://github.com/nejcjelovcan/traceframe/commit/9c41cac64ef670d1ac0f50422b679cd2568c3653) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Add automated token metadata generation for MCP tools. The generate-token-metadata script extracts design tokens from CSS source files and generates TypeScript metadata with descriptions, enabling better tooling support and documentation.

## 1.8.0

### Minor Changes

- [#91](https://github.com/nejcjelovcan/traceframe/pull/91) [`5c64afb`](https://github.com/nejcjelovcan/traceframe/commit/5c64afb5789d5af45e86cc291ee1acaecfa1f187) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Add forge and mist themes, remove dusk and ember themes, set arctic as default theme

- [#92](https://github.com/nejcjelovcan/traceframe/pull/92) [`0a6a2bf`](https://github.com/nejcjelovcan/traceframe/commit/0a6a2bf00e17f01f3e9b28bd4d2db8b5f6086dfa) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Add variant and color props to PageLayout for coordinated backgrounds with Navigation. Replace gradient backgrounds with solid semantic color tokens (emphasis for filled, muted for subtle). Add interactive-primary-muted and interactive-secondary-muted tokens.

## 1.7.0

### Minor Changes

- [#87](https://github.com/nejcjelovcan/traceframe/pull/87) [`9f0102e`](https://github.com/nejcjelovcan/traceframe/commit/9f0102efebdb6619333bed052c61a059d9c56d6f) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Add primary, secondary, and small size Card variants; use light gradient backgrounds for status and accent cards; fix CardContent text color to always default to foreground; fix double border on collapsed accordion and header-only cards

- [#90](https://github.com/nejcjelovcan/traceframe/pull/90) [`8c2531e`](https://github.com/nejcjelovcan/traceframe/commit/8c2531e0a49ca4fd66dea408c16944166f59d632) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Add filled and subtle variants to Navigation component with gradient backgrounds and color options

- [#90](https://github.com/nejcjelovcan/traceframe/pull/90) [`8c2531e`](https://github.com/nejcjelovcan/traceframe/commit/8c2531e0a49ca4fd66dea408c16944166f59d632) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Refactor Card component with gradient backgrounds, add primary/secondary variants and size prop

## 1.6.0

### Minor Changes

- [#84](https://github.com/nejcjelovcan/traceframe/pull/84) [`7952ba5`](https://github.com/nejcjelovcan/traceframe/commit/7952ba50d1a0b15d4b0dab4680906bd9b1499958) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Add ESLint rules for typography and border radius token enforcement

- [#80](https://github.com/nejcjelovcan/traceframe/pull/80) [`babf40f`](https://github.com/nejcjelovcan/traceframe/commit/babf40fc915c6d5bcfcb633a84ca32d02cf46d51) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Refactor inverse

- [#82](https://github.com/nejcjelovcan/traceframe/pull/82) [`750e385`](https://github.com/nejcjelovcan/traceframe/commit/750e385cd7e9483762850e4cd0b3326ca2f1c49e) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Add accordion functionality to Card component - enables collapsible card content with smooth animations and controlled/uncontrolled modes

- [#79](https://github.com/nejcjelovcan/traceframe/pull/79) [`27e8b16`](https://github.com/nejcjelovcan/traceframe/commit/27e8b16c30c9dba9431c1d713f71803f26ecc267) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Switch from RGB to OKLCH palettes. So much color, woohoo!

### Patch Changes

- [#82](https://github.com/nejcjelovcan/traceframe/pull/82) [`750e385`](https://github.com/nejcjelovcan/traceframe/commit/750e385cd7e9483762850e4cd0b3326ca2f1c49e) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Fix keyboard accessibility for actionable Cards - adds proper focus ring styles and keyboard event handlers (Enter/Space) for activation

## 1.5.0

### Minor Changes

- [#74](https://github.com/nejcjelovcan/traceframe/pull/74) [`6836a17`](https://github.com/nejcjelovcan/traceframe/commit/6836a174924ff660a3db15cba8bbc396cb21c12c) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Simplify tokens pipeline: replace Style Dictionary with CSS-first approach using Tailwind v4 @theme inline. CSS files are now the source of truth for token values, with hand-maintained TypeScript metadata for MCP tools.

- [#77](https://github.com/nejcjelovcan/traceframe/pull/77) [`62ee2a9`](https://github.com/nejcjelovcan/traceframe/commit/62ee2a9c8d58a44dfc827cffa93104eca6613786) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Update Select shadows

### Patch Changes

- [#76](https://github.com/nejcjelovcan/traceframe/pull/76) [`6d1810c`](https://github.com/nejcjelovcan/traceframe/commit/6d1810c0f4c7e7e91f76b36512be1d663181c3a3) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Use thick border style instead of highlight for Navigation active states

- [#78](https://github.com/nejcjelovcan/traceframe/pull/78) [`0b78a41`](https://github.com/nejcjelovcan/traceframe/commit/0b78a416ead10b72b7aada1f16a8fc63d81d8a4c) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Fix LogView component layout and styling issues including timestamp alignment, background separation, icon vertical alignment, and text overflow handling

## 1.4.0

### Minor Changes

- [#68](https://github.com/nejcjelovcan/traceframe/pull/68) [`0de93a2`](https://github.com/nejcjelovcan/traceframe/commit/0de93a25e036da3f2c8e95c75353deb6464a7718) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Add border style, shadow, and gradient token detection and suggestion utilities for ESLint enforcement

## 1.3.0

### Minor Changes

- [#66](https://github.com/nejcjelovcan/traceframe/pull/66) [`df30a6a`](https://github.com/nejcjelovcan/traceframe/commit/df30a6a5585c6057435846c8aaefb530249e9965) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Use gradient backgrounds for Button primary, secondary, and destructive variants, remove separate gradient variants, and darken/lighten gradient tokens for light/dark modes

## 1.2.0

### Minor Changes

- [#64](https://github.com/nejcjelovcan/traceframe/pull/64) [`aca71ac`](https://github.com/nejcjelovcan/traceframe/commit/aca71accc3b0f8951c1b11bd0f81325266ba1da5) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Update outline Badge styling

- [#67](https://github.com/nejcjelovcan/traceframe/pull/67) [`2969c2b`](https://github.com/nejcjelovcan/traceframe/commit/2969c2b161f2427a4b7b49f976d0a1837a0a7b7a) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Add actionable and hero variants to Card

- [#69](https://github.com/nejcjelovcan/traceframe/pull/69) [`cbe0904`](https://github.com/nejcjelovcan/traceframe/commit/cbe09048a18b59a071ba45ee724fe3abf82db8bb) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Add light/dark mode variants for gradient tokens

- [#65](https://github.com/nejcjelovcan/traceframe/pull/65) [`26c6b98`](https://github.com/nejcjelovcan/traceframe/commit/26c6b985a8873031c354e490402ef2ff2b6e665f) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Add emphasis accent badge variants (emphasis-accent1 through emphasis-accent5) using gradient tokens

- [#57](https://github.com/nejcjelovcan/traceframe/pull/57) [`d74476c`](https://github.com/nejcjelovcan/traceframe/commit/d74476cf35f24352621da56ba3f6f3f24406e0b3) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Add gradient background tokens for emphasis surfaces

- [#62](https://github.com/nejcjelovcan/traceframe/pull/62) [`48b2a29`](https://github.com/nejcjelovcan/traceframe/commit/48b2a297313c5605931f7e4d49ad5a956351ceed) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Add box shadow tokens for interactive states including hover, focus, and pressed states

- [#61](https://github.com/nejcjelovcan/traceframe/pull/61) [`ef6733d`](https://github.com/nejcjelovcan/traceframe/commit/ef6733d0b95ade096d67993783292243a40f44c7) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Add themable border style tokens for dashed and dotted borders

### Patch Changes

- [#71](https://github.com/nejcjelovcan/traceframe/pull/71) [`497114c`](https://github.com/nejcjelovcan/traceframe/commit/497114ccbe454824fd6c3db4b696cca471fafd78) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Remove hero variant from Card component

- [#63](https://github.com/nejcjelovcan/traceframe/pull/63) [`1e88f5f`](https://github.com/nejcjelovcan/traceframe/commit/1e88f5f81f62526d0d42e0c88b7c87e47c0e46ba) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Update README with documentation for new border style, shadow (interactive/highlight/inset), and gradient design tokens

## 1.1.1

### Patch Changes

- [#58](https://github.com/nejcjelovcan/traceframe/pull/58) [`3190694`](https://github.com/nejcjelovcan/traceframe/commit/31906942a3628f1ad1e5728d4ffd542b2992be27) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Fix font-resolver failing with ERR_PACKAGE_PATH_NOT_EXPORTED by simplifying to single-level require pattern

## 1.1.0

### Minor Changes

- [#56](https://github.com/nejcjelovcan/traceframe/pull/56) [`69302fd`](https://github.com/nejcjelovcan/traceframe/commit/69302fdc3dfdb555abee94051d3657a071fc1eb3) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Add Vite font loading plugin with automatic font discovery and CSS injection, plus comprehensive tests and documentation

- [#53](https://github.com/nejcjelovcan/traceframe/pull/53) [`4c04234`](https://github.com/nejcjelovcan/traceframe/commit/4c04234a4319a5adfdd291eb80cba61082cd4ee6) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Add Vite plugin for automatic font loading
  - Add traceframeFontsPlugin to ui-library for centralized font management
  - Plugin automatically resolves and loads @fontsource packages
  - Re-export plugin from storybook-preset for backward compatibility
  - Add comprehensive tests for font resolver and plugin functionality

## 1.0.3

### Patch Changes

- [#51](https://github.com/nejcjelovcan/traceframe/pull/51) [`7592dbf`](https://github.com/nejcjelovcan/traceframe/commit/7592dbf212d079d4c63d8955b5bcc776bde2725a) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Fix StatCard inverted mode: use foreground-inverted-muted for label, subtitle, icon, and description text when inverted

## 1.0.2

### Patch Changes

- [#49](https://github.com/nejcjelovcan/traceframe/pull/49) [`0c5c390`](https://github.com/nejcjelovcan/traceframe/commit/0c5c390d3099b8d3ede999e2c2069e2b76474b2a) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Fix semantic token values for light/dark mode: update dark mode primary button foreground to use primary.950, adjust status and accent muted backgrounds (50→100 light, 950→900 dark), and add bg-surface to Badge outline variants for inverted background support

## 1.0.1

### Patch Changes

- [#47](https://github.com/nejcjelovcan/traceframe/pull/47) [`ce31e21`](https://github.com/nejcjelovcan/traceframe/commit/ce31e21485170bd5b1eb763cadf22c18bb03d5e2) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Fix broken design tokens in Tailwind v4 theme formatter. The theme CSS now registers all ~81 semantic color tokens instead of only ~22 top-level ones, restoring utility classes for status, accent, interactive, and nested surface/foreground/border variants.

## 1.0.0

### Major Changes

- [#45](https://github.com/nejcjelovcan/traceframe/pull/45) [`8ef0bec`](https://github.com/nejcjelovcan/traceframe/commit/8ef0bec2963fadd0ff7512b2bc2105df50bb44bb) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Update CSS color format for Tailwind v4 compatibility

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

- [#46](https://github.com/nejcjelovcan/traceframe/pull/46) [`5666430`](https://github.com/nejcjelovcan/traceframe/commit/5666430d27ec4a4c61483f5c3736d94fd3ec3c34) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - BREAKING: Remove Tailwind v3 JavaScript preset in favor of CSS-first v4 config. Consumers must now import @nejcjelovcan/traceframe-ui-library/theme.css instead of using the JavaScript preset.

- [#42](https://github.com/nejcjelovcan/traceframe/pull/42) [`aff9bdf`](https://github.com/nejcjelovcan/traceframe/commit/aff9bdfad182f525389495c0ad08a0edf23cfcef) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Upgrade Tailwind CSS from v3 to v4, tailwind-merge from v2 to v3. Migrate to CSS-first configuration with @theme inline for design tokens. Rename deprecated utility classes (rounded -> rounded-sm, outline-none -> outline-hidden, shadow-sm -> shadow-xs, rounded-sm -> rounded-xs). Remove autoprefixer (built into v4). Remove <alpha-value> template from color tokens.

### Patch Changes

- [#40](https://github.com/nejcjelovcan/traceframe/pull/40) [`f160511`](https://github.com/nejcjelovcan/traceframe/commit/f1605114a23e05448678a718834d5dbf5d362749) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Fix foreground-muted contrast to meet WCAG AA standards

## 0.4.1

### Patch Changes

- Fix foreground-muted contrast to meet WCAG AA standards. Updated light theme foreground-muted token from neutral.500 to neutral.600 to achieve WCAG AA compliance (4.5:1 contrast ratio). This improves readability for secondary text in components like Badge, Input placeholders, DataTable secondary columns, EmptyState/ErrorState descriptions, and Navigation secondary labels.

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
