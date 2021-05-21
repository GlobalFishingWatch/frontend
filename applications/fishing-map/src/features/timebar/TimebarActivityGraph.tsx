import React, { useEffect, useState, useRef, useCallback } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { TimebarStackedActivity } from '@globalfishingwatch/timebar'
import { useDebounce, useSmallScreen } from '@globalfishingwatch/react-hooks'
import { quantizeOffsetToDate, TEMPORALGRID_SOURCE_LAYER } from '@globalfishingwatch/layer-composer'
import {
  TimeChunk,
  TimeChunks,
} from '@globalfishingwatch/layer-composer/dist/generators/heatmap/util/time-chunks'
import { getTimeSeries } from '@globalfishingwatch/fourwings-aggregate'
import { MiniglobeBounds } from '@globalfishingwatch/ui-components/dist/miniglobe'
import { MapSourceDataEvent } from '@globalfishingwatch/mapbox-gl'
import { MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID } from '@globalfishingwatch/dataviews-client'
import { useMapBounds, mglToMiniGlobeBounds } from 'features/map/map-viewport.hooks'
import { filterByViewport } from 'features/map/map.utils'
import { selectActivityDataviews } from 'features/dataviews/dataviews.selectors'
import useMapInstance from 'features/map/map-context.hooks'
import styles from './Timebar.module.css'

const getMetadata = (style: any) => {
  const metadata = style.metadata.generatorsMetadata[MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID]
  if (metadata && metadata.timeChunks) {
    return metadata
  }
  return null
}

const TimebarActivityGraph = () => {
  const temporalGridDataviews = useSelector(selectActivityDataviews)
  const [stackedActivity, setStackedActivity] = useState<any>()
  const { bounds } = useMapBounds()
  const debouncedBounds = useDebounce(bounds, 400)
  const isSmallScreen = useSmallScreen()

  const map = useMapInstance()

  const computeStackedActivity = useCallback(
    (metadata: any, bounds: MiniglobeBounds) => {
      if (!map || !metadata) return
      const numSublayers = metadata.numSublayers
      const timeChunks = metadata.timeChunks as TimeChunks
      let prevMaxFrame: number
      const allChunksValues = metadata.timeChunks.chunks.flatMap((chunk: TimeChunk) => {
        const sourceFeatures = map.querySourceFeatures(chunk.sourceId as string, {
          sourceLayer: TEMPORALGRID_SOURCE_LAYER,
        })

        const chunkQuantizeOffset = chunk.quantizeOffset
        const filteredFeatures = filterByViewport(sourceFeatures, bounds)
        if (filteredFeatures?.length > 0) {
          const { values, maxFrame } = getTimeSeries(
            filteredFeatures as any,
            numSublayers,
            chunkQuantizeOffset
          )

          const valuesTimeChunkOverlapFramesFiltered = prevMaxFrame
            ? values.filter((frameValues) => frameValues.frame > prevMaxFrame)
            : values

          prevMaxFrame = maxFrame

          const finalValues = valuesTimeChunkOverlapFramesFiltered.map((frameValues) => {
            // TODO deduplicate a frame that was already there from a previous timechunk?
            // Ideally we don't have the features not visible in 4wings but we have them
            // so this needs to be filtered by the current active ones
            const activeFrameValues = Object.fromEntries(
              Object.entries(frameValues).map(([key, value]) => {
                const cleanValue =
                  key === 'frame' || metadata.visibleSublayers[parseInt(key)] === true ? value : 0
                return [key, cleanValue]
              })
            )
            return {
              ...activeFrameValues,
              date: quantizeOffsetToDate(frameValues.frame, timeChunks.interval).getTime(),
            }
          })
          return finalValues
        } else return []
      })
      if (allChunksValues && allChunksValues.length) {
        setStackedActivity(allChunksValues)
      }
    },
    [map]
  )
  const attachedListener = useRef<boolean>(false)
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
        setLoading(true)
        if (!isNaN(sourcesLoadedTimeout.current)) {
          window.clearTimeout(sourcesLoadedTimeout.current)
        }
        sourcesLoadedTimeout.current = window.setTimeout(() => {
          computeStackedActivity(metadata, mglToMiniGlobeBounds(map.getBounds()))
        }, 1000)
      }
    })
    map.on('dataloading', (e: MapSourceDataEvent) => {
      const { isActive } = isEventSourceActiveChunk(e)
      if (isActive) setLoading(true)
    })
    map.on('idle', () => {
      setLoading(false)
    })
  }, [map, computeStackedActivity, isSmallScreen])

  useEffect(() => {
    if (!map || !debouncedBounds || isSmallScreen) return
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
