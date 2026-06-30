# Timebar architecture

Why this doc exists: timebar state lives in **four** different mechanisms. Each split is
deliberate (render isolation / sync-during-interaction / cross-tree layer registry), but
the spread is the main thing that makes the lib hard to read cold. This is the map.

## The four state mechanisms

| Mechanism | What it holds | Why not something simpler |
|-----------|---------------|---------------------------|
| `rangeRef` (a `useRef`) | the **live** `{ start, end }` during playback/drag | The single source of truth while an interaction drives the range. Written synchronously by `notifyChange`, so the next rAF frame / mousemove reads the value just emitted — no React render in the loop. See `timebar-range.ts`. |
| `useState` range mirror | `{ start, end }` for rendering | The ref can't trigger re-renders. The mirror is what the context exposes to subscribers (charts, units). Kept in lockstep with `rangeRef` by `notifyChange`. |
| Jotai atoms (`charts-store.atom.ts`) | per-chart `data` + deck.gl `layers`, plus `hoveredEventState` | Charts register their layers from anywhere in the tree; the deck wrapper renders the merged, z-ordered list. A cross-tree registry, not prop-drilling. Identity/hash equality selectors avoid layer rebuilds. |
| React context (`TimebarContext`, `TimelineContext`) | shared props + the d3 scales | Read-mostly fan-out to the compound children. `TimebarContext` = range + callbacks + labels; `TimelineContext` = d3 scales + layout dims. |

## The interaction guard (the subtle part)

`timebar-range.ts` keeps an `interactingRef`. While a drag or playback loop is running it
is `true`, and the effect that adopts external prop changes (bookmark, URL, presets) is
suppressed — otherwise a lagged parent echo of our own emit would snap the live range
backward mid-gesture. `beginInteraction()` / `endInteraction()` toggle it. Every code path
that starts a gesture must pair them, including abort paths (`touchcancel`, unmount) — see
`timeline/use-pointer-interaction.ts`.

**Single-writer rule:** `rangeRef` has exactly one writer, `notifyChange`. Don't write it
elsewhere. `innerScaleRef` (in `timeline.tsx`) is shared by the idle commit effect, the
drag handler, and the zoom-out loop — it stays owned by `timeline.tsx` and is passed to the
hooks by reference so they stay coordinated.

## Layout (timeline subsystem)

`timeline/timeline.tsx` owns the timeline state + d3 scale computations + JSX, and delegates
the imperative concerns to focused hooks:

- `use-pointer-interaction.ts` — the drag state machine (pan / zoom-in / zoom-out / release / cancel)
- `use-zoom-out-loop.ts` — the requestAnimationFrame zoom-out acceleration
- `use-timeline-layout.ts` — ResizeObserver + measurement
- `use-timeline-hover.ts` — throttled tooltip `onMouseMove` emit
- `timeline-drag.utils.ts` — the pure decision/stick math (unit-tested)

## Data flow (one range change)

```
interaction (mouse / playback / interval / bookmark)
  → notifyChange(start, end, source)        # clamps to min/max
    → rangeRef updated   (synchronous — the live truth)
    → setRange(...)      (async — triggers render)
    → onChange(...) prop (parent: Redux / URL)
        → parent may echo new start/end props
          → adopted only when interactingRef is false
```
