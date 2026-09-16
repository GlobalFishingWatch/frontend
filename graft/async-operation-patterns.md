---
name: Async Operation Patterns
slug: async-operation-patterns
type: concept
sources:
  - path: apps/platform/features/_map/bigquery/bigquery.slice.ts
    hash: 6ffc2bea88f2c8643691220c88610d989a9efc9f43ff40b566231190802529b4
  - path: apps/platform/features/_map/content-panel/chat/chat-session.hooks.ts
    hash: 783eeaf68bb5d39b6cf042c1c69e7b6fd5f1df2f96ecc4fcda976ee96b841ef8
sources_digest: ed6d01afc43160c16c210eff51b64ddbc0c74d4009c686bc3e2ee6d24f21d97b
links:
  - to: redux-state-management
    relation: part_of
    description: >-
      Async thunks are the primary mechanism for managing async operations in
      Redux slices
generator:
  version: 1
covers:
  - symbol: BigQueryVisualisation
    kind: type
    at: 'apps/platform/features/_map/bigquery/bigquery.slice.ts:L17-L17'
  - symbol: RunCostResponse
    kind: type
    at: 'apps/platform/features/_map/bigquery/bigquery.slice.ts:L19-L22'
  - symbol: CreateBigQueryDataset
    kind: type
    at: 'apps/platform/features/_map/bigquery/bigquery.slice.ts:L24-L34'
  - symbol: CreateBigQueryDatasetResponse
    kind: type
    at: 'apps/platform/features/_map/bigquery/bigquery.slice.ts:L61-L66'
  - symbol: BigQueryState
    kind: interface
    at: 'apps/platform/features/_map/bigquery/bigquery.slice.ts:L112-L116'
  - symbol: LazyLoadedSlices
    kind: interface
    at: 'apps/platform/features/_map/bigquery/bigquery.slice.ts:L176-L176'
  - symbol: FeedbackRating
    kind: type
    at: >-
      apps/platform/features/_map/content-panel/chat/chat-session.hooks.ts:L22-L22
  - symbol: messageText
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/chat/chat-session.hooks.ts:L25-L30
  - symbol: getFeedbackState
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/chat/chat-session.hooks.ts:L32-L54
  - symbol: chatFetchWithAuth
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/chat/chat-session.hooks.ts:L56-L74
  - symbol: ChatSessionArgs
    kind: type
    at: >-
      apps/platform/features/_map/content-panel/chat/chat-session.hooks.ts:L76-L81
  - symbol: useChatSession
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/chat/chat-session.hooks.ts:L83-L189
  - symbol: prepareSendMessagesRequest
    kind: method
    at: >-
      apps/platform/features/_map/content-panel/chat/chat-session.hooks.ts:L91-L101
  - symbol: onToolCall
    kind: method
    at: >-
      apps/platform/features/_map/content-panel/chat/chat-session.hooks.ts:L117-L149
  - symbol: reportNavigate
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/chat/chat-session.hooks.ts:L121-L122
---

<!-- context:generated:start -->

## Summary

Standardized pattern for async workflows using RTK Toolkit thunks with AsyncReducerStatus enums (idle, pending, fulfilled, rejected) to track fetch states. Error handling via parseAPIError converts API responses to ParsedAPIError objects; user-facing errors are surfaced via payloads and UI error boundaries.

## Related

- part of [[redux-state-management]] — Async thunks are the primary mechanism for managing async operations in Redux slices

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
