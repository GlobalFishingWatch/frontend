---
name: Hierarchical file selection with tree flattening for downloads
slug: hierarchical-file-selection-with-tree-flattening-for-downloads
type: concept
sources:
  - path: apps/data-download-portal/src/utils/folderConfig.tsx
    hash: 5afdfc08479995dd9ad068218471a4d925ce7541fc4c3c2153be767715a90cec
sources_digest: 7189e25965b419b19491099d287f1bbed0a3761dadf39bac6a102934cfcd27ac
links: []
generator:
  version: 1
covers:
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
---

<!-- context:generated:start -->

## Summary

Data download portal handles nested folder structures by parsing file paths, building tree representations via insertIntoTree (creating intermediate folders as needed), and supporting multi-level folder selection. getFlattenedFiles recursively extracts leaf files from selected rows while avoiding double-counting descendants—critical for accurate download manifests when users select both parent folders and child files. Uses react-table's subRows property for hierarchy representation and Set<string> for deduplication. Assumes files ending with '/' are folders; design couples path parsing with tree rendering, making it brittle to path format changes.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
