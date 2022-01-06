import { useCallback, useEffect } from 'react'
import { ckmeans } from 'simple-statistics'
import { useSelector } from 'react-redux'
import { COLOR_RAMP_DEFAULT_NUM_STEPS } from '@globalfishingwatch/layer-composer'
import useMapInstance from 'features/map/map-context.hooks'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import {
  getDataviewGeneratorMeta,
  getDataviewViewportFeatures,
} from 'features/workspace/environmental/environmental.utils'
import { selectEnvironmentalDataviews } from 'features/dataviews/dataviews.selectors'
import { useMapSourceTilesLoaded } from 'features/map/map-sources.hooks'

export const useEnvironmentalBreaksUpdate = () => {
  const map = useMapInstance()
  const dataviews = useSelector(selectEnvironmentalDataviews)
  const sources = dataviews.flatMap(
    (dataview) =>
      getDataviewGeneratorMeta(map, dataview.id)?.timeChunks?.chunks?.flatMap(
        ({ sourceId }) => sourceId || []
      ) || []
  )
  const sourcesLoaded = useMapSourceTilesLoaded(sources)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()

  const updateBreaksByViewportValues = useCallback(
    (dataviews) => {
      const dataviewInstances = dataviews?.flatMap((dataview) => {
        const features = getDataviewViewportFeatures(map, dataview.id)
        if (features && features.length) {
          const steps = Math.min(features.length, COLOR_RAMP_DEFAULT_NUM_STEPS - 1)
          // TODO review if sample the features is needed by performance
          // const featuresSample =
          //   features.length > 100
          //     ? sample(features, Math.round(features.length / 100), Math.random)
          //     : features
          // using ckmeans as jenks
          const ck = ckmeans(features, steps).map(([clusterFirst]) => clusterFirst)
          return {
            id: dataview.id,
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
    [map, upsertDataviewInstance]
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
      updateBreaksByViewportValues(dataviews)
    } else {
      hideLayerWhileLoading(dataviews)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourcesLoaded])
}
