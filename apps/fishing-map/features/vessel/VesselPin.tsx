import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { IconButton, IconButtonSize } from '@globalfishingwatch/ui-components'
import {
  Dataset,
  DatasetTypes,
  DataviewInstance,
  IdentityVessel,
  Resource,
  ResourceStatus,
} from '@globalfishingwatch/api-types'
import { setResource } from '@globalfishingwatch/dataviews-client'
import { resolveEndpoint } from '@globalfishingwatch/datasets-client'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import {
  getVesselDataviewInstance,
  getVesselDataviewInstanceDatasetConfig,
  getVesselInWorkspace,
  getVesselInfoDataviewInstanceDatasetConfig,
} from 'features/dataviews/dataviews.utils'
import { getRelatedDatasetsByType } from 'features/datasets/datasets.utils'
import { getEventLabel } from 'utils/analytics'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { getRelatedIdentityVesselIds, getVesselId } from 'features/vessel/vessel.utils'
import { fetchDatasetByIdThunk, selectDatasetById } from 'features/datasets/datasets.slice'
import { DEFAULT_VESSEL_IDENTITY_ID } from 'features/vessel/vessel.config'
import { selectTrackDataviews } from 'features/dataviews/selectors/dataviews.instances.selectors'

export type VesselToResolve = { id: string; name?: string; flag?: string; datasetId?: string }

// Supports both options:
// 1. When identity vessel already available: <VesselPin vessel={vessel} />
// 2. When identity vessel is not available and we only have the vesselId, for example reports or encounters:
//    <VesselPin vesselToResolve={vesselToResolve} /> This will fetch the vessel info and the info dataset
function VesselPin({
  vessel,
  vesselToResolve,
  disabled,
  className = '',
  size = 'small',
}: {
  vessel?: IdentityVessel
  vesselToResolve?: VesselToResolve
  className?: string
  disabled?: boolean
  size?: IconButtonSize
}) {
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { upsertDataviewInstance, deleteDataviewInstance } = useDataviewInstancesConnect()
  const vesselsInWorkspace = useSelector(selectTrackDataviews)
  const infoDatasetId = vessel?.dataset || vesselToResolve?.datasetId || DEFAULT_VESSEL_IDENTITY_ID
  const infoDataset = useSelector(selectDatasetById(infoDatasetId))
  const vesselId = vessel ? getVesselId(vessel) : vesselToResolve!?.id
  const vesselInWorkspace = getVesselInWorkspace(vesselsInWorkspace, vesselId)

  // This avoid requesting the vessel info again when we alredy requested it for the popup
  const populateVesselInfoResource = (
    vessel: IdentityVessel,
    vesselDataviewInstance: DataviewInstance
  ) => {
    const infoDatasetConfig = getVesselDataviewInstanceDatasetConfig(
      vesselId,
      vesselDataviewInstance.config || {}
    )?.find((dc) => dc.datasetId === infoDataset?.id)
    if (infoDataset && infoDatasetConfig) {
      const url = resolveEndpoint(infoDataset, infoDatasetConfig)
      if (url) {
        const resource: Resource = {
          url,
          dataset: infoDataset,
          datasetConfig: infoDatasetConfig,
          dataviewId: vesselDataviewInstance.dataviewId as string,
          data: vessel,
          status: ResourceStatus.Finished,
        }
        dispatch(setResource(resource))
      }
    }
  }

  const onPinClick = async () => {
    let vesselWithIdentity = vessel ? ({ ...vessel } as IdentityVessel) : undefined
    let infoDatasetResolved = { ...infoDataset } as Dataset
    if (vesselInWorkspace) {
      deleteDataviewInstance(vesselInWorkspace.id)
    } else {
      if (!infoDatasetResolved && infoDatasetId) {
        setLoading(true)
        // Fetch the info dataset when no available in the store
        const action = await dispatch(fetchDatasetByIdThunk(infoDatasetId))
        if (fetchDatasetByIdThunk.fulfilled.match(action)) {
          infoDatasetResolved = action.payload as Dataset
        } else {
          console.warn('Pin vessel is not available without an info dataset')
        }
      }
      if (!vesselWithIdentity && infoDatasetResolved) {
        // Fetch the vessel identity info no available
        const datasetConfig = getVesselInfoDataviewInstanceDatasetConfig(vesselId, {
          info: infoDatasetResolved?.id,
        })
        const url = resolveEndpoint(infoDatasetResolved, datasetConfig)
        if (url) {
          setLoading(true)
          try {
            vesselWithIdentity = await GFWAPI.fetch<IdentityVessel>(url)
          } catch (e) {
            setLoading(false)
          }
        }
      }
      if (vesselWithIdentity) {
        const trackDataset = getRelatedDatasetsByType(infoDataset, DatasetTypes.Tracks)?.[0]
        const vesselEventsDatasets = getRelatedDatasetsByType(infoDataset, DatasetTypes.Events)
        const eventsDatasetsId =
          vesselEventsDatasets && vesselEventsDatasets?.length
            ? vesselEventsDatasets.map((d) => d.id)
            : []
        const vesselDataviewInstance = getVesselDataviewInstance(
          { id: vesselId },
          {
            info: infoDataset?.id,
            track: trackDataset?.id,
            ...(eventsDatasetsId?.length && { events: eventsDatasetsId }),
            relatedVesselIds: getRelatedIdentityVesselIds(vesselWithIdentity),
          }
        )

        if (vesselDataviewInstance) {
          upsertDataviewInstance(vesselDataviewInstance)
          populateVesselInfoResource(vesselWithIdentity, vesselDataviewInstance)

          trackEvent({
            category: TrackCategory.Tracks,
            action: 'Click in vessel from grid cell panel',
            label: getEventLabel([infoDataset?.id || '', vesselId]),
          })
        }
      } else {
        console.warn('Vessel to pin not found')
      }
    }
    setLoading(false)
  }

  return (
    <IconButton
      icon={vesselInWorkspace ? 'pin-filled' : 'pin'}
      loading={loading}
      disabled={disabled}
      className={className}
      style={{
        color: vesselInWorkspace ? vesselInWorkspace.config?.color : '',
      }}
      tooltip={
        vesselInWorkspace
          ? t('search.vesselAlreadyInWorkspace', 'This vessel is already in your workspace')
          : t('vessel.addToWorkspace', 'Add vessel to view')
      }
      onClick={onPinClick}
      size={size}
    />
  )
}

export default VesselPin
