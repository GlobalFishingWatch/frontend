import { useSelector } from 'react-redux'
import { useCallback } from 'react'
import { uniq } from 'es-toolkit'
import type { DataviewInstance } from '@globalfishingwatch/api-types'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import { LineColorBarOptions } from '@globalfishingwatch/ui-components'
import type { ReportVesselWithDatasets } from 'features/reports/areas/area-reports.selectors'
import { getVesselDataviewInstance, getVesselInWorkspace } from 'features/dataviews/dataviews.utils'
import { selectTrackDataviews } from 'features/dataviews/selectors/dataviews.instances.selectors'
import {
  fetchAllSearchVessels,
  getAllSearchVesselsUrl,
} from 'features/vessel-groups/vessel-groups-modal.slice'
import { getRelatedDatasetsByType } from 'features/datasets/datasets.utils'
import { getRelatedIdentityVesselIds, getVesselId } from 'features/vessel/vessel.utils'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'

export const MAX_VESSEL_REPORT_PIN = 30

export default function usePinReportVessels() {
  const allVesselsInWorkspace = useSelector(selectTrackDataviews)
  const { upsertDataviewInstance, deleteDataviewInstance } = useDataviewInstancesConnect()

  const onPinClick = useCallback(
    async (vessels: ReportVesselWithDatasets[], mode: 'add' | 'delete' = 'add') => {
      if (mode === 'delete') {
        const pinnedVesselsInstances = vessels.flatMap(
          (vessel) => getVesselInWorkspace(allVesselsInWorkspace, vessel.vesselId!) || []
        )
        deleteDataviewInstance(pinnedVesselsInstances.map((v) => v.id))
      } else {
        const infoDataset = vessels?.[0]?.infoDataset
        if (infoDataset) {
          const url = getAllSearchVesselsUrl(infoDataset)
          if (!url) {
            throw new Error('Missing search url')
          }
          const vesselsWithIdentity = await fetchAllSearchVessels({
            url: `${url}`,
            body: {
              datasets: uniq(vessels.flatMap((v) => v.infoDataset?.id || [])),
              ids: uniq(vessels.flatMap((v) => v.vesselId || [])),
            },
          })

          const vesselDataviewInstances = vesselsWithIdentity.flatMap((vessel) => {
            const trackDataset = getRelatedDatasetsByType(infoDataset, DatasetTypes.Tracks)?.[0]
            const vesselEventsDatasets = getRelatedDatasetsByType(infoDataset, DatasetTypes.Events)
            const eventsDatasetsId =
              vesselEventsDatasets && vesselEventsDatasets?.length
                ? vesselEventsDatasets.map((d) => d.id)
                : []
            const vesselDataviewInstance = getVesselDataviewInstance(
              { id: getVesselId(vessel) },
              {
                info: infoDataset?.id,
                track: trackDataset?.id,
                ...(eventsDatasetsId?.length && { events: eventsDatasetsId }),
                relatedVesselIds: getRelatedIdentityVesselIds(vessel),
              }
            )
            if (!vesselDataviewInstance?.config) {
              return []
            }
            const { colorCyclingType, ...config } = vesselDataviewInstance.config
            return {
              ...vesselDataviewInstance,
              config: {
                ...config,
                color:
                  LineColorBarOptions[Math.floor(Math.random() * LineColorBarOptions.length)]
                    ?.value,
              },
            } as DataviewInstance<any>
          })
          if (vesselDataviewInstances.length) {
            upsertDataviewInstance(vesselDataviewInstances)
          }
        }
      }
    },
    []
  )

  return onPinClick
}
