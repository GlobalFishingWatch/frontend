# apps/platform/features/data/resources/resources.utils.ts · [[data-layer-api]]

Utility module that exports a dataset configuration callback for handling resource visibility and caching based on guest user status and vessel data availability.

- infoDatasetConfigsCallback · function · L7-L20 — Returns a callback that filters and transforms dataset configurations, removing resources when vessel data is missing and adding cache-busting parameters for guest users.
