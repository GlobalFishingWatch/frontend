# libs/api-client/src/utils/url.ts · [[url-parameter-manipulation]]

URL utility module providing functions to validate absolute URLs, extract/remove query parameters, and manage access token handling in the browser.

- isUrlAbsolute · function · L1-L6 — Validates whether a given URL is absolute by checking for http:// or https:// protocol prefix.
- getURLParameterByName · function · L8-L15 — Extracts the value of a query parameter from a URL by name and returns it decoded, or null if not found.
- removeUrlParameterByName · function · L17-L29 — Removes a query parameter from the current browser URL and updates the history state.
- getAccessTokenFromUrl · function · L33-L35 — Retrieves the access token query parameter value from the current URL.
- removeAccessTokenFromUrl · function · L37-L39 — Removes the access token query parameter from the current browser URL.
