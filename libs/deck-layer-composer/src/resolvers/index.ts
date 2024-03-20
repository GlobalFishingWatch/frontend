import { PickingInfo } from '@deck.gl/core/typed'
import { DataviewType, DataviewInstance } from '@globalfishingwatch/api-types'
import {
  AnyDeckLayer,
  BaseMapLayer,
  ContextLayer,
  EEZLayer,
  FourwingsLayer,
  VesselLayer,
} from '@globalfishingwatch/deck-layers'
import { ResolverGlobalConfig } from './types'
import { resolveDeckBasemapLayerProps } from './basemap'
import { resolveDeckFourwingsLayerProps } from './fourwings'
import { resolveDeckContextLayerProps, resolveDeckEEZLayerProps } from './context'
import { resolveDeckVesselLayerProps } from './vessels'

export * from './basemap'
export * from './context'
export * from './fourwings'
export * from './types'
export * from './tile-cluster'
export * from './vessels'

const EEZ_DATAVIEW_ID = 'context-layer-eez'

export const dataviewToDeckLayer = (
  dataview: DataviewInstance,
  globalConfig: ResolverGlobalConfig,
  interactions = [] as PickingInfo[]
): AnyDeckLayer => {
  if (dataview.config?.type === DataviewType.Basemap) {
    const deckLayerProps = resolveDeckBasemapLayerProps(dataview)
    return new BaseMapLayer(deckLayerProps)
  }
  if (dataview.config?.type === DataviewType.HeatmapAnimated) {
    const deckLayerProps = resolveDeckFourwingsLayerProps(dataview, globalConfig, interactions)
    const layer = new FourwingsLayer(deckLayerProps)
    return layer
  }
  if (dataview.config?.type === DataviewType.Context) {
    if (dataview.id === EEZ_DATAVIEW_ID) {
      const deckLayerProps = resolveDeckEEZLayerProps(dataview, globalConfig, interactions)
      const layer = new EEZLayer(deckLayerProps)
      return layer
    }
    const deckLayerProps = resolveDeckContextLayerProps(dataview, globalConfig, interactions)
    const layer = new ContextLayer(deckLayerProps)
    return layer
  }
  if (dataview.config?.type === DataviewType.Track) {
    const deckLayerProps = resolveDeckVesselLayerProps(dataview, globalConfig, interactions)
    const layer = new VesselLayer(deckLayerProps)
    return layer
  }
  throw new Error(`Unknown deck layer generator type: ${dataview.config?.type}`)
}
