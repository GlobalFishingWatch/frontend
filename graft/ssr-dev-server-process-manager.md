---
name: SSR Dev Server Process Manager
slug: ssr-dev-server-process-manager
type: file
sources:
  - path: apps/platform/scripts/serve-ssr.mjs
    hash: b18fc8e8cbe8374df268fa19f30dec36da1428b7b8d5453460caefe24e7c7039
sources_digest: 0d7615addbea75479a3b690d666f6149b6b42d09d639ea5199a3207fb989ad79
links: []
generator:
  version: 1
covers:
  - symbol: exitNow
    kind: function
    at: 'apps/platform/scripts/serve-ssr.mjs:L19-L28'
  - symbol: shutdown
    kind: function
    at: 'apps/platform/scripts/serve-ssr.mjs:L30-L48'
---

<!-- context:generated:start -->

## Summary

Node.js script (serve-ssr.mjs) that spawns and supervises the compiled SSR server (.output/server/index.mjs), killing stale processes on startup, handling graceful shutdown via signal handlers with 3-second grace period before SIGKILL.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
