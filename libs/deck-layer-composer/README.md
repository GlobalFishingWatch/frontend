# @globalfishingwatch/deck-layer-composer

A library for composing and managing deck.gl layers in Global Fishing Watch applications.
This library provides a set of utilities to transform dataviews into deck.gl layers with consistent styling and behavior.

See whimsical schema for an explanation from dataview to deck.gl layer: https://whimsical.com/workspaces-96TFATRNzHgJwvjaDKCLEH

## Installation

```bash
yarn add @globalfishingwatch/deck-layer-composer
```

## Usage example

### useDeckLayerComposer

```typescript
const layers = function useDeckLayerComposer({
  dataviews,
  globalConfig,
}: {
  dataviews: DataviewInstance[]
  globalConfig: ResolverGlobalConfig
})
```

## [Dataview preparation](https://github.com/GlobalFishingWatch/frontend/blob/master/libs/deck-layer-composer/src/resolvers/dataviews.ts#L292)

Preprocessing phase where raw dataviews are transformed into a resolved and prepared state.

```typescript
const dataviews = getDataviewsResolved(dataviews, globalConfig)
```

## [Layer Resolution](https://github.com/GlobalFishingWatch/frontend/blob/master/libs/deck-layer-composer/src/resolvers/resolvers.ts#L43)

The library includes resolvers for different layer types that transform dataviews into the appropriate deck.gl layer. Each resolver handles specific layer requirements and properties.

```typescript
const layer = dataviewToDeckLayer(dataview, globalConfig)
```

## Build and publish

```bash
nx build deck-layer-composer
nx publish deck-layer-composer
```

## Dependencies

- @globalfishingwatch/api-client
- @globalfishingwatch/api-types
- @globalfishingwatch/deck-layers
- @globalfishingwatch/dataviews-client
- @globalfishingwatch/layer-composer
- jotai
- lodash
- luxon
- react

## License

MIT
