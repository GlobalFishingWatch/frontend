---
name: Flag Metadata Utilities
slug: flag-metadata-utilities
type: file
sources:
  - path: apps/platform/utils/flags.ts
    hash: 6137d819b8d4e055266c07f680ecceaf37031b36a64b46477b18d6332e90b2be
sources_digest: 38ef938796e8971f34497acee58728e870ba417edfab1a26c0f50689558771a5
links: []
generator:
  version: 1
covers:
  - symbol: Flag
    kind: type
    at: 'apps/platform/utils/flags.ts:L4-L4'
  - symbol: getFlagById
    kind: function
    at: 'apps/platform/utils/flags.ts:L5-L12'
  - symbol: getFlagsByIds
    kind: function
    at: 'apps/platform/utils/flags.ts:L14-L18'
  - symbol: getFlags
    kind: function
    at: 'apps/platform/utils/flags.ts:L20-L26'
  - symbol: cleanFlagState
    kind: function
    at: 'apps/platform/utils/flags.ts:L28-L30'
---

<!-- context:generated:start -->

## Summary

Functions for retrieving and translating flag metadata from a centralized data source. Exports getFlagById, getFlagsByIds, getFlags, and cleanFlagState utilities that apply i18n translations to flag labels based on current or specified language, with fallback to original labels if translation unavailable.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
