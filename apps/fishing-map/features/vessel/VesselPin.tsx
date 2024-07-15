import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { stringify } from 'qs'
import { IconButton, IconButtonSize } from '@globalfishingwatch/ui-components'
import {
  APIPagination,
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
import { selectTrackDataviews } from 'features/dataviews/selectors/dataviews.instances.selectors'

export type VesselToResolve = { id: string; name?: string; flag?: string; datasetId?: string }
export type VesselToSearch = { id: string; name?: string; flag?: string; datasets?: string[] }

// Supports both options:
// 1. When identity vessel already available: <VesselPin vessel={vessel} />
// 2. When identity vessel is not available and we only have the vesselId, for example reports or encounters:
//    <VesselPin vesselToResolve={vesselToResolve} /> This will fetch the vessel info and the info dataset
function VesselPin({
  vessel,
  vesselToResolve,
  vesselToSearch,
  disabled,
  className = '',
  size = 'small',
  onClick,
}: {
  vessel?: IdentityVessel
  vesselToResolve?: VesselToResolve
  vesselToSearch?: VesselToSearch
  className?: string
  disabled?: boolean
  size?: IconButtonSize
  onClick?: () => void
}) {
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { upsertDataviewInstance, deleteDataviewInstance } = useDataviewInstancesConnect()
  const vesselsInWorkspace = useSelector(selectTrackDataviews)
  const infoDatasetId = vessel?.dataset || vesselToResolve?.datasetId || ''
  const infoDataset = useSelector(selectDatasetById(infoDatasetId))
  const vesselInWorkspace = getVesselInWorkspace(
    vesselsInWorkspace,
    vessel ? getVesselId(vessel) : vesselToResolve!?.id || vesselToSearch?.id || ''
  )

  // This avoid requesting the vessel info again when we alredy requested it for the popup
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

  const onPinClick = async () => {
    let vesselWithIdentity = vessel ? ({ ...vessel } as IdentityVessel) : undefined
    let infoDatasetIdResolved = infoDatasetId
    let infoDatasetResolved = infoDataset ? ({ ...infoDataset } as Dataset) : undefined
    if (vesselInWorkspace) {
      deleteDataviewInstance(vesselInWorkspace.id)
    } else {
      if (!vesselWithIdentity && vesselToSearch) {
        setLoading(true)
        const vessels = await GFWAPI.fetch<APIPagination<IdentityVessel>>(
          `/vessels?${stringify({
            ids: [vesselToSearch.id],
            datasets: vesselToSearch.datasets,
          })}`
        )
        if (vessels?.entries[0]) {
          vesselWithIdentity = vessels?.entries[0]
          infoDatasetIdResolved = vesselWithIdentity.dataset
        }
      }
      if (!infoDatasetResolved && infoDatasetIdResolved) {
        setLoading(true)
        // Fetch the info dataset when no available in the store
        const action = await dispatch(fetchDatasetByIdThunk(infoDatasetIdResolved))
        if (fetchDatasetByIdThunk.fulfilled.match(action)) {
          infoDatasetResolved = action.payload as Dataset
        } else {
          console.warn('Pin vessel is not available without an info dataset')
        }
      }
      if (!vesselWithIdentity && infoDatasetResolved && vesselToResolve) {
        // Fetch the vessel identity info no available
        const datasetConfig = getVesselInfoDataviewInstanceDatasetConfig(vesselToResolve?.id, {
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
        const trackDataset = getRelatedDatasetsByType(infoDatasetResolved, DatasetTypes.Tracks)?.[0]
        const vesselEventsDatasets = getRelatedDatasetsByType(
          infoDatasetResolved,
          DatasetTypes.Events
        )
        const eventsDatasetsId =
          vesselEventsDatasets && vesselEventsDatasets?.length
            ? vesselEventsDatasets.map((d) => d.id)
            : []
        const vesselDataviewInstance = getVesselDataviewInstance(
          { id: getVesselId(vesselWithIdentity) },
          {
            info: infoDatasetResolved?.id,
            track: trackDataset?.id,
            ...(eventsDatasetsId?.length && { events: eventsDatasetsId }),
            relatedVesselIds: getRelatedIdentityVesselIds(vesselWithIdentity),
          }
        )

        if (vesselDataviewInstance) {
          upsertDataviewInstance(vesselDataviewInstance)
          populateVesselInfoResource(
            vesselWithIdentity,
            vesselDataviewInstance,
            infoDatasetResolved!
          )

          trackEvent({
            category: TrackCategory.Tracks,
            action: 'Click in vessel from grid cell panel',
            label: getEventLabel([infoDataset?.id || '', getVesselId(vesselWithIdentity)]),
          })
        }
      } else {
        console.warn('Vessel to pin not found')
      }
    }
    setLoading(false)
    onClick?.()
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
