import { DataviewType, DataviewInstance } from '@globalfishingwatch/api-types'
import {
  AnyDeckLayer,
  BaseMapLayer,
  ClusterLayer,
  ContextLayer,
  FourwingsLayer,
  VesselLayer,
} from '@globalfishingwatch/deck-layers'
import { ResolverGlobalConfig } from './types'
import { resolveDeckBasemapLayerProps } from './basemap'
import { resolveDeckFourwingsLayerProps } from './fourwings'
import { resolveDeckContextLayerProps } from './context'
import { resolveDeckClusterLayerProps } from './clusters'
import { resolveDeckVesselLayerProps } from './vessels'

export * from './basemap'
export * from './context'
export * from './clusters'
export * from './dataviews'
export * from './fourwings'
export * from './types'
export * from './tile-cluster'
export * from './vessels'

export const dataviewToDeckLayer = (
  dataview: DataviewInstance,
  globalConfig: ResolverGlobalConfig
): AnyDeckLayer => {
  if (dataview.config?.type === DataviewType.Basemap) {
    const deckLayerProps = resolveDeckBasemapLayerProps(dataview, globalConfig)
    return new BaseMapLayer(deckLayerProps)
  }
  if (
    dataview.config?.type === DataviewType.HeatmapAnimated ||
    dataview.config?.type === DataviewType.HeatmapStatic
  ) {
    const deckLayerProps = resolveDeckFourwingsLayerProps(dataview, globalConfig)
    const layer = new FourwingsLayer(deckLayerProps)
    return layer
  }
  if (dataview.config?.type === DataviewType.Context) {
    const deckLayerProps = resolveDeckContextLayerProps(dataview, globalConfig)
    const layer = new ContextLayer(deckLayerProps)
    return layer
  }
  if (dataview.config?.type === DataviewType.TileCluster) {
    const deckLayerProps = resolveDeckClusterLayerProps(dataview, globalConfig)
    const layer = new ClusterLayer(deckLayerProps)
    return layer
  }
  if (dataview.config?.type === DataviewType.Track) {
    const deckLayerProps = resolveDeckVesselLayerProps(dataview, globalConfig)
    const layer = new VesselLayer(deckLayerProps)
    return layer
  }
  throw new Error(`Unknown deck layer generator type: ${dataview.config?.type}`)
}
