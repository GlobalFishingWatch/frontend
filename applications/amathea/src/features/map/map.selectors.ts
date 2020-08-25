import { createSelector } from '@reduxjs/toolkit'
import { Generators } from '@globalfishingwatch/layer-composer'
import { getDataviewsGeneratorConfigs } from '@globalfishingwatch/react-hooks/dist/use-dataviews-layers'
import { selectHiddenDataviews } from 'routes/routes.selectors'
import { selectAllAOI } from 'features/areas-of-interest/areas-of-interest.slice'
import { selectCurrentWorkspace } from 'features/workspaces/workspaces.slice'
import { selectCurrentWorkspaceDataviews } from 'features/dataviews/dataviews.selectors'
import { selectGeneratorsConfig } from './map.slice'

export const getCurrentWorkspaceAOIGeneratorsConfig = createSelector(
  [selectCurrentWorkspace],
  (currentWorkspace) => {
    if (!currentWorkspace || !currentWorkspace.aoi) return
    const generator: Generators.GlGeneratorConfig = {
      type: Generators.Type.GL,
      id: `aoi-${currentWorkspace.aoi.id}`,
      sources: [
        {
          type: 'geojson',
          data: currentWorkspace.aoi.geometry,
        },
      ],
      layers: [
        {
          type: 'line',
          paint: {
            'line-color': 'white',
            'line-width': 2,
          },
        },
      ],
    }
    return generator
  }
)
export const getAllAOIGeneratorsConfig = createSelector(
  [selectAllAOI, selectCurrentWorkspace],
  (aoiList, currentWorkspace) => {
    if (!aoiList) return
    return aoiList
      .filter((aoi) => !currentWorkspace || currentWorkspace?.aoi?.id === aoi.id)
      .map((aoi) => {
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
                'line-color': 'white',
                'line-width': 2,
              },
            },
          ],
        }
      }) as Generators.GlGeneratorConfig[]
  }
)

export const getDataviewsGeneratorsConfig = createSelector(
  [selectCurrentWorkspaceDataviews, selectHiddenDataviews],
  (dataviews, hiddenDataviews) => {
    if (!dataviews || !dataviews.length) return
    const filteredDataviews = dataviews.filter((dataview) => !hiddenDataviews.includes(dataview.id))

    const generators = getDataviewsGeneratorConfigs(filteredDataviews)
    return generators
  }
)

export const getGeneratorsConfig = createSelector(
  [
    selectGeneratorsConfig,
    getAllAOIGeneratorsConfig,
    getCurrentWorkspaceAOIGeneratorsConfig,
    getDataviewsGeneratorsConfig,
  ],
  (generators, aoiGenerators, currentWorkspaceAOI, dataviewsGenerators) => {
    let allGenerators = [...generators]
    if (dataviewsGenerators) allGenerators = allGenerators.concat(dataviewsGenerators)
    if (aoiGenerators) allGenerators = allGenerators.concat(aoiGenerators)
    if (currentWorkspaceAOI) allGenerators.push(currentWorkspaceAOI)
    return allGenerators
  }
)
