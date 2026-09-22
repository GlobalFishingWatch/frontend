---
name: Hierarchical File Download with Survey Integration
slug: hierarchical-file-download-with-survey-integration
type: concept
sources:
  - path: apps/data-download-portal/src/components/download-modal/download-modal.tsx
    hash: 38a0f3da9f34dd1111f4ba2007a63f149d98cc12cf230e14431a406af017ded0
  - path: apps/data-download-portal/src/components/table/table.tsx
    hash: d264086a8ba277e72e323853b1d62e25a4145a478b196cd87a1d9d6d33cb3a19
sources_digest: 38a49fbc2275568987476c6acc0df50f7dcd06891827a11cab5893e4c16978e6
links:
  - to: download-modal-survey
    relation: implements
    description: Modal handles survey submission and multi-file email delivery messaging
generator:
  version: 1
covers:
  - symbol: DownloadRequest
    kind: type
    at: >-
      apps/data-download-portal/src/components/download-modal/download-modal.tsx:L19-L22
  - symbol: DownloadModalProps
    kind: type
    at: >-
      apps/data-download-portal/src/components/download-modal/download-modal.tsx:L24-L29
  - symbol: DownloadModal
    kind: function
    at: >-
      apps/data-download-portal/src/components/download-modal/download-modal.tsx:L31-L63
  - symbol: TableData
    kind: type
    at: 'apps/data-download-portal/src/components/table/table.tsx:L54-L61'
  - symbol: ExtendedTableState
    kind: type
    at: 'apps/data-download-portal/src/components/table/table.tsx:L63-L67'
  - symbol: TableInstanceWithHooks
    kind: type
    at: 'apps/data-download-portal/src/components/table/table.tsx:L69-L73'
  - symbol: ExtendedHeaderGroup
    kind: type
    at: 'apps/data-download-portal/src/components/table/table.tsx:L75-L77'
  - symbol: ExtendedRow
    kind: type
    at: 'apps/data-download-portal/src/components/table/table.tsx:L79-L79'
  - symbol: IndeterminateCheckboxProps
    kind: type
    at: 'apps/data-download-portal/src/components/table/table.tsx:L81-L84'
  - symbol: fuzzyTextFilterFn
    kind: function
    at: 'apps/data-download-portal/src/components/table/table.tsx:L109-L144'
  - symbol: collectAllRows
    kind: function
    at: 'apps/data-download-portal/src/components/table/table.tsx:L112-L119'
  - symbol: rowMatches
    kind: function
    at: 'apps/data-download-portal/src/components/table/table.tsx:L129-L138'
  - symbol: HighlightedCellProps
    kind: type
    at: 'apps/data-download-portal/src/components/table/table.tsx:L148-L153'
  - symbol: HighlightedCell
    kind: function
    at: 'apps/data-download-portal/src/components/table/table.tsx:L155-L170'
  - symbol: TableRowItemProps
    kind: type
    at: 'apps/data-download-portal/src/components/table/table.tsx:L172-L178'
  - symbol: TableRowItem
    kind: function
    at: 'apps/data-download-portal/src/components/table/table.tsx:L180-L214'
  - symbol: TableProps
    kind: type
    at: 'apps/data-download-portal/src/components/table/table.tsx:L216-L221'
  - symbol: Table
    kind: function
    at: 'apps/data-download-portal/src/components/table/table.tsx:L223-L449'
---

<!-- context:generated:start -->

## Summary

Data portal supports nested folder structures with tri-state selection (parent/child sync). Single-file downloads bypass modal if surveys disabled; multi-file downloads POST to /download/datasets/{datasetId}/download-multiple and trigger survey feedback collection, with email delivery expected for batched requests.

## Related

- implements [[download-modal-survey]] — Modal handles survey submission and multi-file email delivery messaging

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
