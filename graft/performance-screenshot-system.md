---
name: Performance & Screenshot System
slug: performance-screenshot-system
type: system
sources:
  - path: apps/platform/hooks/paint.hooks.ts
    hash: eecc907552010606e07a16bbfdc01da5a1fba5551320b915e50c60917c2ba595
  - path: apps/platform/hooks/screen.hooks.ts
    hash: dc07070e5b5b07e7d77c8ebb29fe2651140bb998bd9958a963c2c78910f93ba1
sources_digest: 0e6436a987237af54b6256f3d8dca4cbf175533a0b130f8eb09b06ab0b06e34c
links:
  - to: layout-system
    relation: uses
    description: >-
      Screenshot mode flag (selectScreenshotMode) gates footer visibility and
      welcome popup display to enable clean captures
generator:
  version: 1
covers:
  - symbol: runAfterFramePaint
    kind: function
    at: 'apps/platform/hooks/paint.hooks.ts:L3-L10'
  - symbol: useCallbackAfterPaint
    kind: function
    at: 'apps/platform/hooks/paint.hooks.ts:L12-L31'
  - symbol: useDownloadDomElementAsImage
    kind: function
    at: 'apps/platform/hooks/screen.hooks.ts:L7-L114'
  - symbol: useOnScreen
    kind: function
    at: 'apps/platform/hooks/screen.hooks.ts:L116-L139'
  - symbol: useScreenDPI
    kind: function
    at: 'apps/platform/hooks/screen.hooks.ts:L141-L159'
---

<!-- context:generated:start -->

## Summary

Provides screenshot capture via useDownloadDomElementAsImage hook (wraps snapdom library with 2x DPI rendering), deferred callback execution via useCallbackAfterPaint (uses MessageChannel trick for post-paint timing), and device pixel density detection via useScreenDPI. Excludes modal overlays from captures and coordinates map redraws during screenshot export.

## Related

- uses [[layout-system]] — Screenshot mode flag (selectScreenshotMode) gates footer visibility and welcome popup display to enable clean captures

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
