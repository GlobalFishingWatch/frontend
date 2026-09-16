---
name: Protocol Buffer Vessel Schema
slug: protocol-buffer-vessel-schema
type: file
sources:
  - path: libs/api-client/src/pbf-decoders/vessels.proto
    hash: 2f1001da4497d1d522667b7771c6d3a54ecac1a80383c46eeb0f2829de704cbe
sources_digest: 148c43fb6ec8cb70289496d1a46a1944bf13e228157e1344470f93c1f5a20762
links:
  - to: api-client-browser-utilities
    relation: uses
    description: >-
      Protocol buffer definitions are compiled into TypeScript stubs consumed by
      browser-based API client code
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Protobuf message definitions for binary serialization of vessel query responses and tracking data. Exports TilesetVesselQuery, DatasetVesselQuery wrapping paginated results with metadata, and Track for trajectory encoding using sint32 compression. String timestamps and flexible key-value metadata via Extra support schema evolution across heterogeneous backend data sources.

## Related

- uses [[api-client-browser-utilities]] — Protocol buffer definitions are compiled into TypeScript stubs consumed by browser-based API client code

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
