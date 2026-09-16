---
name: SVG & Build Output Provisioning
slug: svg-build-output-provisioning
type: concept
sources:
  - path: apps/api-portal/index.d.ts
    hash: cb8404cf28c220e46273d00d2c202e0e8029902c49b6c20d666503b78604804f
  - path: apps/api-portal/src/routeTree.gen.ts
    hash: 060919284f76f30f51a2205d8ce322a95ae66eb16172ab2eb6a4440fca623392
  - path: apps/data-download-portal/src/app.tsx
    hash: 099e904744dfdf02459e6981c20f275277ec415016eee4c53ddaf6d483770e5b
sources_digest: b03551f60fd4f2b88b2b07c57388d7737e7c1fd3b1f77f1d5dca04ef966631ee
links:
  - to: api-portal-routing
    relation: produces
    description: >-
      routeTree.gen exports auto-generated FileRoutesByPath/ById interfaces and
      finalized route tree
generator:
  version: 1
covers:
  - symbol: FileRoutesByFullPath
    kind: interface
    at: 'apps/api-portal/src/routeTree.gen.ts:L26-L29'
  - symbol: FileRoutesByTo
    kind: interface
    at: 'apps/api-portal/src/routeTree.gen.ts:L30-L33'
  - symbol: FileRoutesById
    kind: interface
    at: 'apps/api-portal/src/routeTree.gen.ts:L34-L38'
  - symbol: FileRouteTypes
    kind: interface
    at: 'apps/api-portal/src/routeTree.gen.ts:L39-L46'
  - symbol: RootRouteChildren
    kind: interface
    at: 'apps/api-portal/src/routeTree.gen.ts:L47-L50'
  - symbol: FileRoutesByPath
    kind: interface
    at: 'apps/api-portal/src/routeTree.gen.ts:L53-L68'
  - symbol: Register
    kind: interface
    at: 'apps/data-download-portal/src/app.tsx:L20-L22'
  - symbol: App
    kind: function
    at: 'apps/data-download-portal/src/app.tsx:L25-L31'
---

<!-- context:generated:start -->

## Summary

Both portals declare TypeScript support for SVG module imports (ReactComponent and default export patterns) and auto-generate route trees at build time, enabling type-safe routing and flexible asset imports without manual configuration.

## Related

- produces [[api-portal-routing]] — routeTree.gen exports auto-generated FileRoutesByPath/ById interfaces and finalized route tree

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
