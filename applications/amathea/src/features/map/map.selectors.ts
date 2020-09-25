import { createSelector } from '@reduxjs/toolkit'
import { Generators } from '@globalfishingwatch/layer-composer'
import { getDataviewsGeneratorConfigs } from '@globalfishingwatch/react-hooks/dist/use-dataviews-layers'
import { selectHiddenDataviews } from 'routes/routes.selectors'
import { selectAllAOI } from 'features/areas-of-interest/areas-of-interest.slice'
import { selectCurrentWorkspace, selectAllWorkspaces } from 'features/workspaces/workspaces.slice'
import { selectCurrentWorkspaceDataviewsResolved } from 'features/dataviews/dataviews.selectors'
import { selectGeneratorsConfig } from './map.slice'

export const getAOIGeneratorsConfig = createSelector(
  [selectAllWorkspaces, selectCurrentWorkspace, selectAllAOI],
  (allWorkspaces, currentWorkspace, allAOI) => {
    if (!allAOI) return
    const workspaces = currentWorkspace ? [currentWorkspace] : allWorkspaces
    if (!workspaces?.length) return

    return workspaces.flatMap((workspace) => {
      const aoi = workspace.aoi?.geometry
        ? workspace.aoi
        : allAOI.find((aoi) => aoi.id === workspace.aoi?.id)
      if (!aoi) return []
      return {
        type: Generators.Type.GL,
        id: `aoi-${aoi.id}`,
        sources: [
          {
            type: 'geojson',
            data: aoi.geometry,
          },
        ],
        layers: [
          {
            type: 'line',
            paint: {
              'line-color': currentWorkspace ? 'white' : workspace.color,
              'line-width': 2,
            },
          },
        ],
      }
    }) as Generators.GlGeneratorConfig[]
  }
)

export const getDataviewsGeneratorsConfig = createSelector(
  [selectCurrentWorkspaceDataviewsResolved, selectHiddenDataviews],
  (dataviews, hiddenDataviews) => {
    if (!dataviews || !dataviews.length) return
    const filteredDataviews = dataviews.filter(
      (dataview) =>
        !hiddenDataviews.includes(dataview.id) &&
        !dataview?.datasets?.some((dataset) => dataset.status === 'error')
    )

    const generators = getDataviewsGeneratorConfigs(filteredDataviews)
    // Reverse to see the first layer on top
    return generators.reverse()
  }
)

export const getGeneratorsConfig = createSelector(
  [selectGeneratorsConfig, getAOIGeneratorsConfig, getDataviewsGeneratorsConfig],
  (generators, aoiGenerators, dataviewsGenerators) => {
    let allGenerators = [...generators]
    if (dataviewsGenerators) allGenerators = allGenerators.concat(dataviewsGenerators)
    if (aoiGenerators) allGenerators = allGenerators.concat(aoiGenerators)
    return allGenerators
  }
)
