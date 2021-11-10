import React, { useEffect, useState, useRef, useCallback } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
// eslint-disable-next-line import/no-webpack-loader-syntax
import createTimebarActivityGraphWorker from 'workerize-loader!./TimebarActivityGraph.worker.ts'
import { TimebarStackedActivity } from '@globalfishingwatch/timebar'
import { useDebounce, useSmallScreen } from '@globalfishingwatch/react-hooks'
import {
  TimeChunk,
  TimeChunks,
  TEMPORALGRID_SOURCE_LAYER_INTERACTIVE,
} from '@globalfishingwatch/layer-composer'
import { MiniglobeBounds } from '@globalfishingwatch/ui-components'
import { MapboxEvent, MapSourceDataEvent } from '@globalfishingwatch/mapbox-gl'
import { MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID } from '@globalfishingwatch/dataviews-client'
import { useMapBounds, mglToMiniGlobeBounds } from 'features/map/map-viewport.hooks'
import { selectActiveActivityDataviews } from 'features/dataviews/dataviews.selectors'
import useMapInstance from 'features/map/map-context.hooks'
import styles from './Timebar.module.css'
import * as TimebarActivityGraphWorker from './TimebarActivityGraph.worker'

const getMetadata = (style: any) => {
  const metadata =
    style?.metadata?.generatorsMetadata?.[MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID]
  if (metadata?.timeChunks) {
    return metadata
  }
  return null
}

const { getTimeseries } = createTimebarActivityGraphWorker<typeof TimebarActivityGraphWorker>()

const TimebarActivityGraph = () => {
  const temporalGridDataviews = useSelector(selectActiveActivityDataviews)
  const [stackedActivity, setStackedActivity] = useState<any>()
  const { bounds } = useMapBounds()
  const debouncedBounds = useDebounce(bounds, 1000)
  const isSmallScreen = useSmallScreen()
  const attachedListener = useRef<boolean>(false)
  const map = useMapInstance()
  const computeStackedActivity = useCallback(
    (metadata: any, bounds: MiniglobeBounds) => {
      if (!map || !metadata) return
      const numSublayers = metadata.numSublayers
      const timeChunks = metadata.timeChunks as TimeChunks
      const allChunksFeatures = metadata.timeChunks.chunks.map((chunk: TimeChunk) => {
        const features = map.querySourceFeatures(chunk.sourceId as string, {
          sourceLayer: TEMPORALGRID_SOURCE_LAYER_INTERACTIVE,
        })

        const serializedFeatures = features.map(({ properties, geometry }) => ({
          type: 'Feature' as any,
          properties,
          geometry,
        }))

        return {
          features: serializedFeatures,
          quantizeOffset: chunk.quantizeOffset,
        }
      })

      const getTimeseriesAsync = async () => {
        const timeseries = await getTimeseries(
          allChunksFeatures,
          bounds,
          numSublayers,
          timeChunks.interval,
          metadata.visibleSublayers
        )
        if (attachedListener.current) {
          setStackedActivity(timeseries)
        }
      }
      getTimeseriesAsync()
    },
    [map]
  )

  const sourcesLoadedTimeout = useRef<number>(NaN)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (!map || attachedListener.current || isSmallScreen) return
    attachedListener.current = true

    const isEventSourceActiveChunk = (e: MapSourceDataEvent) => {
      const style = (e as any).style.stylesheet
      const metadata = getMetadata(style)
      if (!metadata) {
        return {
          isActive: false,
        }
      }
      const chunkSourceIds: string[] = metadata.timeChunks.chunks.map((c: TimeChunk) => c.sourceId)
      return {
        isActive: chunkSourceIds.includes(e.sourceId),
        metadata,
      }
    }
    map.on('data', (e: MapSourceDataEvent) => {
      const { metadata, isActive } = isEventSourceActiveChunk(e)
      if (isActive && (e as any).previousState !== 'reloading') {
        if (attachedListener.current) setLoading(true)
        if (!isNaN(sourcesLoadedTimeout.current)) {
          window.clearTimeout(sourcesLoadedTimeout.current)
        }
        sourcesLoadedTimeout.current = window.setTimeout(() => {
          computeStackedActivity(metadata, mglToMiniGlobeBounds(map.getBounds()))
        }, 2000)
      }
    })
    map.on('dataloading', (e: MapSourceDataEvent) => {
      const { isActive } = isEventSourceActiveChunk(e)
      if (isActive && attachedListener.current) setLoading(true)
    })
    map.on('idle', (e: MapboxEvent) => {
      // If there's still a timer running when idle, skip it and render graph immediately
      if (!isNaN(sourcesLoadedTimeout.current)) {
        window.clearTimeout(sourcesLoadedTimeout.current)
        sourcesLoadedTimeout.current = NaN
        const style = (e.target as any).style.stylesheet
        const metadata = getMetadata(style)

        computeStackedActivity(metadata, mglToMiniGlobeBounds(map.getBounds()))
      }

      if (attachedListener.current) setLoading(false)
    })
    return () => {
      attachedListener.current = false
    }
  }, [map, computeStackedActivity, isSmallScreen])

  useEffect(() => {
    // Need to check for first load to ensure getStyle doesn't crash
    if (!map || !map.loaded || !map.loaded() || !debouncedBounds || isSmallScreen) return
    const metadata = getMetadata(map?.getStyle())
    computeStackedActivity(metadata, debouncedBounds)
  }, [debouncedBounds, computeStackedActivity, map, isSmallScreen])

  const dataviewsColors = temporalGridDataviews?.map((dataview) => dataview.config?.color)

  if (!stackedActivity) return null
  return (
    <div className={cx({ [styles.loading]: loading })}>
      <TimebarStackedActivity
        key="stackedActivity"
        data={stackedActivity}
        colors={dataviewsColors}
        numSublayers={temporalGridDataviews?.length}
      />
    </div>
  )
}

export default TimebarActivityGraph
