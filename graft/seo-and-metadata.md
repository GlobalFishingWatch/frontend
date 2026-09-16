---
name: SEO and Metadata
slug: seo-and-metadata
type: file
sources:
  - path: apps/platform/router/router.meta.ts
    hash: 4df59a61315be5bc1a035db1c98c8f2f7185ca18d474a507e844bf1293419d7f
sources_digest: b8ca0cecb53edafe9c2b96448e85504213b4d8570945dc0c536bd6c8c8d0e8a3
links:
  - to: route-configuration
    relation: uses
    description: Meta functions are called from route configurations to set page head tags
generator:
  version: 1
covers:
  - symbol: WorkspaceCategoryDescriptionKey
    kind: type
    at: 'apps/platform/router/router.meta.ts:L8-L9'
  - symbol: buildCanonicalUrl
    kind: function
    at: 'apps/platform/router/router.meta.ts:L21-L25'
  - symbol: getCanonicalPathname
    kind: function
    at: 'apps/platform/router/router.meta.ts:L27-L28'
  - symbol: getCanonicalLink
    kind: function
    at: 'apps/platform/router/router.meta.ts:L31-L37'
  - symbol: getDefaultMeta
    kind: function
    at: 'apps/platform/router/router.meta.ts:L39-L116'
  - symbol: getHeadTitle
    kind: function
    at: 'apps/platform/router/router.meta.ts:L118-L118'
  - symbol: getRouteHead
    kind: function
    at: 'apps/platform/router/router.meta.ts:L120-L132'
  - symbol: VesselHeadData
    kind: type
    at: 'apps/platform/router/router.meta.ts:L134-L143'
  - symbol: getVesselHead
    kind: function
    at: 'apps/platform/router/router.meta.ts:L145-L188'
  - symbol: getWorkspaceHead
    kind: function
    at: 'apps/platform/router/router.meta.ts:L190-L193'
  - symbol: getSearchHead
    kind: function
    at: 'apps/platform/router/router.meta.ts:L195-L200'
---

<!-- context:generated:start -->

## Summary

Centralized SEO metadata management including canonical URL generation, Open Graph tags, and schema.org JSON-LD structured data. Exports getCanonicalLink (single canonical URL to prevent duplicate content), getDefaultMeta (global meta tags), getRouteHead (category/description), getVesselHead (vessel detail with OpenGraph and structured data), getWorkspaceHead and getSearchHead (specialized wrappers). Environment-aware SITE_ORIGIN switching using WORKSPACE_ENV, falling back to window.location.origin only in browsers.

## Related

- uses [[route-configuration]] — Meta functions are called from route configurations to set page head tags

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
