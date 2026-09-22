# apps/port-labeler/src/features/labeler/labeler.slice.ts · [[labeler-state-management]] [[port-data-metadata-types]] [[redux-state-management-for-labeler]] [[redux-store]]

Redux slice managing port labeler state including port/subarea/point values, country metadata, data sorting, and selected point tracking for a fishing watch port labeling tool.

- ValuesObject · interface · L8-L10 — Generic key-value map interface for storing arbitrary labeler attribute values.
- CountryMap · interface · L11-L13 — Country-keyed map interface for organizing labeler values by country.
- CountrySelectMap · interface · L14-L16 — Country-keyed map interface for organizing port and subarea options by country.
- ProjectSlice · type · L18-L31 — Root state type defining the complete Redux slice shape for port labeler including data, values maps, selections, and metadata.
- selectDisplayExtraData · function · L236-L236 — Redux selector extracting the extraData flag indicating whether additional data should be displayed.
- selectSelectedPoints · function · L237-L237 — Redux selector extracting the array of currently selected point IDs.
- selectCountry · function · L238-L238 — Redux selector extracting the currently active country context.
- selectHoverPoint · function · L239-L239 — Redux selector extracting the ID of the currently hovered point.
- selectSubareas · function · L240-L240 — Redux selector extracting the country-organized map of available subareas.
- selectPorts · function · L241-L241 — Redux selector extracting the country-organized map of available ports.
- selectMapData · function · L242-L242 — Redux selector extracting the array of port position data points.
- selectPortValues · function · L243-L243 — Redux selector extracting the country-keyed map of assigned port values.
- selectSubareaValues · function · L244-L244 — Redux selector extracting the country-keyed map of assigned subarea values.
- selectPointValues · function · L245-L245 — Redux selector extracting the country-keyed map of assigned point values.
- selectCountries · function · L246-L246 — Redux selector extracting the array of available country options.
- selectCountryColors · function · L247-L247 — Redux selector extracting the country-keyed map of assigned color values.
