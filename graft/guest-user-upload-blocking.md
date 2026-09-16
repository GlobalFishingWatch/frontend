---
name: Guest User Upload Blocking
slug: guest-user-upload-blocking
type: concept
sources:
  - path: apps/platform/features/_map/datasets/upload/NewDataset.tsx
    hash: 76c2c52e6619176a925d806d2ca7625f7629db08670159fe4c60d9a17274bfbb
sources_digest: 116c9536e1142d83f3ec151453329bdaefeece4ac39843ff369e12fb64d387df
links: []
generator:
  version: 1
covers:
  - symbol: OnConfirmParams
    kind: type
    at: 'apps/platform/features/_map/datasets/upload/NewDataset.tsx:L43-L43'
  - symbol: NewDatasetProps
    kind: type
    at: 'apps/platform/features/_map/datasets/upload/NewDataset.tsx:L44-L51'
  - symbol: DatasetMetadata
    kind: type
    at: 'apps/platform/features/_map/datasets/upload/NewDataset.tsx:L53-L60'
  - symbol: NewDataset
    kind: function
    at: 'apps/platform/features/_map/datasets/upload/NewDataset.tsx:L62-L274'
---

<!-- context:generated:start -->

## Summary

The NewDataset modal enforces authentication by showing a RegisterOrLoginToUpload gate for guest or expired users, preventing anonymous dataset uploads. Successful uploads trigger analytics tracking via trackEvent with TrackCategory.User, recording user engagement with the upload feature.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
