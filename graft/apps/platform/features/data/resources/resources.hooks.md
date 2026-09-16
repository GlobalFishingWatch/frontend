# apps/platform/features/data/resources/resources.hooks.ts · [[workspace-map-data]]

Provides React hooks for fetching and managing resource data from Redux store.

- useFetchResources · function · L10-L25 — Dispatches fetch actions for each resource in the provided list whenever the resources dependency changes.
- useFetchDataviewResources · function · L28-L31 — Fetches resources associated with dataviews from Redux, conditionally delegating to useFetchResources based on readiness flag.
