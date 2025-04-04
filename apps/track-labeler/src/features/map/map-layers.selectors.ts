import { createSelector } from 'reselect'

import { CONTEXT_LAYERS_IDS } from '../../data/config'
import { selectHiddenLayers, selectIsSatelliteBasemap } from '../../routes/routes.selectors'

import dataviews from './map-layers.dataviews'

export const getContextualLayersDataviews = createSelector(
  [selectHiddenLayers, selectIsSatelliteBasemap],
  (hiddenLayers, isSatelliteBasemap) => {
    const contextualLayersDataviews = dataviews.flatMap((dataview) => {
      const visible = !hiddenLayers.includes(dataview.id)
      if (isSatelliteBasemap && dataview.id === CONTEXT_LAYERS_IDS.basemap) {
        return {
          ...dataview,
          config: {
            ...dataview.config,
            visible,
            basemap: 'satellite',
          },
        }
      }
      return {
        ...dataview,
        config: {
          ...dataview.config,
          visible,
        },
      }
    })
    return contextualLayersDataviews
  }
)
