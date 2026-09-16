# apps/platform/features/data/regions/regions.hooks.ts · [[i18n-localization]] [[workspace-map-data]]

Module that exports React hooks for looking up region translations and names by type in the data regions feature.

- useRegionTranslationsById · function · L16-L39 — Hook that returns a function to fetch translated display text for a region by its ID from the regions datasets schema.
- useRegionNamesByType · function · L43-L74 — Hook that returns a function to resolve region display labels for a given region type and list of region IDs, with localized text substitutions.
