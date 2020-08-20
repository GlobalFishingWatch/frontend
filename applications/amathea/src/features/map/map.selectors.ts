import { createSelector } from '@reduxjs/toolkit'
import { Generators } from '@globalfishingwatch/layer-composer'
import { selectHiddenDataviews } from 'routes/routes.selectors'
import { selectAllAOI } from 'features/areas-of-interest/areas-of-interest.slice'
import { selectCurrentWorkspace } from 'features/workspaces/workspaces.slice'
import { selectCurrentWorkspaceDataviews } from 'features/dataviews/dataviews.selectors'
import { selectGeneratorsConfig } from './map.slice'

const API_GATEWAY = 'https://gateway.api.dev.globalfishingwatch.org'

export const getCurrentWorkspaceAOIGeneratorsConfig = createSelector(
  [selectCurrentWorkspace],
  (currentWorkspace) => {
    if (!currentWorkspace || !currentWorkspace.aoi) return
    const generator: Generators.GlGeneratorConfig = {
      type: Generators.Type.GL,
      id: `aoi-${currentWorkspace.aoiId}`,
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
  [selectCurrentWorkspaceDataviews, selectHiddenDataviews],
  (dataviews, hiddenDataviews) => {
    if (!dataviews || !dataviews.length) return
    return dataviews
      .filter((dataview) => !hiddenDataviews.includes(dataview.id))
      .map((dataview) => {
        if (!dataview.dataset) return null

        const contextTilesEndpoint = dataview.dataset?.endpoints?.find(
          (endpoint) => endpoint.id === 'user-context-tiles'
        )
        if (contextTilesEndpoint) {
          const generator: Generators.UserContextGeneratorConfig = {
            id: dataview.dataset.id as string,
            type: Generators.Type.UserContext,
            color: dataview.defaultView?.color as string,
            tilesUrl: contextTilesEndpoint.pathTemplate,
          }
          return generator
        }

        const fourwingsTilesEndpoint = dataview.dataset?.endpoints?.find(
          (endpoint) => endpoint.id === '4wings-tiles'
        )
        if (fourwingsTilesEndpoint) {
          return {
            type: Generators.Type.GL,
            id: `fourwings-${dataview.id}`,
            sources: [
              {
                maxzoom: 12,
                type: 'vector',
                tiles: [
                  API_GATEWAY +
                    fourwingsTilesEndpoint.pathTemplate
                      .replace('{{type}}', 'heatmap')
                      .replace(/{{/g, '{')
                      .replace(/}}/g, '}') +
                    `?format=mvt&proxy=true&temporal-aggregation=true`,
                ],
              },
            ],
            layers: [
              {
                type: 'fill',
                paint: {
                  // 'fill-color': dataview.defaultView?.color,
                  'fill-color': [
                    'interpolate',
                    ['linear'],
                    ['to-number', ['get', '17532']],
                    0,
                    '#002457',
                    20,
                    '#163F89',
                    24,
                    '#0F6F97',
                    25,
                    '#07BBAE',
                    26,
                    '#00FFC3',
                    28,
                    '#FFFFFF',
                  ],
                },
                'source-layer': dataview.dataset?.id,
              },
            ],
          }
        }
        return null
      })
      .filter((g) => g !== null) as Generators.GlGeneratorConfig[]
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
