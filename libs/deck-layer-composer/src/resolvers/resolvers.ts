import { DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'
import type { AnyDeckLayer } from '@globalfishingwatch/deck-layers'
import {
  BaseMapImageLayer,
  BaseMapLabelsLayer,
  BaseMapLayer,
  BathymetryContourLayer,
  ContextLayer,
  FourwingsClustersLayer,
  FourwingsLayer,
  FourwingsVectorsTileLayer,
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

import {
  resolveDeckBasemapImageLayerProps,
  resolveDeckBasemapLabelsLayerProps,
  resolveDeckBasemapLayerProps,
} from './basemap'
import { resolveDeckBathymetryContourLayerProps } from './bathymetry-contour'
import { resolveDeckFourwingsClustersLayerProps } from './clusters'
import { resolveDeckContextLayerProps } from './context'
import { resolveDeckFourwingsLayerProps } from './fourwings'
import { resolveDeckGraticulesLayerProps } from './graticules'
import { resolveDeckPolygonsLayerProps } from './polygons'
import {
  resolveDeckUserContextLayerProps,
  resolveDeckUserPointsLayerProps,
  resolveDeckUserTracksLayerProps,
} from './user'
import { resolveDeckVectorsLayerProps } from './vectors'
import { resolveDeckVesselLayerProps } from './vessels'
import { resolveDeckWorkspacesLayerProps } from './workspaces'

export const dataviewToDeckLayer = (
  dataview: ResolvedDataviewInstance,
  globalConfig: ResolverGlobalConfig
): AnyDeckLayer => {
  if (dataview.config?.type === DataviewType.Basemap) {
    const deckLayerProps = resolveDeckBasemapLayerProps(dataview, globalConfig)
    return new BaseMapLayer(deckLayerProps)
  }
  if (dataview.config?.type === DataviewType.BasemapImage) {
    const deckLayerProps = resolveDeckBasemapImageLayerProps(dataview, globalConfig)
    return new BaseMapImageLayer(deckLayerProps)
  }
  if (dataview.config?.type === DataviewType.BasemapLabels) {
    const deckLayerProps = resolveDeckBasemapLabelsLayerProps(dataview, globalConfig)
    return new BaseMapLabelsLayer(deckLayerProps)
  }
  if (dataview.config?.type === DataviewType.Bathymetry) {
    const deckLayerProps = resolveDeckBathymetryContourLayerProps(dataview, globalConfig)
    return new BathymetryContourLayer(deckLayerProps)
  }
  if (dataview.config?.type === DataviewType.Graticules) {
    const deckLayerProps = resolveDeckGraticulesLayerProps(dataview, globalConfig)
    return new GraticulesLayer(deckLayerProps)
  }
  if (
    dataview.config?.type === DataviewType.HeatmapAnimated ||
    dataview.config?.type === DataviewType.HeatmapStatic
  ) {
    const deckLayerProps = resolveDeckFourwingsLayerProps(
      dataview as ResolvedFourwingsDataviewInstance,
      globalConfig
    )
    const layer = new FourwingsLayer(deckLayerProps)
    return layer
  }
  if (dataview.config?.type === DataviewType.FourwingsVector) {
    const deckLayerProps = resolveDeckVectorsLayerProps(
      dataview as ResolvedFourwingsDataviewInstance,
      globalConfig
    )
    const layer = new FourwingsVectorsTileLayer(deckLayerProps)
    return layer
  }
  if (dataview.config?.type === DataviewType.Context) {
    const deckLayerProps = resolveDeckContextLayerProps(
      dataview as ResolvedContextDataviewInstance,
      globalConfig
    )
    const layer = new ContextLayer(deckLayerProps)
    return layer
  }
  if (dataview.config?.type === DataviewType.Polygons) {
    const deckLayerProps = resolveDeckPolygonsLayerProps(dataview, globalConfig)
    const layer = new PolygonsLayer(deckLayerProps)
    return layer
  }
  if (dataview.config?.type === DataviewType.UserContext) {
    const deckLayerProps = resolveDeckUserContextLayerProps(
      dataview as ResolvedContextDataviewInstance,
      globalConfig
    )
    const layer = new UserContextTileLayer(deckLayerProps)
    return layer
  }
  if (dataview.config?.type === DataviewType.UserPoints) {
    const deckLayerProps = resolveDeckUserPointsLayerProps(
      dataview as ResolvedContextDataviewInstance,
      globalConfig
    )
    const layer = new UserPointsTileLayer(deckLayerProps)
    return layer
  }
  if (dataview.config?.type === DataviewType.FourwingsTileCluster) {
    const deckLayerProps = resolveDeckFourwingsClustersLayerProps(dataview, globalConfig)
    const layer = new FourwingsClustersLayer(deckLayerProps)
    return layer
  }
  if (dataview.config?.type === DataviewType.Track) {
    if (dataview.category === DataviewCategory.User) {
      const deckLayerProps = resolveDeckUserTracksLayerProps(
        dataview as ResolvedContextDataviewInstance,
        globalConfig
      )
      const layer = new UserTracksLayer(deckLayerProps)
      return layer
    }
    const deckLayerProps = resolveDeckVesselLayerProps(dataview, globalConfig)
    const layer = new VesselLayer(deckLayerProps)
    return layer
  }
  if (dataview.config?.type === DataviewType.Workspaces) {
    const deckLayerProps = resolveDeckWorkspacesLayerProps(dataview, globalConfig)
    const layer = new WorkspacesLayer(deckLayerProps)
    return layer
  }
  throw new Error(`Unknown deck layer generator type: ${dataview.config?.type}`)
}
