# apps/platform/utils/encounter-types.ts · [[encounter-type-normalization]]

Utilities for expanding and normalizing encounter type identifiers to their bidirectional forms.

- getEncounterTypesFromId · function · L1-L11 — Expands a hyphen-separated encounter type identifier into its forward and reverse forms, deduplicating when both parts are equal.
- getEncounterTypesFromIds · function · L13-L19 — Normalizes a single or multiple encounter type identifiers into a deduplicated array of all their bidirectional forms.
