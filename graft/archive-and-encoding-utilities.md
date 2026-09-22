---
name: Archive and Encoding Utilities
slug: archive-and-encoding-utilities
type: system
sources:
  - path: libs/data-transforms/src/files/text-encoding.ts
    hash: 7d4747a3b45e863c14e0884dda64872d51434496e2306aaddb554bb89bf2f5e7
  - path: libs/data-transforms/src/files/zip-to-files.test.ts
    hash: a4b309fa28dde1196533e2136ae93d10d39bb196b7410d5227a9ab0f99cb0e8e
  - path: libs/data-transforms/src/files/zip-to-files.ts
    hash: eaaeb5101ab20711284fef0f5c599fc34a421cef6a5956fa3d9281e9bdc25f2a
sources_digest: 4fcee633c845b0b8f377c0ef7aab6a808af115322284c0645aa25c6b3507c112
links:
  - to: file-format-conversion-pipeline
    relation: part_of
    description: >-
      ZIP utilities support KML/KMZ decompression within the file conversion
      pipeline
generator:
  version: 1
covers:
  - symbol: fixTextEncoding
    kind: function
    at: 'libs/data-transforms/src/files/text-encoding.ts:L1-L31'
  - symbol: zipContent
    kind: function
    at: 'libs/data-transforms/src/files/zip-to-files.test.ts:L6-L11'
  - symbol: isZipFile
    kind: function
    at: 'libs/data-transforms/src/files/zip-to-files.ts:L5-L9'
  - symbol: isJunkEntry
    kind: function
    at: 'libs/data-transforms/src/files/zip-to-files.ts:L12-L13'
  - symbol: zipToFiles
    kind: function
    at: 'libs/data-transforms/src/files/zip-to-files.ts:L15-L29'
  - symbol: findZipEntries
    kind: function
    at: 'libs/data-transforms/src/files/zip-to-files.ts:L32-L34'
  - symbol: zipEntryToFile
    kind: function
    at: 'libs/data-transforms/src/files/zip-to-files.ts:L36-L39'
---

<!-- context:generated:start -->

## Summary

Lightweight utilities for ZIP file handling (zipToFiles, zipEntryToFile, findZipEntries) and text encoding repair (fixTextEncoding for mojibake in imported data). The ZIP utilities support pattern-based entry filtering and automatic macOS metadata filtering (__MACOSX, ._prefixed files), with lazy-loading of JSZip to minimize bundle impact. Text encoding utilities target Romance and Germanic languages with specific diacritical replacements.

## Related

- part of [[file-format-conversion-pipeline]] — ZIP utilities support KML/KMZ decompression within the file conversion pipeline

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
