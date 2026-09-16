---
name: Vite Test Infrastructure Plugins
slug: vite-test-infrastructure-plugins
type: file
sources:
  - path: apps/platform/test/utils/vitest/plugins.ts
    hash: c201b4c15c6c0a0a86ebb6c78e1de6de94be8af75e6a97fc74316c3403365ce2
sources_digest: c0b6294fac096e8f249bffa93e6573b4131a7c11e90690939d9ea52e5f4ab727
links: []
generator:
  version: 1
covers:
  - symbol: publicAssetsPlugin
    kind: function
    at: 'apps/platform/test/utils/vitest/plugins.ts:L15-L37'
  - symbol: configureServer
    kind: method
    at: 'apps/platform/test/utils/vitest/plugins.ts:L17-L26'
  - symbol: configurePreviewServer
    kind: method
    at: 'apps/platform/test/utils/vitest/plugins.ts:L27-L36'
  - symbol: authTokensPlugin
    kind: function
    at: 'apps/platform/test/utils/vitest/plugins.ts:L40-L80'
  - symbol: configureServer
    kind: method
    at: 'apps/platform/test/utils/vitest/plugins.ts:L42-L60'
  - symbol: configurePreviewServer
    kind: method
    at: 'apps/platform/test/utils/vitest/plugins.ts:L61-L79'
---

<!-- context:generated:start -->

## Summary

Vite plugins that support platform testing: publicAssetsPlugin strips basePath prefixes from asset requests during tests; authTokensPlugin serves authentication tokens from the file system, enabling browser tests to authenticate. Both implement middleware for development and preview servers.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
