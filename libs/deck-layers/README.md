# @globalfishingwatch/deck-layers

A library of custom deck.gl layers used by Global Fishing Watch.

## Installation

```bash
yarn add @globalfishingwatch/deck-layers
```

## Available Layers

### Base Map

- `BasemapLayer`: Renders base map with bathymetry and landmass
- `BasemapLabelsLayer`: Renders map labels with localization
- `TilesBoundariesLayer`: Debug layer for tile boundaries visualization

### Fourwings Visualization

- `FourwingsLayer`:
  - `FourwingsHeatmapLayer`: Gridded heatmap visualization
  - `FourwingsPositionsLayer`: Individual vessel positions visualization
  - `FourwingsClustersLayer`: Clustered activity visualization

### Vessel visualizations

- `VesselLayer`: Renders vessel composed with:
  - `VesselTracksLayer`: Animated vessel track visualization
  - `VesselEventsLayer`: Visualization of vessel events

### Context & Boundaries

- `PolygonLayer`: Custom polygon visualization
- `ContextLayer`: Known areas context visualization
- `UserContextTileLayer`: Custom uploaded user data visualization
- `UserPointsTileLayer`: User-defined point data visualization
- `GraticulesLayer`: Renders graticules for the base map

### Analysis & Tools

- `DrawLayer`: Interactive drawing tools for analysis
- `RulerLayer`: Ruler tool for measuring distances

## Build and publish

```bash
nx build deck-layers
nx publish deck-layers
```

## Dependencies

Core dependencies:

- `@deck.gl/core`: Core deck.gl library for WebGL-powered data visualization
- `@deck.gl/layers`: Standard deck.gl layer collection
- `@deck.gl/geo-layers`: Geospatial layers for deck.gl
- `@deck.gl/mesh-layers`: 3D mesh visualization layers
- `@deck.gl-community/editable-layers`: Interactive drawing and editing capabilities

Data Processing:

- `@loaders.gl/core`: Data loading and parsing utilities
- `@loaders.gl/mvt`: Mapbox Vector Tile support
- `@globalfishingwatch/deck-loaders`: [Custom data parsing](https://github.com/GlobalFishingWatch/frontend/blob/master/libs/deck-loaders/README.md)
- `@turf/helpers`: Geospatial analysis utilities
- `d3-scale`: Data scaling and transformation

Peer Dependencies:

- `@luma.gl/core`: WebGL rendering engine used by deck.gl

## License

MIT
