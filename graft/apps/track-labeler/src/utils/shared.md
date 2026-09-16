# apps/track-labeler/src/utils/shared.ts · [[shared-utilities]]

Utility module providing helper functions for timestamp navigation, bounding box validation, date formatting, and position lookups in vessel tracking.

- typedKeys · function · L6-L9 — Extracts typed object keys with preserved type information.
- isFiniteBbox · function · L11-L13 — Validates that all coordinates in a bounding box are finite numbers.
- formatedDate · function · L15-L22 — Formats a Unix timestamp into a human-readable date string in UTC timezone.
- findPreviousTimestamp · function · L23-L34 — Locates the previous timestamp in a sorted array, returning the current timestamp if at boundaries.
- findNextTimestamp · function · L36-L46 — Locates the next timestamp in a sorted array, returning the current timestamp if at boundaries.
- findPreviousPosition · function · L48-L57 — Retrieves the latitude or longitude coordinate at the previous timestamp in a track position sequence.
- findNextPosition · function · L59-L68 — Retrieves the latitude or longitude coordinate at the next timestamp in a track position sequence.
