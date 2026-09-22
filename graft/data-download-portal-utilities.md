---
name: Data download portal utilities
slug: data-download-portal-utilities
type: system
sources:
  - path: apps/data-download-portal/src/utils/dates.ts
    hash: 4f854c26550adad7c48439e804efb3cd56773a7f39069f2f30cf65bb572dbbb5
  - path: apps/data-download-portal/src/utils/folderConfig.tsx
    hash: 5afdfc08479995dd9ad068218471a4d925ce7541fc4c3c2153be767715a90cec
  - path: apps/data-download-portal/src/utils/sorting.tsx
    hash: 9660f256d1b6e90886d5327e21c4edfb4bed30e8975f58356ffb1c0f78d9f831
  - path: apps/data-download-portal/src/utils/text.tsx
    hash: e0d87c762657b40ee4c9f04be8616cb495c7dbfa49b5784c4d3b6f369a7f8cf6
sources_digest: e0b5e8cc974673cd18dc08b9b7f1b2e08e954daf6c591764e1c8ede650442536
links: []
generator:
  version: 1
covers:
  - symbol: DateInput
    kind: type
    at: 'apps/data-download-portal/src/utils/dates.ts:L3-L3'
  - symbol: getUTCDateTime
    kind: function
    at: 'apps/data-download-portal/src/utils/dates.ts:L5-L25'
  - symbol: getUTCString
    kind: function
    at: 'apps/data-download-portal/src/utils/dates.ts:L27-L32'
  - symbol: formatBytes
    kind: function
    at: 'apps/data-download-portal/src/utils/folderConfig.tsx:L7-L17'
  - symbol: insertIntoTree
    kind: function
    at: 'apps/data-download-portal/src/utils/folderConfig.tsx:L19-L46'
  - symbol: buildFileTree
    kind: function
    at: 'apps/data-download-portal/src/utils/folderConfig.tsx:L48-L55'
  - symbol: getFlattenedFiles
    kind: function
    at: 'apps/data-download-portal/src/utils/folderConfig.tsx:L59-L88'
  - symbol: processRow
    kind: function
    at: 'apps/data-download-portal/src/utils/folderConfig.tsx:L63-L84'
  - symbol: sortByName
    kind: function
    at: 'apps/data-download-portal/src/utils/sorting.tsx:L3-L10'
  - symbol: sortByLastUpdated
    kind: function
    at: 'apps/data-download-portal/src/utils/sorting.tsx:L12-L18'
  - symbol: sortDatasets
    kind: function
    at: 'apps/data-download-portal/src/utils/sorting.tsx:L20-L33'
  - symbol: getHighlightedText
    kind: function
    at: 'apps/data-download-portal/src/utils/text.tsx:L3-L26'
  - symbol: regEscape
    kind: function
    at: 'apps/data-download-portal/src/utils/text.tsx:L11-L11'
---

<!-- context:generated:start -->

## Summary

Collection of helper functions supporting dataset and file management in the download portal. Includes date normalization with UTC anchoring (dates.ts), hierarchical file tree construction and flattening for folder-based selection (folderConfig.tsx), dataset sorting by name or last-updated with locale awareness (sorting.tsx), and highlighted text rendering for search results (text.tsx). All utilities are defensive against invalid inputs and avoid throwing errors.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
