---
name: Detection Image Enhancement Pipeline
slug: detection-image-enhancement-pipeline
type: concept
sources:
  - path: apps/platform/features/_map/map/popups/activity/DetectionThumbnail.tsx
    hash: 8866274f2118c3dd5dbb1b13e60745656d0c6b5a40634d74eba460b69f3d8165
sources_digest: 692aff9cf866d26b2dc3e1106f95f7fd07e967c2989a5048eb9316f63a763220
links:
  - to: map-popup-system
    relation: implements
    description: Image enhancement is specialized rendering strategy within popup system
generator:
  version: 1
covers:
  - symbol: DetectionThumbnailProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/activity/DetectionThumbnail.tsx:L10-L15
  - symbol: stretchHistogram
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/activity/DetectionThumbnail.tsx:L19-L60
  - symbol: drawEnhancedImageToCanvas
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/activity/DetectionThumbnail.tsx:L62-L197
  - symbol: DetectionThumbnail
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/activity/DetectionThumbnail.tsx:L199-L253
  - symbol: draw
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/activity/DetectionThumbnail.tsx:L205-L211
---

<!-- context:generated:start -->

## Summary

Detection thumbnails support both 8-bit standard images (via histogram stretching with percentile-based min/max normalization) and specialized 16-bit PNG decoding (via upng-js for grayscale/RGB variants with channel configs 0/2/4/6). Dataset-specific sizing: 200px for planet-presence, 100px default. Fallback error handling applies histogram stretching if 16-bit decode fails. Critical invariant: image processing must occur on canvas with pixel-level access to DataView objects; raw base64 decoding insufficient for 16-bit data.

## Related

- implements [[map-popup-system]] — Image enhancement is specialized rendering strategy within popup system

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
