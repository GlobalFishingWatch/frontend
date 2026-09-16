---
name: Defensive utility design with lenient error handling
slug: defensive-utility-design-with-lenient-error-handling
type: concept
sources:
  - path: apps/data-download-portal/src/utils/dates.ts
    hash: 4f854c26550adad7c48439e804efb3cd56773a7f39069f2f30cf65bb572dbbb5
  - path: apps/data-download-portal/src/utils/folderConfig.tsx
    hash: 5afdfc08479995dd9ad068218471a4d925ce7541fc4c3c2153be767715a90cec
  - path: apps/data-download-portal/src/utils/sorting.tsx
    hash: 9660f256d1b6e90886d5327e21c4edfb4bed30e8975f58356ffb1c0f78d9f831
  - path: apps/data-download-portal/src/utils/text.tsx
    hash: e0d87c762657b40ee4c9f04be8616cb495c7dbfa49b5784c4d3b6f369a7f8cf6
  - path: apps/image-labeler/src/features/project/TaskImage.utils.ts
    hash: 18a808755128256165215a32e93168ecaa09666d46b759691dd8c71a761c72bf
sources_digest: 4d7addfbce48e90c3a2281f5a8b9b9049acc4d742445ff3094a44512bcdb8227
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
  - symbol: RawImageData
    kind: type
    at: 'apps/image-labeler/src/features/project/TaskImage.utils.ts:L7-L7'
  - symbol: LevelsValues
    kind: type
    at: 'apps/image-labeler/src/features/project/TaskImage.utils.ts:L8-L8'
  - symbol: DataRange
    kind: type
    at: 'apps/image-labeler/src/features/project/TaskImage.utils.ts:L9-L9'
  - symbol: AutoLevelsResult
    kind: type
    at: 'apps/image-labeler/src/features/project/TaskImage.utils.ts:L10-L10'
  - symbol: decodeEnhancedToRaw
    kind: function
    at: 'apps/image-labeler/src/features/project/TaskImage.utils.ts:L12-L24'
  - symbol: NormMode
    kind: type
    at: 'apps/image-labeler/src/features/project/TaskImage.utils.ts:L26-L26'
  - symbol: decodeOriginalToRaw
    kind: function
    at: 'apps/image-labeler/src/features/project/TaskImage.utils.ts:L28-L136'
  - symbol: applyLevelToChannel
    kind: function
    at: 'apps/image-labeler/src/features/project/TaskImage.utils.ts:L138-L149'
  - symbol: applyLevelsToCanvas
    kind: function
    at: 'apps/image-labeler/src/features/project/TaskImage.utils.ts:L151-L167'
  - symbol: computeAutoLevels
    kind: function
    at: 'apps/image-labeler/src/features/project/TaskImage.utils.ts:L169-L205'
  - symbol: drawHistogram
    kind: function
    at: 'apps/image-labeler/src/features/project/TaskImage.utils.ts:L207-L265'
---

<!-- context:generated:start -->

## Summary

Pervasive pattern avoiding throwing errors in favor of fallback values and console warnings. dates.ts returns current UTC time on invalid input rather than throwing; folderConfig.tsx uses Set-based deduplication for recursive flattening; text.tsx escapes regex characters to prevent injection; TaskImage.utils.ts guards against division-by-zero and numerical instability in gamma computation. This design prevents downstream breakage but may mask upstream data quality issues. Particularly notable in sorting.tsx where sortByLastUpdated ignores the direction parameter, creating inconsistency if consumers expect bidirectional control—indicative of incomplete feature rather than defensive design.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
