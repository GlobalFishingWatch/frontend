# libs/skills/src/encode-url/routes.ts · [[encode-url-routes-routing-utilities]] [[route-pattern-matching-with-legacy-fallback]]

Module that provides route encoding/decoding utilities to convert between MapRoute objects and URL paths, supporting TanStack Router integration with optional and required path parameters.

- MapRouteType · type · L12-L20 — Enumeration of route types supported by the routing system.
- MapRouteParams · type · L22-L31 — Optional parameter fields that may be present in a route descriptor.
- MapRoute · type · L33-L33 — Route object combining a required type discriminant with optional navigation parameters.
- RouteNavigation · type · L35-L38 — Structured representation of a route with its TanStack Router pattern and parameter map.
- required · function · L40-L46 — Validates and retrieves a required route parameter, throwing an error if missing.
- getRouteNavigation · function · L52-L111 — Converts a MapRoute object into TanStack Router navigation parameters by route type and parameter availability.
- parseParamSegment · function · L116-L121 — Extracts parameter name and optionality from a URL segment token (required or optional).
- buildRoutePath · function · L124-L133 — Interpolates a RouteNavigation into a URL path using TanStack Router's parameter encoding.
- matchPattern · function · L162-L183 — Tests whether a pathname segment list matches a route pattern and extracts matching parameters.
- matchRoutePath · function · L188-L207 — Parses a URL pathname into a MapRoute by matching against route patterns and handling legacy paths.
