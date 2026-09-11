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

`filterByPolygon` now detects an unwrapped bbox (`maxX > 180 || minX < -180`) and rebuilds the
geometry with the longitude range widened to `[-180, 180]`, so turf's internal short-circuits
agree with the coordinates. Deliberately **not** `bbox(polygon, { recompute: true })`: a
superset bbox can only cost a rejection that would have been quick, never cause a wrong one,
and widening is O(1) where walking the coordinates of a dissolved or buffered area is not.

**Never pass a geometry carrying a `bbox` from `wrapGeometryBbox` to a turf predicate.** Keep
unwrapped bounds in a separate variable — that is what `areas.slice.ts` and the report-area
selectors do when they assign to `bounds`.

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

`UserBaseLayer.getRenderedFeatures` has the same shape and has **not** been given the same
treatment — check it before trusting a user-layer report near the antimeridian.

**How to apply:** any count or coverage that looks a few percent low on an area crossing
±180 is one of these two. Verify against the source data with GDAL rather than against
another part of the app — `ogrinfo -dialect SQLITE -sql "… ST_Intersects(…)"` over the
source shapefile is what pinned both of these down.

See [[platform-testing]] for why this was verified through `platform-e2e` and not vitest.
