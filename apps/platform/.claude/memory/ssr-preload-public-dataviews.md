---
name: ssr-preload-public-dataviews
description: How a route preloads public dataviews/datasets into redux on the server — anonymous nitro-cached fetch, upsert into the router store, shipped via dehydrated slices
---

# Preloading public dataviews and datasets on the server

Added 2026-10-13 for the places pages (`/ports`, `/areas/$placeType`). It is the template for doing
the same on `/map`.

1. A `.server.ts` helper fetches with `GFWAPI.fetch(url, { token: '' })` and wraps it in nitro
   `defineCachedFunction` (`features/_places/places-map.server.ts`).
2. A `createServerFn` validates the cache-key parts against a static config and calls it.
3. The route loader passes `context` and upserts the response into the router's redux store
   (`upsertDataviews`, `upsertDatasets`). On the server it awaits; on the client it does not.
4. `dataviews` and `datasets` are already in `SSR_DEHYDRATED_SLICES`
   (`store/store.dehydrated-state.ts`), so the client store starts with them. No extra wiring.

**Why:**

- `token: ''` makes the fetch stateless and anonymous. The gateway grants anonymous access by
  referer (`SSR_HEADERS`). A cached response is shared by every user, so it must never be fetched
  with a user's token, which `GFWAPI` would otherwise read from the request cookie.
- The dehydration snapshot is taken once loaders settle. Data that has not reached the store by
  then is not shipped, which is why the server path awaits.
- Validating the key parts keeps the nitro key space bounded. Use `Object.hasOwn`, because
  `config['__proto__']` is truthy.

**How to apply:**

- This only fits **public** data. Anything permission-scoped (VMS and other private datasets,
  private workspaces) cannot share an anonymous cache entry. Fetch it per request with the user's
  token, or leave it to the client.
- Cold cache costs one API round trip on the server: about 0.6s of TTFB measured on dev on
  2026-10-13. Warm, the whole page took 40–55ms. `swr: true` keeps cold hits rare.
- The client fetch thunks skip ids already in the store. A dataset preloaded anonymously is never
  refetched with the user's token. Check that the anonymous and logged-in payloads match before
  you preload a dataset that a logged-in user sees differently.

See [[platform-testing]] for verification. `apps/platform-e2e/src/tests/Places.e2e.spec.ts` asserts
that the browser makes no `/dataviews` or `/datasets` request.
