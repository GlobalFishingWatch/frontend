import { useMemo, useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  Bbox,
  eventsToBbox,
  filterSegmentsByTimerange,
  segmentsToBbox,
} from '@globalfishingwatch/data-transforms'
import { DEFAULT_TIME_RANGE } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import {
  selectVesselTracksData,
  selectVesselEventsFilteredByTimerange,
} from 'features/vessel/selectors/vessel.resources.selectors'
import { setVesselFitBoundsOnLoad } from 'features/vessel/vessel.slice'
import { getSearchIdentityResolved } from 'features/vessel/vessel.utils'
import { useLocationConnect } from 'routes/routes.hook'
import { selectIsVesselLocation, selectUrlTimeRange } from 'routes/routes.selectors'
import { useMapFitBounds } from 'features/map/map-bounds.hooks'
import {
  selectVesselFitBoundsOnLoad,
  selectVesselInfoData,
} from 'features/vessel/selectors/vessel.selectors'

export type UseVesselBoundsType = 'events' | 'track'
export const useVesselBounds = (type?: UseVesselBoundsType) => {
  const fitBounds = useMapFitBounds()
  const { start, end } = useTimerangeConnect()
  const vesselTrack = useSelector(selectVesselTracksData)
  const events = useSelector(selectVesselEventsFilteredByTimerange)

  const vesselBounds = useMemo(() => {
    let bounds: Bbox | undefined
    if (vesselTrack?.length && (!type || type === 'track')) {
      const filteredSegments = filterSegmentsByTimerange(vesselTrack, { start, end })
      bounds = filteredSegments?.length ? segmentsToBbox(filteredSegments) : undefined
    } else if (events?.length && (!type || type === 'events')) {
      bounds = eventsToBbox(events)
    }
    return bounds
  }, [end, events, start, type, vesselTrack])

  const setVesselBounds = useCallback(
    (bounds: Bbox) => {
      if (bounds) {
        fitBounds(bounds)
      }
    },
    [fitBounds]
  )

  return useMemo(() => ({ vesselBounds, setVesselBounds }), [vesselBounds, setVesselBounds])
}

export const useVesselFitBoundsOnLoad = () => {
  const dispatch = useAppDispatch()
  const fitBounds = useMapFitBounds()
  const { vesselBounds, setVesselBounds } = useVesselBounds('track')
  const isVesselFitBoundsOnLoad = useSelector(selectVesselFitBoundsOnLoad)

  useEffect(() => {
    if (vesselBounds && isVesselFitBoundsOnLoad) {
      setVesselBounds(vesselBounds)
      dispatch(setVesselFitBoundsOnLoad(false))
    }
  }, [dispatch, fitBounds, isVesselFitBoundsOnLoad, setVesselBounds, vesselBounds])
}

export const useVesselFitTranmissionsBounds = () => {
  const isVesselLocation = useSelector(selectIsVesselLocation)
  const fitBounds = useMapFitBounds()
  const segments = useSelector(selectVesselTracksData)
  const urlTimerange = useSelector(selectUrlTimeRange)
  const vessel = useSelector(selectVesselInfoData)
  const { setTimerange } = useTimerangeConnect()
  const { dispatchQueryParams } = useLocationConnect()
  const [timerangeBoundsUpdated, seTimerangeBoundsUpdated] = useState(false)
  const [trackBoundsUpdated, setTrackBoundsUpdated] = useState(false)
  const { transmissionDateFrom, transmissionDateTo } = getSearchIdentityResolved(vessel)

  // Updates the timerange to the vessel's transmission dates only if not set or are the default of the workspace
  const isDefaultTimerange =
    urlTimerange &&
    urlTimerange.start === DEFAULT_TIME_RANGE.start &&
    urlTimerange.end === DEFAULT_TIME_RANGE.end
  const needsTimerangeUpdate =
    isDefaultTimerange && vessel !== null && transmissionDateFrom && transmissionDateTo

  useEffect(() => {
    if (isVesselLocation && needsTimerangeUpdate) {
      // This is needed to update the url instantly instead of waiting for the debounced
      // update in setTimerange fn as the resouce needs to be generated asap
      dispatchQueryParams({ start: transmissionDateFrom, end: transmissionDateTo })
      setTimerange({ start: transmissionDateFrom, end: transmissionDateTo })
      requestAnimationFrame(() => {
        seTimerangeBoundsUpdated(true)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needsTimerangeUpdate])

  // There has to wait for the timerange to be updated so the track loads with the entire track
  useEffect(() => {
    if (isVesselLocation && segments?.length && timerangeBoundsUpdated && !trackBoundsUpdated) {
      const bbox = segments?.length ? segmentsToBbox(segments) : undefined
      if (bbox) {
        fitBounds(bbox)
        setTrackBoundsUpdated(true)
      }
    }
  }, [isVesselLocation, fitBounds, segments, timerangeBoundsUpdated, trackBoundsUpdated])
}

export const useVesselFitBounds = () => {
  // Fit bounds when standalone vessel page and not has any date selected
  useVesselFitTranmissionsBounds()
  // Fit bounds when coming from a workspace or navigation link
  // only for the events in the current timerange
  useVesselFitBoundsOnLoad()
}
