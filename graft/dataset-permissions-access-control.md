---
name: Dataset Permissions & Access Control
slug: dataset-permissions-access-control
type: file
sources:
  - path: libs/datasets-client/src/permissions.ts
    hash: f6240d34e7b4d1a53cb4b2457ddb2ecfae8e6f6514841ceb046073080ba097ac
sources_digest: df05b5f28dc9acc589716b3fcbd3dee20bae989d67d73e8ab7904921157c8ffd
links:
  - to: dataview-resolution-filtering
    relation: validates
    description: >-
      Permission checks should gate access to sensitive datasets before
      resolution
generator:
  version: 1
covers:
  - symbol: checkDatasetReportPermission
    kind: function
    at: 'libs/datasets-client/src/permissions.ts:L4-L7'
  - symbol: checkDatasetDownloadTrackPermission
    kind: function
    at: 'libs/datasets-client/src/permissions.ts:L9-L23'
---

<!-- context:generated:start -->

## Summary

Provides wrapper functions for checking user dataset-specific permissions (reporting, downloading at various granularities) by delegating to auth-middleware's generic permission checker. Works around current wildcard matching limitations.

## Related

- validates [[dataview-resolution-filtering]] — Permission checks should gate access to sensitive datasets before resolution

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
