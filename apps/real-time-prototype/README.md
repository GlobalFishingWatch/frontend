# Deck Playground

This apps intends to be the container for the proof of concept of the implementation of the Global Fishing Watch (GFW) map features using [deckGL](https://deck.gl/) as data visualization framework.

DeckGL provides a way to write custom map layers with full control of the rendering pipeline leveraging webGl capabilities. This extensible layer architecture facilitates the creation of semantic, modular, classes that could be then plugged into a Deck instance. This provides a way to encapsulate functionality making easier to use and share (imagine a deckGl based app being able to import and use 4Wings layers out of the box 🌈).

You'd find here a set of layer types meaningful for the Global Fishing Watch project:

- [x] - `FourwingsLayer`: Displays fishing effort heatmap and vessels positions (depending on zoom level)

- [x] `VesselsLayers`: Display vessels events and tracks

- [ ] `ContextLayer`: Displays context datasets (MPAs, EEZs...) and user updated datasets

- [ ] `EditLayer`: Displays user drawn shapes (allowing edit)

### Conventions

- It is expected for [Composite layers](https://deck.gl/docs/developer-guide/custom-layers/composite-layers) to return an array of layers inside the `layer` property. This will be used for layer oprdering purposes.

- In order to be able to order layers stack on the map a `zIndex` prop could be provided to the layers. This is an optional prop. Layers on this repo have a default value for the `zIndex` property that accomodates GFWs map needs regarding layer ordering.

  For `zIndex` to take effect layers need to be sorted by this property before they get passed to the `Deck` instance. In order to do that there's a `zIndexSortedArray` function that take a layers array and handles the ordering.
