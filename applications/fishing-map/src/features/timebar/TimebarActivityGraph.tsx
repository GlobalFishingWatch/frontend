import React, { useEffect, useMemo, useState, useRef } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { TimebarStackedActivity } from '@globalfishingwatch/timebar'
import { useDebounce, useSmallScreen } from '@globalfishingwatch/react-hooks'
import { quantizeOffsetToDate } from '@globalfishingwatch/layer-composer'
import {
  TimeChunk,
  TimeChunks,
} from '@globalfishingwatch/layer-composer/dist/generators/heatmap/util/time-chunks'
import { getTimeSeries } from '@globalfishingwatch/fourwings-aggregate'
import { MiniglobeBounds } from '@globalfishingwatch/ui-components/dist/miniglobe'
import { VectorSource } from '@globalfishingwatch/mapbox-gl'
import { useMapBounds } from 'features/map/map-viewport.hooks'
import { filterByViewport } from 'features/map/map.utils'
import { useActivityTemporalgridFeatures } from 'features/map/map-features.hooks'
import { selectActivityDataviews } from 'features/dataviews/dataviews.selectors'
import { useMapStyle } from 'features/map/map.hooks'
import styles from './Timebar.module.css'

const TimebarActivityGraph = () => {
  const temporalGridDataviews = useSelector(selectActivityDataviews)
  const [stackedActivity, setStackedActivity] = useState<any>()

  const visibleTemporalGridDataviews = useMemo(
    () => (temporalGridDataviews || [])?.map((dataview) => dataview.config?.visible ?? false),
    [temporalGridDataviews]
  )

  const { bounds } = useMapBounds()
  const { sourcesFeatures, haveSourcesLoaded, sourcesMetadata } = useActivityTemporalgridFeatures()
  const style = useMapStyle()
  const debouncedBounds = useDebounce(bounds, 400)
  const isSmallScreen = useSmallScreen()

  const prevActiveSourceUrl = useRef<string>('')
  const prevDebouncedBounds = useRef<MiniglobeBounds | undefined>(debouncedBounds)
  useEffect(() => {
    if (!visibleTemporalGridDataviews?.length || isSmallScreen) {
      setStackedActivity(undefined)
      return
    }

    const activeSourceId = sourcesMetadata?.[0]?.timeChunks?.activeSourceId
    if (!activeSourceId || !debouncedBounds) {
      setStackedActivity(undefined)
      return
    }

    const features = sourcesFeatures?.[0]
    if (!features || !features.length) {
      return
    }

    let activeSourceUrl
    if (style && style.sources && sourcesMetadata && sourcesMetadata[0]) {
      const activeSource = style.sources[activeSourceId] as VectorSource
      if (activeSource && activeSource.tiles) {
        activeSourceUrl = activeSource.tiles[0]
      }
    }

    let recompute = ''
    //  Time chunk changed
    if (activeSourceUrl && activeSourceUrl !== prevActiveSourceUrl.current) {
      //  Time chunk changed and source is fully loaded
      if (haveSourcesLoaded && features && features.length) {
        recompute = 'url changed'
        prevActiveSourceUrl.current = activeSourceUrl
      }
    }

    if (prevDebouncedBounds.current !== debouncedBounds) {
      recompute = 'bounds'
    }
    prevDebouncedBounds.current = debouncedBounds

    if (recompute === '') return

    const numSublayers = sourcesMetadata[0].numSublayers
    const timeChunks = sourcesMetadata[0].timeChunks as TimeChunks
    const activeTimeChunk = timeChunks?.chunks.find((c: any) => c.active) as TimeChunk
    const chunkQuantizeOffset = activeTimeChunk.quantizeOffset

    const filteredFeatures = filterByViewport(features, debouncedBounds)
    if (filteredFeatures?.length > 0) {
      const values = getTimeSeries(filteredFeatures as any, numSublayers, chunkQuantizeOffset).map(
        (frameValues) => {
          // Ideally we don't have the features not visible in 4wings but we have them
          // so this needs to be filtered by the current active ones
          const activeFrameValues = Object.fromEntries(
            Object.entries(frameValues).map(([key, value]) => {
              const cleanValue =
                key === 'frame' || visibleTemporalGridDataviews[parseInt(key)] === true ? value : 0
              return [key, cleanValue]
            })
          )
          return {
            ...activeFrameValues,
            date: quantizeOffsetToDate(frameValues.frame, timeChunks.interval).getTime(),
          }
        }
      )
      setStackedActivity(values)
    }
  }, [
    sourcesMetadata,
    sourcesFeatures,
    haveSourcesLoaded,
    debouncedBounds,
    visibleTemporalGridDataviews,
    isSmallScreen,
    style,
  ])

  const dataviewsColors = temporalGridDataviews?.map((dataview) => dataview.config?.color)

  // Using an effect to ensure the blur loading is removed once the component has been rendered
  const [loading, setLoading] = useState(haveSourcesLoaded)

  useEffect(() => {
    setLoading(haveSourcesLoaded)
  }, [haveSourcesLoaded])

  // Use a debounced version of loading because sadly haveSourcesLoaded is briefly set to false when applyin g a style, even if there's no source update
  const debouncedLoading = useDebounce(loading, 400)
  if (!stackedActivity) return null
  return (
    <div className={cx({ [styles.loading]: !debouncedLoading })}>
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
