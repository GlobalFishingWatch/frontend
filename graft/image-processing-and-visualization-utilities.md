---
name: Image processing and visualization utilities
slug: image-processing-and-visualization-utilities
type: system
sources:
  - path: apps/image-labeler/src/features/project/TaskImage.utils.ts
    hash: 18a808755128256165215a32e93168ecaa09666d46b759691dd8c71a761c72bf
sources_digest: 03fb2e64c984deaa86267ee29eb262673b2731af1232d5e8f1a17912adff8dff
links:
  - to: image-labeler-task-labeling-ui
    relation: uses
    description: >-
      TaskImage and LevelsSlider components invoke these utilities for decoding,
      rendering, and adjusting image display
generator:
  version: 1
covers:
  - symbol: RawImageData
    kind: type
    at: 'apps/image-labeler/src/features/project/TaskImage.utils.ts:L7-L7'
  - symbol: LevelsValues
    kind: type
    at: 'apps/image-labeler/src/features/project/TaskImage.utils.ts:L8-L8'
  - symbol: DataRange
    kind: type
    at: 'apps/image-labeler/src/features/project/TaskImage.utils.ts:L9-L9'
  - symbol: AutoLevelsResult
    kind: type
    at: 'apps/image-labeler/src/features/project/TaskImage.utils.ts:L10-L10'
  - symbol: decodeEnhancedToRaw
    kind: function
    at: 'apps/image-labeler/src/features/project/TaskImage.utils.ts:L12-L24'
  - symbol: NormMode
    kind: type
    at: 'apps/image-labeler/src/features/project/TaskImage.utils.ts:L26-L26'
  - symbol: decodeOriginalToRaw
    kind: function
    at: 'apps/image-labeler/src/features/project/TaskImage.utils.ts:L28-L136'
  - symbol: applyLevelToChannel
    kind: function
    at: 'apps/image-labeler/src/features/project/TaskImage.utils.ts:L138-L149'
  - symbol: applyLevelsToCanvas
    kind: function
    at: 'apps/image-labeler/src/features/project/TaskImage.utils.ts:L151-L167'
  - symbol: computeAutoLevels
    kind: function
    at: 'apps/image-labeler/src/features/project/TaskImage.utils.ts:L169-L205'
  - symbol: drawHistogram
    kind: function
    at: 'apps/image-labeler/src/features/project/TaskImage.utils.ts:L207-L265'
---

<!-- context:generated:start -->

## Summary

Low-level image manipulation library for the labeling interface. Decodes standard and 16-bit PNG images via UPNG and Jimp with support for global and per-channel normalization. Applies three-point levels adjustment (black point, gamma, white point) with gamma correction per channel. Computes auto-levels by analyzing histograms with 0.01/99.99% outlier clipping. Renders histograms with optional per-channel RGB overlay using screen blending and logarithmic scaling. All functions handle device pixel ratio awareness and transparent pixel detection. Critical constraints include maintaining histogram bins across normalization modes and guarding against numerical instability in gamma computation.

## Related

- uses [[image-labeler-task-labeling-ui]] — TaskImage and LevelsSlider components invoke these utilities for decoding, rendering, and adjusting image display

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
