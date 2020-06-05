import { Style, AnySourceImpl, Layer } from 'mapbox-gl'
import Generators from './generators'
import { flatObjectArrays, layersDictToArray } from './utils'
import { Dictionary, LayerComposerStyles, LayerComposerOptions, GeneratorStyles } from './types'
import {
  Generator,
  GeneratorConfig,
  GlobalGeneratorConfig,
  AnyGeneratorConfig,
} from './generators/types'

export const DEFAULT_CONFIG = {
  version: 8,
  glyphs:
    'https://raw.githubusercontent.com/GlobalFishingWatch/map-gl-glyphs/master/_output/{fontstack}/{range}.pbf?raw=true',
  sprite: 'https://raw.githubusercontent.com/GlobalFishingWatch/map-gl-sprites/master/out/sprites',
}

class LayerComposer {
  version: number
  glyphs: string
  sprite: string
  generators: Dictionary<Generator>
  latestGenerated: {
    sourcesStyle: Dictionary<AnySourceImpl[]>
    layersStyle: Dictionary<Layer[]>
  }

  constructor(params?: LayerComposerOptions) {
    this.version = (params && params.version) || DEFAULT_CONFIG.version
    this.glyphs = (params && params.glyphs) || DEFAULT_CONFIG.glyphs
    this.sprite = (params && params.sprite) || DEFAULT_CONFIG.sprite
    this.generators = (params && params.generators) || Generators

    // Used to cache results and always return the latest style in promises
    this.latestGenerated = { sourcesStyle: {}, layersStyle: {} }
  }

  // Sources dictionary for id and array of sources per layer
  _getGeneratorSources = (layers: GeneratorStyles[]): Dictionary<AnySourceImpl[]> => {
    return Object.fromEntries(
      layers
        .filter((layer) => layer.sources && layer.sources.length)
        .map((layer) => [layer.id, layer.sources])
    )
  }

  // Same here for layers
  _getGeneratorLayers = (layers: GeneratorStyles[]): Dictionary<Layer[]> => {
    return Object.fromEntries(
      layers
        .filter((layer) => layer.layers && layer.layers.length)
        .map((layer) => [layer.id, layer.layers])
    )
  }

  // apply generic config to all generator layers
  _applyGenericStyle = (
    generatorConfig: GeneratorConfig,
    generatorStyles: GeneratorStyles
  ): GeneratorStyles => {
    const newGeneratorStyles = { ...generatorStyles }
    newGeneratorStyles.layers = newGeneratorStyles.layers.map((layer) => {
      const newLayer = { ...layer }
      if (generatorConfig.visible !== undefined && generatorConfig.visible !== null) {
        if (!newLayer.layout) {
          newLayer.layout = {}
        }
        newLayer.layout.visibility = generatorConfig.visible === true ? 'visible' : 'none'
      }
      return newLayer
    })
    return newGeneratorStyles
  }

  // Compute helpers based on global config
  _getGlobalConfig = (config: GlobalGeneratorConfig) => {
    const newConfig = { ...config }
    if (newConfig.zoom) {
      newConfig.zoomLoadLevel = Math.floor(newConfig.zoom)
    }
    return newConfig
  }

  // Uses generators to return the layer with sources and layers
  _getGeneratorStyles = (
    config: GeneratorConfig,
    globalConfig: GlobalGeneratorConfig
  ): GeneratorStyles => {
    if (!this.generators[config.type]) {
      throw new Error(`There is no generator loaded for the config: ${config.type}}`)
    }
    const finalConfig = {
      ...this._getGlobalConfig(globalConfig),
      ...config,
    }
    const generator = this.generators[finalConfig.type]
    const generatorStyles = this._applyGenericStyle(finalConfig, generator.getStyle(finalConfig))
    return generatorStyles
  }

  // Latest step in the workflow which compose the output needed for mapbox-gl
  _getStyleJson(sources = {}, layers = {}): Style {
    return {
      version: this.version,
      glyphs: this.glyphs,
      sprite: this.sprite,
      sources: flatObjectArrays(sources),
      layers: layersDictToArray(layers),
    }
  }

  // Main method of the library which uses the privates one to compose the style
  getGLStyle = (
    layers: AnyGeneratorConfig[],
    globalGeneratorConfig: GlobalGeneratorConfig = {}
  ): LayerComposerStyles => {
    if (!layers) {
      console.warn('No layers passed to layer manager')
      return { style: this._getStyleJson() }
    }

    let layersPromises: Promise<GeneratorStyles>[] = []
    const layersGenerated = layers.map((layer) => {
      const { promise, promises, ...rest } = this._getGeneratorStyles(layer, globalGeneratorConfig)
      let layerPromises: Promise<GeneratorStyles>[] = []
      if (promise) {
        layerPromises = [promise]
      } else if (promises) {
        layerPromises = promises
      }
      layersPromises = layersPromises.concat(layerPromises)
      return rest
    })

    const sourcesStyle = this._getGeneratorSources(layersGenerated)
    const layersStyle = this._getGeneratorLayers(layersGenerated)

    this.latestGenerated = { sourcesStyle, layersStyle }

    const promises = layersPromises.map((promise) => {
      return promise
        .then((layer) => {
          const { id, sources, layers } = layer
          const { sourcesStyle, layersStyle } = this.latestGenerated
          // Mutating the reference to keep the layers order
          sourcesStyle[id] = sources
          layersStyle[id] = layers
          return { style: this._getStyleJson(sourcesStyle, layersStyle), layer }
        })
        .catch((e) => {
          console.warn(e)
          return { style: this._getStyleJson(sourcesStyle, layersStyle) }
        })
    })

    return { style: this._getStyleJson(sourcesStyle, layersStyle), promises }
  }
}

export default LayerComposer
