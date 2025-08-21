import { DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'
import type { AnyDeckLayer } from '@globalfishingwatch/deck-layers'
import {
  BaseMapLabelsLayer,
  BaseMapLayer,
  BathymetryContourLayer,
  ContextLayer,
  FourwingsClustersLayer,
  FourwingsCurrentsTileLayer,
  FourwingsLayer,
  GraticulesLayer,
  PolygonsLayer,
  UserContextTileLayer,
  UserPointsTileLayer,
  UserTracksLayer,
  VesselLayer,
  WorkspacesLayer,
} from '@globalfishingwatch/deck-layers'

import type {
  ResolvedContextDataviewInstance,
  ResolvedDataviewInstance,
  ResolvedFourwingsDataviewInstance,
} from '../types/dataviews'
import type { ResolverGlobalConfig } from '../types/resolvers'

import { resolveDeckBasemapLabelsLayerProps, resolveDeckBasemapLayerProps } from './basemap'
import { resolveDeckBathymetryContourLayerProps } from './bathymetry-contour'
import { resolveDeckFourwingsClustersLayerProps } from './clusters'
import { resolveDeckContextLayerProps } from './context'
import { resolveDeckCurrentsLayerProps } from './currents'
import { resolveDeckFourwingsLayerProps } from './fourwings'
import { resolveDeckGraticulesLayerProps } from './graticules'
import { resolveDeckPolygonsLayerProps } from './polygons'
import {
  resolveDeckUserContextLayerProps,
  resolveDeckUserPointsLayerProps,
  resolveDeckUserTracksLayerProps,
} from './user'
import { resolveDeckVesselLayerProps } from './vessels'
import { resolveDeckWorkspacesLayerProps } from './workspaces'

export const getDataviewHighlightedFeatures = (
  dataview: ResolvedDataviewInstance,
  globalConfig: ResolverGlobalConfig
) => {
  return globalConfig.highlightedFeatures?.filter((f) => f.layerId === dataview.id)
}

export const dataviewToDeckLayer = (
  dataview: ResolvedDataviewInstance,
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
  if (dataview.config?.type === DataviewType.Bathymetry) {
    const deckLayerProps = resolveDeckBathymetryContourLayerProps(dataview, layerConfig)
    return new BathymetryContourLayer(deckLayerProps)
  }
  if (dataview.config?.type === DataviewType.Graticules) {
    const deckLayerProps = resolveDeckGraticulesLayerProps(dataview, layerConfig)
    return new GraticulesLayer(deckLayerProps)
  }
  if (
    dataview.config?.type === DataviewType.HeatmapAnimated ||
    dataview.config?.type === DataviewType.HeatmapStatic
  ) {
    const deckLayerProps = resolveDeckFourwingsLayerProps(
      dataview as ResolvedFourwingsDataviewInstance,
      layerConfig
    )
    const layer = new FourwingsLayer(deckLayerProps)
    return layer
  }
  if (dataview.config?.type === DataviewType.Currents) {
    const deckLayerProps = resolveDeckCurrentsLayerProps(
      dataview as ResolvedFourwingsDataviewInstance,
      layerConfig
    )
    const layer = new FourwingsCurrentsTileLayer(deckLayerProps)
    return layer
  }
  if (dataview.config?.type === DataviewType.Context) {
    const deckLayerProps = resolveDeckContextLayerProps(
      dataview as ResolvedContextDataviewInstance,
      layerConfig
    )
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
  if (dataview.config?.type === DataviewType.FourwingsTileCluster) {
    const deckLayerProps = resolveDeckFourwingsClustersLayerProps(dataview, layerConfig)
    const layer = new FourwingsClustersLayer(deckLayerProps)
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
