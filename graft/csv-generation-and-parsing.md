---
name: CSV Generation and Parsing
slug: csv-generation-and-parsing
type: file
sources:
  - path: apps/platform/utils/csv.ts
    hash: 75e163d041b9966a3772ab8666bf249e64a99b066ff72642f10731861af1cfa5
sources_digest: 57618d8e04c8200d76812f2c07a7164164fff2f0988219ec40e77767da02e7fd
links: []
generator:
  version: 1
covers:
  - symbol: CsvConfig
    kind: type
    at: 'apps/platform/utils/csv.ts:L5-L9'
  - symbol: parseCSVString
    kind: function
    at: 'apps/platform/utils/csv.ts:L11-L13'
  - symbol: parseCSVDate
    kind: function
    at: 'apps/platform/utils/csv.ts:L14-L14'
  - symbol: parseCSVList
    kind: function
    at: 'apps/platform/utils/csv.ts:L15-L15'
  - symbol: objectArrayToCSV
    kind: function
    at: 'apps/platform/utils/csv.ts:L17-L35'
---

<!-- context:generated:start -->

## Summary

CSV utilities for converting objects to CSV-formatted text and parsing CSV data types. Main export objectArrayToCSV accepts a configuration schema specifying labels, property accessors (supporting nested paths), and optional value transformers. Supporting parsers handle string escaping, date conversion to UTC format, and list flattening for array fields.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
