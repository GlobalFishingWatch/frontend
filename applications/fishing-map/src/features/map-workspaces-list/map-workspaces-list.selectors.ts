import { createSelector } from '@reduxjs/toolkit'
import { AnyLayer, Generators } from '@globalfishingwatch/layer-composer'
import { selectCurrentHighlightedWorkspaces } from 'features/workspaces-list/workspaces-list.selectors'

const basemap: Generators.BasemapGeneratorConfig = {
  id: 'landmass',
  type: Generators.Type.Basemap,
  basemap: Generators.BasemapType.Default,
}

export const selectWorkspacesListGenerators = createSelector(
  [selectCurrentHighlightedWorkspaces],
  (workspaces) => {
    if (!workspaces?.length) return

    const workspaceGenerators = workspaces.flatMap((workspace) => {
      if (!workspace.viewport) {
        return []
      }
      const { latitude, longitude } = workspace.viewport
      const generator: Generators.GlGeneratorConfig = {
        id: workspace.id,
        type: Generators.Type.GL,
        sources: [
          {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: { id: workspace.id, label: workspace.name, type: 'workspace' },
              geometry: {
                type: 'Point',
                coordinates: [longitude, latitude],
              },
            },
          },
        ],
        layers: [
          {
            type: 'circle',
            layout: {},
            paint: {
              'circle-color': '#fff',
              'circle-stroke-color': '#088',
              'circle-radius': 10,
            },
            metadata: {
              interactive: true,
            },
          } as AnyLayer,
        ],
      }
      return generator
    })
    return workspaceGenerators.length ? workspaceGenerators : undefined
  }
)

export const selectMapWorkspacesListGenerators = createSelector(
  [selectWorkspacesListGenerators],
  (workspaceGenerators) => {
    if (!workspaceGenerators) return [basemap]
    return [basemap, ...workspaceGenerators]
  }
)
