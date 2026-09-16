# apps/image-labeler/src/features/project/TaskImage.utils.ts · [[canvas-based-image-processing-with-interactive-adjustment]] [[defensive-utility-design-with-lenient-error-handling]] [[image-processing-and-visualization-utilities]]

Utility module for decoding, normalizing, and manipulating image data with histogram generation and level adjustment for image labeling tasks.

- RawImageData · type · L7-L7 — Type alias representing uncompressed image pixel data as a byte array with dimensions.
- LevelsValues · type · L8-L8 — Type alias for a three-element tuple holding black point, midtone, and white point levels.
- DataRange · type · L9-L9 — Type alias for a two-element tuple representing the minimum and maximum data values in an image.
- AutoLevelsResult · type · L10-L10 — Type alias for the result of automatic levels computation, containing adjusted levels and original data range.
- decodeEnhancedToRaw · function · L12-L24 — Decodes an image from a source URL using Jimp and normalizes it to raw pixel data.
- NormMode · type · L26-L26 — Type alias specifying whether normalization is applied globally or independently per color channel.
- decodeOriginalToRaw · function · L28-L136 — Decodes a base64-encoded PNG image and normalizes pixel values by range, handling both 16-bit and standard 8-bit formats.
- applyLevelToChannel · function · L138-L149 — Applies black/white point and gamma correction to a single pixel value for levels adjustment.
- applyLevelsToCanvas · function · L151-L167 — Renders raw image data to canvas after applying levels adjustment (black, midtone, white) to each RGB channel.
- computeAutoLevels · function · L169-L205 — Computes optimal black/white/midtone levels by analyzing the distribution of pixel intensities and clipping outliers.
- drawHistogram · function · L207-L265 — Renders a logarithmic intensity histogram to canvas, supporting both grayscale and per-channel color visualization modes.
