---
name: API Error Classification & Parsing
slug: api-error-classification-parsing
type: system
sources:
  - path: libs/api-client/src/utils/errors.ts
    hash: c14719f702537ce35acf53aab00a10a103b5b6b8c43dcc8e830eac918cb2f796
sources_digest: 7f184a4f1ba831ea3c24d656ab8c413085481624f61fa224422ed4ff4df0b461
links:
  - to: response-parsing-processing
    relation: uses
    description: >-
      Error parsing integrates with HTTP response processing to convert error
      responses into structured error objects
generator:
  version: 1
covers:
  - symbol: V2MetadataError
    kind: type
    at: 'libs/api-client/src/utils/errors.ts:L3-L3'
  - symbol: V2MessageError
    kind: interface
    at: 'libs/api-client/src/utils/errors.ts:L4-L8'
  - symbol: ResponseError
    kind: interface
    at: 'libs/api-client/src/utils/errors.ts:L9-L13'
  - symbol: getIsUnauthorizedError
    kind: function
    at: 'libs/api-client/src/utils/errors.ts:L15-L16'
  - symbol: getIsConcurrentError
    kind: function
    at: 'libs/api-client/src/utils/errors.ts:L18-L19'
  - symbol: getIsTimeoutError
    kind: function
    at: 'libs/api-client/src/utils/errors.ts:L27-L30'
  - symbol: parseAPIErrorStatus
    kind: function
    at: 'libs/api-client/src/utils/errors.ts:L32-L34'
  - symbol: parseAPIErrorMessage
    kind: function
    at: 'libs/api-client/src/utils/errors.ts:L36-L41'
  - symbol: parseAPIErrorMetadata
    kind: function
    at: 'libs/api-client/src/utils/errors.ts:L43-L48'
  - symbol: ParsedAPIError
    kind: type
    at: 'libs/api-client/src/utils/errors.ts:L50-L55'
  - symbol: parseAPIError
    kind: function
    at: 'libs/api-client/src/utils/errors.ts:L56-L66'
  - symbol: isUnauthorized
    kind: function
    at: 'libs/api-client/src/utils/errors.ts:L68-L70'
  - symbol: isForbidden
    kind: function
    at: 'libs/api-client/src/utils/errors.ts:L72-L74'
  - symbol: isAuthError
    kind: function
    at: 'libs/api-client/src/utils/errors.ts:L76-L78'
  - symbol: isSessionError
    kind: function
    at: 'libs/api-client/src/utils/errors.ts:L88-L93'
  - symbol: isTransientError
    kind: function
    at: 'libs/api-client/src/utils/errors.ts:L95-L99'
---

<!-- context:generated:start -->

## Summary

Error categorization and normalization system for HTTP responses from backend APIs. Classifies errors as unauthorized, concurrent, timeout, or transient via predicates; extracts normalized message/status/metadata from v1 and v2 API formats; handles Cloudflare 524 timeouts manifesting as TypeErrors with browser-specific string patterns (Safari 'Load failed', Chromium 'Failed to fetch'); distinguishes recoverable from permanent session failures to guide retry logic.

## Related

- uses [[response-parsing-processing]] — Error parsing integrates with HTTP response processing to convert error responses into structured error objects

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
