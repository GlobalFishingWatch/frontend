# apps/platform/features/_reports/tabs/environment/migramar/reportEnvironmentMigramar.hooks.ts · [[internationalization-i18n-and-formatting]] [[migramar-environmental-analysis]]

Provides hooks and utilities for managing Migramar environmental data filtering and display by species, indicators, and geographic area.

- hasYearData · function · L12-L19 — Validates that a Migramar row contains at least one non-empty year column matching the YYYY format.
- useMigramar · function · L21-L119 — Custom hook that manages fetching, filtering, and returning species/indicator options and graph data for a specified Migramar area.
- selectSpecies · function · L104-L107 — Callback that sets the selected species and resets the indicator selection.
