import { DataviewType, DataviewInstance, DataviewCategory } from '@globalfishingwatch/api-types'
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
  UserTracksLayer,
  VesselLayer,
  WorkspacesLayer,
} from '@globalfishingwatch/deck-layers'
import { resolveDeckWorkspacesLayerProps } from './workspaces'
import { ResolverGlobalConfig } from './types'
import { resolveDeckBasemapLabelsLayerProps, resolveDeckBasemapLayerProps } from './basemap'
import { resolveDeckFourwingsLayerProps } from './fourwings'
import { resolveDeckContextLayerProps } from './context'
import { resolveDeckClusterLayerProps } from './clusters'
import { resolveDeckVesselLayerProps } from './vessels'
import {
  resolveDeckUserContextLayerProps,
  resolveDeckUserPointsLayerProps,
  resolveDeckUserTracksLayerProps,
} from './user'
import { resolveDeckGraticulesLayerProps } from './graticules'
import { resolveDeckPolygonsLayerProps } from './polygons'

export const getDataviewHighlightedFeatures = (
  dataview: DataviewInstance,
  globalConfig: ResolverGlobalConfig
) => {
  return globalConfig.highlightedFeatures?.filter((f) => f.layerId === dataview.id)
}

export const dataviewToDeckLayer = (
  dataview: DataviewInstance,
  globalConfig: ResolverGlobalConfig
): AnyDeckLayer => {
  const highlightedFeatures = getDataviewHighlightedFeatures(dataview, globalConfig)
  const layerConfig = { ...globalConfig, highlightedFeatures }
  if (dataview.config?.type === DataviewType.Basemap) {
    const deckLayerProps = resolveDeckBasemapLayerProps(dataview, layerConfig)
    return new BaseMapLayer(deckLayerProps)
  }
  if (dataview.config?.type === DataviewType.BasemapLabels) {
    const deckLayerProps = resolveDeckBasemapLabelsLayerProps(dataview, layerConfig)
    return new BaseMapLabelsLayer(deckLayerProps)
  }
  if (dataview.config?.type === DataviewType.Graticules) {
    const deckLayerProps = resolveDeckGraticulesLayerProps(dataview, layerConfig)
    return new GraticulesLayer(deckLayerProps)
  }
  if (
    dataview.config?.type === DataviewType.HeatmapAnimated ||
    dataview.config?.type === DataviewType.HeatmapStatic
  ) {
    const deckLayerProps = resolveDeckFourwingsLayerProps(dataview, layerConfig)
    const layer = new FourwingsLayer(deckLayerProps)
    return layer
  }
  if (dataview.config?.type === DataviewType.Context) {
    const deckLayerProps = resolveDeckContextLayerProps(dataview, layerConfig)
    const layer = new ContextLayer(deckLayerProps)
    return layer
  }
  if (dataview.config?.type === DataviewType.Polygons) {
    const deckLayerProps = resolveDeckPolygonsLayerProps(dataview, layerConfig)
    const layer = new PolygonsLayer(deckLayerProps)
    return layer
  }
  if (dataview.config?.type === DataviewType.UserContext) {
    const deckLayerProps = resolveDeckUserContextLayerProps(dataview, layerConfig)
    const layer = new UserContextTileLayer(deckLayerProps)
    return layer
  }
  if (dataview.config?.type === DataviewType.UserPoints) {
    const deckLayerProps = resolveDeckUserPointsLayerProps(dataview, layerConfig)
    const layer = new UserPointsTileLayer(deckLayerProps)
    return layer
  }
  if (dataview.config?.type === DataviewType.TileCluster) {
    const deckLayerProps = resolveDeckClusterLayerProps(dataview, layerConfig)
    const layer = new ClusterLayer(deckLayerProps)
    return layer
  }
  if (dataview.config?.type === DataviewType.Track) {
    if (dataview.category === DataviewCategory.User) {
      const deckLayerProps = resolveDeckUserTracksLayerProps(dataview, layerConfig)
      const layer = new UserTracksLayer(deckLayerProps)
      return layer
    }
    const deckLayerProps = resolveDeckVesselLayerProps(dataview, layerConfig)
    const layer = new VesselLayer(deckLayerProps)
    return layer
  }
  if (dataview.config?.type === DataviewType.Workspaces) {
    const deckLayerProps = resolveDeckWorkspacesLayerProps(dataview, layerConfig)
    const layer = new WorkspacesLayer(deckLayerProps)
    return layer
  }
  throw new Error(`Unknown deck layer generator type: ${dataview.config?.type}`)
}