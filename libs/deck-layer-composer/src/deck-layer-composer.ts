import { DataviewConfigType, DataviewInstance } from '@globalfishingwatch/api-types'
import {
  AnyDeckLayer,
  BaseMapLayer,
  ContextLayer,
  FourwingsLayer,
  VesselLayer,
} from '@globalfishingwatch/deck-layers'
import { ResolverGlobalConfig } from './resolvers/types'
import { resolveDeckBasemapLayerProps } from './resolvers/basemap'
import { resolveDeckFourwingsLayerProps } from './resolvers/fourwings'
import { resolveDeckContextLayerProps } from './resolvers/context'
import { resolveDeckVesselLayerProps } from './resolvers/vessels'

export const dataviewToDeckLayer = (
  dataview: DataviewInstance,
  globalConfig: ResolverGlobalConfig
): AnyDeckLayer => {
  if (dataview.config?.type === DataviewConfigType.Basemap) {
    const deckLayerProps = resolveDeckBasemapLayerProps(dataview)
    return new BaseMapLayer(deckLayerProps)
  }
  if (dataview.config?.type === DataviewConfigType.HeatmapAnimated) {
    const deckLayerProps = resolveDeckFourwingsLayerProps(dataview, globalConfig)
    const layer = new FourwingsLayer(deckLayerProps)
    return layer
  }
  if (dataview.config?.type === DataviewConfigType.Context) {
    const deckLayerProps = resolveDeckContextLayerProps(dataview, globalConfig)
    const layer = new ContextLayer(deckLayerProps)
    return layer
  }
  if (dataview.config?.type === DataviewConfigType.Track) {
    const deckLayerProps = resolveDeckVesselLayerProps(dataview, globalConfig)
    const layer = new VesselLayer(deckLayerProps)
    return layer
  }
  throw new Error(`Unknown deck layer generator type: ${dataview.config?.type}`)
}
