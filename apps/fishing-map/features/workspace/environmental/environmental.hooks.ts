import { useCallback, useEffect } from 'react'
import { ckmeans } from 'simple-statistics'
import { useSelector } from 'react-redux'
import { COLOR_RAMP_DEFAULT_NUM_STEPS } from '@globalfishingwatch/layer-composer'
import { MiniglobeBounds } from '@globalfishingwatch/ui-components'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectActiveEnvironmentalDataviews } from 'features/dataviews/dataviews.selectors'
import { DataviewFeature, useMapDataviewFeatures } from 'features/map/map-sources.hooks'
import { aggregateFeatures } from 'features/workspace/environmental/environmental.utils'
import { useMapBounds } from 'features/map/map-viewport.hooks'
import { filterByViewport } from 'features/map/map.utils'

export const useEnvironmentalBreaksUpdate = () => {
  const dataviews = useSelector(selectActiveEnvironmentalDataviews)
  const { bounds } = useMapBounds()
  const dataviewFeatures = useMapDataviewFeatures(dataviews)
  const sourcesLoaded =
    dataviewFeatures?.length > 0 ? dataviewFeatures.every(({ loaded }) => loaded) : false
  const { upsertDataviewInstance } = useDataviewInstancesConnect()

  const updateBreaksByViewportValues = useCallback(
    (dataviewFeatures: DataviewFeature[], bounds: MiniglobeBounds) => {
      const dataviewInstances = dataviewFeatures?.flatMap(({ features, dataviewId, metadata }) => {
        if (features && features.length) {
          const filteredFeatures = filterByViewport(features, bounds)
          const data = aggregateFeatures(filteredFeatures, metadata)
          const steps = Math.min(data.length, COLOR_RAMP_DEFAULT_NUM_STEPS - 1)
          // TODO review if sample the features is needed by performance
          // const featuresSample =
          //   features.length > 100
          //     ? sample(features, Math.round(features.length / 100), Math.random)
          //     : features
          // using ckmeans as jenks
          const ck = ckmeans(data, steps).map(([clusterFirst]) => clusterFirst)
          return {
            id: dataviewId,
            config: {
              opacity: undefined,
              breaks: ck,
            },
          }
        }
        return []
      })
      if (dataviewInstances) {
        upsertDataviewInstance(dataviewInstances)
      }
    },
    [upsertDataviewInstance]
  )

  const hideLayerWhileLoading = useCallback(
    (dataviews) => {
      const dataviewInstances = dataviews?.flatMap((dataview) => {
        return {
          id: dataview.id,
          config: {
            opacity: 0,
          },
        }
      })
      if (dataviewInstances) {
        upsertDataviewInstance(dataviewInstances)
      }
    },
    [upsertDataviewInstance]
  )

  useEffect(() => {
    if (sourcesLoaded) {
      updateBreaksByViewportValues(dataviewFeatures, bounds)
    } else {
      hideLayerWhileLoading(dataviews)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourcesLoaded])
}
