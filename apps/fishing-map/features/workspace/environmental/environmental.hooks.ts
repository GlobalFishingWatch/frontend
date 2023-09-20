import { useCallback, useEffect } from 'react'
import { ckmeans, sample, mean, standardDeviation } from 'simple-statistics'
import { useSelector } from 'react-redux'
import { COLOR_RAMP_DEFAULT_NUM_STEPS, HeatmapLayerMeta } from '@globalfishingwatch/layer-composer'
import { MiniglobeBounds } from '@globalfishingwatch/ui-components'
import { filterFeaturesByBounds } from '@globalfishingwatch/data-transforms'
import { aggregateFeatures, ChunkFeature } from '@globalfishingwatch/features-aggregate'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectActiveNonTrackEnvironmentalDataviews } from 'features/dataviews/dataviews.selectors'
import {
  DataviewFeature,
  areDataviewsFeatureLoaded,
  useMapDataviewFeatures,
} from 'features/map/map-sources.hooks'
import { useMapBounds } from 'features/map/map-viewport.hooks'

export const useEnvironmentalBreaksUpdate = () => {
  const dataviews = useSelector(selectActiveNonTrackEnvironmentalDataviews)
  const { bounds } = useMapBounds()
  const dataviewFeatures = useMapDataviewFeatures(dataviews)
  const sourcesLoaded = areDataviewsFeatureLoaded(dataviewFeatures)
  const layersFilterHash = dataviews
    .flatMap(({ config }) => `${config?.minVisibleValue}-${config?.maxVisibleValue}`)
    .join(',')
  const { upsertDataviewInstance } = useDataviewInstancesConnect()

  const updateBreaksByViewportValues = useCallback(
    (dataviewFeatures: DataviewFeature[], bounds: MiniglobeBounds) => {
      const dataviewInstances = dataviewFeatures?.flatMap(
        ({ chunksFeatures, dataviewsId, metadata }) => {
          const { features } = chunksFeatures?.[0] || ({} as ChunkFeature)
          if (features && features.length) {
            const config = dataviews.find(({ id }) => dataviewsId.includes(id))?.config
            const filteredFeatures = filterFeaturesByBounds(features, bounds)
            const rawData = aggregateFeatures(filteredFeatures, metadata as HeatmapLayerMeta)
            const data = rawData.filter((d) => {
              const matchesMin =
                config?.minVisibleValue !== undefined ? d >= config?.minVisibleValue : true
              const matchesMax =
                config?.maxVisibleValue !== undefined ? d <= config?.maxVisibleValue : true
              return matchesMin && matchesMax
            })

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
              // Needed to ensure there is the correct num of steps in areas where
              // ck returns less than COLOR_RAMP_DEFAULT_NUM_STEPS
              const ckWithAllSteps = [...new Array(COLOR_RAMP_DEFAULT_NUM_STEPS)].map((_, i) => {
                return ck[i] || 0
              })
              let cleanBreaks = [] as number[]
              ckWithAllSteps.forEach((k, i) => {
                if (i >= 1) {
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
    [dataviews, upsertDataviewInstance]
  )

  useEffect(() => {
    if (sourcesLoaded) {
      updateBreaksByViewportValues(dataviewFeatures, bounds)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourcesLoaded, layersFilterHash])
}
