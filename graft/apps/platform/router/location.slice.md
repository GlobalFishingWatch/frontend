# apps/platform/router/location.slice.ts · [[location-state]]

Redux slice defining location state that bridges legacy route tracking and TanStack Router navigation.

- LocationPayload · type · L10-L10 — Type alias extending route link payload with optional string-valued properties for flexible location parameters.
- LocationState · interface · L24-L37 — Interface representing the Redux store's location state with both legacy route attributes and new TanStack Router path pattern support.
