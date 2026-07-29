import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { DEFAULT_TIME_RANGE } from 'data/map/config'
import { useAppDispatch } from 'features/app/app.hooks'
import { useMapFitBounds } from 'features/map/map/map-bounds.hooks'
import { useSetTimerange, useTimerangeConnect } from 'features/map/timebar/timebar.hooks'
import {
  selectVesselFitBoundsOnLoad,
  selectVesselInfoData,
} from 'features/vessels/vessel/selectors/vessel.selectors'
import { useVesselProfileLayer } from 'features/vessels/vessel/vessel.hooks'
import { setVesselFitBoundsOnLoad } from 'features/vessels/vessel/vessel.slice'
import {
  getVesselTransmissionDates,
  isTimerangeOutsideTransmissions,
} from 'features/vessels/vessel/vessel.utils'
import { useReplaceQueryParams } from 'router/routes.hook'
import { selectIsVesselLocation, selectUrlTimeRange } from 'router/routes.selectors'
import { getUTCDateTime } from 'utils/dates'

export const useVesselProfileBbox = () => {
  const vesselLayer = useVesselProfileLayer()
  const trackLoaded = vesselLayer?.instance?.getVesselTracksLayersLoaded()
  const urlTimerange = useSelector(selectUrlTimeRange)
  return useMemo(() => {
    if (trackLoaded) {
      return vesselLayer?.instance?.getVesselTrackBounds()
    }
    return null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackLoaded, urlTimerange?.start, urlTimerange?.end])
}

export const useVesselProfileBounds = () => {
  const { t } = useTranslation()
  const fitBounds = useMapFitBounds()
  const setTimerange = useSetTimerange()
  const vessel = useSelector(selectVesselInfoData)
  const urlTimerange = useSelector(selectUrlTimeRange)
  const { transmissionDateFrom, transmissionDateTo } = getVesselTransmissionDates(vessel)
  const vesselLayer = useVesselProfileLayer()
  const isTrackLoaded = vesselLayer?.instance?.getVesselTracksLayersLoaded()
  const bounds = useVesselProfileBbox()
  const pendingFitRef = useRef(false)

  const confirmTimerangeChange = useCallback(() => {
    if (
      !isTimerangeOutsideTransmissions(urlTimerange, transmissionDateFrom, transmissionDateTo) ||
      !window.confirm(t((t) => t.layer.vessel_fit_bounds_out_of_timerange) as string)
    ) {
      return
    }
    setTimerange({
      start: getUTCDateTime(transmissionDateFrom).toISO()!,
      end: getUTCDateTime(transmissionDateTo).toISO()!,
    })
  }, [urlTimerange, transmissionDateFrom, transmissionDateTo, t, setTimerange])

  const setVesselBounds = useCallback(() => {
    if (bounds) {
      fitBounds(bounds, { padding: 60, fitZoom: true })
      return
    }
    if (!isTrackLoaded) {
      pendingFitRef.current = true
      return
    }
    confirmTimerangeChange()
  }, [bounds, isTrackLoaded, fitBounds, confirmTimerangeChange])

  useEffect(() => {
    if (!pendingFitRef.current || !isTrackLoaded) {
      return
    }
    pendingFitRef.current = false
    if (bounds) {
      fitBounds(bounds, { padding: 60, fitZoom: true })
    } else {
      confirmTimerangeChange()
    }
  }, [isTrackLoaded, bounds, fitBounds, confirmTimerangeChange])

  return useMemo(
    () => ({ setVesselBounds, boundsReady: isTrackLoaded }),
    [setVesselBounds, isTrackLoaded]
  )
}

const useVesselFitBoundsOnLoad = () => {
  const dispatch = useAppDispatch()
  const fitBounds = useMapFitBounds()
  const { setVesselBounds } = useVesselProfileBounds()
  const vesselLayer = useVesselProfileLayer()
  const isTrackLoaded = vesselLayer?.instance?.getVesselTracksLayersLoaded()
  const isVesselFitBoundsOnLoad = useSelector(selectVesselFitBoundsOnLoad)

  useEffect(() => {
    if (isTrackLoaded && isVesselFitBoundsOnLoad) {
      setVesselBounds()
      dispatch(setVesselFitBoundsOnLoad(false))
    }
  }, [isTrackLoaded, dispatch, fitBounds, isVesselFitBoundsOnLoad, setVesselBounds])
}

const useVesselFitTranmissionsBounds = () => {
  const isVesselLocation = useSelector(selectIsVesselLocation)
  const { setVesselBounds } = useVesselProfileBounds()
  const { replaceQueryParams } = useReplaceQueryParams()
  const urlTimerange = useSelector(selectUrlTimeRange)
  const vessel = useSelector(selectVesselInfoData)
  const { setTimerange } = useTimerangeConnect()
  const [timerangeBoundsUpdated, seTimerangeBoundsUpdated] = useState(false)
  const [trackBoundsUpdated, setTrackBoundsUpdated] = useState(false)
  const { transmissionDateFrom, transmissionDateTo } = getVesselTransmissionDates(vessel)

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
      // update in setTimerange fn as the resource needs to be generated asap
      replaceQueryParams({ start: transmissionDateFrom, end: transmissionDateTo })
      setTimerange({ start: transmissionDateFrom, end: transmissionDateTo })
      requestAnimationFrame(() => {
        seTimerangeBoundsUpdated(true)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needsTimerangeUpdate])

  // There has to wait for the timerange to be updated so the track loads with the entire track
  useEffect(() => {
    if (isVesselLocation && timerangeBoundsUpdated && !trackBoundsUpdated) {
      setVesselBounds()
      setTrackBoundsUpdated(true)
    }
  }, [
    isVesselLocation,
    timerangeBoundsUpdated,
    trackBoundsUpdated,
    needsTimerangeUpdate,
    setVesselBounds,
  ])
}

export const useVesselFitBounds = () => {
  // Fit bounds when standalone vessel page and not has any date selected
  useVesselFitTranmissionsBounds()
  // Fit bounds when coming from a workspace or navigation link
  // only for the events in the current timerange
  useVesselFitBoundsOnLoad()
}
