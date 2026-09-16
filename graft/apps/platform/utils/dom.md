# apps/platform/utils/dom.ts · [[dom-and-storage-safety-utilities]]

Utility module providing safe DOM and browser APIs with fallbacks for server-side rendering and blocked storage environments.

- getIsBrowser · function · L1-L1 — Detects whether the code is executing in a browser environment by checking for the window object.
- getLocalStorage · function · L3-L13 — Returns the localStorage object with fallback handling for non-browser environments and browsers with blocked storage access.
- getLocalStorageItem · function · L15-L21 — Safely retrieves a value from localStorage, returning null if the item doesn't exist or storage access fails.
- setLocalStorageItem · function · L23-L29 — Safely sets a key-value pair in localStorage, silently failing if storage access is unavailable.
- removeLocalStorageItem · function · L31-L37 — Safely removes a key from localStorage, silently failing if storage access is unavailable.
- getSafeElementById · function · L39-L41 — Safely retrieves a DOM element by ID in browser environments, returning null in non-browser contexts.
- getCSSVarValue · function · L43-L48 — Retrieves the computed value of a CSS custom property from the document body in browser environments.
