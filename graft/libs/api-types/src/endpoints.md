# libs/api-types/src/endpoints.ts · [[api-types-type-definitions]]

Type definitions for API endpoint metadata including parameter types, endpoint configurations, and endpoint identifiers used throughout the system.

- EndpointParamType · type · L1-L1 — Union type that restricts endpoint parameter types to specific serializable kinds.
- EndpointParam · type · L3-L11 — Configuration schema for a single endpoint parameter, including its type, validation, and documentation.
- EndpointId · enum · L13-L40 — Enumeration of all available API endpoint identifiers across the application.
- Endpoint · type · L42-L51 — Complete specification of an API endpoint including its route, parameters, query options, and HTTP metadata.
