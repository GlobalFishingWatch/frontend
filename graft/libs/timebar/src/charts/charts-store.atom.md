# libs/timebar/src/charts/charts-store.atom.ts · [[inactive-chart-data-retention]] [[layer-rendering-order-declarative-layering]] [[timebar-chart-state-management]]

- ChartState · type · L8-L8 — Type definition for individual chart state holding optional data, active flag, deck.gl layers, and loading indicator.
- selectActiveCharts · function · L14-L15 — Filters chart store to extract only actively displayed charts with their data.
- activeChartsEqual · function · L17-L21 — Compares two active chart collections for equality based on chart count and data object identity to optimize atom subscriptions.
- selectLayers · function · L27-L28 — Extracts and orders visualization layers from all active charts according to the predefined layer priority sequence.
- layersEqual · function · L30-L31 — Compares two layer arrays for equality to prevent unnecessary re-renders when deck.gl layers have not changed.
- selectAnyLoading · function · L35-L36 — Determines if any chart in the store is currently loading to signal in-progress data fetches.
- useUpdateChartsData · function · L40-L54 — React hook that synchronizes chart data and loading state to the atom store, marking charts active on mount and inactive on unmount.
- useUpdateChartLayers · function · L56-L70 — React hook that syncs deck.gl rendering layers to the atom store and cleans them up when the chart component unmounts.
