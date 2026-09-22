---
name: Access Token Management UI
slug: access-token-management-ui
type: system
sources:
  - path: >-
      apps/api-portal/src/components/access-token/access-token-create/access-token-create.spec.tsx
    hash: 5cad5fffef10a84647b934264571b2931d14c6635123d33cac61e63d5d9c8190
  - path: >-
      apps/api-portal/src/components/access-token/access-token-create/access-token-create.tsx
    hash: 1c2243debeed4f7ae3195d608014bf444b6c142c84a0f44fb5af753606d2584d
  - path: >-
      apps/api-portal/src/components/access-token/access-token-list/access-token-list.spec.tsx
    hash: 607f7afa24a7abad53aa863f46f4d476373a353d99a3891f672592174d938487
  - path: >-
      apps/api-portal/src/components/access-token/access-token-list/access-token-list.tsx
    hash: da5d64803151723c74440486e037463f368d7fbd947a703d96d02ac66506049c
sources_digest: eaf64acdbffc6196b9681cadef8c6812d3fac0cb7c702cf3c418784a2a7540d9
links:
  - to: clipboard-utilities
    relation: uses
    description: AccessTokenList uses useClipboardNotification for copy feedback
  - to: date-formatting
    relation: uses
    description: AccessTokenList displays formatted token creation timestamps
  - to: user-applications-api-layer
    relation: uses
    description: >-
      Both components use useUserApplications, useDeleteUserApplication, and
      useCreateUserApplication hooks
  - to: user-authentication-profile
    relation: depends_on
    description: >-
      Token creation checks permission via isAllowed from
      useCreateUserApplication
generator:
  version: 1
covers:
  - symbol: AccessTokenCreate
    kind: function
    at: >-
      apps/api-portal/src/components/access-token/access-token-create/access-token-create.tsx:L10-L92
  - symbol: ActionMessage
    kind: type
    at: >-
      apps/api-portal/src/components/access-token/access-token-list/access-token-list.tsx:L16-L19
  - symbol: AccessTokenList
    kind: function
    at: >-
      apps/api-portal/src/components/access-token/access-token-list/access-token-list.tsx:L21-L185
---

<!-- context:generated:start -->

## Summary

UI components for displaying existing API tokens and creating new ones. Provides visibility toggles, copy-to-clipboard functionality, and deletion workflows with confirmation dialogs.

## Related

- uses [[clipboard-utilities]] — AccessTokenList uses useClipboardNotification for copy feedback
- uses [[date-formatting]] — AccessTokenList displays formatted token creation timestamps
- uses [[user-applications-api-layer]] — Both components use useUserApplications, useDeleteUserApplication, and useCreateUserApplication hooks
- depends on [[user-authentication-profile]] — Token creation checks permission via isAllowed from useCreateUserApplication

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
