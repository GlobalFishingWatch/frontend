import { createSelector } from '@reduxjs/toolkit'
import { Generators } from '@globalfishingwatch/layer-composer'
import { isWorkspaceEditorPage } from 'routes/routes.selectors'
import { selectAllAOI } from 'features/areas-of-interest/areas-of-interest.slice'
import { selectCurrentWorkspace } from 'features/workspaces/workspaces.slice'
import { selectCurrentWorkspaceDataviews } from 'features/dataviews/dataviews.selectors'
import { selectGeneratorsConfig } from './map.slice'

const API_GATEWAY = 'https://gateway.api.dev.globalfishingwatch.org'

export const getAOIGeneratorsConfig = createSelector(
  [selectAllAOI, selectCurrentWorkspace],
  (aoiList, currentWorkspace) => {
    if (!aoiList) return
    return aoiList
      .filter((aoi) => !currentWorkspace || currentWorkspace.aoiId === aoi.id)
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
  [selectCurrentWorkspaceDataviews, isWorkspaceEditorPage],
  (dataviews, currentWorkspace) => {
    if (!dataviews) return

    return dataviews
      .map((dataview) => {
        const tilesEndpoint = dataview.dataset?.endpoints?.find(
          (endpoint) => endpoint.id === 'user-context-tiles'
        )
        if (!tilesEndpoint) return null
        return {
          type: Generators.Type.GL,
          id: `user-context-${dataview.id}`,
          sources: [
            {
              type: 'vector',
              tiles: [
                API_GATEWAY + tilesEndpoint.pathTemplate.replace(/{{/g, '{').replace(/}}/g, '}'),
              ],
            },
          ],
          layers: [
            {
              type: 'line',
              paint: {
                'line-color': 'red',
                'line-width': 3,
              },
              'source-layer': `user-context-${dataview.id}`,
            },
          ],
        }
      })
      .filter((g) => g !== null) as Generators.GlGeneratorConfig[]
  }
)

export const getGeneratorsConfig = createSelector(
  [selectGeneratorsConfig, getAOIGeneratorsConfig, getDataviewsGeneratorsConfig],
  (generators, aoiGenerators, dataviewsGenerators) => {
    let allGenerators = [...generators]
    if (aoiGenerators) allGenerators = allGenerators.concat(aoiGenerators)
    if (dataviewsGenerators) allGenerators = allGenerators.concat(dataviewsGenerators)
    return allGenerators
  }
)
