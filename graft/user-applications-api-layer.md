---
name: User Applications API Layer
slug: user-applications-api-layer
type: system
sources:
  - path: apps/api-portal/src/features/user-applications/user-applications.ts
    hash: 7dd05d1981286a6d948e1526d9c2e3d7aec538d7fcb06cd227f8a038734adea9
sources_digest: 075041cfb8c80b2fdd8f8d2d2a56a0f001ab74d979c74a73557058af17f7810b
links:
  - to: form-validation-types
    relation: depends_on
    description: >-
      Validation logic enforces three-character name minimum and non-empty
      description
  - to: user-authentication-profile
    relation: depends_on
    description: >-
      useCreateUserApplication delegates permission checks to
      checkUserApplicationPermission
generator:
  version: 1
covers:
  - symbol: UserApplicationCreateArguments
    kind: type
    at: >-
      apps/api-portal/src/features/user-applications/user-applications.ts:L11-L14
  - symbol: fetchUserApplications
    kind: function
    at: >-
      apps/api-portal/src/features/user-applications/user-applications.ts:L16-L27
  - symbol: useUserApplications
    kind: function
    at: >-
      apps/api-portal/src/features/user-applications/user-applications.ts:L29-L37
  - symbol: deleteUserApplication
    kind: function
    at: >-
      apps/api-portal/src/features/user-applications/user-applications.ts:L39-L46
  - symbol: useDeleteUserApplication
    kind: function
    at: >-
      apps/api-portal/src/features/user-applications/user-applications.ts:L48-L56
  - symbol: createUserApplication
    kind: function
    at: >-
      apps/api-portal/src/features/user-applications/user-applications.ts:L60-L69
  - symbol: useCreateUserApplication
    kind: function
    at: >-
      apps/api-portal/src/features/user-applications/user-applications.ts:L75-L115
---

<!-- context:generated:start -->

## Summary

React hooks wrapping GFWAPI client for user application management. Provides queries for fetching paginated applications, mutations for create/delete operations, and combined form state with validation logic via useCreateUserApplication.

## Related

- depends on [[form-validation-types]] — Validation logic enforces three-character name minimum and non-empty description
- depends on [[user-authentication-profile]] — useCreateUserApplication delegates permission checks to checkUserApplicationPermission

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
