---
name: API Portal Routing
slug: api-portal-routing
type: system
sources:
  - path: apps/api-portal/src/routes/__root.tsx
    hash: 1f863b70aa8e56733df7a8d1876820107dee4f4b9e772eae658a999392bb4a86
  - path: apps/api-portal/src/routes/index.tsx
    hash: c267b0555b07ba974afca247a78d34ccce5b8dd903e8f6bf88098575d8b47b9a
  - path: apps/api-portal/src/routes/signup.tsx
    hash: 369070e55862c0e81cd419612c9caa2a3227db0f181c71c31e25fc2c2eedce45
  - path: apps/api-portal/src/routeTree.gen.ts
    hash: 060919284f76f30f51a2205d8ce322a95ae66eb16172ab2eb6a4440fca623392
sources_digest: 4cd79e134f5d10d9c78f6e96d9e9efd54743b320920323fe133b44f77cb5a0ea
links:
  - to: access-token-management-ui
    relation: uses
    description: Home route renders AccessTokenList and AccessTokenCreate components
  - to: authenticated-layout-wrapper
    relation: uses
    description: Both home and signup routes use lazy-loaded Layout for user auth checks
  - to: profile-completion-guard
    relation: uses
    description: Home route wraps token management in RequireAdditionalInfo guard
  - to: user-additional-profile-form
    relation: uses
    description: Signup route renders UserAdditionalFields form for profile completion
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
  - symbol: RootComponent
    kind: function
    at: 'apps/api-portal/src/routes/__root.tsx:L3-L5'
  - symbol: Home
    kind: function
    at: 'apps/api-portal/src/routes/index.tsx:L12-L28'
  - symbol: Signup
    kind: function
    at: 'apps/api-portal/src/routes/signup.tsx:L11-L32'
---

<!-- context:generated:start -->

## Summary

File-based route definitions for the API Portal using TanStack Router. Establishes root, home (/), and signup (/signup) routes with lazy-loaded layouts and guard components for access control.

## Related

- uses [[access-token-management-ui]] — Home route renders AccessTokenList and AccessTokenCreate components
- uses [[authenticated-layout-wrapper]] — Both home and signup routes use lazy-loaded Layout for user auth checks
- uses [[profile-completion-guard]] — Home route wraps token management in RequireAdditionalInfo guard
- uses [[user-additional-profile-form]] — Signup route renders UserAdditionalFields form for profile completion

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
