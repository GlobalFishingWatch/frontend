---
name: User Additional Profile Form
slug: user-additional-profile-form
type: system
sources:
  - path: >-
      apps/api-portal/src/components/user-additional-fields/user-additional-fields.spec.tsx
    hash: 5691abb04438096fdf4c7c75a563603686ba4f5482ef87f6809d37e1fff7c715
  - path: >-
      apps/api-portal/src/components/user-additional-fields/user-additional-fields.tsx
    hash: 98521cbc9a533f8cee8d6da12b5d0b851385360deb5b4cdd5b7decdbe6b6739a
sources_digest: a4b84131ce7ab521eba1aae458c4fe14752df71ed40c3bacf0c0c9bc03a1774b
links:
  - to: form-validation-types
    relation: depends_on
    description: >-
      Uses UserApiAdditionalInformation type and USER_APPLICATION_INTENDED_USES
      constants
  - to: user-authentication-profile
    relation: uses
    description: Depends on useUser and useUpdateUserAdditionalInformation hooks
generator:
  version: 1
covers:
  - symbol: UserAdditionalFields
    kind: function
    at: >-
      apps/api-portal/src/components/user-additional-fields/user-additional-fields.tsx:L15-L222
---

<!-- context:generated:start -->

## Summary

React form component collecting user metadata required before API access: intended use case, end-user description, problem statement, and API terms acceptance. Enforces non-commercial-only usage and requires explicit terms link navigation before checkbox enablement.

## Related

- depends on [[form-validation-types]] — Uses UserApiAdditionalInformation type and USER_APPLICATION_INTENDED_USES constants
- uses [[user-authentication-profile]] — Depends on useUser and useUpdateUserAdditionalInformation hooks

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
