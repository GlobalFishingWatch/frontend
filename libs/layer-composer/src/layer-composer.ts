import { DataviewType } from '@globalfishingwatch/api-types'
import type { LayerSpecification,SourceSpecification } from '@globalfishingwatch/maplibre-gl'

import type {
  AnyGeneratorConfig,
  GlobalGeneratorConfig,
  GlobalGeneratorConfigExtended,
} from './generators/types'
import { isConfigVisible } from './generators/utils'
import { DEFAULT_STYLE } from './config'
import type { GeneratorsRecord } from './generators'
import Generators, { EVENTS_COLORS } from './generators'
import type {
  Dictionary,
  ExtendedStyle,
  ExtendedStyleMeta,
  GeneratorPromise,
  GeneratorStyles,
  HeatmapLayerMeta,
  LayerComposerOptions,
  LayerComposerStyles,
} from './types'
import { flatObjectArrays, layersDictToArray } from './utils'

export class LayerComposer {
  glyphs: string
  sprite: string
  generators: GeneratorsRecord
  latestGenerated: {
    sourcesStyle: Dictionary<SourceSpecification[]>
    layersStyle: Dictionary<LayerSpecification[]>
  }

  constructor(params?: LayerComposerOptions) {
    this.glyphs = (params && params.glyphs) || DEFAULT_STYLE.glyphs
    this.sprite = (params && params.sprite) || DEFAULT_STYLE.sprite
    this.generators = (params && params.generators) || Generators

    // Used to cache results and always return the latest style in promises
    this.latestGenerated = { sourcesStyle: {}, layersStyle: {} }
  }

  // Sources dictionary for id and array of sources per layer
  _getGeneratorSources = (layers: GeneratorStyles[]): Dictionary<SourceSpecification[]> => {
    return Object.fromEntries(
      layers
        .filter((layer) => layer.sources && layer.sources.length)
        .map((layer) => [layer.id, layer.sources])
    )
  }

  // Same here for layers
  _getGeneratorLayers = (layers: GeneratorStyles[]): Dictionary<LayerSpecification[]> => {
    return Object.fromEntries(
      layers
        .filter((layer) => layer.layers && layer.layers.length)
        .map((layer) => [layer.id, layer.layers])
    )
  }

  _getGeneratorMetadata = (layers: GeneratorStyles[]): ExtendedStyleMeta => {
    const generatorsMetadata = Object.fromEntries(
      layers
        .filter((layer) => layer.metadata)
        .map((layer) => [layer.id, layer.metadata as HeatmapLayerMeta])
    )
    const metadata = {
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
    newGeneratorStyles.layers = newGeneratorStyles.layers?.map((layer) => {
      const newLayer = { ...layer }
      if (!newLayer.layout) {
        newLayer.layout = {} as LayerSpecification['layout']
      }
      newLayer.layout = {
        ...newLayer.layout,
        visibility: isConfigVisible(generatorConfig),
      }
      if (!newLayer.paint) {
        newLayer.paint = {} as LayerSpecification['paint']
      }
      if (!newLayer.metadata) {
        newLayer.metadata = {}
      }
      newLayer.metadata = {
        ...newLayer.metadata,
        generatorId: generatorConfig.id,
        generatorType: generatorConfig.type as DataviewType,
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
    generatorConfig: AnyGeneratorConfig,
    globalConfig?: GlobalGeneratorConfig
  ): GeneratorStyles => {
    if (!this.generators[generatorConfig?.type]) {
      throw new Error(
        `There is no generator loaded for the config: ${
          generatorConfig ? generatorConfig.type : generatorConfig
        }}`
      )
    }
    const finalConfig = {
      ...this._getGlobalConfig(globalConfig),
      ...generatorConfig,
    }
    const generator = this.generators[finalConfig.type]
    const generatorStyles = this._applyGenericStyle(
      finalConfig,
      (generator as any).getStyle(finalConfig as any)
    )
    return generatorStyles
  }

  // Latest step in the workflow which compose the output needed for mapbox-gl
  _getStyleJson(sources = {}, layers = {}, metadata = {}): ExtendedStyle {
    return {
      version: DEFAULT_STYLE.version,
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
    const extendedGlobalGeneratorConfig = {
      ...globalGeneratorConfig,
      totalHeatmapAnimatedGenerators: layers.filter(
        (l) => l.type === DataviewType.HeatmapAnimated || l.type === DataviewType.HeatmapStatic
      )?.length,
    }
    let layersPromises: GeneratorPromise[] = []
    const singleTrackLayersVisible =
      layers.filter(({ type, visible }) => type === DataviewType.Track && visible).length === 1
    // Temporal workaound to avoid crashes when graticules layer is present
    const layersWithoutGraticules = layers.filter((layer) => layer.type !== ('GRATICULES' as any))
    const layersGenerated = layersWithoutGraticules.map((layer) => {
      // Paint fishing events white if only one vessel is shown
      if (layer.type === DataviewType.VesselEventsShapes && singleTrackLayersVisible) {
        layer.color = EVENTS_COLORS.fishing
      }
      const { promise, promises, ...rest } = this._getGeneratorStyles(
        layer,
        extendedGlobalGeneratorConfig
      )
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
