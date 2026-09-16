---
name: Version Generation
slug: version-generation
type: file
sources:
  - path: libs/deck-loaders/scripts/generate-version.mjs
    hash: e65c6497885f684c17ba1a6bae646d6545cda0b9dd1e199e5f3968793c61d110
sources_digest: 9daa0b21886de9b40e661bd6e55a7c444b2bd5c890884a5ee8fbca3dd85a8b4e
links: []
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Auto-generates src/version.ts exporting VERSION constant from package.json semver. Uses ES module import.meta.url to compute __dirname and includes do-not-edit header. Critical constraint: builds must run this script before compilation to avoid stale version strings—silent correctness bug otherwise.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
