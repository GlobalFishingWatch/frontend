import { createSelector } from '@reduxjs/toolkit'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { DataviewType } from '@globalfishingwatch/api-types'
import { LayerGroup } from '@globalfishingwatch/deck-layers'
import { selectCurrentWorkspacesList } from 'features/workspaces-list/workspaces-list.selectors'
import { selectMapDrawingEditId } from 'routes/routes.selectors'
import {
  selectReportPreviewBufferFeature,
  selectReportBufferFeature,
} from 'features/reports/reports.selectors'
import { WorkspaceCategory } from 'data/workspaces'
import { BUFFER_PREVIEW_COLOR } from 'data/config'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import {
  PREVIEW_BUFFER_GENERATOR_ID,
  REPORT_BUFFER_GENERATOR_ID,
  WORKSPACES_POINTS_TYPE,
  WORKSPACE_GENERATOR_ID,
} from './map.config'

const EMPTY_ARRAY: [] = []

export const selectWorkspacesListFeatures = createSelector(
  [selectCurrentWorkspacesList],
  (workspaces) => {
    if (!workspaces?.length) return []
    return workspaces.flatMap((workspace) => {
      if (!workspace.viewport) {
        return EMPTY_ARRAY
      }

      const { latitude, longitude, zoom } = workspace.viewport
      return {
        type: 'Feature',
        properties: {
          id: workspace.id,
          label: workspace.name,
          type: WORKSPACES_POINTS_TYPE,
          category: workspace.category || WorkspaceCategory.FishingActivity,
          latitude,
          longitude,
          zoom,
        },
        geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
      }
    })
  }
)
export const selectWorkspacesListDataview = createSelector(
  [selectWorkspacesListFeatures],
  (workspaceListFeatures) => {
    if (!workspaceListFeatures?.length) return
    const dataview: UrlDataviewInstance<DataviewType> = {
      id: WORKSPACE_GENERATOR_ID,
      config: {
        type: DataviewType.Polygons,
        color: '#ffffff',
        data: {
          type: 'FeatureCollection',
          features: workspaceListFeatures,
        },
      },
    }

    return dataview
  }
)

// export const selectMarineManagerGenerators = createSelector(
//   [selectIsMarineManagerLocation, selectMarineManagerDataviewInstanceResolved],
//   (isMarineManagerLocation, marineManagerDataviewInstances) => {
//     if (isMarineManagerLocation && marineManagerDataviewInstances?.length) {
//       const mpaGeneratorConfig = getDataviewsGeneratorConfigs(marineManagerDataviewInstances)
//       if (mpaGeneratorConfig) {
//         return mpaGeneratorConfig
//       }
//     }
//   }
// )

// export const selectMapWorkspacesListGenerators = createSelector(
//   [selectDefaultBasemapGenerator, selectWorkspacesListGenerator, selectMarineManagerGenerators],
//   (basemapGenerator, workspaceGenerator, marineManagerGenerators): AnyGeneratorConfig[] => {
//     const generators: AnyGeneratorConfig[] = [basemapGenerator]
//     if (marineManagerGenerators?.length) {
//       generators.push(...(marineManagerGenerators as any))
//     }
//     if (workspaceGenerator) generators.push(workspaceGenerator)
//     return generators
//   }
// )

// export const selectShowWorkspaceDetail = createSelector(
//   [selectIsWorkspaceLocation, selectIsAnyReportLocation, selectIsWorkspaceVesselLocation],
//   (isWorkspacelLocation, isReportLocation, isVesselLocation) => {
//     return isWorkspacelLocation || isReportLocation || isVesselLocation
//   }
// )

export const selectMapReportBufferDataviews = createSelector(
  [selectReportBufferFeature, selectReportPreviewBufferFeature],
  (reportBufferFeature, reportPreviewBufferFeature) => {
    const dataviews = [] as UrlDataviewInstance<DataviewType>[]
    if (reportBufferFeature?.geometry) {
      dataviews.push({
        id: REPORT_BUFFER_GENERATOR_ID,
        config: {
          type: DataviewType.Polygons,
          data: { type: 'FeatureCollection', features: [reportBufferFeature] },
          color: '#ffffff',
          visible: true,
          group: LayerGroup.OutlinePolygonsHighlighted,
        },
      })
    }
    if (reportPreviewBufferFeature?.geometry) {
      dataviews.push({
        id: PREVIEW_BUFFER_GENERATOR_ID,
        config: {
          type: DataviewType.Polygons,
          data: { type: 'FeatureCollection', features: [reportPreviewBufferFeature] },
          color: BUFFER_PREVIEW_COLOR,
          visible: true,
          group: LayerGroup.OutlinePolygonsHighlighted,
        },
      })
    }
    return dataviews
  }
)

// export const selectDefaultMapGeneratorsConfig = createSelector(
//   [],
//   (): AnyGeneratorConfig[] => {
//     if (isVesselLocation) {
//       return workspaceGenerators as any
//     }
//     if (workspaceError.status === 401 || workspaceStatus === AsyncReducerStatus.Loading) {
//       return [basemapGenerator]
//     }
//     if (showWorkspaceDetail) {
//       TODO:deck render the basemap while the workspace is loading
//       const generators =
//         workspaceStatus !== AsyncReducerStatus.Finished ? [basemapGenerator] : workspaceGenerators
//       if (isReportLocation) {
//         return [...generators, ...mapReportGenerators] as any
//       }
//       return generators as any
//     }
//     return workspaceListGenerators
//   }
// )

export const selectDrawEditDataset = createSelector(
  [selectAllDatasets, selectMapDrawingEditId],
  (datasets, datasetId) => {
    return datasets.find((dataset) => dataset.id === datasetId)
  }
)
