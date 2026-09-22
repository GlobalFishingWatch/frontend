---
name: Rate Limiting & Download Throttling
slug: rate-limiting-download-throttling
type: concept
sources:
  - path: libs/api-types/src/download.ts
    hash: a785f134e1def146b8c21cb27f2fb1fd71705b4989b824ca9ac8c0da54347839
  - path: libs/api-types/src/downloadActivity.ts
    hash: 2df5aec3deb0667307949e83fe3a1afb4b514834b4f4a5ca935340447a7a6cb5
sources_digest: c70a444fc3ba3bd5c8878ab4c90f31b8eddb7adeba4097ca944c1b87d94dd6cd
links:
  - to: api-types-type-definitions
    relation: part_of
    description: Rate limiting patterns applied to download endpoints throughout the API
generator:
  version: 1
covers:
  - symbol: DownloadRateLimit
    kind: type
    at: 'libs/api-types/src/download.ts:L1-L6'
  - symbol: DownloadActivityStatus
    kind: enum
    at: 'libs/api-types/src/downloadActivity.ts:L1-L6'
  - symbol: DownloadActivity
    kind: type
    at: 'libs/api-types/src/downloadActivity.ts:L8-L14'
---

<!-- context:generated:start -->

## Summary

DownloadRateLimit type carries remaining/limit/reset/retryAfter metadata returned by download operations. Consumed by API response handlers and download clients to enforce server-side rate limiting policies without client implementation of backoff logic. Supports both per-window and retry-based strategies via separate reset and retryAfter fields.

## Related

- part of [[api-types-type-definitions]] — Rate limiting patterns applied to download endpoints throughout the API

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
