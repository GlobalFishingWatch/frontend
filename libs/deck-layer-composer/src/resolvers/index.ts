import { PickingInfo } from '@deck.gl/core/typed'
import { DataviewConfigType, DataviewInstance } from '@globalfishingwatch/api-types'
import {
  AnyDeckLayer,
  BaseMapLayer,
  ContextLayer,
  FourwingsLayer,
  VesselLayer,
} from '@globalfishingwatch/deck-layers'
import { ResolverGlobalConfig } from './types'
import { resolveDeckBasemapLayerProps } from './basemap'
import { resolveDeckFourwingsLayerProps } from './fourwings'
import { resolveDeckContextLayerProps } from './context'
import { resolveDeckVesselLayerProps } from './vessels'

export * from './basemap'
export * from './context'
export * from './fourwings'
export * from './types'
export * from './tile-cluster'
export * from './vessels'

export const dataviewToDeckLayer = (
  dataview: DataviewInstance,
  globalConfig: ResolverGlobalConfig,
  interactions = [] as PickingInfo[]
): AnyDeckLayer => {
  if (dataview.config?.type === DataviewConfigType.Basemap) {
    const deckLayerProps = resolveDeckBasemapLayerProps(dataview)
    return new BaseMapLayer(deckLayerProps)
  }
  if (dataview.config?.type === DataviewConfigType.HeatmapAnimated) {
    const deckLayerProps = resolveDeckFourwingsLayerProps(dataview, globalConfig, interactions)
    const layer = new FourwingsLayer(deckLayerProps)
    return layer
  }
  if (dataview.config?.type === DataviewConfigType.Context) {
    const deckLayerProps = resolveDeckContextLayerProps(dataview, globalConfig, interactions)
    const layer = new ContextLayer(deckLayerProps)
    return layer
  }
  if (dataview.config?.type === DataviewConfigType.Track) {
    const deckLayerProps = resolveDeckVesselLayerProps(dataview, globalConfig, interactions)
    const layer = new VesselLayer(deckLayerProps)
    return layer
  }
  throw new Error(`Unknown deck layer generator type: ${dataview.config?.type}`)
}
