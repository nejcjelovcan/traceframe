# @nejcjelovcan/traceframe-mcp-ui

## 3.0.0

### Patch Changes

- Updated dependencies [[`a9cb9b8`](https://github.com/nejcjelovcan/traceframe/commit/a9cb9b87896903675df61f21ada702c55056a815), [`2f7bb8e`](https://github.com/nejcjelovcan/traceframe/commit/2f7bb8e5bff1a4f2983ca64692f2ab58916b0c51), [`8e050be`](https://github.com/nejcjelovcan/traceframe/commit/8e050be2aa1c92663d7b79fe42fb3dc13e890f66)]:
  - @nejcjelovcan/traceframe-ui-library@3.0.0

## 3.0.0

### Patch Changes

- Updated dependencies [[`67598fb`](https://github.com/nejcjelovcan/traceframe/commit/67598fb399f801c3846f93ce5ba33ecaf9fb2b8f), [`17806ed`](https://github.com/nejcjelovcan/traceframe/commit/17806ed861f48f29f29959c85359b50ef921553e), [`f5dc92c`](https://github.com/nejcjelovcan/traceframe/commit/f5dc92cc6d3e8a31cb48635b3216808d80183888), [`fd13e14`](https://github.com/nejcjelovcan/traceframe/commit/fd13e149f07448682869692b12e963d9dfcce9eb)]:
  - @nejcjelovcan/traceframe-ui-library@2.4.0

## 2.0.0

### Patch Changes

- Updated dependencies [[`a44304b`](https://github.com/nejcjelovcan/traceframe/commit/a44304b623eeea500d1b58d68cbc014eeb69b5d9), [`7b03b67`](https://github.com/nejcjelovcan/traceframe/commit/7b03b673eab9304f941cf0fbfb73e8f0c0200619), [`792f617`](https://github.com/nejcjelovcan/traceframe/commit/792f6175f543aa0c1daa9544838a79cd232aed60), [`4672e88`](https://github.com/nejcjelovcan/traceframe/commit/4672e880940f5f2e6285d01470db7505052a5cd7)]:
  - @nejcjelovcan/traceframe-ui-library@2.3.0

## 1.0.0

### Major Changes

- [#107](https://github.com/nejcjelovcan/traceframe/pull/107) [`8bcc936`](https://github.com/nejcjelovcan/traceframe/commit/8bcc93692101668da47dac3e97f2e194e44ad73a) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Convert traceframe-ui-library to peer dependency to prevent duplicate React instances

  BREAKING CHANGE: @nejcjelovcan/traceframe-ui-library is now a peer dependency. Consumers must install it explicitly:

  ```bash
  npm install @nejcjelovcan/traceframe-ui-library@^2.0.0
  ```

  This change prevents duplicate React instances when using mcp-ui in monorepos or with different ui-library versions.

### Patch Changes

- Updated dependencies [[`e3e1564`](https://github.com/nejcjelovcan/traceframe/commit/e3e1564e393b607542d73b75455559f325d09853), [`ade8550`](https://github.com/nejcjelovcan/traceframe/commit/ade855072312f1334e2a83660088a7b91e29efe8), [`5738d7d`](https://github.com/nejcjelovcan/traceframe/commit/5738d7d9749ac06a9961b3eea401be5cdaea3b7c)]:
  - @nejcjelovcan/traceframe-ui-library@2.2.0

## 0.4.1

### Patch Changes

- Updated dependencies [[`ba9565e`](https://github.com/nejcjelovcan/traceframe/commit/ba9565ead720bc330340eeeba37e3463c600e16e), [`7d8a579`](https://github.com/nejcjelovcan/traceframe/commit/7d8a57968eb82907a7d8afa0edd186e8739df61a), [`d0c5e13`](https://github.com/nejcjelovcan/traceframe/commit/d0c5e13ba4dfbdc0764cb5332f492544426ee1c1), [`35ac47c`](https://github.com/nejcjelovcan/traceframe/commit/35ac47c05642c64d63eeba5d968dc6ef8185476e), [`dfb8bfd`](https://github.com/nejcjelovcan/traceframe/commit/dfb8bfdb5dc0f0309a3e67a06f51a5e53b28de5b), [`9c41cac`](https://github.com/nejcjelovcan/traceframe/commit/9c41cac64ef670d1ac0f50422b679cd2568c3653)]:
  - @nejcjelovcan/traceframe-ui-library@2.0.0

## 0.4.0

### Minor Changes

- [#80](https://github.com/nejcjelovcan/traceframe/pull/80) [`babf40f`](https://github.com/nejcjelovcan/traceframe/commit/babf40fc915c6d5bcfcb633a84ca32d02cf46d51) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Refactor inverse

- [#79](https://github.com/nejcjelovcan/traceframe/pull/79) [`27e8b16`](https://github.com/nejcjelovcan/traceframe/commit/27e8b16c30c9dba9431c1d713f71803f26ecc267) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Switch from RGB to OKLCH palettes. So much color, woohoo!

### Patch Changes

- Updated dependencies [[`7952ba5`](https://github.com/nejcjelovcan/traceframe/commit/7952ba50d1a0b15d4b0dab4680906bd9b1499958), [`babf40f`](https://github.com/nejcjelovcan/traceframe/commit/babf40fc915c6d5bcfcb633a84ca32d02cf46d51), [`750e385`](https://github.com/nejcjelovcan/traceframe/commit/750e385cd7e9483762850e4cd0b3326ca2f1c49e), [`750e385`](https://github.com/nejcjelovcan/traceframe/commit/750e385cd7e9483762850e4cd0b3326ca2f1c49e), [`27e8b16`](https://github.com/nejcjelovcan/traceframe/commit/27e8b16c30c9dba9431c1d713f71803f26ecc267)]:
  - @nejcjelovcan/traceframe-ui-library@1.6.0

## 0.3.0

### Minor Changes

- [#74](https://github.com/nejcjelovcan/traceframe/pull/74) [`6836a17`](https://github.com/nejcjelovcan/traceframe/commit/6836a174924ff660a3db15cba8bbc396cb21c12c) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Simplify tokens pipeline: replace Style Dictionary with CSS-first approach using Tailwind v4 @theme inline. CSS files are now the source of truth for token values, with hand-maintained TypeScript metadata for MCP tools.

### Patch Changes

- Updated dependencies [[`6d1810c`](https://github.com/nejcjelovcan/traceframe/commit/6d1810c0f4c7e7e91f76b36512be1d663181c3a3), [`6836a17`](https://github.com/nejcjelovcan/traceframe/commit/6836a174924ff660a3db15cba8bbc396cb21c12c), [`62ee2a9`](https://github.com/nejcjelovcan/traceframe/commit/62ee2a9c8d58a44dfc827cffa93104eca6613786), [`0b78a41`](https://github.com/nejcjelovcan/traceframe/commit/0b78a416ead10b72b7aada1f16a8fc63d81d8a4c)]:
  - @nejcjelovcan/traceframe-ui-library@1.5.0

## 0.2.5

### Patch Changes

- Updated dependencies [[`8ef0bec`](https://github.com/nejcjelovcan/traceframe/commit/8ef0bec2963fadd0ff7512b2bc2105df50bb44bb), [`f160511`](https://github.com/nejcjelovcan/traceframe/commit/f1605114a23e05448678a718834d5dbf5d362749), [`5666430`](https://github.com/nejcjelovcan/traceframe/commit/5666430d27ec4a4c61483f5c3736d94fd3ec3c34), [`aff9bdf`](https://github.com/nejcjelovcan/traceframe/commit/aff9bdfad182f525389495c0ad08a0edf23cfcef)]:
  - @nejcjelovcan/traceframe-ui-library@1.0.0

## 0.2.4

### Patch Changes

- Updated dependencies [[`f7943d0`](https://github.com/nejcjelovcan/traceframe/commit/f7943d0440f126a14038a131fa5eb7a9a0222e6a)]:
  - @nejcjelovcan/traceframe-ui-library@0.4.0

## 0.2.3

### Patch Changes

- Updated dependencies [[`674c747`](https://github.com/nejcjelovcan/traceframe/commit/674c747657b2a29a944f5efe1c9ad4a9f0fb72b2)]:
  - @nejcjelovcan/traceframe-ui-library@0.3.0

## 0.2.2

### Patch Changes

- Updated dependencies [[`efde399`](https://github.com/nejcjelovcan/traceframe/commit/efde3998b28b495d830c8d9a81b2ceb937dd4df3)]:
  - @nejcjelovcan/traceframe-ui-library@0.2.0

## 0.2.1

### Patch Changes

- Updated dependencies [[`dd2d62b`](https://github.com/nejcjelovcan/traceframe/commit/dd2d62bf4b6f39c6c8c0ac7b5ca0e1286764cabb)]:
  - @nejcjelovcan/traceframe-ui-library@0.1.0

## 0.2.0

### Minor Changes

- [#14](https://github.com/nejcjelovcan/traceframe/pull/14) [`33a8cae`](https://github.com/nejcjelovcan/traceframe/commit/33a8cae55f3a2a388a55caa4bff1821e42168f2a) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Publish mcp-ui as a standalone MCP server package for AI agent integration with the Traceframe design system. Removes Storybook/Playroom tools and refactors component tools to use imported metadata from ui-library instead of filesystem parsing.

### Patch Changes

- [#14](https://github.com/nejcjelovcan/traceframe/pull/14) [`33a8cae`](https://github.com/nejcjelovcan/traceframe/commit/33a8cae55f3a2a388a55caa4bff1821e42168f2a) Thanks [@nejcjelovcan](https://github.com/nejcjelovcan)! - Initial release
