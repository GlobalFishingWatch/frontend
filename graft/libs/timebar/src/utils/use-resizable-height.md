# libs/timebar/src/utils/use-resizable-height.ts · [[localstorage-persistence-pattern]] [[timebar-utilities-helpers]]

Provides a React hook for managing drag-to-resize timebar height with localStorage persistence.

- getStoredHeight · function · L13-L21 — Retrieves the previously stored timebar height from localStorage, with fallback to a default height if storage is unavailable.
- setStoredHeight · function · L23-L29 — Persists the current timebar height to localStorage, gracefully handling storage unavailability.
- useResizableHeight · function · L35-L87 — Manages drag-to-resize interaction for timebar height, constraining movement within min/max bounds and persisting changes to storage.
