---
name: label-layer-sdf-outline-opacity
description: LabelLayer's SDF outline ignores getColor alpha, so lowering a label's opacity fades the glyph but leaves a solid halo — opacity is not a usable hierarchy channel there
---

# Fading a LabelLayer label leaves its halo solid

`LabelLayer` draws SDF text with `outlineColor: hexToDeckColor(BLEND_BACKGROUND, 1)` and
`outlineWidth: 6`. `outlineColor` is a **layer-level uniform**, not an accessor, and the
fragment shader mixes it with the per-instance colour including the alpha channel:

```glsl
// node_modules/@deck.gl/layers/dist/text-layer/multi-icon-layer/multi-icon-layer-fragment.glsl.js
color = mix(sdf.outlineColor, vColor, inFill);  // mixes RGB *and* alpha
alpha = inBorder;
float a = alpha * color.a;
```

In the halo region `inFill = 0`, so the alpha resolves to the outline's `1.0` regardless of
what `getColor` returned. Only the glyph interior (`inFill = 1`) picks up the accessor's
alpha.

**Why:** the practical consequence is the opposite of what you intend. Dropping a label to
~0.35 alpha does not make it recede — it fades the letter while leaving an opaque dark
outline, so you get a smudge with a ghost digit inside it and the contrast _inverts_. This
was mistaken for "the labels look washed out" in the bathymetry contour layer before the
shader was read (2026-09).

**How to apply:**

- **Never express label hierarchy through `getColor` alpha in a `LabelLayer`.** Use size
  (`getSize`), or presence via `getCollisionPriority` — see
  [[deck-collision-priority-range]] — which is the cartographically standard channel anyway.
- Per-tier opacity would require the outline to fade in step, which means one `LabelLayer`
  instance per tier since `outlineColor` cannot vary per feature. Rarely worth it.
- A uniform label opacity is fine, and is what `BathymetryContourLayer` now uses
  (`LABEL_OPACITY * zoomOpacity`, no elevation ramp). Deep-water labels previously
  inherited the line ramp and bottomed out near 0.33.
