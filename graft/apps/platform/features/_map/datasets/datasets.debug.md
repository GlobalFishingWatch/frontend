# apps/platform/features/_map/datasets/datasets.debug.ts · [[dataset-information-display]]

Debugging utilities to trace which dataviews and related datasets cause a specific dataset to be loaded.

- debugDatasetsInDataviews · function · L9-L28 — Traces and logs which dataview(s) include a given dataset by searching through all dataview configurations.
- debugRelatedDatasets · function · L31-L49 — Traces and logs which dataset(s) reference a given dataset through their relatedDatasets relationships.
