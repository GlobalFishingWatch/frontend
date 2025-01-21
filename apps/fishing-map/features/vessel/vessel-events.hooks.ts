import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'

import { useGetDeckLayer } from '@globalfishingwatch/deck-layer-composer'
import type { VesselLayer } from '@globalfishingwatch/deck-layers'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectVesselProfileDataview } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { selectVesselId } from 'routes/routes.selectors'

import { setVesselEvents } from './vessel.slice'

const useVesselProfileLayer = () => {
  const vesselDataview = useSelector(selectVesselProfileDataview)
  return useGetDeckLayer<VesselLayer>(vesselDataview?.id as string)
}

const useVesselProfileEvents = () => {
  const vesselLayer = useVesselProfileLayer()
  const dataLoaded = vesselLayer?.instance?.getVesselEventsLayersLoaded()
  return useMemo(() => {
    if (dataLoaded) {
      return vesselLayer?.instance?.getVesselEventsData()
    }
     
  }, [dataLoaded])
}

export const useVesselProfileEventsLoading = () => {
  const vesselInstance = useVesselProfileLayer()
  return vesselInstance?.instance && !vesselInstance?.instance?.getVesselEventsLayersLoaded()
}

export const useVesselProfileEventsError = () => {
  const vesselInstance = useVesselProfileLayer()
  return vesselInstance?.instance?.getVesselLayersError('events') ?? false
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
