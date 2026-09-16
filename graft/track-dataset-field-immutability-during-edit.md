---
name: Track Dataset Field Immutability During Edit
slug: track-dataset-field-immutability-during-edit
type: concept
sources:
  - path: apps/platform/features/_map/datasets/upload/NewTrackDataset.tsx
    hash: 76d1ff5cdb07bd33661dc9e21815e05276bea20812308321d1dcabc78c76253d
sources_digest: bc84a6a243f0423416b07efd6f6b48f6f16ceb73980ef543574a189f26d340d6
links: []
generator:
  version: 1
covers:
  - symbol: NewTrackDataset
    kind: function
    at: 'apps/platform/features/_map/datasets/upload/NewTrackDataset.tsx:L49-L453'
  - symbol: updateFileType
    kind: function
    at: 'apps/platform/features/_map/datasets/upload/NewTrackDataset.tsx:L71-L76'
---

<!-- context:generated:start -->

## Summary

When editing an existing track dataset, the component disables file selection and locks latitude/longitude field configuration to prevent breaking existing visualizations. Only optional settings (time filters, value properties) can be modified. This constraint ensures that re-uploaded or re-parsed coordinate data does not invalidate already-persisted feature IDs.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
