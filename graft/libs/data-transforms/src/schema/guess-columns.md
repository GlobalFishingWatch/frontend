# libs/data-transforms/src/schema/guess-columns.ts · [[coordinate-and-date-parsing-utilities]] [[schema-detection-and-inference]]

Module that provides utilities to guess and resolve dataset column types (latitude, longitude, timestamp, vessel properties) by matching header names against predefined alias patterns.

- GuessColumn · type · L4-L4 — Type alias for the three geographic column categories that can be auto-guessed from dataset headers.
- VesselPropertyGuessColumn · type · L5-L5 — Type alias for the five vessel-related column categories that can be auto-guessed from dataset headers.
- matchesWithUpperCase · function · L34-L40 — Expands a list of string aliases by adding uppercase and title-cased variants to improve case-insensitive matching.
- resolveVesselPropertyColumn · function · L58-L68 — Identifies which vessel property type a CSV header belongs to by normalized case-insensitive matching against known aliases.
- guessColumn · function · L70-L72 — Finds the first option that matches a known alias list for a given geographic column type.
- guessColumnsFromFilters · function · L74-L99 — Auto-detects geographic columns from dataset filters using exact matching followed by regex-based approximate matching for ambiguous cases.
