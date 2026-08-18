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
7. **Relative imports inside `popups/`** (`./categories/X`, `../Popup.module.css`). No absolute
   `features/_map/map/popups/...` self-references.
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

The directory stays **flat** on purpose: with rule 2 the names already group themselves
(`Events*`, `User*`, `Vessel*` sort together), which is most of what per-category folders would buy.

See [[locales-source-is-the-only-editable]] if a popup needs a new translation key.
