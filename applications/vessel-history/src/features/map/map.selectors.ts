import { createSelector } from '@reduxjs/toolkit'
import { Generators } from '@globalfishingwatch/layer-composer'
import { BACKGROUND_LAYER, DEFAULT_DATAVIEWS } from 'data/config'
import { selectHiddenLayers, selectSatellite } from 'routes/routes.selectors'

/**
 * Select the base layers that are not hidden by the user
 */
export const selectMapLayers = createSelector(
  [selectHiddenLayers, selectSatellite],
  (hiddenLayers, satellite) => {
    const dataviews: any = DEFAULT_DATAVIEWS.map((dataview) => {
      return {
        ...dataview,
        basemap:
          dataview.type !== Generators.Type.Basemap
            ? dataview.type
            : satellite
            ? Generators.BasemapType.Satellite
            : Generators.BasemapType.Default,
        visible: !hiddenLayers.includes(dataview.id),
      }
    })
    return dataviews
  }
)
/**
 * Merge all the layers needed to render the map
 */
export const getLayerComposerLayers = createSelector([selectMapLayers], (mapLayers) => {
  return [...BACKGROUND_LAYER, ...mapLayers]
})
