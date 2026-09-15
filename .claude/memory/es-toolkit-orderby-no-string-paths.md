---
name: es-toolkit-orderby-no-string-paths
description: es-toolkit's orderBy/sortBy ignore lodash-style 'a.b' path strings and silently return the input order
---

# `orderBy(data, ['a.b'], ['asc'])` sorts nothing in es-toolkit

This workspace uses `es-toolkit`, not lodash. Its `orderBy` / `sortBy` accept a **top-level
key** or an **iteratee function** — a lodash-style dot path resolves to `undefined` for every
element, every comparison ties, and the array comes back in its original order. No throw, no
type error (the signature accepts `string`).

```js
const d = [{ properties: { stime: 3 } }, { properties: { stime: 1 } }, { properties: { stime: 2 } }]
orderBy(d, ['properties.stime'], ['asc']) // → 3, 1, 2   (unchanged)
orderBy(d, [['properties', 'stime']], ['asc']) // → 3, 1, 2   (also unchanged)
orderBy(d, [(x) => x.properties.stime], ['asc']) // → 1, 2, 3   correct
```

**Why:** the failure is invisible at the call site and only shows up as wrong _derived_ data
much later. Found on 2026-09-15 in `FourwingsPositionsTileLayer._onViewportLoad`, where
`orderBy(data, ['properties.stime'], ['asc'])` had never sorted anything. Consequences that
went unnoticed for as long as the line existed:

- `_getLatestVesselPositions` took `.slice(-1)` of each vessel group, so the "last position"
  driving the vessel name labels was an arbitrary position, not the newest.
- Once positions-mode started drawing a path per vessel, the same unsorted groups produced
  tracks that zig-zagged between non-consecutive points — which is how it was finally caught,
  by comparing a positions track against the same vessel's real track layer.

**How to apply:**

- Always pass a **function** iteratee to `orderBy`/`sortBy` when the key is nested. A lint rule
  would not catch this; a grep would:
  `grep -rn "orderBy(\|sortBy(" --include="*.ts*" libs apps | grep "'[a-z]*\.[a-z]"`
  (clean as of 2026-09-15).
- Beware of this in any code migrated from lodash — the call compiles and runs either way.
- When something downstream of a sort looks "randomly wrong", verify the sort actually sorted
  before suspecting the consumer.
