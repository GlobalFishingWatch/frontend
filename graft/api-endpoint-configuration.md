---
name: API Endpoint Configuration
slug: api-endpoint-configuration
type: system
sources:
  - path: libs/datasets-client/src/endpoints.config.ts
    hash: 6d364b5416eddeda85dd7af65a88db624308268b47d6cd9d621eb2902482713d
  - path: libs/datasets-client/src/endpoints.ts
    hash: 7b31311515cf4b28ac71ba7f6fd82d5f0f0749806b5a1c2e47650ddda08fcda7
sources_digest: 8d00d211acd4decd23e32db4bcf17caaf304b802ab9b2258651b5cc79ea389d7
links:
  - to: dataset-configuration-and-filtering
    relation: part_of
    description: >-
      Endpoint configurations depend on filter types and dataset type enums from
      datasets.filters
generator:
  version: 1
covers:
  - symbol: InferEndpoint
    kind: type
    at: 'libs/datasets-client/src/endpoints.ts:L18-L25'
  - symbol: ExtractQueryParamIds
    kind: type
    at: 'libs/datasets-client/src/endpoints.ts:L29-L29'
  - symbol: QueryParamIds
    kind: type
    at: 'libs/datasets-client/src/endpoints.ts:L33-L35'
  - symbol: ParamTypeMap
    kind: type
    at: 'libs/datasets-client/src/endpoints.ts:L38-L44'
  - symbol: InferParamType
    kind: type
    at: 'libs/datasets-client/src/endpoints.ts:L47-L62'
  - symbol: QueryParamItem
    kind: type
    at: 'libs/datasets-client/src/endpoints.ts:L64-L64'
  - symbol: QueryParamId
    kind: type
    at: 'libs/datasets-client/src/endpoints.ts:L65-L65'
  - symbol: RequiredQueryParamId
    kind: type
    at: 'libs/datasets-client/src/endpoints.ts:L66-L69'
  - symbol: OptionalQueryParamId
    kind: type
    at: 'libs/datasets-client/src/endpoints.ts:L70-L73'
  - symbol: QueryParamById
    kind: type
    at: 'libs/datasets-client/src/endpoints.ts:L74-L77'
  - symbol: InferQueryParams
    kind: type
    at: 'libs/datasets-client/src/endpoints.ts:L81-L87'
  - symbol: replacePathVersion
    kind: function
    at: 'libs/datasets-client/src/endpoints.ts:L106-L111'
  - symbol: replaceEndpointsVersion
    kind: function
    at: 'libs/datasets-client/src/endpoints.ts:L113-L118'
  - symbol: GetEndpointParams
    kind: type
    at: 'libs/datasets-client/src/endpoints.ts:L120-L120'
  - symbol: getEndpoints
    kind: function
    at: 'libs/datasets-client/src/endpoints.ts:L121-L128'
  - symbol: GetEndpointsByDataset
    kind: type
    at: 'libs/datasets-client/src/endpoints.ts:L130-L132'
  - symbol: getEndpointsByDatasetType
    kind: function
    at: 'libs/datasets-client/src/endpoints.ts:L133-L135'
  - symbol: GetEndpointByType
    kind: type
    at: 'libs/datasets-client/src/endpoints.ts:L137-L139'
  - symbol: getEndpointByType
    kind: function
    at: 'libs/datasets-client/src/endpoints.ts:L147-L155'
---

<!-- context:generated:start -->

## Summary

Declarative configuration for all HTTP API endpoints in the Global Fishing Watch datasets service, organized into logical groups (TRACK_ENDPOINTS, VESSELS_ENDPOINTS, EVENTS_ENDPOINTS, FOURWINGS_ENDPOINTS, context layers, PM_TILES, THUMBNAILS). Each endpoint specifies HTTP method, path template with variable interpolation, path/query parameters with type enforcement and validation rules, and metadata like downloadability. Type-safe endpoint resolution via ENDPOINTS_BY_TYPE maps dataset types to available endpoints. Sophisticated TypeScript types (InferEndpoint, InferQueryParams) enable compile-time parameter verification. Supports optional API version overrides for testing multi-version support.

## Related

- part of [[dataset-configuration-and-filtering]] — Endpoint configurations depend on filter types and dataset type enums from datasets.filters

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
