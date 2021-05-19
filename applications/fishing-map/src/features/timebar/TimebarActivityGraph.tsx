import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react'
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
import { MapDataEvent, MapSourceDataEvent, VectorSource } from '@globalfishingwatch/mapbox-gl'
import { MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID } from '@globalfishingwatch/dataviews-client'
import { useMapBounds } from 'features/map/map-viewport.hooks'
import { filterByViewport } from 'features/map/map.utils'
import {
  useActivityTemporalgridFeatures,
  useActiveHeatmapAnimatedMetadatas,
} from 'features/map/map-features.hooks'
import { selectActivityDataviews } from 'features/dataviews/dataviews.selectors'
import { useMapStyle } from 'features/map/map.hooks'
import useMapInstance from 'features/map/map-context.hooks'
import {
  selectActiveHeatmapAnimatedGeneratorConfigs,
  selectGeneratorConfigsById,
} from 'features/map/map.selectors'
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

  // const visibleTemporalGridDataviews = useMemo(
  //   () => (temporalGridDataviews || [])?.map((dataview) => dataview.config?.visible ?? false),
  //   [temporalGridDataviews]
  // )

  const { bounds } = useMapBounds()
  const {
    sourcesFeatures,
    haveSourcesLoaded,
    sourcesMetadata: lala,
  } = useActivityTemporalgridFeatures()
  const style = useMapStyle()
  const debouncedBounds = useDebounce(bounds, 400)
  const isSmallScreen = useSmallScreen()

  const prevActiveSourceUrl = useRef<string>('')
  const prevDebouncedBounds = useRef<MiniglobeBounds | undefined>(debouncedBounds)

  const map = useMapInstance()
  // const generator = useSelector(
  //   selectGeneratorConfigsById(MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID)
  // )
  // const sourcesMetadata = useActiveHeatmapAnimatedMetadatas(generator)
  // console.log(sourcesMetadata)
  const onSourceLoaded = useCallback(
    (metadata: any, bounds: MiniglobeBounds) => {
      console.log('map fired data', metadata)
      if (!map || !metadata) return
      const sourceFeatures = map.querySourceFeatures('mergedAnimatedHeatmap-heatmapchunk_10days', {
        sourceLayer: TEMPORALGRID_SOURCE_LAYER,
      })
      // console.log(sourceFeatures)
      const numSublayers = metadata.numSublayers
      const timeChunks = metadata.timeChunks as TimeChunks
      const activeTimeChunk = timeChunks?.chunks.find((c: any) => c.active) as TimeChunk
      const chunkQuantizeOffset = activeTimeChunk.quantizeOffset

      const filteredFeatures = filterByViewport(sourceFeatures, bounds)
      if (filteredFeatures?.length > 0) {
        // console.log(filteredFeatures)
        const values = getTimeSeries(
          filteredFeatures as any,
          numSublayers,
          chunkQuantizeOffset
        ).map((frameValues) => {
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
        // console.log(values)
        setStackedActivity(values)
      }
    },
    [map]
  )
  const attachedListener = useRef<boolean>(false)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (!map) return
    attachedListener.current = true
    console.log('attaching listener')
    map.on('data', (e: MapSourceDataEvent) => {
      const style = (e as any).style.stylesheet
      const metadata = getMetadata(style)
      if (
        metadata &&
        e.sourceId === metadata.timeChunks.activeSourceId &&
        (e as any).previousState !== 'reloading'
      ) {
        setLoading(false)
        const mglBounds = map.getBounds()
        const bounds: MiniglobeBounds = {
          north: mglBounds.getNorth(),
          south: mglBounds.getSouth(),
          east: mglBounds.getEast(),
          west: mglBounds.getWest(),
        }
        console.log(mglBounds)
        console.log('redrawing', e, e.isSourceLoaded, (e as any).previousState)
        onSourceLoaded(metadata, bounds)
      }
    })
    map.on('idle', () => {
      setLoading(true)
    })
  }, [map, onSourceLoaded])

  useEffect(() => {
    if (debouncedBounds) {
      const metadata = getMetadata(map?.getStyle())
      onSourceLoaded(metadata, debouncedBounds)
    }
  }, [debouncedBounds, onSourceLoaded, map])

  // useEffect(() => {
  //   if (!visibleTemporalGridDataviews?.length || isSmallScreen) {
  //     setStackedActivity(undefined)
  //     return
  //   }

  //   if (
  //     !sourcesMetadata[0] ||
  //     !sourcesMetadata[0].timeChunks ||
  //     !sourcesMetadata[0].timeChunks.activeSourceId ||
  //     !debouncedBounds
  //   ) {
  //     setStackedActivity(undefined)
  //     return
  //   }

  //   let activeSourceUrl
  //   if (style && style.sources && sourcesMetadata && sourcesMetadata[0]) {
  //     const activeSource = style.sources[
  //       sourcesMetadata[0].timeChunks.activeSourceId
  //     ] as VectorSource
  //     if (activeSource && activeSource.tiles) {
  //       activeSourceUrl = activeSource.tiles[0]
  //     }
  //   }

  //   let recompute = ''
  //   const features = sourcesFeatures && sourcesFeatures[0]
  //   //  Time chunk changed
  //   if (activeSourceUrl && activeSourceUrl !== prevActiveSourceUrl.current) {
  //     //  Time chunk changed and source is fully loaded
  //     if (haveSourcesLoaded && features && features.length) {
  //       recompute = 'url changed'
  //       prevActiveSourceUrl.current = activeSourceUrl
  //     }
  //   }

  //   if (prevDebouncedBounds.current !== debouncedBounds) {
  //     recompute = 'bounds'
  //   }
  //   prevDebouncedBounds.current = debouncedBounds
  //   if (recompute === '') return
  //   console.log('recompute?', recompute)

  //   if (!features || !features.length) {
  //     console.log('sourcesFeatures not ready')
  //     return
  //   }

  //   const numSublayers = sourcesMetadata[0].numSublayers
  //   const timeChunks = sourcesMetadata[0].timeChunks as TimeChunks
  //   const activeTimeChunk = timeChunks?.chunks.find((c: any) => c.active) as TimeChunk
  //   const chunkQuantizeOffset = activeTimeChunk.quantizeOffset

  //   const filteredFeatures = filterByViewport(features, debouncedBounds)
  //   if (filteredFeatures?.length > 0) {
  //     const values = getTimeSeries(filteredFeatures as any, numSublayers, chunkQuantizeOffset).map(
  //       (frameValues) => {
  //         // Ideally we don't have the features not visible in 4wings but we have them
  //         // so this needs to be filtered by the current active ones
  //         const activeFrameValues = Object.fromEntries(
  //           Object.entries(frameValues).map(([key, value]) => {
  //             const cleanValue =
  //               key === 'frame' || visibleTemporalGridDataviews[parseInt(key)] === true ? value : 0
  //             return [key, cleanValue]
  //           })
  //         )
  //         return {
  //           ...activeFrameValues,
  //           date: quantizeOffsetToDate(frameValues.frame, timeChunks.interval).getTime(),
  //         }
  //       }
  //     )
  //     setStackedActivity(values)
  //   }
  // }, [
  //   sourcesMetadata,
  //   sourcesFeatures,
  //   haveSourcesLoaded,
  //   debouncedBounds,
  //   visibleTemporalGridDataviews,
  //   isSmallScreen,
  //   style,
  // ])

  const dataviewsColors = temporalGridDataviews?.map((dataview) => dataview.config?.color)

  // Using an effect to ensure the blur loading is removed once the component has been rendered
  // const [loading, setLoading] = useState(haveSourcesLoaded)

  // useEffect(() => {
  //   setLoading(haveSourcesLoaded)
  // }, [haveSourcesLoaded])

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
