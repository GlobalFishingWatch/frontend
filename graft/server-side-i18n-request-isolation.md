---
name: Server-side i18n Request Isolation
slug: server-side-i18n-request-isolation
type: concept
sources:
  - path: apps/platform/features/i18n/request-i18n.server.ts
    hash: 2fd888b08d732656dacd764c2d79664a90a09b1086dec7a5719ce1d7ca87340d
sources_digest: e1893dba07c6e24fc29ffa7808618c85d664c53ddc92cd44600355ef63073c4b
links:
  - to: internationalization
    relation: part_of
    description: >-
      Implements per-request language isolation for server-side rendering via
      AsyncLocalStorage and request-scoped i18n accessor
generator:
  version: 1
covers:
  - symbol: I18nInstance
    kind: type
    at: 'apps/platform/features/i18n/request-i18n.server.ts:L13-L13'
  - symbol: getFallbackInstance
    kind: function
    at: 'apps/platform/features/i18n/request-i18n.server.ts:L22-L27'
  - symbol: runRequestWithI18n
    kind: function
    at: 'apps/platform/features/i18n/request-i18n.server.ts:L29-L34'
  - symbol: getRequestI18n
    kind: function
    at: 'apps/platform/features/i18n/request-i18n.server.ts:L36-L38'
---

<!-- context:generated:start -->

## Summary

AsyncLocalStorage-based pattern that scopes per-request i18next instances across concurrent HTTP requests without threading context through functions, enabling deep utilities and Redux selectors to read the current request's language transparently.

## Related

- part of [[internationalization]] — Implements per-request language isolation for server-side rendering via AsyncLocalStorage and request-scoped i18n accessor

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
