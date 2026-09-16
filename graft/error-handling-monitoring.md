---
name: Error Handling & Monitoring
slug: error-handling-monitoring
type: concept
sources:
  - path: apps/platform/instrument.server.mjs
    hash: 1592c4226d46a1bf9e176c853e355c36cea5e2bd5c41e69e8ca48967a3560302
sources_digest: 99890a5483918694111f9c892730b73c3630a7db27683c31de1630ef80c98589
links: []
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Sentry-based error tracking and performance monitoring with 10% trace sampling and user context tracking. Intentionally suppresses known non-errors (missing refresh tokens for guests, aborted operations), assuming downstream code handles 401 gracefully via guest fallback.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
