---
"@nejcjelovcan/traceframe-mcp-ui": major
---

Convert traceframe-ui-library to peer dependency to prevent duplicate React instances

BREAKING CHANGE: @nejcjelovcan/traceframe-ui-library is now a peer dependency. Consumers must install it explicitly:

```bash
npm install @nejcjelovcan/traceframe-ui-library@^2.0.0
```

This change prevents duplicate React instances when using mcp-ui in monorepos or with different ui-library versions.
