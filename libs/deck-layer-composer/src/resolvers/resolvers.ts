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

type DeckLayerClass = new (props: any) => AnyDeckLayer

// Resolved layer class + props for a dataview, kept separate from instantiation so the
// composer can skip recreating a layer when its props haven't changed (see useDeckLayerComposer).
export type DeckLayerResolved = {
  LayerClass: DeckLayerClass
  props: any
}

export const dataviewToDeckLayerResolved = (
  dataview: ResolvedDataviewInstance,
  globalConfig: ResolverGlobalConfig
): DeckLayerResolved => {
  if (dataview.config?.type === DataviewType.Basemap) {
    return { LayerClass: BaseMapLayer, props: resolveDeckBasemapLayerProps(dataview, globalConfig) }
  }
  if (dataview.config?.type === DataviewType.BasemapImage) {
    return {
      LayerClass: BaseMapImageLayer,
      props: resolveDeckBasemapImageLayerProps(dataview, globalConfig),
    }
  }
  if (dataview.config?.type === DataviewType.BasemapLabels) {
    return {
      LayerClass: BaseMapLabelsLayer,
      props: resolveDeckBasemapLabelsLayerProps(dataview, globalConfig),
    }
  }
  if (dataview.config?.type === DataviewType.Bathymetry) {
    return {
      LayerClass: BathymetryContourLayer,
      props: resolveDeckBathymetryContourLayerProps(dataview, globalConfig),
    }
  }
  if (dataview.config?.type === DataviewType.Graticules) {
    return {
      LayerClass: GraticulesLayer,
      props: resolveDeckGraticulesLayerProps(dataview, globalConfig),
    }
  }
  if (
    dataview.config?.type === DataviewType.HeatmapAnimated ||
    dataview.config?.type === DataviewType.HeatmapStatic
  ) {
    return {
      LayerClass: FourwingsLayer,
      props: resolveDeckFourwingsLayerProps(
        dataview as ResolvedFourwingsDataviewInstance,
        globalConfig
      ),
    }
  }
  if (dataview.config?.type === DataviewType.FourwingsVector) {
    return {
      LayerClass: FourwingsVectorsTileLayer,
      props: resolveDeckVectorsLayerProps(
        dataview as ResolvedFourwingsDataviewInstance,
        globalConfig
      ),
    }
  }
  if (dataview.config?.type === DataviewType.Context) {
    return {
      LayerClass: ContextLayer,
      props: resolveDeckContextLayerProps(
        dataview as ResolvedContextDataviewInstance,
        globalConfig
      ),
    }
  }
  if (dataview.config?.type === DataviewType.Polygons) {
    return {
      LayerClass: PolygonsLayer,
      props: resolveDeckPolygonsLayerProps(dataview, globalConfig),
    }
  }
  if (dataview.config?.type === DataviewType.UserContext) {
    return {
      LayerClass: UserContextTileLayer,
      props: resolveDeckUserContextLayerProps(
        dataview as ResolvedContextDataviewInstance,
        globalConfig
      ),
    }
  }
  if (dataview.config?.type === DataviewType.UserPoints) {
    return {
      LayerClass: UserPointsTileLayer,
      props: resolveDeckUserPointsLayerProps(
        dataview as ResolvedContextDataviewInstance,
        globalConfig
      ),
    }
  }
  if (dataview.config?.type === DataviewType.FourwingsTileCluster) {
    return {
      LayerClass: FourwingsClustersLayer,
      props: resolveDeckFourwingsClustersLayerProps(dataview, globalConfig),
    }
  }
  if (dataview.config?.type === DataviewType.Track) {
    if (dataview.category === DataviewCategory.User) {
      return {
        LayerClass: UserTracksLayer,
        props: resolveDeckUserTracksLayerProps(
          dataview as ResolvedContextDataviewInstance,
          globalConfig
        ),
      }
    }
    return { LayerClass: VesselLayer, props: resolveDeckVesselLayerProps(dataview, globalConfig) }
  }
  if (dataview.config?.type === DataviewType.Workspaces) {
    return {
      LayerClass: WorkspacesLayer,
      props: resolveDeckWorkspacesLayerProps(dataview, globalConfig),
    }
  }
  throw new Error(`Unknown deck layer generator type: ${dataview.config?.type}`)
}

export const dataviewToDeckLayer = (
  dataview: ResolvedDataviewInstance,
  globalConfig: ResolverGlobalConfig
): AnyDeckLayer => {
  const { LayerClass, props } = dataviewToDeckLayerResolved(dataview, globalConfig)
  return new LayerClass(props)
}
