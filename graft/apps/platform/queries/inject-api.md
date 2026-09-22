# apps/platform/queries/inject-api.ts · [[query-api-infrastructure]]

Module that provides utilities for dynamically injecting RTK Query APIs into Redux middleware and reducer configuration.

- QueryReducerPath · type · L17-L17 — Type alias that restricts reducer path names to the valid RTK Query API identifiers.
- InjectableApi · type · L21-L25 — Interface defining the contract for RTK Query API objects that can be dynamically injected into the store.
- injectQueryApi · function · L30-L36 — Registers an RTK Query API's reducer and middleware into the Redux store at runtime.
