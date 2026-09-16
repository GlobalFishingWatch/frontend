# apps/platform/features/_map/content-panel/user-guide/UserGuideContent.tsx · [[localization-and-resource-keys]] [[router-and-url-state-management]] [[user-guide-system]]

React component that displays localized user guide content with a table of contents sidebar, auto-scrolling to subsections, and section navigation.

- UserGuideContentComponent · function · L18-L240 — Main component that displays user guide content with selectable sections, auto-scrolling to subsections, and navigation between guide chapters.
- onScroll · function · L38-L38 — Scroll event handler that tracks whether the container has scrolled past a threshold to show the current section title in the header.
- performScroll · function · L66-L73 — Performs smooth scrolling to the target subcontent element if no images are still loading.
- onImgLoad · function · L85-L89 — Image load completion callback that decrements pending image counter and triggers scroll when all images have loaded.
