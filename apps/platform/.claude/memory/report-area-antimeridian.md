---
name: report-area-antimeridian
description: Two antimeridian traps that silently drop features from area reports — a stale geometry.bbox that turf trusts, and tile features arriving in repeated world copies
---

# Area reports lose antimeridian features in two separate ways

Found 2026-09-10 debugging an MPA report over FAO 71 (Pacific, Western Central), which spans
99°E to 175°W. It reported 949 of 1011 areas. Both causes are silent — no error, no warning,
just a smaller number.

**Why:** neither is visible from the report code. One lives in the geometry's metadata, the
other in how deck hands back tiles.

## 1. A stale `bbox` member on the report geometry poisons every turf predicate

`wrapGeometryBbox` (`libs/data-transforms/src/wrap-longitudes/`) deliberately returns an
**unwrapped** bbox for an antimeridian-crossing area — FAO 71's is `[99, -28.15, 185, 20]`,
where `185` is `-175 + 360`. That is correct and necessary for fitBounds, which needs a
continuous span.

The trap is that the same unwrapped bbox rides along on the geometry as its `bbox` member,
and **turf trusts `bbox` for fast rejection**:

```js
// @turf/boolean-point-in-polygon
const bbox = geoJSONPolygon.bbox
if (bbox && inBBox(pt, bbox) === false) return false
```

So `booleanPointInPolygon([-175.2, -21.1], faoArea)` returns **false** for a point that is
plainly inside the area's second part, because `-175.2` is not within `[99 … 185]`.
`booleanContains` inherits it. The bbox prefilter inside `filterByPolygon` had the same bug
from the same value (`fx2 >= px1` → `-175.2 >= 99` → false).

### The fix keeps the bbox — it is a real optimization — and makes it honest

Dropping `geometry.bbox` would cost turf an O(n) coordinate walk **per predicate call**, i.e.
per cell of the report. So the member stays; what changes is which of the two bboxes goes in it.
An area now carries both, and they are not interchangeable:

| value                             | span                       | for                                |
| --------------------------------- | -------------------------- | ---------------------------------- |
| `Area.bounds`, `wrapGeometryBbox` | unwrapped, maxX can be 185 | fitBounds, needs a continuous span |
| `geometry.bbox`, `getTurfBbox`    | matches the coordinates    | turf's prefilter                   |

`getTurfBbox` (`libs/data-transforms/src/wrap-longitudes/`) is `bbox(geometry, { recompute: true })`.
The `recompute` is load-bearing: `@turf/bbox` returns an existing `bbox` member untouched, so
without it the function would hand back the very unwrapped value it exists to replace. Set once —
`areas.slice.ts` at fetch, `selectReportBufferArea` for the buffered geometry — so the walk happens
per area, not per cell. `area-reports.hooks.tsx` reads `reportArea?.bounds` alone for fitBounds.

**Never store a `wrapGeometryBbox` result as a geometry's `bbox` member.** Covered by
`get-turf-bbox.test.ts`.

`filterByPolygon` keeps a guard for callers that attach nothing or attach the wrong one (a picked
feature, say): it recomputes only when the member is missing, and when the member is unwrapped it
**widens to a superset** (`min(bx1,-180) … max(bx2,180)`) rather than clamping to `[-180, 180]`. A
superset can only cost a rejection that would have been quick; clamping could reject a coordinate
that really is out there — which the 0–360 buffered geometry in section 3 really does have.

## 2. Tile features arrive in more than one copy of the world

A viewport wide enough to show the antimeridian makes deck select tiles from the repeated
worlds either side of it, so `getSelectedTilesFeatures` returns the same feature at
`-180.8` **and** at `179.2`. Longitudes reached ±181.8 in practice.

Consequences, both silent:

- a feature only present in the wrapped copy matches neither half of a report area split at
  ±180, and is dropped;
- `mergePickedFeatures` unions the two copies by id into one geometry spanning 360°.

`unwrapFeatureLongitudes` (same `wrap-longitudes` module, the inverse of
`wrapFeatureLongitudes`) shifts each ring back by whole worlds and is applied in
`getSelectedTilesFeatures` for both the PMTiles and MVT paths. Per ring, so a ring that
genuinely straddles the antimeridian is not torn in half.

`UserBaseLayer.getRenderedFeatures` goes through the same `getSelectedTilesFeatures`, so it is
covered too. A sweep on 2026-09-10 closed the three call sites that were not:

- `ContextLayer.getPickingInfo` and `UserBaseLayer.getPickingInfo` — the picked geometry is the
  polygon the map tooltip's sparkline filters cells against
  (`popups/context/area-tooltip-timeseries.hooks.ts` falls back to `feature.geometry` when the
  dataset has no area detail), so a wrapped copy made the sparkline empty;
- `UserPointsTileLayer` point features, unwrapped **in `getFeaturesFilteredByArea`**, not in the
  layer's `getData`. Folding it into `getData`'s existing `flatMap` looks free and is the obvious
  place, but `getViewportData` shares that method and feeds the timebar points graph
  (`timebar-points.hooks.ts`), which filters against `viewport.getBounds()`. deck's `unproject`
  never wraps, so those bounds are continuous — a viewport at the seam returns `[157 … 200.6]` —
  and unwrapped points would fall outside them. The two consumers genuinely want different
  spaces; don't "optimize" the extra pass away by moving it down.

  What makes the extra pass cheap instead: `unwrapFeatureLongitudes` returns **its own argument**,
  by reference, whenever no ring crossed a world boundary — so the overwhelmingly common in-range
  feature costs one division and no allocation. Asserted with `toBe` in
  `unwrap-feature-longitudes.test.ts`; keep that property if you touch the helper.

Still deliberately untouched, both viewport-space consumers rather than report ones:
`FourwingsPositionsTileLayer._onViewportLoad` and `FourwingsClustersLayer._onViewportLoad`.

Fourwings cells are **not** affected: their coordinates come from `tile.bbox`, and deck's
`getOSMTileIndices` normalises tile x back into `[0, 2^z)` (world copies only shift the culling
volume), so cell longitudes are always in range. Only `transformTileCoordsToWGS84`, which
unprojects through the viewport, produces the repeated-world copies.

## 3. Still open: a buffered antimeridian area is expressed in 0–360

`selectReportAreaDissolved` → `getGeometryDissolved` calls `wrapFeatureLongitudes` for any area
touching ±179.5, which maps negative longitudes to `lon + 360`. With a report buffer active,
`selectReportArea` returns that buffered geometry, whose coordinates genuinely sit at 180–185 —
this is not a lying `bbox`, so the `filterByPolygon` widening cannot help, and every cell east
of the antimeridian (negative longitude) is dropped from the buffered report.

Unwrapping is not the fix: a ring that straddles 180 in wrapped space has to be **cut** at the
antimeridian into two rings, not shifted by a whole world. Unmeasured as of 2026-09-10.

**How to apply:** any count or coverage that looks a few percent low on an area crossing
±180 is one of these two. Verify against the source data with GDAL rather than against
another part of the app — `ogrinfo -dialect SQLITE -sql "… ST_Intersects(…)"` over the
source shapefile is what pinned both of these down.

See [[platform-testing]] for why this was verified through `platform-e2e` and not vitest.
