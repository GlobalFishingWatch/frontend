import { useCallback, useEffect } from 'react'
import { ckmeans, sample } from 'simple-statistics'
import { useSelector } from 'react-redux'
import { COLOR_RAMP_DEFAULT_NUM_STEPS } from '@globalfishingwatch/layer-composer'
import { MiniglobeBounds } from '@globalfishingwatch/ui-components'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectActiveNonTrackEnvironmentalDataviews } from 'features/dataviews/dataviews.selectors'
import {
  DataviewFeature,
  areDataviewsFeatureLoaded,
  useMapDataviewFeatures,
  DataviewChunkFeature,
} from 'features/map/map-sources.hooks'
import { aggregateFeatures } from 'features/workspace/environmental/environmental.utils'
import { useMapBounds } from 'features/map/map-viewport.hooks'
import { filterByViewport } from 'features/map/map.utils'

export const useEnvironmentalBreaksUpdate = () => {
  const dataviews = useSelector(selectActiveNonTrackEnvironmentalDataviews)
  const { bounds } = useMapBounds()
  const dataviewFeatures = useMapDataviewFeatures(dataviews)
  const sourcesLoaded = areDataviewsFeatureLoaded(dataviewFeatures)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()

  const updateBreaksByViewportValues = useCallback(
    (dataviewFeatures: DataviewFeature[], bounds: MiniglobeBounds) => {
      const dataviewInstances = dataviewFeatures?.flatMap(
        ({ chunksFeatures, dataviewsId, metadata }) => {
          const { features } = chunksFeatures?.[0] || ({} as DataviewChunkFeature)
          if (features && features.length) {
            const filteredFeatures = filterByViewport(features, bounds)
            const data = aggregateFeatures(filteredFeatures, metadata)
            if (data && data.length) {
              const steps = Math.min(data.length, COLOR_RAMP_DEFAULT_NUM_STEPS)
              const dataSampled =
                data.length > 1000 ? sample(data, Math.round(data.length / 100), Math.random) : data

              // using ckmeans as jenks
              const ck = ckmeans(dataSampled, steps).map(([clusterFirst]) =>
                parseFloat(clusterFirst.toFixed(2))
              )
              return {
                id: dataviewsId[0],
                config: {
                  breaks: ck,
                },
              }
            }
            return []
          }
          return []
        }
      )
      if (dataviewInstances) {
        upsertDataviewInstance(dataviewInstances)
      }
    },
    [upsertDataviewInstance]
  )

  useEffect(() => {
    if (sourcesLoaded) {
      updateBreaksByViewportValues(dataviewFeatures, bounds)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourcesLoaded])
}
