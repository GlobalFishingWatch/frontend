import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { uniq, uniqBy } from 'es-toolkit'

import type {
  Dataset,
  DataviewInstance,
  IdentityVessel,
  Resource,
} from '@globalfishingwatch/api-types'
import { DatasetTypes, ResourceStatus } from '@globalfishingwatch/api-types'
import { resolveEndpoint } from '@globalfishingwatch/datasets-client'
import { LineColorBarOptions } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { getRelatedDatasetsByType } from 'features/datasets/datasets.utils'
import {
  getVesselDataviewInstance,
  getVesselDataviewInstanceDatasetConfig,
  getVesselInWorkspace,
} from 'features/dataviews/dataviews.utils'
import { selectTrackDataviews } from 'features/dataviews/selectors/dataviews.instances.selectors'
import type { ReportTableVessel } from 'features/reports/shared/vessels/report-vessels.types'
import { setResource } from 'features/resources/resources.slice'
import { getRelatedIdentityVesselIds, getVesselId } from 'features/vessel/vessel.utils'
import {
  fetchAllSearchVessels,
  getAllSearchVesselsUrl,
} from 'features/vessel-groups/vessel-groups-modal.slice'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { setWorkspaceSuggestSave } from 'features/workspace/workspace.slice'

export const MAX_VESSEL_REPORT_PIN = 50

// This avoid requesting the vessel info again when we alredy requested it for the popup
export function usePopulateVesselResource() {
  const dispatch = useAppDispatch()
  const populateVesselInfoResource = (
    vessel: IdentityVessel,
    vesselDataviewInstance: DataviewInstance,
    infoDatasetResolved: Dataset
  ) => {
    const infoDatasetConfig = getVesselDataviewInstanceDatasetConfig(
      getVesselId(vessel),
      vesselDataviewInstance.config || {}
    )?.find((dc) => dc.datasetId === infoDatasetResolved?.id)
    if (infoDatasetResolved && infoDatasetConfig) {
      const url = resolveEndpoint(infoDatasetResolved, infoDatasetConfig)
      if (url) {
        const resource: Resource = {
          url,
          dataset: infoDatasetResolved,
          datasetConfig: infoDatasetConfig,
          dataviewId: vesselDataviewInstance.dataviewId as string,
          data: vessel,
          status: ResourceStatus.Finished,
        }
        dispatch(setResource(resource))
      }
    }
  }
  return populateVesselInfoResource
}

export default function usePinReportVessels() {
  const dispatch = useAppDispatch()
  const datasets = useSelector(selectAllDatasets)
  const allVesselsInWorkspace = useSelector(selectTrackDataviews)
  const populateVesselInfoResource = usePopulateVesselResource()
  const { upsertDataviewInstance, deleteDataviewInstance } = useDataviewInstancesConnect()

  const pinVessels = useCallback(
    async (vessels: ReportTableVessel[]) => {
      const infoDataset = datasets.find((d) => d.id === vessels?.[0]?.datasetId)
      if (infoDataset) {
        const url = getAllSearchVesselsUrl(infoDataset)
        if (!url) {
          throw new Error('Missing search url')
        }
        const vesselsWithIdentity = await fetchAllSearchVessels({
          url: `${url}`,
          body: {
            datasets: uniq(vessels.flatMap((v) => v.datasetId || [])),
            ids: uniq(vessels.flatMap((v) => v.id || [])),
          },
        })

        const vesselsWithDataviewInstances = vesselsWithIdentity.flatMap((vessel) => {
          const trackDataset = getRelatedDatasetsByType(infoDataset, DatasetTypes.Tracks)?.[0]
          const vesselEventsDatasets = getRelatedDatasetsByType(infoDataset, DatasetTypes.Events)
          const eventsDatasetsId =
            vesselEventsDatasets && vesselEventsDatasets?.length
              ? vesselEventsDatasets.map((d) => d.id)
              : []
          const vesselDataviewInstance = getVesselDataviewInstance(
            { id: getVesselId(vessel) },
            {
              info: vessel.dataset,
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
            identity: vessel,
            instance: {
              ...vesselDataviewInstance,
              config: {
                ...config,
                color:
                  LineColorBarOptions[Math.floor(Math.random() * LineColorBarOptions.length)]
                    ?.value,
                colorCyclingType: undefined,
              },
            } as DataviewInstance<any>,
          }
        })
        if (vesselsWithDataviewInstances.length) {
          const instances = uniqBy(
            vesselsWithDataviewInstances.map((v) => v.instance),
            (d) => d.id
          )
          upsertDataviewInstance(instances)
          vesselsWithDataviewInstances.forEach(({ identity, instance }) => {
            populateVesselInfoResource(identity, instance, infoDataset)
          })
        }
        dispatch(setWorkspaceSuggestSave(true))
      }
    },
    [datasets, dispatch, populateVesselInfoResource, upsertDataviewInstance]
  )

  const unPinVessels = useCallback(
    (vessels: ReportTableVessel[]) => {
      const pinnedVesselsInstances = vessels.flatMap(
        (vessel) => getVesselInWorkspace(allVesselsInWorkspace, vessel.id!) || []
      )
      deleteDataviewInstance(pinnedVesselsInstances.map((v) => v.id))
      dispatch(setWorkspaceSuggestSave(true))
    },
    [allVesselsInWorkspace, deleteDataviewInstance, dispatch]
  )

  return useMemo(() => ({ pinVessels, unPinVessels }), [pinVessels, unPinVessels])
}
