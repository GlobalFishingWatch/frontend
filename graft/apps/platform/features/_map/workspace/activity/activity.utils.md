# apps/platform/features/_map/workspace/activity/activity.utils.ts · [[activity-dataview-management-system]]

Utility module for querying and filtering activity and detection dataviews with source dataset options.

- isDefaultActivityDataview · function · L11-L13 — Determines whether a dataview is a default activity/fishing dataview by checking the slug prefix or activity type.
- isDefaultDetectionsDataview · function · L15-L16 — Determines whether a dataview is a default detections dataview by checking against the presence slug or detection type.
- getSourcesOptionsInDataview · function · L20-L27 — Extracts and returns a sorted list of available dataset source options from a dataview, filtered by dataset type.
- getSourcesSelectedInDataview · function · L29-L40 — Filters the available source options to return only those currently selected in the dataview configuration.
- areAllSourcesSelectedInDataview · function · L42-L51 — Checks whether all available source options are currently selected in the dataview configuration.
