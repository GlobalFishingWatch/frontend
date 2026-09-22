# apps/platform/features/_map/map/popups/activity/DetectionThumbnail.tsx · [[detection-image-enhancement-pipeline]] [[map-popup-system]]

React component that displays a detection thumbnail image with histogram stretching enhancement, canvas rendering, and optional scale bar overlay.

- DetectionThumbnailProps · type · L10-L15 — Type definition for the props accepted by the DetectionThumbnail component, specifying image data, optional scale factor, and dataset identifier.
- stretchHistogram · function · L19-L60 — Applies histogram stretching to image pixel data by remapping intensity values between calculated percentiles to improve contrast and visibility.
- drawEnhancedImageToCanvas · function · L62-L197 — Renders an image to a canvas with adaptive enhancement: decodes 16-bit PNGs with contrast stretching, or applies histogram stretching to 8-bit images with fallback error handling.
- DetectionThumbnail · function · L199-L253 — React component that renders an interactive detection thumbnail with optional scale reference bar, enhanced image rendering, and click handling for fullscreen image viewing.
- draw · function · L205-L211 — Callback handler that triggers canvas-based enhanced image drawing when the thumbnail image finishes loading.
