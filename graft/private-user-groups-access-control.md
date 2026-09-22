---
name: Private User Groups & Access Control
slug: private-user-groups-access-control
type: concept
sources:
  - path: apps/platform/features/_user/selectors/user.groups.selectors.ts
    hash: b2f0daa11bcb101c562bfe0d90285ef68663d4e3caaa49091f27ae3fd7f4cb9e
  - path: apps/platform/features/_user/user.config.ts
    hash: ee9f3c6c7d165c68963882a0ce226bd2950b93c74c07a9d7c6d528c8700758d0
sources_digest: 198b64bc0e40208fe569cacc2dc0131a18d6ef886a0f768896204be1f9409c10
links:
  - to: user-authorization-permissions-system
    relation: part_of
    description: >-
      selectPrivateUserGroups is used by permission and workspace selectors to
      gate private resources
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

PRIVATE_SUPPORTED_GROUPS configuration array (user.config) defines whitelisted country and partner groups (Costa Rica, Belize, Brazil, SSF partners, etc.) that grant access to private datasets and workspaces. selectPrivateUserGroups intersects user's assigned groups with whitelist, granting GFW staff full access while restricting others. PRIVATE_SEARCH_DATASET_BY_GROUP maps each group to searchable vessel-identity datasets; SSF groups have empty arrays, suggesting alternate data access patterns.

## Related

- part of [[user-authorization-permissions-system]] — selectPrivateUserGroups is used by permission and workspace selectors to gate private resources

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
