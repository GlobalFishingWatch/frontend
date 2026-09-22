# apps/platform/hooks/cookies.hooks.ts · [[content-resizing-pattern]]

Provides a React hook to persist panel width settings to browser cookies without concurrent writes overwriting each other.

- usePersistedPanelWidth · function · L7-L17 — Returns a callback that persists a specific panel width field to cookies using read-modify-write pattern to prevent concurrent write conflicts.
