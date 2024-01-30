import { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Dataset, DatasetTypes, VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { getRelatedDatasetByType, getRelatedDatasetsByType } from 'features/datasets/datasets.utils'
import { getVesselDataviewInstance } from 'features/dataviews/dataviews.utils'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { getVesselProperty } from 'features/vessel/vessel.utils'
import { selectVesselInfoData } from 'features/vessel/selectors/vessel.selectors'
import { useVesselEvents } from 'features/workspace/vessels/vessel-events.hooks'
import { selectVesselSelfReportedId } from 'features/vessel/vessel.config.selectors'

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
  const { setVesselEventVisibility } = useVesselEvents()
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
