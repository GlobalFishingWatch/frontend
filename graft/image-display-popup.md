---
name: Image Display Popup
slug: image-display-popup
type: system
sources:
  - path: apps/platform/utils/img.ts
    hash: 3b2b9a71e9398f9fe0161e479f9890c10e8cfe252b5d58703ab9a4844b3efd7e
sources_digest: d816f88926dcf322392760bc331fa69480d825c5058e07cb0f81dce25d13acf2
links: []
generator:
  version: 1
covers:
  - symbol: handleOpenImage
    kind: function
    at: 'apps/platform/utils/img.ts:L1-L51'
---

<!-- context:generated:start -->

## Summary

Utility function handleOpenImage that opens images in a new browser window with styled presentation. Constructs a minimal HTML document with responsive CSS that varies by image type (vessel/detection): detection images are height-constrained to 400px while vessel images scale to viewport dimensions. Includes optional copyright attribution as footer text.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
