import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useGetDeckLayer } from '@globalfishingwatch/deck-layer-composer'
import { VesselLayer } from '@globalfishingwatch/deck-layers'
import { selectVesselProfileDataview } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectVesselId } from 'routes/routes.selectors'
import { setVesselEvents } from './vessel.slice'

const useVesselEvents = (dataviewId: string) => {
  const vesselInstance = useGetDeckLayer<VesselLayer>(dataviewId)
  const dataLoaded = vesselInstance?.instance?.getAllSublayersLoaded()
  return useMemo(() => {
    if (dataLoaded) {
      const data = vesselInstance?.instance?.getVesselEventsData()
      return data
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataLoaded])
}

const useVesselProfileEvents = () => {
  const vesselDataview = useSelector(selectVesselProfileDataview)
  return useVesselEvents(vesselDataview?.id || '')
}

export const useVesselProfileEventsLoading = () => {
  const vesselDataview = useSelector(selectVesselProfileDataview)
  const vesselInstance = useGetDeckLayer<VesselLayer>(vesselDataview?.id as string)
  // TODO:deck review this and try to avoid intermediate loading states while toggled on events load
  return vesselInstance?.instance && !vesselInstance?.instance?.getVesselEventsLayersLoaded()
}

export const useVesselProfileEventsError = () => {
  const vesselDataview = useSelector(selectVesselProfileDataview)
  const vesselInstance = useGetDeckLayer<VesselLayer>(vesselDataview?.id as string)
  return vesselInstance?.instance?.getErrorMessage() || ''
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
