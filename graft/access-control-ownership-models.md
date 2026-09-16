---
name: Access Control & Ownership Models
slug: access-control-ownership-models
type: concept
sources:
  - path: libs/api-types/src/reports.ts
    hash: b1ab17729a64b6bd53f9437a308783c35e60d98bd5876a3e65bf73897ec82144
  - path: libs/api-types/src/user-applications.ts
    hash: 437ead3a0979104404f565bc155e1ae396ab55c4e2d233597d213e19c3e13724
  - path: libs/api-types/src/user.ts
    hash: aa7318bd717d1bb14e8e60798357ca77b16be3a8f48f377fe76a322a34cc8ddf
sources_digest: c772d989cc7f3d7f3d1f4069c0dc2438ad775e4d0c790bf8224caf1861cf3587
links:
  - to: api-types-type-definitions
    relation: part_of
    description: >-
      Access control patterns span user management, workspace, and report
      modules
generator:
  version: 1
covers:
  - symbol: Report
    kind: type
    at: 'libs/api-types/src/reports.ts:L3-L14'
  - symbol: Narrowable
    kind: type
    at: 'libs/api-types/src/user-applications.ts:L1-L1'
  - symbol: tuple
    kind: function
    at: 'libs/api-types/src/user-applications.ts:L2-L2'
  - symbol: UserApplicationIntendedUse
    kind: type
    at: 'libs/api-types/src/user-applications.ts:L5-L5'
  - symbol: UserApiAdditionalInformation
    kind: type
    at: 'libs/api-types/src/user-applications.ts:L7-L13'
  - symbol: UserApplication
    kind: type
    at: 'libs/api-types/src/user-applications.ts:L14-L21'
  - symbol: BADGES_GROUP
    kind: type
    at: 'libs/api-types/src/user.ts:L11-L16'
  - symbol: BADGES_PERMISSIONS
    kind: type
    at: 'libs/api-types/src/user.ts:L18-L23'
  - symbol: UserPermissionType
    kind: type
    at: 'libs/api-types/src/user.ts:L25-L36'
  - symbol: UserPermissionValue
    kind: type
    at: 'libs/api-types/src/user.ts:L38-L67'
  - symbol: UserPermissionAction
    kind: type
    at: 'libs/api-types/src/user.ts:L69-L70'
  - symbol: UserPermission
    kind: type
    at: 'libs/api-types/src/user.ts:L72-L76'
  - symbol: UserGroupId
    kind: type
    at: 'libs/api-types/src/user.ts:L78-L93'
  - symbol: UserGroup
    kind: type
    at: 'libs/api-types/src/user.ts:L95-L103'
  - symbol: FutureUserData
    kind: type
    at: 'libs/api-types/src/user.ts:L105-L110'
  - symbol: UserData
    kind: type
    at: 'libs/api-types/src/user.ts:L112-L133'
---

<!-- context:generated:start -->

## Summary

OwnerType enum (User, Organization, Admin) determines ownership categories across reports and workspaces. UserData carries permissions as array of UserPermission objects combining type (dataset/workspace/vessel), value (resource identifier or scope like 'indonesia:*'), and action. UserGroup defines team/regional groupings with roles. Report type omits workspace access-control fields during serialization to prevent leaking fine-grained permissions. UserApplicationIntendedUse ('commercial'|'non-commercial') and badge identifiers (AMBASSADOR_BADGE_ID, TEACHER_BADGE_ID) enable role-based feature gating and UI personalization.

## Related

- part of [[api-types-type-definitions]] — Access control patterns span user management, workspace, and report modules

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
