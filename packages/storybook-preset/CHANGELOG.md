# @nejcjelovcan/traceframe-storybook-preset

## 1.2.1

### Patch Changes

- Updated dependencies [[`9f0102e`](https://github.com/nejcjelovcan/traceframe/commit/9f0102efebdb6619333bed052c61a059d9c56d6f), [`8c2531e`](https://github.com/nejcjelovcan/traceframe/commit/8c2531e0a49ca4fd66dea408c16944166f59d632), [`8c2531e`](https://github.com/nejcjelovcan/traceframe/commit/8c2531e0a49ca4fd66dea408c16944166f59d632)]:
  - @nejcjelovcan/traceframe-ui-library@1.7.0

## 1.2.0

### Minor Changes

- [#79](https://github.com/nejcjelovcan/traceframe/pull/79) [`27e8b16`](https://github.com/nejcjelovcan/traceframe/commit/27e8b16c30c9dba9431c1d713f71803f26ecc267) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Switch from RGB to OKLCH palettes. So much color, woohoo!

### Patch Changes

- Updated dependencies [[`7952ba5`](https://github.com/nejcjelovcan/traceframe/commit/7952ba50d1a0b15d4b0dab4680906bd9b1499958), [`babf40f`](https://github.com/nejcjelovcan/traceframe/commit/babf40fc915c6d5bcfcb633a84ca32d02cf46d51), [`750e385`](https://github.com/nejcjelovcan/traceframe/commit/750e385cd7e9483762850e4cd0b3326ca2f1c49e), [`750e385`](https://github.com/nejcjelovcan/traceframe/commit/750e385cd7e9483762850e4cd0b3326ca2f1c49e), [`27e8b16`](https://github.com/nejcjelovcan/traceframe/commit/27e8b16c30c9dba9431c1d713f71803f26ecc267)]:
  - @nejcjelovcan/traceframe-ui-library@1.6.0

## 1.1.5

### Patch Changes

- Updated dependencies [[`6d1810c`](https://github.com/nejcjelovcan/traceframe/commit/6d1810c0f4c7e7e91f76b36512be1d663181c3a3), [`6836a17`](https://github.com/nejcjelovcan/traceframe/commit/6836a174924ff660a3db15cba8bbc396cb21c12c), [`62ee2a9`](https://github.com/nejcjelovcan/traceframe/commit/62ee2a9c8d58a44dfc827cffa93104eca6613786), [`0b78a41`](https://github.com/nejcjelovcan/traceframe/commit/0b78a416ead10b72b7aada1f16a8fc63d81d8a4c)]:
  - @nejcjelovcan/traceframe-ui-library@1.5.0

## 1.1.4

### Patch Changes

- Updated dependencies [[`0de93a2`](https://github.com/nejcjelovcan/traceframe/commit/0de93a25e036da3f2c8e95c75353deb6464a7718)]:
  - @nejcjelovcan/traceframe-ui-library@1.4.0

## 1.1.3

### Patch Changes

- Updated dependencies [[`df30a6a`](https://github.com/nejcjelovcan/traceframe/commit/df30a6a5585c6057435846c8aaefb530249e9965)]:
  - @nejcjelovcan/traceframe-ui-library@1.3.0

## 1.1.2

### Patch Changes

- Updated dependencies [[`aca71ac`](https://github.com/nejcjelovcan/traceframe/commit/aca71accc3b0f8951c1b11bd0f81325266ba1da5), [`2969c2b`](https://github.com/nejcjelovcan/traceframe/commit/2969c2b161f2427a4b7b49f976d0a1837a0a7b7a), [`497114c`](https://github.com/nejcjelovcan/traceframe/commit/497114ccbe454824fd6c3db4b696cca471fafd78), [`cbe0904`](https://github.com/nejcjelovcan/traceframe/commit/cbe09048a18b59a071ba45ee724fe3abf82db8bb), [`1e88f5f`](https://github.com/nejcjelovcan/traceframe/commit/1e88f5f81f62526d0d42e0c88b7c87e47c0e46ba), [`26c6b98`](https://github.com/nejcjelovcan/traceframe/commit/26c6b985a8873031c354e490402ef2ff2b6e665f), [`d74476c`](https://github.com/nejcjelovcan/traceframe/commit/d74476cf35f24352621da56ba3f6f3f24406e0b3), [`48b2a29`](https://github.com/nejcjelovcan/traceframe/commit/48b2a297313c5605931f7e4d49ad5a956351ceed), [`ef6733d`](https://github.com/nejcjelovcan/traceframe/commit/ef6733d0b95ade096d67993783292243a40f44c7)]:
  - @nejcjelovcan/traceframe-ui-library@1.2.0

## 1.1.1

### Patch Changes

- Updated dependencies [[`3190694`](https://github.com/nejcjelovcan/traceframe/commit/31906942a3628f1ad1e5728d4ffd542b2992be27)]:
  - @nejcjelovcan/traceframe-ui-library@1.1.1

## 1.1.0

### Minor Changes

- [#55](https://github.com/nejcjelovcan/traceframe/pull/55) [`00d6a6b`](https://github.com/nejcjelovcan/traceframe/commit/00d6a6b2afd6f8ea5463b9ccda02ce027945f65a) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Integrate Vite font plugin with Storybook preset for automatic font loading via virtual module

- [#56](https://github.com/nejcjelovcan/traceframe/pull/56) [`69302fd`](https://github.com/nejcjelovcan/traceframe/commit/69302fdc3dfdb555abee94051d3657a071fc1eb3) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Add Vite font loading plugin with automatic font discovery and CSS injection, plus comprehensive tests and documentation

- [#53](https://github.com/nejcjelovcan/traceframe/pull/53) [`4c04234`](https://github.com/nejcjelovcan/traceframe/commit/4c04234a4319a5adfdd291eb80cba61082cd4ee6) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Add Vite plugin for automatic font loading
  - Add traceframeFontsPlugin to ui-library for centralized font management
  - Plugin automatically resolves and loads @fontsource packages
  - Re-export plugin from storybook-preset for backward compatibility
  - Add comprehensive tests for font resolver and plugin functionality

### Patch Changes

- Updated dependencies [[`69302fd`](https://github.com/nejcjelovcan/traceframe/commit/69302fdc3dfdb555abee94051d3657a071fc1eb3), [`4c04234`](https://github.com/nejcjelovcan/traceframe/commit/4c04234a4319a5adfdd291eb80cba61082cd4ee6)]:
  - @nejcjelovcan/traceframe-ui-library@1.1.0

## 1.0.4

### Patch Changes

- Updated dependencies [[`7592dbf`](https://github.com/nejcjelovcan/traceframe/commit/7592dbf212d079d4c63d8955b5bcc776bde2725a)]:
  - @nejcjelovcan/traceframe-ui-library@1.0.3

## 1.0.3

### Patch Changes

- Updated dependencies [[`0c5c390`](https://github.com/nejcjelovcan/traceframe/commit/0c5c390d3099b8d3ede999e2c2069e2b76474b2a)]:
  - @nejcjelovcan/traceframe-ui-library@1.0.2

## 1.0.2

### Patch Changes

- Updated dependencies [[`ce31e21`](https://github.com/nejcjelovcan/traceframe/commit/ce31e21485170bd5b1eb763cadf22c18bb03d5e2)]:
  - @nejcjelovcan/traceframe-ui-library@1.0.1

## 1.0.1

### Patch Changes

- Updated dependencies [[`8ef0bec`](https://github.com/nejcjelovcan/traceframe/commit/8ef0bec2963fadd0ff7512b2bc2105df50bb44bb), [`f160511`](https://github.com/nejcjelovcan/traceframe/commit/f1605114a23e05448678a718834d5dbf5d362749), [`5666430`](https://github.com/nejcjelovcan/traceframe/commit/5666430d27ec4a4c61483f5c3736d94fd3ec3c34), [`aff9bdf`](https://github.com/nejcjelovcan/traceframe/commit/aff9bdfad182f525389495c0ad08a0edf23cfcef)]:
  - @nejcjelovcan/traceframe-ui-library@1.0.0

## 1.0.0

### Major Changes

- [#36](https://github.com/nejcjelovcan/traceframe/pull/36) [`ddc2985`](https://github.com/nejcjelovcan/traceframe/commit/ddc2985f726a32e44c3a16c7a8bad503be8103bf) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Upgrade to Storybook 10 and convert preset entry point from CJS to ESM

## 0.1.4

### Patch Changes

- Updated dependencies [[`f7943d0`](https://github.com/nejcjelovcan/traceframe/commit/f7943d0440f126a14038a131fa5eb7a9a0222e6a)]:
  - @nejcjelovcan/traceframe-ui-library@0.4.0

## 0.1.3

### Patch Changes

- Updated dependencies [[`674c747`](https://github.com/nejcjelovcan/traceframe/commit/674c747657b2a29a944f5efe1c9ad4a9f0fb72b2)]:
  - @nejcjelovcan/traceframe-ui-library@0.3.0

## 0.1.2

### Patch Changes

- Updated dependencies [[`efde399`](https://github.com/nejcjelovcan/traceframe/commit/efde3998b28b495d830c8d9a81b2ceb937dd4df3)]:
  - @nejcjelovcan/traceframe-ui-library@0.2.0

## 0.1.1

### Patch Changes

- Updated dependencies [[`244bc1f`](https://github.com/nejcjelovcan/traceframe/commit/244bc1f648d8febfdf68c1d39b7f56ad0633b1ae)]:
  - @nejcjelovcan/traceframe-ui-library@0.1.1

## 0.1.0

### Minor Changes

- [#16](https://github.com/nejcjelovcan/traceframe/pull/16) [`dd2d62b`](https://github.com/nejcjelovcan/traceframe/commit/dd2d62bf4b6f39c6c8c0ac7b5ca0e1286764cabb) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Initial release of all packages. Includes UI component library with design tokens, Icon system, ThemeProvider, and components (StatCard, LogView, etc.); ESLint plugin for semantic token enforcement; Storybook preset with theme switching; and Playroom preset with component exports and snippets.

### Patch Changes

- Updated dependencies [[`dd2d62b`](https://github.com/nejcjelovcan/traceframe/commit/dd2d62bf4b6f39c6c8c0ac7b5ca0e1286764cabb)]:
  - @nejcjelovcan/traceframe-ui-library@0.1.0
