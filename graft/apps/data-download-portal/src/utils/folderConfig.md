# apps/data-download-portal/src/utils/folderConfig.tsx · [[data-download-portal-utilities]] [[defensive-utility-design-with-lenient-error-handling]] [[hierarchical-file-selection-with-tree-flattening-for-downloads]]

Utility module for building hierarchical file trees from flat datasets and formatting file sizes, with selection tracking to avoid double-counting nested files.

- formatBytes · function · L7-L17 — Converts a byte size into a human-readable format with appropriate unit (Bytes, KB, MB, GB, TB, PB) and decimal precision.
- insertIntoTree · function · L19-L46 — Recursively inserts a file into a hierarchical tree structure by parsing its path and creating intermediate folder nodes as needed.
- buildFileTree · function · L48-L55 — Constructs a nested tree structure of files and folders from a flat list of dataset files.
- getFlattenedFiles · function · L59-L88 — Extracts all selected leaf files from a hierarchical table structure, deduplicating descendants of selected folder nodes to avoid counting files multiple times.
- processRow · function · L63-L84 — Recursively processes a tree node to collect all leaf file entries while tracking visited paths to prevent duplication.
