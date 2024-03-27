import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { useGetDeckLayer } from '@globalfishingwatch/deck-layer-composer'
import { FourwingsLayer, getFourwingsChunk } from '@globalfishingwatch/deck-layers'
import { getMergedDataviewId } from '@globalfishingwatch/dataviews-client'
import { ActivityTimeseriesFrame } from '@globalfishingwatch/timebar'
import { useDebounce } from '@globalfishingwatch/react-hooks'
import { getUTCDate } from '@globalfishingwatch/data-transforms'
import { selectTimebarVisualisation } from 'features/app/selectors/app.timebar.selectors'
import { useMapViewport } from 'features/map/map-viewport.hooks'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { selectTimebarSelectedDataviews } from 'features/timebar/timebar.selectors'
import { FourwingsFeature } from '../../../../libs/deck-loaders/src/fourwings'
import { getGraphDataFromFourwingsFeatures } from './timebar.utils'

const EMPTY_ACTIVITY_DATA = [] as ActivityTimeseriesFrame[]

export const useHeatmapActivityGraph = () => {
  const timebarVisualisation = useSelector(selectTimebarVisualisation)
  const viewport = useMapViewport()
  const viewportChangeHash = useMemo(() => {
    if (!viewport) return ''
    return [viewport.zoom, viewport.latitude, viewport.longitude].map((v) => v.toFixed(5)).join(',')
  }, [viewport])
  const debouncedViewportChangeHash = useDebounce(viewportChangeHash, 400)
  const dataviews = useSelector(selectTimebarSelectedDataviews)
  const timerange = useTimerangeConnect()
  const start = getUTCDate(timerange.start).getTime()
  const end = getUTCDate(timerange.end).getTime()
  const chunk = getFourwingsChunk(start, end)
  const id = dataviews?.length ? getMergedDataviewId(dataviews) : ''
  const fourwingsActivityLayer = useGetDeckLayer<FourwingsLayer>(id)
  const { loaded, instance } = fourwingsActivityLayer || {}
  const heatmapActivity = useMemo(() => {
    if (loaded) {
      const viewportData = instance?.getViewportData() as FourwingsFeature[]
      return (
        getGraphDataFromFourwingsFeatures(viewportData, {
          start: chunk.bufferedStart,
          end: chunk.bufferedEnd,
          interval: chunk.interval,
          sublayers: instance.props.sublayers.length,
        }) || EMPTY_ACTIVITY_DATA
      )
    }
    return EMPTY_ACTIVITY_DATA
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    loaded,
    debouncedViewportChangeHash,
    timebarVisualisation,
    chunk.bufferedStart,
    chunk.bufferedEnd,
    chunk.interval,
  ])

  return useMemo(() => ({ loading: !loaded, heatmapActivity }), [heatmapActivity, loaded])
}
