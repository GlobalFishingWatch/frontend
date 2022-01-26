import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useMapLegend, useDebounce, useSmallScreen } from '@globalfishingwatch/react-hooks'
// eslint-disable-next-line import/no-webpack-loader-syntax
import {
  TimebarStackedActivity,
  TimebarChartChunk,
  TimebarChartValue,
} from '@globalfishingwatch/timebar'
import {
  TimeChunk,
  TimeChunks,
  TEMPORALGRID_SOURCE_LAYER_INTERACTIVE,
} from '@globalfishingwatch/layer-composer'
import { MiniglobeBounds } from '@globalfishingwatch/ui-components'
import { MapLibreEvent, MapSourceDataEvent } from '@globalfishingwatch/maplibre-gl'
import { useMapBounds, mglToMiniGlobeBounds } from 'features/map/map-viewport.hooks'
import {
  selectActiveActivityDataviews,
  selectActiveEnvironmentalDataviews,
} from 'features/dataviews/dataviews.selectors'
import useMapInstance from 'features/map/map-context.hooks'
import { useMapStyle } from 'features/map/map-style.hooks'
import { formatNumber } from 'utils/info'
import { getTimeseries } from './timebarActivityGraph.worker'
import styles from './Timebar.module.css'
import { useActivityMetadata } from './timebar.hooks'

const TimebarActivityGraph = () => {
  const activityDataviews = useSelector(selectActiveActivityDataviews)
  const environmentalDataviews = useSelector(selectActiveEnvironmentalDataviews)
  const temporalGridDataviews = useMemo(
    () => [...activityDataviews, ...environmentalDataviews],
    [activityDataviews, environmentalDataviews]
  )
  const [stackedActivity, setStackedActivity] = useState<any>()
  const { bounds } = useMapBounds()
  const debouncedBounds = useDebounce(bounds, 1000)
  const isSmallScreen = useSmallScreen()
  const attachedListener = useRef<boolean>(false)
  const map = useMapInstance()
  const computeStackedActivity = useCallback(
    (metadata: any, bounds: MiniglobeBounds) => {
      if (!map || !metadata) {
        return
      }
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

  const metadata = useActivityMetadata()

  const sourcesLoadedTimeout = useRef<number>(NaN)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (!map || attachedListener.current || isSmallScreen) return
    attachedListener.current = true

    const isEventSourceActiveChunk = (e: MapSourceDataEvent) => {
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
    map.on('idle', (e: MapLibreEvent) => {
      // If there's still a timer running when idle, skip it and render graph immediately
      if (!isNaN(sourcesLoadedTimeout.current)) {
        window.clearTimeout(sourcesLoadedTimeout.current)
        sourcesLoadedTimeout.current = NaN

        computeStackedActivity(metadata, mglToMiniGlobeBounds(map.getBounds()))
      }

      if (attachedListener.current) setLoading(false)
    })
    return () => {
      attachedListener.current = false
    }
  }, [map, computeStackedActivity, isSmallScreen, metadata])

  useEffect(() => {
    // Need to check for first load to ensure getStyle doesn't crash
    if (!map || !map.loaded || !map.loaded() || !debouncedBounds || isSmallScreen) return
    computeStackedActivity(metadata, debouncedBounds)
  }, [debouncedBounds, computeStackedActivity, map, isSmallScreen, metadata])

  const style = useMapStyle()
  const mapLegends = useMapLegend(style, temporalGridDataviews)
  const getActivityHighlighterLabel = useCallback(
    (_: any, value: TimebarChartValue, __: any, itemIndex: number) => {
      const unit = mapLegends[itemIndex]?.unit || ''
      return `${formatNumber(value.value)} ${unit} on screen`
    },
    [mapLegends]
  )

  if (!stackedActivity) return null
  return (
    <div className={cx({ [styles.loading]: loading })}>
      <TimebarStackedActivity
        key="stackedActivity"
        timeseries={stackedActivity}
        dataviews={temporalGridDataviews}
        highlighterCallback={getActivityHighlighterLabel}
      />
    </div>
  )
}

export default TimebarActivityGraph
