---
name: Authentication & Entry Point
slug: authentication-entry-point
type: system
sources:
  - path: apps/track-labeler/src/features/login/Login.tsx
    hash: b94055f96d94fdc36d4619781e22dc276c030fe951a53381d83e8a9e89ccf649
sources_digest: 296930edd9690a63883179969fa75ee45e16702208a4d8b50faa6f8b985317ee
links:
  - to: redux-state-management-store
    relation: depends_on
    description: >-
      Login components check allowedAppAccess and allowedProjectAccess selectors
      before rendering application features.
generator:
  version: 1
covers:
  - symbol: Login
    kind: function
    at: 'apps/track-labeler/src/features/login/Login.tsx:L12-L33'
---

<!-- context:generated:start -->

## Summary

Handles user login via Global Fishing Watch OAuth credentials. The Login component constructs a callback URL using the application's BASE_URL constant and GFWAPI service, redirecting authenticated users back to the app. Authentication guards and role-based access control (allowedAppAccess, allowedProjectAccess) are enforced at the sidebar/main layout level.

## Related

- depends on [[redux-state-management-store]] — Login components check allowedAppAccess and allowedProjectAccess selectors before rendering application features.

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
