# apps/platform/router/routes.search.ts · [[route-configuration]] [[url-search-parameter-validation]]

Defines URL search parameter schemas and validators for routing across vessel profiles, reports, and vessel search queries, with fallback handling to prevent parse errors from crashing the application.

- optionalNumber · function · L46-L46 — Coerces a URL search parameter to an optional number, falling back to undefined on invalid input.
- optionalBoolean · function · L47-L47 — Parses a URL search parameter as an optional boolean (accepting both native booleans and string-encoded forms), falling back to undefined on invalid input.
- optionalString · function · L50-L50 — Accepts an optional string URL search parameter, falling back to undefined on invalid input.
- optionalStringArray · function · L51-L51 — Parses a URL search parameter as an optional array of strings, falling back to undefined on invalid input.
- optionalStringOrArray · function · L52-L53 — Accepts a URL search parameter that can be either a single string or an array of strings, falling back to undefined on invalid input.
- optionalEnum · function · L54-L55 — Validates a URL search parameter against a supplied enum object, accepting only enumerated values and falling back to undefined on invalid input.
- optionalLiteralUnion · function · L56-L57 — Validates a URL search parameter against a union of literal string values, falling back to undefined on invalid input.
- validateRootSearchParams · function · L260-L262 — Parses and validates the shared root search parameters (viewport, time, workspace state, app state, auth) using the root schema.
- validateVesselProfileParams · function · L264-L266 — Parses and validates vessel profile–specific search parameters (section, area, identity source, activity mode) using the vessel profile schema.
- validateReportSearchParams · function · L268-L270 — Parses and validates report-specific search parameters (category, subcategory, vessel filtering, activity/events/ports graphs, area/buffer settings) using the report schema.
- validateSearchQueryParams · function · L272-L274 — Parses and validates vessel search query parameters (name, identifiers, flags, gear types, owner, fleet) using the vessel search query schema.
- validateSearchParams · function · L283-L285 — Parses and validates the complete merged search parameter schema across all routes for backward compatibility.
