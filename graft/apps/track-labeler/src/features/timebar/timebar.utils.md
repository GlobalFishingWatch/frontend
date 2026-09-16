# apps/track-labeler/src/features/timebar/timebar.utils.tsx · [[timebar-ui-data-filtering]]

Utility module that exports helper functions for processing vessel track points in the timebar feature.

- getIsOutOfFilterRange · function · L6-L19 — Determines whether a numeric value falls outside the min/max bounds defined by a filter mode configuration.
- getTimebarPoints · function · L21-L49 — Transforms raw vessel track data into annotated VesselPoint objects, marking each point as in or out of range based on time and filter constraints.
- getMaxMinVesselPointsByProperty · function · L51-L59 — Computes the minimum and maximum values of a specified numeric property across a collection of vessel points.
