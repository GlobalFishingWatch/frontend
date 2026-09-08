---
name: popup-component-naming
description: Naming and export rules for map popup components under apps/platform/features/_map/map/popups
---

# Popup components: `<Domain>Tooltip<Section|Row>`, one default export per file

Everything under `apps/platform/features/_map/map/popups/` follows these rules (established
2026-08-18, when 21 of ~25 category files had a name that disagreed with their export):

1. **One default export per component file**, declared then exported at the bottom:
   `function PopupWrapper(…) {}` … `export default PopupWrapper`. No named component exports,
   no dual named+default. Applies to `MapPopups`, `PopupWrapper`, `PopupByCategory` too
   (`export default memo(PopupByCategory)`).
2. **File name == exported component name**, and the import site uses that exact name —
   `import PopupWrapper from './PopupWrapper'`. Never `import X as Y`.
3. **Suffix encodes the component's role**, on a domain noun:
   - `Section` — what `PopupByCategory` renders directly for a category/subcategory. Owns the
     icon + title block. Normally takes `features: T[]`.
   - `Row` — one feature/sublayer, inside a Section or where the dispatcher maps the list itself.
   - `Layers` is banned in component names. It described the folder, not the component.
4. **Props type == `<ComponentName>Props`**, file-local, not exported.
5. **`PopupBy<X>` == dispatcher** — a component that only branches to other components.
   `PopupByCategory` (on `feature.category`), `PopupByEventType` (on `layerId`).
6. **Widgets keep plain descriptive names, no Section/Row** — `VesselsTable`,
   `DetectionThumbnail`, `ContextLayerSparkline`, `ContextLayerReportLink`,
   `ContextLayerDownloadPopupButton`, `VesselDetectionTimestamps`.
7. **Relative imports inside `popups/`** (`./activity/X`, `../context/X`, `../Popup.module.css`).
   No absolute `features/_map/map/popups/...` self-references.
8. Multi-export files — `map-popups.utils.ts`, `*.hooks.ts`, `vessels-table.utils.ts` — keep named
   exports and have no default. Rule 1 is about component files.

**What went wrong before:** a default export lets the import site pick any identifier, and it did —
`PopupByCategory` imported `ContextLayers as ContextTooltipSection` while keeping the _file_ name
`VesselEventsLayers` as the identifier for a component actually named `VesselEventsTooltipSection`.
The same component was called two different things depending which line you read. Rule 2 is what
fixes that; the export style is a consistency choice on top of it, not the guard.

Named exports were tried on 2026-08-18 and reverted the same day: they make the compiler enforce
rule 2, but only at the cost of every popup file diverging from the app's default-export house
style. Now that all names match, consistency won. Don't re-propose the switch without new evidence
that the names have drifted again.

**How to apply:** adding a popup renderer means one file, one default export, matching names, and a
`Props` type derived from the component name. If you find yourself writing `import X as Y`, the
name is wrong — fix the file, not the import.

## Folders are per-category, not one flat `categories/` (changed 2026-08-18)

The flat `categories/` folder reached 39 files / ~5000 LOC and was split into eight siblings of
`PopupByCategory.tsx`. It was a pure move — **zero component or file renames**, so rules 1–8 above
are untouched.

| Folder         | n   | Holds                                                                        |
| -------------- | --- | ---------------------------------------------------------------------------- |
| `activity/`    | 7   | `activity` **and** `detections` — every file is shared by both categories    |
| `context/`     | 9   | `Context*`, `Ports*`, the area-timeseries + sparkline + report-link stack    |
| `events/`      | 7   | `PopupByEventType` + its cluster rows                                        |
| `environment/` | 2   | `GriddedValueTooltipSection`, `VectorsTooltipRow`                            |
| `user/`        | 3   | `User*TooltipSection`                                                        |
| `vessels/`     | 3   | `vessels` + `vesselGroups`                                                   |
| `tools/`       | 4   | popups with no dataview category: rulers, report buffer, hotspot, workspaces |
| `shared/`      | 4   | `VesselsTable(+css+utils)`, `VesselDetectionTimestamps`                      |

The convention, in order of precedence:

1. **Folder name == the `DataviewCategory` string value** it serves (`libs/api-types/src/dataviews.ts`).
2. A file lives with its **primary** category — the first `case` in `PopupByCategory.tsx` that renders
   it. Several files serve 2–3 categories (`UserContextTooltipSection` → environment/context/user;
   `ActivityTooltipRow` → activity + user BQ heatmaps; `GriddedValueTooltipSection` → environment +
   user). Cross-folder imports are the expected, explicit outcome — do not duplicate the file.
3. `shared/` only for primitives embedded by 3+ category folders and owned by none.
4. `tools/` for popups with no backing dataview category.
5. A category with 0–1 files gets **no folder** — `detections`, `vesselGroups`, `workspaces` and
   `buffer` are folded into `activity/`, `vessels/` and `tools/` per rule 2.
6. Folders are **flat inside** — no nested `components/` or `hooks/`.
7. **No `index.ts` barrels.** Outside the dispatcher there is exactly one external consumer
   (`features/_map/workspace/context-areas/ContextAreaLayerPanel.tsx` → `popups/context/*`), so a
   barrel would only add indirection.

**Why the split was cheap:** the new folders sit at the same depth as `categories/` did, so all ~41
`../Popup.module.css` / `../map-popups.utils` / `../../map.slice` imports stayed byte-identical. Only
the dispatcher's 19 import lines, 9 sibling imports that became cross-folder, and the one external
consumer changed. Keep that property — a deeper nesting level would touch every file in the tree.

**Trap when moving these files:** `activity/PositionsTooltipRow.tsx` loads `DetectionThumbnail`
through `lazy(() => import('./DetectionThumbnail'))`. `tsc` does not check that string and a
grep for `from './…'` does not see it.

Prior reasoning, now superseded: the folder was kept flat because rule 2's names already group
themselves alphabetically (`Events*`, `User*`, `Vessel*`). That held at ~25 files; at 39 it did not.

See [[locales-source-is-the-only-editable]] if a popup needs a new translation key.
