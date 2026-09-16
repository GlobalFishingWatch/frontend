---
name: Server-side Internationalization (i18n)
slug: server-side-internationalization-i18n
type: system
sources:
  - path: apps/platform/server/i18n.ts
    hash: 1802ecbd30bcc5d5edc2b787bdf449ab7ee81b6f4b0c3f9641fc3165b6b2f74b
sources_digest: 3c8d16ed4feaa102b3e7efe0e1ac6e164105eeeedd2d5ce5902cc4a5dd72700c
links: []
generator:
  version: 1
covers:
  - symbol: Namespace
    kind: type
    at: 'apps/platform/server/i18n.ts:L8-L8'
  - symbol: serverT
    kind: function
    at: 'apps/platform/server/i18n.ts:L18-L33'
---

<!-- context:generated:start -->

## Summary

Provides server-rendered translation support across namespaces (translations, flags) by loading JSON dictionaries statically and resolving keys via a fallback chain (English → source → provided default). Uses regex-based template replacement for variable interpolation with double-brace syntax.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
