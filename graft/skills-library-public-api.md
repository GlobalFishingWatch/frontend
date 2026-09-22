---
name: Skills Library Public API
slug: skills-library-public-api
type: file
sources:
  - path: libs/skills/src/index.ts
    hash: db087148ac1571a0c60270a2221c790082293b6d4e27fd1788638e22035e82e2
sources_digest: afe57b723db03c8d4f48af654701a67cc3e687ad1b60ba0b61cdbb46335fadca
links:
  - to: decode-url-skill-barrel-export
    relation: produces
    description: Aggregates decode-url functionality
  - to: encode-url-skill-barrel-export
    relation: produces
    description: Aggregates encode-url functionality
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Root entry point for the skills library, re-exporting encode-url and decode-url domains to provide a flat namespace for URL encoding/decoding and workspace manipulation.

## Related

- produces [[decode-url-skill-barrel-export]] — Aggregates decode-url functionality
- produces [[encode-url-skill-barrel-export]] — Aggregates encode-url functionality

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
