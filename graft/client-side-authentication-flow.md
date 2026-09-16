---
name: Client-Side Authentication Flow
slug: client-side-authentication-flow
type: concept
sources:
  - path: apps/api-portal/src/components/layout.tsx
    hash: 5d0988552530880c315734adec46239f615160b25b50c473b9f6b74f580178dc
  - path: apps/api-portal/src/features/user/user.ts
    hash: 639cf97e42054e969712af03cce8408ba1ba6b9e7f345fc9c8ae7ccfe98e5430
  - path: apps/data-download-portal/src/components/header/header.tsx
    hash: 749cea14c1a35b166155df63ab3e88c4fbdb0d5a5d545e95bacad85a1842a22b
  - path: apps/data-download-portal/src/pages/login/login.tsx
    hash: 3a97c470db43fc145973f455097d27741b71feb087afa03b8cd75306b227218c
sources_digest: af90ecb4641ac2b110a79cf356a03749232907bac23b7ec864ef090433cb4156
links:
  - to: profile-completion-guard
    relation: implements
    description: >-
      API Portal enforces profile completion requirement before token management
      access
  - to: user-authentication-profile
    relation: implements
    description: >-
      API Portal useUser hook manages token extraction, caching, and permission
      derivation
generator:
  version: 1
covers:
  - symbol: Layout
    kind: function
    at: 'apps/api-portal/src/components/layout.tsx:L13-L56'
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
  - symbol: HeaderComponent
    kind: function
    at: 'apps/data-download-portal/src/components/header/header.tsx:L9-L38'
  - symbol: handleLoginRedirect
    kind: function
    at: 'apps/data-download-portal/src/components/header/header.tsx:L12-L16'
  - symbol: handleSettingsRedirect
    kind: function
    at: 'apps/data-download-portal/src/components/header/header.tsx:L17-L19'
  - symbol: LoginPage
    kind: function
    at: 'apps/data-download-portal/src/pages/login/login.tsx:L5-L10'
---

<!-- context:generated:start -->

## Summary

Both portals gate access via auth checks (useGFWLogin, useUser hooks) and OAuth redirects. API Portal enforces profile completion before token access; Data Portal allows partial browsing but requires login for downloads. LoginPage and GFWAPI.getLoginUrl manage redirect to external auth service.

## Related

- implements [[profile-completion-guard]] — API Portal enforces profile completion requirement before token management access
- implements [[user-authentication-profile]] — API Portal useUser hook manages token extraction, caching, and permission derivation

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
