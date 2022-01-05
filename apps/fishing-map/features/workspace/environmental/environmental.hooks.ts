import { useCallback, useEffect } from 'react'
import { ckmeans } from 'simple-statistics'
import { useSelector } from 'react-redux'
import {
  COLOR_RAMP_DEFAULT_NUM_STEPS,
  ExtendedStyle,
  pickActiveTimeChunk,
  TimeChunks,
} from '@globalfishingwatch/layer-composer'
import { useMapIdle } from 'features/map/map-features.hooks'
import useMapInstance from 'features/map/map-context.hooks'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { getDataviewViewportFeatures } from 'features/workspace/environmental/environmental.utils'
import { selectEnvironmentalDataviews } from 'features/dataviews/dataviews.selectors'
import { useMapStyle } from 'features/map/map-style.hooks'

export const useEnvironmentalBreaksUpdate = () => {
  const idle = useMapIdle()
  const map = useMapInstance()
  const mapStyle = useMapStyle()
  const dataviews = useSelector(selectEnvironmentalDataviews)
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
    if (idle) {
      updateBreaksByViewportValues(dataviews)
    } else {
      hideLayerWhileLoading(dataviews)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idle])

  useEffect(() => {
    if (!map) return
    const setIdleState = (e) => {
      if (e.sourceId === 'mergedAnimatedHeatmap-heatmapchunk_10days') {
        console.log(e)
      }
    }
    if (map) {
      console.log('adds')
      map.on('sourcetilesdata', setIdleState)
    }
    const detachListeners = () => {
      console.log('removes')
      map.off('sourcetilesdata', setIdleState)
      // map.off('sourcedata', resetIdleState)
    }

    return detachListeners
  }, [map])
}
