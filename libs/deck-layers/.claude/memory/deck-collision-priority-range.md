---
name: deck-collision-priority-range
description: getCollisionPriority is packed into NDC z, so the total must stay inside -1000..1000 or the label is clipped away entirely
---

# Collision priority has a hard ±1000 budget

`CollisionFilterExtension`'s `getCollisionPriority` is not an abstract ranking. The
extension writes it straight into clip-space z:

```glsl
// node_modules/@deck.gl/extensions/dist/collision-filter/shader-module.js:61
position.z = -0.001 * collisionPriority * position.w; // Support range -1000 -> 1000
```

**Why:** past ±1000 the vertex falls outside the NDC depth range and is clipped, so an
over-budget label does not merely lose a collision — it disappears. There is no warning
and nothing in the type signature hints at the limit.

**How to apply:** treat ±1000 as a budget to be _divided_ between every term that feeds
the priority, and re-check the arithmetic whenever a term is added. Adding a term on top
of scales that already span the full range silently breaks labels.

Worked example, `BathymetryContourLayer` (2026-09):

| term           | range | why                                                  |
| -------------- | ----- | ---------------------------------------------------- |
| index tier     | ±500  | dominant: 500 > 350 + 100, so tiers never interleave |
| contour length | ±350  | orders labels within a tier                          |
| label bearing  | ±100  | prefers near-horizontal labels                       |
| **worst case** | ±950  | leaves −1000 usable as a "no data" sentinel          |

Its length scale was originally `±900`, which with the `±100` bearing term sat exactly on
the ceiling. Adding the index tier meant shrinking length to `±350` first — not adding
`500` to what was already there.

See [[label-layer-sdf-outline-opacity]] for the other non-obvious constraint on these
labels.
