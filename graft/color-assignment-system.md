---
name: Color Assignment System
slug: color-assignment-system
type: concept
sources:
  - path: apps/port-labeler/src/features/sidebar/sidebar.hooks.ts
    hash: f9411a8a0866265a8d853aea313f6c71d9fdb3ca8dfd2bd31da3508d388356e3
  - path: apps/port-labeler/src/utils/colors.ts
    hash: 4af3718f1173a514d792326041bde42c57635d176f4e4dbf275d03842ae80077
sources_digest: 870307cb4a4624d5f4d0679f2e5d77a2cabdf5510d98473905232126690d5674
links:
  - to: redux-state-management-for-labeler
    relation: uses
    description: >-
      Color assignments for new subareas/ports persisted in labeler slice via
      Redux state
generator:
  version: 1
covers:
  - symbol: useSelectedTracksConnect
    kind: function
    at: 'apps/port-labeler/src/features/sidebar/sidebar.hooks.ts:L25-L266'
  - symbol: findPortName
    kind: function
    at: 'apps/port-labeler/src/features/sidebar/sidebar.hooks.ts:L35-L41'
  - symbol: findSubareaName
    kind: function
    at: 'apps/port-labeler/src/features/sidebar/sidebar.hooks.ts:L42-L48'
  - symbol: assignLabeledValues
    kind: function
    at: 'apps/port-labeler/src/features/sidebar/sidebar.hooks.ts:L50-L76'
  - symbol: dispatchDownload
    kind: function
    at: 'apps/port-labeler/src/features/sidebar/sidebar.hooks.ts:L79-L87'
  - symbol: parseCountriesMetadata
    kind: function
    at: 'apps/port-labeler/src/features/sidebar/sidebar.hooks.ts:L89-L128'
  - symbol: handleFileUploaded
    kind: function
    at: 'apps/port-labeler/src/features/sidebar/sidebar.hooks.ts:L133-L149'
  - symbol: dispatchImportHandler
    kind: function
    at: 'apps/port-labeler/src/features/sidebar/sidebar.hooks.ts:L155-L161'
  - symbol: onCountryChange
    kind: function
    at: 'apps/port-labeler/src/features/sidebar/sidebar.hooks.ts:L164-L259'
  - symbol: typedKeys
    kind: function
    at: 'apps/port-labeler/src/utils/colors.ts:L1-L4'
  - symbol: getFixedColorForUnknownLabel
    kind: function
    at: 'apps/port-labeler/src/utils/colors.ts:L37-L44'
---

<!-- context:generated:start -->

## Summary

getFixedColorForUnknownLabel deterministically assigns colors from a 25-color palette (baseColors dictionary excluding lime and magenta) by index position; falls back to random hex if index exceeds palette size. Ensures consistent visual labeling for unknown ports/subareas without explicit color configuration, with palette comment noting lime/magenta are now managed in TRACK_COLORS settings.

## Related

- uses [[redux-state-management-for-labeler]] — Color assignments for new subareas/ports persisted in labeler slice via Redux state

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
