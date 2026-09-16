---
name: Workspace Dataview Integration
slug: workspace-dataview-integration
type: concept
sources:
  - path: apps/platform/features/_user/vessel-groups/VesselGroupModal.tsx
    hash: 6cf5ccdb8cd465d47cfb4afa0cc366ff1e7c4c95214b659671857308d41a0083
  - path: apps/platform/features/_vessels/search/SearchActions.tsx
    hash: 96fb1a85c40eee3562edcd9b706f913f77fed78b47671c04c1091d1864d690d0
sources_digest: 28f2db8ae238968d435a502af9cb50db6b1e941d0d3de8454dce3c31495dba05
links:
  - to: vessel-search-system
    relation: produces
    description: >-
      SearchActions constructs dataview instances from selected vessels via
      getVesselDataviewInstance and addNewDataviewInstances; vessel group modal
      uses same integration for workspace sync
generator:
  version: 1
covers:
  - symbol: VesselGroupModal
    kind: function
    at: 'apps/platform/features/_user/vessel-groups/VesselGroupModal.tsx:L101-L759'
  - symbol: SearchActions
    kind: function
    at: 'apps/platform/features/_vessels/search/SearchActions.tsx:L40-L136'
  - symbol: onSeeVesselsInMapClick
    kind: function
    at: 'apps/platform/features/_vessels/search/SearchActions.tsx:L52-L99'
  - symbol: onAddToVesselGroup
    kind: function
    at: 'apps/platform/features/_vessels/search/SearchActions.tsx:L101-L112'
---

<!-- context:generated:start -->

## Summary

Vessels selected in search results are converted to dataview instances and upserted into the current workspace or default map context. Related datasets (tracks, events) are resolved via datasetsClient and attached. Navigation to map clears search state and resets to EMPTY_SEARCH_FILTERS.

## Related

- produces [[vessel-search-system]] — SearchActions constructs dataview instances from selected vessels via getVesselDataviewInstance and addNewDataviewInstances; vessel group modal uses same integration for workspace sync

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
