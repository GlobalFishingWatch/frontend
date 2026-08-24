import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from '@tanstack/react-router'

import type { IdentityVessel } from '@globalfishingwatch/api-types'
import { getIsVMSDataset } from '@globalfishingwatch/datasets-client'
import { IconButton } from '@globalfishingwatch/ui-components'
import { DEFAULT_WORKSPACE_CATEGORY, DEFAULT_WORKSPACE_ID } from '@platform/config/map/workspaces'

import { selectDeprecatedDatasets } from 'features/_map/datasets/datasets.slice'
import { selectWorkspace } from 'features/_map/workspace/workspace.selectors'
import type { IdentityVesselData } from 'features/_vessels/vessel/vessel.slice'
import { getVesselProperty } from 'features/_vessels/vessel/vessel.utils'
import { ROUTE_PATHS } from 'router/routes.utils'

const VesselDeprecatedLink = ({
  vesselIdentity,
}: {
  vesselIdentity: IdentityVessel | IdentityVesselData
}) => {
  const workspace = useSelector(selectWorkspace)
  const deprecatedDatasets = useSelector(selectDeprecatedDatasets)
  const { t } = useTranslation()
  const vesselDatasetId =
    typeof vesselIdentity.dataset === 'string' ? vesselIdentity.dataset : vesselIdentity.dataset.id

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
        icon="warning"
        type="warning-invert"
        size="small"
        tooltip={t((t) => t.workspace.deprecatedVesselLayer)}
      />
    </Link>
  )
}

export default VesselDeprecatedLink
