---
name: Server State Management via React Query
slug: server-state-management-via-react-query
type: concept
sources:
  - path: apps/api-portal/src/app.tsx
    hash: 44ccb3911cfdd2000f956a166b963d3a6e4ed808b9f6dd4012a6f161a6f5ec8c
  - path: apps/api-portal/src/features/user-applications/user-applications.ts
    hash: 7dd05d1981286a6d948e1526d9c2e3d7aec538d7fcb06cd227f8a038734adea9
  - path: apps/api-portal/src/features/user/user.ts
    hash: 639cf97e42054e969712af03cce8408ba1ba6b9e7f345fc9c8ae7ccfe98e5430
sources_digest: 2c6fac94c58ebbc2a0895e9f3611d534495f1c1c1988b9a0f3f5031818e4cd26
links:
  - to: api-portal-application
    relation: implements
    description: >-
      App component wraps routing with QueryClientProvider for global query
      cache
generator:
  version: 1
covers:
  - symbol: Register
    kind: interface
    at: 'apps/api-portal/src/app.tsx:L17-L19'
  - symbol: App
    kind: function
    at: 'apps/api-portal/src/app.tsx:L22-L30'
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
  - symbol: fetchUser
    kind: function
    at: 'apps/api-portal/src/features/user/user.ts:L13-L21'
  - symbol: UserAction
    kind: type
    at: 'apps/api-portal/src/features/user/user.ts:L22-L22'
  - symbol: checkUserApplicationPermission
    kind: function
    at: 'apps/api-portal/src/features/user/user.ts:L23-L29'
  - symbol: logoutUser
    kind: function
    at: 'apps/api-portal/src/features/user/user.ts:L31-L33'
  - symbol: useUser
    kind: function
    at: 'apps/api-portal/src/features/user/user.ts:L35-L77'
  - symbol: updateUserAdditionalFields
    kind: function
    at: 'apps/api-portal/src/features/user/user.ts:L79-L93'
  - symbol: useUpdateUserAdditionalInformation
    kind: function
    at: 'apps/api-portal/src/features/user/user.ts:L94-L103'
  - symbol: useUserAdditionalInformation
    kind: function
    at: 'apps/api-portal/src/features/user/user.ts:L105-L112'
---

<!-- context:generated:start -->

## Summary

Both portals use react-query (TanStack Query) for caching and invalidation. API Portal wraps GFWAPI queries in hooks with 5-minute stale time; mutations auto-invalidate user queries. Data Portal table integrates with download modal and survey submission.

## Related

- implements [[api-portal-application]] — App component wraps routing with QueryClientProvider for global query cache

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
