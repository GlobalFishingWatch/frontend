# libs/api-client/src/utils/cookies.ts · [[api-client-browser-utilities]] [[error-handling-cross-environment-resilience]] [[isomorphic-code-patterns-for-ssr]]

Utility module for reading, writing, and removing cookies with type-safe parsing support in browser and server environments.

- readCookieString · function · L3-L6 — Extracts and decodes a cookie value by key from a raw cookie header string using regex matching.
- CookieType · type · L8-L8 — Type union defining the three supported cookie value formats.
- NumberCookieArgs · type · L9-L9 — Type definition specifying arguments for reading a cookie as a number.
- ObjectCookieArgs · type · L10-L10 — Type definition specifying arguments for reading a cookie as a parsed JSON object.
- StringCookieArgs · type · L11-L11 — Type definition specifying arguments for reading a cookie as a string.
- ReadCookieArgs · type · L12-L12 — Type definition for generic cookie read arguments with optional type parameter.
- parseCookieValue · function · L14-L34 — Parses a raw cookie value into the requested type, with safe JSON and number conversion.
- readCookie · function · L39-L45 — Reads and parses a cookie value from a provided string with overloaded return types matching the requested format.
- readDocumentCookie · function · L50-L56 — Reads and parses a cookie from the document.cookie with browser environment safety check.
- writeDocumentCookie · function · L60-L67 — Writes a cookie to the document with a default one-year expiration and strict samesite policy.
- writeDocumentCookieJSON · function · L69-L76 — Writes a JSON-serialized cookie value with proper URL encoding for safe transmission.
- removeDocumentCookie · function · L78-L81 — Removes a cookie from the document by setting its max-age to zero.
