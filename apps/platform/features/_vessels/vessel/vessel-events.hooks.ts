import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { GFWAPI } from '@globalfishingwatch/api-client'
import { useRateLimitChallengeState } from '@globalfishingwatch/api-client/hooks'
import { useGetDeckLayer } from '@globalfishingwatch/deck-layer-composer'
import type { VesselLayer } from '@globalfishingwatch/deck-layers'

import { selectVesselProfileDataview } from 'features/_map/dataviews/selectors/dataviews.instances.selectors'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectVesselId } from 'router/routes.selectors'

import { setVesselEvents } from './vessel.slice'

const useVesselProfileLayer = () => {
  const vesselDataview = useSelector(selectVesselProfileDataview)
  return useGetDeckLayer<VesselLayer>(vesselDataview?.id as string)
}

const useVesselProfileEvents = () => {
  const vesselLayer = useVesselProfileLayer()
  const eventLayersCount = vesselLayer?.instance?.getEventLayers().length ?? 0
  const dataLoaded = eventLayersCount > 0 && vesselLayer?.instance?.getVesselEventsLayersLoaded()
  return useMemo(() => {
    if (dataLoaded) {
      return vesselLayer?.instance?.getVesselEventsData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataLoaded, eventLayersCount])
}

export const useVesselProfileEventsLoading = () => {
  const vesselInstance = useVesselProfileLayer()
  return !vesselInstance?.instance || !vesselInstance?.instance?.getVesselEventsLayersLoaded()
}

export const useVesselProfileEventsError = () => {
  const vesselInstance = useVesselProfileLayer()
  return vesselInstance?.instance?.getVesselLayersError('events') ?? false
}

/** Blocked when the track or any events request hit the rate limit, or the user cancelled the challenge */
export const useVesselProfileRateLimit = () => {
  const vesselInstance = useVesselProfileLayer()
  const challengeCancelled = useRateLimitChallengeState() === 'cancelled'
  const rateLimited = vesselInstance?.instance?.getVesselLayersRateLimited() ?? false

  // Refetch them once any rate limit reset succeeds, wherever the challenge was started from
  useEffect(() => {
    if (rateLimited) {
      return GFWAPI.onRateLimitReset(() => vesselInstance?.instance?.reloadErroredSublayers())
    }
  }, [rateLimited, vesselInstance])

  const [verifying, setVerifying] = useState(false)
  const verify = useCallback(() => {
    setVerifying(true)
    GFWAPI.startRateLimitChallenge()
      .catch(() => {})
      .finally(() => setVerifying(false))
  }, [])
  return { blocked: rateLimited || challengeCancelled || verifying, verifying, verify }
}

export const useSetVesselProfileEvents = () => {
  const events = useVesselProfileEvents()
  const vesselId = useSelector(selectVesselId)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (vesselId && events) {
      dispatch(setVesselEvents({ vesselId, events }))
    }
  }, [dispatch, events, vesselId])
}
