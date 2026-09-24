---
name: deck-viewstate-url-seed
description: DeckGL must not render before the URL viewport is in viewStateAtom, or deck echoes DEFAULT_VIEWPORT back and overwrites it
---

# Deck echoes its first viewState back, so it must be created with the URL one

`viewStateAtom` starts at `DEFAULT_VIEWPORT` (26/19/1.49) so SSR and client agree, and
`useMapViewStateUrlSync` writes the URL `latitude`/`longitude`/`zoom` into it in a layout effect.
That is one render too late if `DeckGLWrapper` already rendered `<DeckGL viewState={...}>`: deck is
constructed with the default, then fires `onViewStateChange` with its own (stale) viewState ~50ms
later, and the handler writes that back into the atom — silently discarding the deep-linked
viewport. `useMapViewStateUrlSync` therefore returns a `synced` flag and `DeckGLWrapper` renders
`null` until it is true.

**Why:** the clobber was invisible on ordinary map URLs because `fitWorkspaceBounds` re-applies
`urlViewport` after the workspace fetch. It is skipped on report routes
(`!isAreaReportLocation`), so only reports kept the wrong camera — and for a **global** report
(`region-world`, no `areaId` in the path) that is fatal: `useReportAreaInViewport` compares the
camera against `useReportAreaCenter`, `reports-timeseries.hooks` refuses to compute while they
disagree, and the only re-fit runs on the `deckMapJustLoaded` edge, which has already passed. The
report sits on `ReportActivityPlaceholder loading` forever. Found 2026-09-22 on a
`periodComparison` global report that worked on first load and hung on every refresh.

**How to apply:**

- Anything that has to be in the atom before the first paint belongs in that same layout effect,
  ahead of the `synced` flip — not in an effect that runs after deck mounts.
- Don't "fix" a stuck report by loosening `isAreaCenterInViewport` tolerances (1e-6 lon/lat,
  1e-3 zoom, floor-compare for the world). They are tight on purpose; a camera that drifts from
  the fit is the symptom, not the cause.
- Reproduce with `platform-e2e`: load a report URL, `page.reload()`, wait — see
  [[browser-testing-uses-platform-e2e]]. A stuck report shows the placeholder while the map sits
  at 26/19/1.49.
