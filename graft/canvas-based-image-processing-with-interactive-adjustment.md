---
name: Canvas-based image processing with interactive adjustment
slug: canvas-based-image-processing-with-interactive-adjustment
type: concept
sources:
  - path: apps/image-labeler/src/features/project/LevelsSlider.tsx
    hash: bc30041b490c70b66c256aec5bafe9f9972f3b5559ca8edae4381962c0debef2
  - path: apps/image-labeler/src/features/project/TaskImage.tsx
    hash: c2622a6e9c098185f9a1cce86bf63a06759a2e42664d624f6e78760b6d3fc09e
  - path: apps/image-labeler/src/features/project/TaskImage.utils.ts
    hash: 18a808755128256165215a32e93168ecaa09666d46b759691dd8c71a761c72bf
sources_digest: ce96068d30aee502a5061b067c8ce350310ef9fec9ffaa600e2e64c9f26d6765
links: []
generator:
  version: 1
covers:
  - symbol: LevelsSlider
    kind: function
    at: 'apps/image-labeler/src/features/project/LevelsSlider.tsx:L13-L78'
  - symbol: handleChange
    kind: function
    at: 'apps/image-labeler/src/features/project/LevelsSlider.tsx:L26-L28'
  - symbol: TaskImageProps
    kind: type
    at: 'apps/image-labeler/src/features/project/TaskImage.tsx:L14-L21'
  - symbol: TaskImage
    kind: function
    at: 'apps/image-labeler/src/features/project/TaskImage.tsx:L25-L181'
  - symbol: draw
    kind: function
    at: 'apps/image-labeler/src/features/project/TaskImage.tsx:L80-L103'
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

Image labeling workflow integrates decoding (UPNG for 16-bit PNG, Jimp for standard formats), histogram visualization with logarithmic scaling, and three-point levels adjustment. TaskImage component manages canvasRef and histCanvasRef, applying levels via keyboard input from LevelsSlider component with strict ordering (black < gamma < white). Design uses useEffect with intentional eslint-disable-next-line dependencies on refs rather than props (levelsRef, autoLevelsRef, rangeModeRef) to preserve state across re-renders and avoid infinite loops. Histogram rendering supports per-channel RGB overlay using screen blending for visual stacking, with device pixel ratio awareness for retina displays.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
