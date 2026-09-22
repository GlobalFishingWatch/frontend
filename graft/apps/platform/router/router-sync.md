# apps/platform/router/router-sync.ts · [[route-synchronization]]

Synchronizes TanStack Router navigation events to Redux state and tracks workspace history.

- NavigationState · interface · L15-L17 — Metadata flag to mark when navigation was triggered by browser history.
- toRoutePathValue · function · L27-L29 — Normalizes a router match's fullPath into a Redux-safe RoutePathValues type for re-navigation.
- syncInitialLocation · function · L41-L59 — Captures the server-rendered or initial URL and synchronizes it to Redux state during store creation.
- setupRouterSync · function · L74-L207 — Establishes bidirectional sync from TanStack Router events to Redux location state and maintains workspace navigation history.
