import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { stringify } from 'qs'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type {
  APIPagination,
  Dataset,
  DataviewInstanceOrigin,
  IdentityVessel,
} from '@globalfishingwatch/api-types'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import { resolveEndpoint } from '@globalfishingwatch/datasets-client'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { IconButtonSize } from '@globalfishingwatch/ui-components'
import { IconButton } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { fetchDatasetByIdThunk, selectDatasetById } from 'features/datasets/datasets.slice'
import { getRelatedDatasetsByType } from 'features/datasets/datasets.utils'
import {
  getVesselDataview,
  getVesselDataviewInstance,
  getVesselInfoDataviewInstanceDatasetConfig,
} from 'features/dataviews/dataviews.utils'
import { selectTrackDataviews } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { selectVesselTemplateDataviews } from 'features/dataviews/selectors/dataviews.vessels.selectors'
import type { ExtendedFeatureVessel } from 'features/map/map.slice'
import { usePopulateVesselResource } from 'features/reports/shared/vessels/report-vessels.hooks'
import { getRelatedIdentityVesselIds, getVesselId } from 'features/vessel/vessel.utils'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { setWorkspaceSuggestSave } from 'features/workspace/workspace.slice'
import { getEventLabel } from 'utils/analytics'

export type VesselToResolve = {
  id: string
  name?: string
  flag?: string
  datasetId: string
}
export type VesselToSearch = { id: string; name?: string; flag?: string; datasets?: string[] }
export type VesselPinClickProps = {
  dataviewInstance?: UrlDataviewInstance | null | undefined
  vesselId?: string
}

export type VesselPinOnClickCb = ({ vesselId, dataviewInstance }: VesselPinClickProps) => void

type VesselPinProps = {
  vessel?: IdentityVessel | ExtendedFeatureVessel
  vesselToResolve?: VesselToResolve
  vesselToSearch?: VesselToSearch
  className?: string
  disabled?: boolean
  size?: IconButtonSize
  origin?: DataviewInstanceOrigin
  onClick?: VesselPinOnClickCb
}
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
  origin,
  onClick,
}: VesselPinProps) {
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { upsertDataviewInstance, deleteDataviewInstance } = useDataviewInstancesConnect()
  const populateVesselInfoResource = usePopulateVesselResource()
  const vesselsInWorkspace = useSelector(selectTrackDataviews)
  const vesselTemplateDataviews = useSelector(selectVesselTemplateDataviews)
  const infoDatasetId =
    typeof vessel?.dataset === 'string'
      ? vessel?.dataset
      : vessel?.dataset?.id || vesselToResolve?.datasetId || ''
  const infoDataset = useSelector(selectDatasetById(infoDatasetId))
  const vesselInstanceId = vessel
    ? getVesselId(vessel)
    : vesselToResolve?.id || vesselToSearch?.id || ''
  const vesselInWorkspaceSameOriginDataview = getVesselDataview({
    dataviews: vesselsInWorkspace,
    vesselId: vesselInstanceId,
    origin,
  })

  const onPinClick = async () => {
    let dataviewInstance = vesselInWorkspaceSameOriginDataview
    let vesselWithIdentity = vessel ? ({ ...vessel } as IdentityVessel) : undefined
    let infoDatasetIdResolved = infoDatasetId
    let infoDatasetResolved = infoDataset ? ({ ...infoDataset } as Dataset) : undefined
    const vesselInWorkspaceDataview = getVesselDataview({
      dataviews: vesselsInWorkspace,
      vesselId: vesselInstanceId,
    })
    if (vesselInWorkspaceSameOriginDataview) {
      deleteDataviewInstance(vesselInWorkspaceSameOriginDataview.id)
    } else if (vesselInWorkspaceDataview) {
      upsertDataviewInstance({ id: vesselInWorkspaceDataview.id, origin })
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
        const vesselDataviewInstance = getVesselDataviewInstance({
          vessel: { id: getVesselId(vesselWithIdentity) },
          datasets: {
            info: infoDatasetResolved?.id,
            track: trackDataset?.id,
            ...(eventsDatasetsId?.length && { events: eventsDatasetsId }),
            relatedVesselIds: getRelatedIdentityVesselIds(vesselWithIdentity),
          },
          origin,
          vesselTemplateDataviews,
        })

        if (vesselDataviewInstance) {
          upsertDataviewInstance(vesselDataviewInstance)
          dataviewInstance = vesselDataviewInstance
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
    dispatch(setWorkspaceSuggestSave(true))
    onClick?.({
      vesselId: getVesselId(vessel as IdentityVessel),
      dataviewInstance,
    })
  }

  return (
    <IconButton
      icon={vesselInWorkspaceSameOriginDataview ? 'pin-filled' : 'pin'}
      loading={loading}
      disabled={disabled}
      className={className}
      style={{
        color: vesselInWorkspaceSameOriginDataview
          ? vesselInWorkspaceSameOriginDataview.config?.color
          : '',
      }}
      tooltip={
        vesselInWorkspaceSameOriginDataview
          ? t('search.vesselAlreadyInWorkspace', 'This vessel is already in your workspace')
          : t('vessel.addToWorkspace', 'Add vessel to view')
      }
      onClick={onPinClick}
      size={size}
    />
  )
}

export default VesselPin
