# libs/api-client/src/utils/errors.ts · [[api-error-classification-parsing]] [[error-handling-cross-environment-resilience]]

Utility module providing error classification, parsing, and session validation helpers for API responses.

- V2MetadataError · type · L3-L3 — Type alias for arbitrary metadata attached to API error responses.
- V2MessageError · interface · L4-L8 — Interface representing a structured error message with detail, title, and optional metadata fields.
- ResponseError · interface · L9-L13 — Interface representing an API response error with status code, message, and optional structured messages array.
- getIsUnauthorizedError · function · L15-L16 — Checks if an error is an authorization failure by testing for HTTP status codes between 400 and 403.
- getIsConcurrentError · function · L18-L19 — Detects concurrent request/conflict errors by comparing the error status to a predefined concurrent error status constant.
- getIsTimeoutError · function · L27-L30 — Identifies timeout errors by matching error messages against known browser-specific timeout error strings.
- parseAPIErrorStatus · function · L32-L34 — Extracts the HTTP status code from an API error, falling back to a code property if status is unavailable.
- parseAPIErrorMessage · function · L36-L41 — Extracts the error message from an API error, preferring the detail field of the first structured message if available.
- parseAPIErrorMetadata · function · L43-L48 — Extracts optional metadata from an API error, returning the metadata of the first structured message or an empty object.
- ParsedAPIError · type · L50-L55 — Type alias for a normalized error object with status, message, optional metadata, and refresh status flag.
- parseAPIError · function · L56-L66 — Converts a raw API error into a normalized ParsedAPIError object by extracting status, message, metadata, and refresh flag.
- isUnauthorized · function · L68-L70 — Checks if a parsed error represents an HTTP 401 Unauthorized authentication failure.
- isForbidden · function · L72-L74 — Checks if a parsed error represents an HTTP 403 Forbidden access denial.
- isAuthError · function · L76-L78 — Checks if an error is any authentication or authorization failure by testing for both 401 and 403 statuses.
- isSessionError · function · L88-L93 — Determines if an error indicates a session or authentication rejection, including token-related failures and deserialized server errors.
- isTransientError · function · L95-L99 — Classifies an error as transient (retryable) if it is not a session error and is either a timeout, missing status, or server error.
