# apps/platform/features/_map/workspace/shared/LayerFilters.hooks.ts · [[dataview-instance-connector]] [[layer-filter-and-properties-components]]

- UseLayerFilterStateParams · type · L30-L34 — Configuration object specifying base dataview, category dataviews, and optional callback for layer filter state management.
- useLayerFilterState · function · L36-L168 — Hook that manages layer filter state including dataview config tracking, filter changes, and confirmation with vessel-groups high-res downgrade logic.
- UseLayerFilterHandlersParams · type · L170-L174 — Configuration object providing dataview and filter change callbacks for layer filter event handlers.
- useLayerFilterHandlers · function · L176-L345 — Hook that provides handlers for filter selection, removal, cleaning, and operator changes with analytics tracking.
- onSelectHistogramRangeFilterClick · function · L183-L203 — Handler that updates visible value range filters and tracks the selection event.
- onSelectFilterClick · function · L205-L265 — Handler that applies filter selection to dataview config, removes incompatible filters, and triggers vessel-groups modal if needed.
- onSelectFilterOperationClick · function · L267-L293 — Handler that toggles filter exclusion operators on or off based on the selected filter operation.
- onRemoveFilterClick · function · L295-L318 — Handler that removes or updates filter values and their operators based on remaining selections.
- onCleanFilterClick · function · L320-L336 — Handler that completely clears a filter and its associated operator.
