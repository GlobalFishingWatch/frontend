---
name: Portal Header Component
slug: portal-header-component
type: file
sources:
  - path: apps/api-portal/src/components/header/header.tsx
    hash: b509b74fa8d8d8fb33078c987a53245939c8f8ef0dd039641589a3c23a895e7d
sources_digest: 98acaf99069103d83b51b8e21900117a75c7bc36bbfcc4942666cddd8bb6f8a6
links:
  - to: user-authentication-profile
    relation: depends_on
    description: Accepts optional UserData and logout callback from parent
generator:
  version: 1
covers:
  - symbol: HeaderProps
    kind: interface
    at: 'apps/api-portal/src/components/header/header.tsx:L9-L13'
  - symbol: openSettings
    kind: function
    at: 'apps/api-portal/src/components/header/header.tsx:L15-L17'
  - symbol: Header
    kind: function
    at: 'apps/api-portal/src/components/header/header.tsx:L19-L30'
---

<!-- context:generated:start -->

## Summary

Renders branding and user authentication UI for the API Portal. Conditionally shows UIHeader only when authenticated, provides logout callback, and opens settings via GFWAPI.getSettingsUrl() in new window.

## Related

- depends on [[user-authentication-profile]] — Accepts optional UserData and logout callback from parent

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
