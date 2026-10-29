---
name: deck-raise-error-wraps-cause
description: A sublayer's onError receives a new Error wrapping the fetch rejection; HTTP status is on error.cause
---

# A sublayer's `onError` gets a wrapper, the HTTP status is on `error.cause`

When a sublayer's `fetch` rejects, deck does not pass the rejection to `onError` as-is.
`Layer.raiseError` wraps it:

```js
// node_modules/@deck.gl/core/dist/lib/layer.js (9.4)
raiseError(error, message) {
  if (message) {
    error = new Error(`${message}: ${error.message}`, { cause: error })
  }
  ...
}
```

`fetchWithGFWAPI` uses `responseType: 'default'`, so `GFWAPI` rejects with the raw `Response`.
That `Response` ends up on `error.cause`; `error.status` is `undefined`.

**Why:** found 2026-10-26. The vessel panel checked `errors.track.status === 429` to show the
rate-limit message and always fell back to the generic "error loading the vessel details"
tooltip. Nothing fails loudly; the check is simply never true.

**How to apply:** read a sublayer error's status as `error.status ?? error.cause?.status`, as
`VesselLayer.getVesselLayersRateLimited` does. `VesselLayerState.errors` is typed `string`, but it
really holds these `Error` objects.

A sublayer that errored is not refetched while its `id` and `data` stay the same.
`VesselLayer.reloadErroredSublayers` adds a per-type reload counter to the chunk ids to force a
refetch of only the errored sublayers.
