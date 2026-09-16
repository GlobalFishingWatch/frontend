---
name: Virtualized Table for Large Datasets
slug: virtualized-table-for-large-datasets
type: concept
sources:
  - path: apps/data-download-portal/src/components/table/table.tsx
    hash: d264086a8ba277e72e323853b1d62e25a4145a478b196cd87a1d9d6d33cb3a19
sources_digest: 5e182d2e0c82d0c3efafd779a6ffcd87e71984511b09b81c59eeebed346cd4d0
links: []
generator:
  version: 1
covers:
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

Data portal table uses react-window virtualization with fixed 500px height to handle large file hierarchies efficiently. Fuzzy filter recursively includes parent rows if any child matches, maintaining context despite flat filtering result.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
