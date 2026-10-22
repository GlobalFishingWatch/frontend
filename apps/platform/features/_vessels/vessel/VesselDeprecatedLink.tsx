import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from '@tanstack/react-router'

import type { IdentityVessel } from '@globalfishingwatch/api-types'
import { getIsVMSDataset } from '@globalfishingwatch/datasets-client'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { IconButton } from '@globalfishingwatch/ui-components'
import { DEFAULT_WORKSPACE_CATEGORY, DEFAULT_WORKSPACE_ID } from '@platform/config/map/workspaces'
import { ROUTE_PATHS } from '@platform/config/routes'

import { selectDeprecatedDatasets } from 'features/_map/datasets/datasets.slice'
import { mergeDataviewIntancesToUpsert } from 'features/_map/workspace/workspace.hook'
import { selectWorkspace } from 'features/_map/workspace/workspace.selectors'
import {
  getIsPipe4VesselDataset,
  getPipe5VesselDatasetId,
} from 'features/_vessels/vessel/vessel.config'
import { selectIncludeRelatedIdentities } from 'features/_vessels/vessel/vessel.config.selectors'
import type { IdentityVesselData } from 'features/_vessels/vessel/vessel.slice'
import { fetchVesselInfoThunk } from 'features/_vessels/vessel/vessel.slice'
import {
  getPipe5VesselDataviewInstance,
  getVesselProperty,
} from 'features/_vessels/vessel/vessel.utils'
import { useAppDispatch } from 'features/app/app.hooks'
import { useReplaceQueryParams } from 'router/routes.hook'
import { selectVesselId } from 'router/routes.selectors'

type VesselDeprecatedLinkProps = {
  vesselIdentity: IdentityVessel | IdentityVesselData
  // Pipe 4 vessels are switched in place in this dataview instead of searched again
  dataview?: UrlDataviewInstance
  isVesselProfile?: boolean
}

const VesselDeprecatedLink = ({
  vesselIdentity,
  dataview,
  isVesselProfile = false,
}: VesselDeprecatedLinkProps) => {
  const dispatch = useAppDispatch()
  const workspace = useSelector(selectWorkspace)
  const deprecatedDatasets = useSelector(selectDeprecatedDatasets)
  const includeRelatedIdentities = useSelector(selectIncludeRelatedIdentities)
  const profileVesselId = useSelector(selectVesselId)
  const { replaceQueryParams } = useReplaceQueryParams()
  const { t } = useTranslation()
  const vesselDatasetId =
    typeof vesselIdentity.dataset === 'string' ? vesselIdentity.dataset : vesselIdentity.dataset.id
  const isPipe4Vessel = !!dataview && getIsPipe4VesselDataset(vesselDatasetId)

  const onSwitchToPipe5Click = useCallback(() => {
    if (!dataview) {
      return
    }
    const pipe5VesselDatasetId = getPipe5VesselDatasetId(vesselDatasetId)
    replaceQueryParams((prev) => ({
      dataviewInstances: mergeDataviewIntancesToUpsert(
        getPipe5VesselDataviewInstance(dataview),
        prev.dataviewInstances || []
      ),
      ...(isVesselProfile && { vesselDatasetId: pipe5VesselDatasetId }),
    }))
    if (isVesselProfile) {
      // The profile only fetches the info on mount, so it needs a refresh with the new dataset
      dispatch(
        fetchVesselInfoThunk({
          vesselId: profileVesselId,
          datasetId: pipe5VesselDatasetId,
          includeRelatedIdentities,
          isRefresh: true,
        })
      )
    }
  }, [
    dataview,
    dispatch,
    includeRelatedIdentities,
    isVesselProfile,
    profileVesselId,
    replaceQueryParams,
    vesselDatasetId,
  ])

  if (isPipe4Vessel) {
    return (
      <IconButton
        icon="update-required"
        type="update-required"
        size="medium"
        tooltip={t((t) => t.workspace.deprecatedVesselLayerSwitch)}
        onClick={onSwitchToPipe5Click}
      />
    )
  }

  return (
    <Link
      to={ROUTE_PATHS.WORKSPACE_SEARCH}
      params={{
        category: workspace?.category || DEFAULT_WORKSPACE_CATEGORY,
        workspaceId: workspace?.id || DEFAULT_WORKSPACE_ID,
      }}
      search={{
        searchOption: 'advanced',
        query: getVesselProperty(vesselIdentity, 'shipname'),
        ...(!getIsVMSDataset(vesselDatasetId) && {
          ssvid: getVesselProperty(vesselIdentity, 'ssvid'),
        }),
        sources: deprecatedDatasets[vesselDatasetId]
          ? [deprecatedDatasets[vesselDatasetId]]
          : undefined,
        flag: getVesselProperty(vesselIdentity, 'flag')
          ? [getVesselProperty(vesselIdentity, 'flag')]
          : undefined,
      }}
    >
      <IconButton
        icon="update-required"
        type="warning-invert"
        size="small"
        tooltip={t((t) => t.workspace.deprecatedVesselLayer)}
      />
    </Link>
  )
}

export default VesselDeprecatedLink
