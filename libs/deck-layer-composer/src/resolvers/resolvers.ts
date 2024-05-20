import { DataviewType, DataviewInstance } from '@globalfishingwatch/api-types'
import {
  AnyDeckLayer,
  BaseMapLabelsLayer,
  BaseMapLayer,
  ClusterLayer,
  ContextLayer,
  FourwingsLayer,
  GraticulesLayer,
  PolygonsLayer,
  UserContextTileLayer,
  UserPointsTileLayer,
  VesselLayer,
} from '@globalfishingwatch/deck-layers'
import { ResolverGlobalConfig } from './types'
import { resolveDeckBasemapLabelsLayerProps, resolveDeckBasemapLayerProps } from './basemap'
import { resolveDeckFourwingsLayerProps } from './fourwings'
import { resolveDeckContextLayerProps } from './context'
import { resolveDeckClusterLayerProps } from './clusters'
import { resolveDeckVesselLayerProps } from './vessels'
import { resolveDeckUserContextLayerProps, resolveDeckUserPointsLayerProps } from './user'
import { resolveDeckGraticulesLayerProps } from './graticules'
import { resolveDeckPolygonsLayerProps } from './polygons'

export const dataviewToDeckLayer = (
  dataview: DataviewInstance,
  globalConfig: ResolverGlobalConfig
): AnyDeckLayer => {
  if (dataview.config?.type === DataviewType.Basemap) {
    const deckLayerProps = resolveDeckBasemapLayerProps(dataview, globalConfig)
    return new BaseMapLayer(deckLayerProps)
  }
  if (dataview.config?.type === DataviewType.BasemapLabels) {
    const deckLayerProps = resolveDeckBasemapLabelsLayerProps(dataview, globalConfig)
    return new BaseMapLabelsLayer(deckLayerProps)
  }
  if (dataview.config?.type === DataviewType.Graticules) {
    const deckLayerProps = resolveDeckGraticulesLayerProps(dataview, globalConfig)
    return new GraticulesLayer(deckLayerProps)
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
  if (dataview.config?.type === DataviewType.Polygons) {
    const deckLayerProps = resolveDeckPolygonsLayerProps(dataview, globalConfig)
    const layer = new PolygonsLayer(deckLayerProps)
    return layer
  }
  if (dataview.config?.type === DataviewType.UserContext) {
    const deckLayerProps = resolveDeckUserContextLayerProps(dataview, globalConfig)
    const layer = new UserContextTileLayer(deckLayerProps)
    return layer
  }
  if (dataview.config?.type === DataviewType.UserPoints) {
    const deckLayerProps = resolveDeckUserPointsLayerProps(dataview, globalConfig)
    const layer = new UserPointsTileLayer(deckLayerProps)
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
