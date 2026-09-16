---
name: Environmental Data Tooltips
slug: environmental-data-tooltips
type: system
sources:
  - path: >-
      apps/platform/features/_map/map/popups/environment/BathymetryContourTooltipSection.tsx
    hash: 7a2c01c3d0ee93158f3c5d14ac2cf269d7f319a068952b0da976addc2e02e14b
  - path: >-
      apps/platform/features/_map/map/popups/environment/GriddedValueTooltipSection.tsx
    hash: 36be4acb15d6b7e71734b91a5dd32f07f824d6b16267d57d0bfdf4ffb60aec77
  - path: apps/platform/features/_map/map/popups/environment/VectorsTooltipRow.tsx
    hash: 4ed260d9a5b33f39671719bca2ea1b9c891cbe0906a1600c34639728cb03fcb1
sources_digest: 57964da0199034c9e3e7282ae3cf2031904c0b71f57a823e0c1d22f167a6f5a5
links:
  - to: dataview-metadata-resolution
    relation: depends_on
    description: >-
      Environmental tooltips depend on selectAllDataviewInstancesResolved to
      look up dataset information
  - to: number-localization
    relation: uses
    description: >-
      Environmental components use I18nNumber and d3-format for locale-aware
      numeric display
  - to: popup-layout-components
    relation: uses
    description: >-
      Environmental tooltip sections use PopupSectionLayout for consistent
      structure
generator:
  version: 1
covers:
  - symbol: BathymetryContourTooltipSectionProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/environment/BathymetryContourTooltipSection.tsx:L16-L19
  - symbol: BathymetryContourTooltipSection
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/environment/BathymetryContourTooltipSection.tsx:L21-L58
  - symbol: GriddedValueTooltipSectionProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/environment/GriddedValueTooltipSection.tsx:L19-L22
  - symbol: parseEnvironmentalValue
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/environment/GriddedValueTooltipSection.tsx:L24-L32
  - symbol: GriddedValueTooltipSection
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/environment/GriddedValueTooltipSection.tsx:L34-L87
  - symbol: VectorsTooltipRowProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/environment/VectorsTooltipRow.tsx:L17-L22
  - symbol: VectorsTooltipRow
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/environment/VectorsTooltipRow.tsx:L24-L53
---

<!-- context:generated:start -->

## Summary

A subsystem for rendering tooltips on environmental map layers including bathymetry contours, gridded heatmap values, and vector data (wind, currents). Components parse dataset metadata via Redux, format numerical values with locale awareness, and conditionally display units and disclaimers based on layer type.

## Related

- depends on [[dataview-metadata-resolution]] — Environmental tooltips depend on selectAllDataviewInstancesResolved to look up dataset information
- uses [[number-localization]] — Environmental components use I18nNumber and d3-format for locale-aware numeric display
- uses [[popup-layout-components]] — Environmental tooltip sections use PopupSectionLayout for consistent structure

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
