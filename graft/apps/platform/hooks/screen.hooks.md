# apps/platform/hooks/screen.hooks.ts · [[performance-screenshot-system]] [[responsive-layout-pattern]]

Exports React hooks for DOM element screenshot capture, intersection visibility detection, and screen DPI measurement.

- useDownloadDomElementAsImage · function · L7-L114 — Hook that provides functionality to capture a DOM element as an image and download or preview it using snapdom.
- useOnScreen · function · L116-L139 — Hook that detects whether a referenced element is currently visible in the viewport using IntersectionObserver.
- useScreenDPI · function · L141-L159 — Hook that measures the device's screen DPI by creating a temporary element with known physical dimensions.
