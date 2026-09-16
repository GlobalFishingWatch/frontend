# libs/api-types/src/user-applications.ts · [[access-control-ownership-models]] [[api-types-type-definitions]]

Defines user application types and constants for API access management, including intended use categories and application metadata structures.

- Narrowable · type · L1-L1 — Union type that restricts values to primitive types suitable for tuple inference in TypeScript.
- tuple · function · L2-L2 — Generic helper function that captures and returns a narrowed tuple of literal values for type-safe constant arrays.
- UserApplicationIntendedUse · type · L5-L5 — Enumerated type representing the intended use category of a user application, derived from the application use constants.
- UserApiAdditionalInformation · type · L7-L13 — Schema for optional metadata about a user's API application including intended use, target users, and compliance details.
- UserApplication · type · L14-L21 — Core schema defining the structure of a registered user application with identifier, descriptive fields, and authentication token.
