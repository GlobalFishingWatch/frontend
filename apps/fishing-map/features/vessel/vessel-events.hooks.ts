import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useGetDeckLayer } from '@globalfishingwatch/deck-layer-composer'
import { VesselLayer } from '@globalfishingwatch/deck-layers'
import { selectVesselProfileDataview } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { useAppDispatch } from 'features/app/app.hooks'
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataLoaded])
}

export const useVesselProfileEventsLoading = () => {
  const vesselInstance = useVesselProfileLayer()
  // TODO:deck review this and try to avoid intermediate loading states while toggled on events load
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
