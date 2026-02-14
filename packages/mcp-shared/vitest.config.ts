import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    testTimeout: 10000,
    coverage: {
      provider: 'v8',
      thresholds: {
        // Lower thresholds for shared utilities that are difficult to unit test
        // (exec-command, cli-runner execute shell commands)
        lines: 40,
        functions: 40,
        branches: 70,
        statements: 40,
      },
    },
  },
})
