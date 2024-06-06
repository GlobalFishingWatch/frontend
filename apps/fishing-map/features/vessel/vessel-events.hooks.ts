import { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Dataset, DatasetTypes, VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { useGetDeckLayer } from '@globalfishingwatch/deck-layer-composer'
import { VesselLayer } from '@globalfishingwatch/deck-layers'
import { getRelatedDatasetByType, getRelatedDatasetsByType } from 'features/datasets/datasets.utils'
import { getVesselDataviewInstance } from 'features/dataviews/dataviews.utils'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { getVesselProperty } from 'features/vessel/vessel.utils'
import { selectVesselInfoData } from 'features/vessel/selectors/vessel.selectors'
import { useVisibleVesselEvents } from 'features/workspace/vessels/vessel-events.hooks'
import { selectVesselSelfReportedId } from 'features/vessel/vessel.config.selectors'
import { selectVesselProfileDataview } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { useAppDispatch } from 'features/app/app.hooks'
import { setVesselEvents } from './vessel.slice'

export type VesselDataviewInstanceParams = { id: string; dataset: Dataset }

export const useAddVesselDataviewInstance = () => {
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const addVesselDataviewInstance = useCallback(
    (vessel: VesselDataviewInstanceParams) => {
      const vesselTrackDataset = getRelatedDatasetByType(vessel.dataset, DatasetTypes.Tracks)
      const vesselEventsDatasets = getRelatedDatasetsByType(vessel.dataset, DatasetTypes.Events)
      const eventsDatasetsId =
        vesselEventsDatasets && vesselEventsDatasets?.length
          ? vesselEventsDatasets.map((d) => d.id)
          : []

      const vesselDataviewInstance = getVesselDataviewInstance(vessel, {
        info: vessel.dataset.id,
        track: vesselTrackDataset?.id,
        ...(eventsDatasetsId.length > 0 && { events: eventsDatasetsId }),
      })
      upsertDataviewInstance(vesselDataviewInstance)
    },
    [upsertDataviewInstance]
  )

  return addVesselDataviewInstance
}

export const useUpdateVesselEventsVisibility = () => {
  const { setVesselEventVisibility } = useVisibleVesselEvents()
  const vessel = useSelector(selectVesselInfoData)
  const identityId = useSelector(selectVesselSelfReportedId)
  useEffect(() => {
    if (vessel) {
      const shiptypes = getVesselProperty(vessel, 'shiptypes', {
        identityId,
        identitySource: VesselIdentitySourceEnum.SelfReported,
      })
      if (shiptypes?.includes('FISHING')) {
        setVesselEventVisibility({ event: 'loitering', visible: false })
      } else {
        setVesselEventVisibility({ event: 'fishing', visible: false })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vessel])
}

export const useVesselEvents = (dataviewId: string) => {
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

export const useVesselProfileEvents = () => {
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
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (events) {
      dispatch(setVesselEvents(events))
    }
  }, [dispatch, events])
}
