---
name: Deck Loaders Public API
slug: deck-loaders-public-api
type: system
sources:
  - path: libs/deck-loaders/src/index.ts
    hash: e195e753988351b45a39a1294480ccc2f58a79b085ebddb0ee3353235ee478fd
sources_digest: 0b27281116065f04759e7ba4588dfa795bd0d4dd6e9918409b90ac2e47d6da9f
links:
  - to: fourwings-public-api
    relation: uses
    description: Re-exports Fourwings loaders and helpers
  - to: user-tracks-public-api
    relation: uses
    description: Re-exports user track functionality
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Top-level barrel export for deck-loaders library, re-exporting all public functionality from fourwings (main loader), fourwings/helpers (utilities), vessels (domain-specific data), and user (user track management). Provides unified interface for consuming code to access all deck loading and management features.

## Related

- uses [[fourwings-public-api]] — Re-exports Fourwings loaders and helpers
- uses [[user-tracks-public-api]] — Re-exports user track functionality

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
