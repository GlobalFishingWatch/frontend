# apps/platform/features/_map/workspace/context-areas/ContextAreaLayerPanel.tsx · [[context-areas-management-system]]

Provides an interactive layer control panel for context area datasets, enabling toggling visibility, filtering, color/thickness customization, and real-time display of features on screen.

- LayerPanelProps · type · L61-L65 — Type definition for the properties accepted by the LayerPanel component.
- FeaturesOnScreen · type · L72-L72 — Type definition that represents the collection of context features currently visible and on-screen within the map viewport.
- LayerPanel · function · L73-L426 — React component that renders an interactive panel for controlling context area layers, including visibility, filtering, color/thickness properties, and displaying on-screen features.
- updateFeaturesOnScreen · function · L111-L122 — Async function that retrieves and filters rendered context layer features by proximity to update the on-screen features list.
- changeColor · function · L151-L160 — Handler that updates the dataview instance with a new color and color ramp configuration when the user selects a color.
- changeThickness · function · L161-L169 — Handler that updates the dataview instance with a new thickness value when the user modifies the thickness selector.
- onToggleColorOpen · function · L170-L172 — Toggle function that opens or closes the properties panel for color and thickness customization.
- onToggleFilterOpen · function · L174-L176 — Toggle function that opens or closes the filters panel for schema-based filtering of context layer features.
- closeExpandedContainer · function · L182-L185 — Function that closes both the filters and properties expanded panels when the user clicks outside them.
- highlightArea · function · L220-L222 — Function that sets the highlighted features on the context layer to visually emphasize a selected feature or clear the highlight.
