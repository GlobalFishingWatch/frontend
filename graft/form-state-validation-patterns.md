---
name: Form State & Validation Patterns
slug: form-state-validation-patterns
type: concept
sources:
  - path: >-
      apps/api-portal/src/components/access-token/access-token-create/access-token-create.tsx
    hash: 1c2243debeed4f7ae3195d608014bf444b6c142c84a0f44fb5af753606d2584d
  - path: >-
      apps/api-portal/src/components/user-additional-fields/user-additional-fields.tsx
    hash: 98521cbc9a533f8cee8d6da12b5d0b851385360deb5b4cdd5b7decdbe6b6739a
  - path: apps/api-portal/src/features/user-applications/user-applications.ts
    hash: 7dd05d1981286a6d948e1526d9c2e3d7aec538d7fcb06cd227f8a038734adea9
  - path: apps/api-portal/src/lib/types.ts
    hash: 01a83de49d8c85e379319c5e723ed5f1b13ccaec48a2395dfa4d61b86f9a0ef1
sources_digest: df4e2c365dafe481424d43df0b65ceaf9711d1f5c260671b98d7b00a0c2a86fc
links:
  - to: form-validation-types
    relation: implements
    description: FieldValidationError type enables type-safe validation error objects
generator:
  version: 1
covers:
  - symbol: AccessTokenCreate
    kind: function
    at: >-
      apps/api-portal/src/components/access-token/access-token-create/access-token-create.tsx:L10-L92
  - symbol: UserAdditionalFields
    kind: function
    at: >-
      apps/api-portal/src/components/user-additional-fields/user-additional-fields.tsx:L15-L222
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
  - symbol: FieldValidationError
    kind: type
    at: 'apps/api-portal/src/lib/types.ts:L3-L5'
---

<!-- context:generated:start -->

## Summary

Forms manage validation reactively via useMemo and derive errors from field state rather than computing on-demand. Validation gates button enable/disable and renders error messages as tooltips or field-level feedback. Token creation enforces three-char minimum; profile form blocks commercial use and requires terms navigation before checkbox.

## Related

- implements [[form-validation-types]] — FieldValidationError type enables type-safe validation error objects

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
