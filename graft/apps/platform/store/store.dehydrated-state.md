# apps/platform/store/store.dehydrated-state.ts · [[state-shape-and-persistence]]

Manages SSR dehydration and rehydration of Redux state by serializing specified store slices for server-side prerendering and recovering them on the client.

- DehydratedReduxState · type · L11-L11 — Type representing a partial Redux state containing only the vessel, dataviews, and datasets slices for SSR hydration.
- DehydratedRouterData · type · L13-L13 — Type defining the structure of router dehydration data that may contain a Redux state payload.
- TanStackBootstrapWindow · type · L15-L18 — Type extending the Window object with TanStack Router's dehydrated data storage, including the Redux state.
- serializeReduxState · function · L20-L26 — Extracts and returns a subset of the Redux store state containing only the SSR-dehydrated slices.
- getDehydratedReduxState · function · L28-L37 — Retrieves the Redux state that was dehydrated by the server and embedded in the TanStack Router bootstrap data on the client.
