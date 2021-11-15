import { AnySourceImpl, Layer, AnyPaint, AnyLayout } from '@globalfishingwatch/mapbox-gl'
import Generators from './generators'
import { flatObjectArrays, layersDictToArray } from './utils'
import {
  Dictionary,
  LayerComposerStyles,
  LayerComposerOptions,
  GeneratorStyles,
  Generator,
  ExtendedStyle,
  ExtendedStyleMeta,
  GeneratorPromise,
} from './types'
import {
  GlobalGeneratorConfig,
  AnyGeneratorConfig,
  GeneratorType,
  GlobalGeneratorConfigExtended,
} from './generators/types'
import { isConfigVisible } from './generators/utils'
import { DEFAULT_STYLE } from './config'

export class LayerComposer {
  version: number
  glyphs: string
  sprite: string
  generators: Dictionary<Generator>
  latestGenerated: {
    sourcesStyle: Dictionary<AnySourceImpl[]>
    layersStyle: Dictionary<Layer[]>
  }

  constructor(params?: LayerComposerOptions) {
    this.version = (params && params.version) || DEFAULT_STYLE.version
    this.glyphs = (params && params.glyphs) || DEFAULT_STYLE.glyphs
    this.sprite = (params && params.sprite) || DEFAULT_STYLE.sprite
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

  _getGeneratorMetadata = (layers: GeneratorStyles[]): ExtendedStyleMeta => {
    const generatorsMetadata = Object.fromEntries(
      layers.filter((layer) => layer.metadata).map((layer) => [layer.id, layer.metadata])
    )
    const metadata = {
      generatedAt: Date.now(),
      generatorsMetadata,
    }
    return metadata
  }

  // apply generic config to all generator layers
  _applyGenericStyle = (
    generatorConfig: AnyGeneratorConfig,
    generatorStyles: GeneratorStyles
  ): GeneratorStyles => {
    const newGeneratorStyles = { ...generatorStyles }
    newGeneratorStyles.layers = newGeneratorStyles.layers.map((layer) => {
      const newLayer = { ...layer }
      if (!newLayer.layout) {
        newLayer.layout = {} as AnyLayout
      }
      newLayer.layout = {
        ...newLayer.layout,
        visibility: isConfigVisible(generatorConfig),
      }
      if (!newLayer.paint) {
        newLayer.paint = {} as AnyPaint
      }
      if (!newLayer.metadata) {
        newLayer.metadata = {
          generatorId: generatorConfig.id,
          generatorType: generatorConfig.type as GeneratorType,
        }
      } else {
        newLayer.metadata = {
          ...newLayer.metadata,
          generatorType: generatorConfig.type as GeneratorType,
        }
      }
      if (generatorConfig.opacity !== undefined && generatorConfig.opacity !== null) {
        // Can't really handle global opacity on symbol layers as we don't know whether it applies to icon or text
        if (newLayer.type !== 'symbol') {
          const propName = `${newLayer.type}-opacity`
          const currentOpacity = (newLayer.paint as any)[propName] || 1
          const paint = {
            [propName]: currentOpacity * generatorConfig.opacity,
          }
          newLayer.paint = { ...newLayer.paint, ...paint }
        }
      }
      return newLayer
    })
    return newGeneratorStyles
  }

  // Compute helpers based on global config
  _getGlobalConfig = (config?: GlobalGeneratorConfig) => {
    if (!config) return {}

    const newConfig: GlobalGeneratorConfigExtended = {
      ...config,
      zoomLoadLevel: Math.floor(config.zoom || 0),
    }
    return newConfig
  }

  // Uses generators to return the layer with sources and layers
  _getGeneratorStyles = (
    config: AnyGeneratorConfig,
    globalConfig?: GlobalGeneratorConfig
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
  _getStyleJson(sources = {}, layers = {}, metadata = {}): ExtendedStyle {
    return {
      version: this.version,
      glyphs: this.glyphs,
      sprite: this.sprite,
      sources: flatObjectArrays(sources),
      layers: layersDictToArray(layers),
      metadata,
    }
  }

  // Main method of the library which uses the privates one to compose the style
  getGLStyle = (
    layers: AnyGeneratorConfig[],
    globalGeneratorConfig?: GlobalGeneratorConfig
  ): LayerComposerStyles => {
    if (!layers) {
      console.warn('No layers passed to layer manager')
      return { style: this._getStyleJson() }
    }

    let layersPromises: GeneratorPromise[] = []
    const layersGenerated = layers.map((layer) => {
      const { promise, promises, ...rest } = this._getGeneratorStyles(layer, globalGeneratorConfig)
      let layerPromises: GeneratorPromise[] = []
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
    const metadataStyle = this._getGeneratorMetadata(layersGenerated)

    this.latestGenerated = { sourcesStyle, layersStyle }

    const promises = layersPromises.map((promise) => {
      return promise
        .then(({ config, style }) => {
          const layer = this._applyGenericStyle(config, style)
          const metadataStyle = this._getGeneratorMetadata([...layersGenerated, layer])
          const { id, sources, layers } = layer
          const { sourcesStyle, layersStyle } = this.latestGenerated
          // Mutating the reference to keep the layers order
          sourcesStyle[id] = sources
          layersStyle[id] = layers
          return { style: this._getStyleJson(sourcesStyle, layersStyle, metadataStyle), layer }
        })
        .catch((e) => {
          console.warn(e)
          return { style: this._getStyleJson(sourcesStyle, layersStyle, metadataStyle) }
        })
    })

    return { style: this._getStyleJson(sourcesStyle, layersStyle, metadataStyle), promises }
  }
}
