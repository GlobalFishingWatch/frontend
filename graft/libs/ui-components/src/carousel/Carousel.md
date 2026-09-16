# libs/ui-components/src/carousel/Carousel.tsx · [[carousel-responsive-overflow-detection]] [[css-module-encapsulation-theming]] [[pointer-event-gesture-recognition-pattern]] [[responsive-overflow-detection-pattern]] [[ui-components-library]]

Carousel component source file providing a horizontal scrollable carousel with mouse drag support and visual indicators for remaining content.

- CarouselProps · interface · L11-L20 — Configuration interface for the Carousel component specifying layout, styling, and optional item-per-view overrides.
- Carousel · function · L22-L125 — Horizontal carousel component that allows mouse-drag scrolling, tracks overflow state, and prevents accidental clicks on dragged items.
- update · function · L42-L43 — Checks whether scrollable content remains after the current viewport position to control fade visibility.
- onPointerDown · function · L59-L63 — Captures the starting mouse position and scroll offset when the user presses down on the carousel.
- onPointerMove · function · L65-L77 — Translates pointer movement into carousel scroll position once drag threshold is exceeded, enabling drag-to-scroll interaction.
- onPointerEnd · function · L79-L82 — Completes drag interaction by clearing the start reference and resetting the dragging state.
