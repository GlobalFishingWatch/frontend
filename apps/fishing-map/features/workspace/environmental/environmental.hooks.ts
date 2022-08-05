import { useCallback, useEffect } from 'react'
import { ckmeans, sample, mean, standardDeviation } from 'simple-statistics'
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
              const dataSampled = data.length > 1000 ? sample(data, 1000, Math.random) : data
              // filter data to 2 standard deviations from mean to remove outliers
              const meanValue = mean(dataSampled)
              const standardDeviationValue = standardDeviation(dataSampled)
              const upperCut = meanValue + standardDeviationValue * 2
              const lowerCut = meanValue - standardDeviationValue * 2
              const dataFiltered = dataSampled.filter((a) => a >= lowerCut && a <= upperCut)
              const steps = Math.min(dataFiltered.length, COLOR_RAMP_DEFAULT_NUM_STEPS - 1)
              // using ckmeans as jenks
              const ck = ckmeans(dataFiltered, steps).map(([clusterFirst]) =>
                parseFloat(clusterFirst.toFixed(3))
              )

              let cleanBreaks = []
              ck.forEach((k, i) => {
                if (i > 1) {
                  const cleanBreak =
                    k === 0 || k <= cleanBreaks?.[i - 1] ? cleanBreaks[i - 1] + 0.01 : k
                  cleanBreaks.push(cleanBreak)
                } else {
                  cleanBreaks.push(k)
                }
              })

              return {
                id: dataviewsId[0],
                config: {
                  breaks: cleanBreaks,
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
