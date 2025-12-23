# Deck Layers Reports Architecture

## Visual Data Flow

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER INTERACTION                                │
│                  (Changes time range, area, category)                   │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        DATAVIEWS LAYER                                  │
│  • selectActiveReportDataviews                                          │
│  • Dataview instances configured                                        │
│  • useReportInstances() gets layer IDs                                  │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    DECK LAYER COMPOSER                                  │
│  • useGetDeckLayers(ids) → DeckLayerAtom[]                              │
│  • Returns: { id, instance, loaded }                                    │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
        ┌──────────────────────┐    ┌──────────────────────┐
        │  MAP RENDERING       │    │  REPORT PROCESSING   │
        │  (DeckGLWrapper)     │    │  (reports hooks)     │
        └──────────┬───────────┘    └─────────┬────────────┘
                   │                          │
                   │                          │
                   │                          │
    ┌──────────────▼──────────────────────────▼──────────────┐
    │                                                        │
    │            GLOBAL LAYER STATE ATOM                     │
    │         (deckLayersStateAtom)                          │
    │                                                        │
    │  Updated by:     ┌──────────────────────────┐          │
    │  onAfterRender   │  {                       │          │
    │  callback        │    "layer-1": {          │          │
    │                  │      loaded: true,       │          │
    │  Read by:        │      cacheHash: "abc123" │          │
    │  Derived atoms   │    },                    │          │
    │                  │    "layer-2": { ... }    │          │
    │                  │  }                       │          │
    │                  └──────────────────────────┘          │
    │                                                        │
    └──────────────────────────┬─────────────────────────────┘
                               │
                               │ Triggers derived atoms
                               │
                               ▼
    ┌──────────────────────────────────────────────────────────┐
    │         DERIVED ATOM (per layer set)                     │
    │      getLayersStateHashAtom(layerIds)                    │
    │                                                          │
    │  atom((get) => {                                         │
    │    const state = get(deckLayersStateAtom)                │
    │    return layerIds                                       │
    │      .map(id => `${id}:${state[id].cacheHash}`)          │
    │      .join('|')                                          │
    │  })                                                      │
    │                                                          │
    │  Returns: "layer-1:abc123|layer-2:def456"                │
    └──────────────────────────┬───────────────────────────────┘
                               │
                               │ useAtomValue subscribes
                               │
                               ▼
    ┌──────────────────────────────────────────────────────────┐
    │         REPORT TIMESERIES HOOK                           │
    │      (useReportTimeseries)                               │
    │                                                          │
    │  1. layersStateHash changes                              │
    │  2. processingHash recomputes                            │
    │  3. useEffect triggers                                   │
    │  4. Process features                                     │
    │  5. Calculate timeseries                                 │
    │  6. Calculate stats                                      │
    │  7. Single atomic state update                           │
    └──────────────────────────┬───────────────────────────────┘
                               │
                               ▼
    ┌──────────────────────────────────────────────────────────┐
    │              REPORT STATE ATOM                           │
    │           (reportStateAtom)                              │
    │                                                          │
    │  {                                                       │
    │    isLoading: false,                                     │
    │    timeseries: [...],                                    │
    │    featuresFiltered: [...],                              │
    │    stats: { ... }                                        │
    │  }                                                       │
    └──────────────────────────┬───────────────────────────────┘
                               │
                               ▼
    ┌──────────────────────────────────────────────────────────┐
    │                  UI COMPONENTS                           │
    │  • ReportActivityGraph                                   │
    │  • ReportEnvironment                                     │
    │  • useReportFilteredTimeSeries()                         │
    │  • useTimeseriesStats()                                  │
    └──────────────────────────────────────────────────────────┘
```

## Component Interaction Detail

### 1. DeckGLWrapper (Map Rendering)

`apps/fishing-map/features/map/DeckGLWrapper.tsx`

**What happens:**

- Called after EVERY DeckGL render
- Updates `deckLayersStateAtom` with current layer state **only if changed** (optimized with shallow comparison)
- Checks both `loaded` status and `cacheHash` for each layer
- Triggers all derived atoms automatically when state actually changes

### 2. Derived Atom Factory (Reactive Hash)

`libs/deck-layer-composer/src/hooks/deck-layers-state.hooks.ts`

**What happens:**

- Creates a **derived atom** for specific layer IDs
- Automatically recomputes when `deckLayersStateAtom` changes
- Only includes layers you care about
- Memoized by layer IDs (stable atom instance)

### 3. Report Timeseries Hook (Consumer)

`apps/fishing-map/features/reports/reports-timeseries.hooks.ts`

**What happens:**

```text
User Action / DeckGL Render
  ↓
deckLayersStateAtom updates (single source, optimized)
  ↓
Derived atom recomputes (automatic, memoized)
  ↓
useAtomValue returns new value
  ↓
processingHash changes
  ↓
Three focused effects run (in order):
  1. Process features (async, web worker)
  2. Calculate stats (when features ready)
  3. Reset state (on major param changes)
  ↓
Single atomic state update per effect
  ↓
UI updates (once per meaningful change)
```
