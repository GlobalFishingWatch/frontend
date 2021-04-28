import { createSelector } from '@reduxjs/toolkit'
// import { Generators } from '@globalfishingwatch/layer-composer'
import { getDataviewsGeneratorConfigs } from '@globalfishingwatch/dataviews-client'
// import { selectHiddenLayers, selectSatellite } from 'routes/routes.selectors'
import { selectDataviewInstancesResolved } from 'features/dataviews/dataviews.selectors'
import { BACKGROUND_LAYER, OFFLINE_LAYERS } from 'features/dataviews/dataviews.config'

const generatorOptions = {
  // heatmapAnimatedMode,
  // highlightedTime,
  // timeRange: staticTime,
  // debug: debugOptions.debug,
  // mergedActivityGeneratorId: MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID,
}

// const generatorsConfig = getDataviewsGeneratorConfigs(dataviews, generatorOptions, resources)

/**
 * Select the base layers that are not hidden by the user
 */
export const selectMapLayers = createSelector(
  [selectDataviewInstancesResolved],
  (dataviewsInstances) => {
    if (!dataviewsInstances) return
    return getDataviewsGeneratorConfigs(
      dataviewsInstances,
      generatorOptions
      // resources
    )
  }
)
/**
 * Merge all the layers needed to render the map
 */
export const getLayerComposerLayers = createSelector([selectMapLayers], (mapLayers = []) => {
  return [...BACKGROUND_LAYER, ...OFFLINE_LAYERS, ...mapLayers]
})
