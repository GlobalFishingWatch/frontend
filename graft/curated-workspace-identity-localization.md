---
name: Curated Workspace Identity & Localization
slug: curated-workspace-identity-localization
type: concept
sources:
  - path: libs/skills/src/decode-url/workspaces.ts
    hash: fede13ceca279efe9ff1cddae0aa043789ab619c5db65c174a708f8dfb4d29af
sources_digest: b9d57ad37fdf418027343c25a970a6597f7170a37e0953569af145959ef7312d
links:
  - to: workspace-naming-lookup
    relation: implements
    description: HIGHLIGHTED_WORKSPACES is the concrete lookup table
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

HIGHLIGHTED_WORKSPACES maps workspace IDs to human-readable names sourced from platform configuration and i18n locale files, creating a single source of truth for consistent workspace naming in UI. This avoids hardcoding workspace labels and enables localization across the platform.

## Related

- implements [[workspace-naming-lookup]] — HIGHLIGHTED_WORKSPACES is the concrete lookup table

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
