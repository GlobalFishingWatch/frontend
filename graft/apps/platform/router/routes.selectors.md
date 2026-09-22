# apps/platform/router/routes.selectors.ts · [[route-configuration]]

Provides Redux selectors for routing state that extract and derive location type, parameters, and navigation context across the application.

- selectLocation · function · L26-L26 — Extracts the location object from the Redux root state.
- QueryParamProperty · type · L127-L127 — Generic type alias that extracts a specific workspace query parameter type from the QueryParams structure.
- selectQueryParam · function · L128-L132 — Factory function that creates a selector for a specific URL query parameter with deep equality comparison.
