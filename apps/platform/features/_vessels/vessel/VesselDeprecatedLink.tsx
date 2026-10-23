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
import { getVesselLatestDatasetId } from 'features/_vessels/vessel/vessel.config'
import { selectIncludeRelatedIdentities } from 'features/_vessels/vessel/vessel.config.selectors'
import type { IdentityVesselData } from 'features/_vessels/vessel/vessel.slice'
import { fetchVesselInfoThunk } from 'features/_vessels/vessel/vessel.slice'
import {
  getLatestVesselDataviewInstance,
  getVesselProperty,
} from 'features/_vessels/vessel/vessel.utils'
import { useAppDispatch } from 'features/app/app.hooks'
import { useReplaceQueryParams } from 'router/routes.hook'
import { selectVesselId } from 'router/routes.selectors'

type VesselDeprecatedLinkProps = {
  vesselIdentity: IdentityVessel | IdentityVesselData
  // Deprecated vessels are switched in place in this dataview instead of searched again
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
  const latestVesselDatasetId = dataview
    ? getVesselLatestDatasetId(vesselDatasetId, deprecatedDatasets, dataview.datasets)
    : undefined

  const onSwitchToLatestClick = useCallback(() => {
    if (!dataview || !latestVesselDatasetId) {
      return
    }
    replaceQueryParams((prev) => ({
      dataviewInstances: mergeDataviewIntancesToUpsert(
        getLatestVesselDataviewInstance(dataview, deprecatedDatasets),
        prev.dataviewInstances || []
      ),
      ...(isVesselProfile && latestVesselDatasetId && { vesselDatasetId: latestVesselDatasetId }),
    }))
    if (isVesselProfile) {
      // The profile only fetches the info on mount, so it needs a refresh with the new dataset
      dispatch(
        fetchVesselInfoThunk({
          vesselId: profileVesselId,
          datasetId: latestVesselDatasetId,
          includeRelatedIdentities,
          isRefresh: true,
        })
      )
    }
  }, [
    dataview,
    deprecatedDatasets,
    dispatch,
    includeRelatedIdentities,
    isVesselProfile,
    latestVesselDatasetId,
    profileVesselId,
    replaceQueryParams,
  ])

  if (latestVesselDatasetId) {
    return (
      <IconButton
        icon="update-required"
        type="update-required"
        size="medium"
        tooltip={t((t) => t.workspace.deprecatedVesselLayerSwitch)}
        onClick={onSwitchToLatestClick}
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
