import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Link from 'redux-first-router-link'

import type { IdentityVessel } from '@globalfishingwatch/api-types'
import { IconButton } from '@globalfishingwatch/ui-components'

import { DEFAULT_WORKSPACE_CATEGORY, DEFAULT_WORKSPACE_ID } from 'data/workspaces'
import { selectDeprecatedDatasets } from 'features/datasets/datasets.slice'
import type { IdentityVesselData } from 'features/vessel/vessel.slice'
import { getVesselProperty } from 'features/vessel/vessel.utils'
import { selectWorkspace } from 'features/workspace/workspace.selectors'
import { WORKSPACE_SEARCH } from 'routes/routes'

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
      to={{
        type: WORKSPACE_SEARCH,
        payload: {
          category: workspace?.category || DEFAULT_WORKSPACE_CATEGORY,
          workspaceId: workspace?.id || DEFAULT_WORKSPACE_ID,
        },
        query: {
          searchOption: 'advanced',
          query: getVesselProperty(vesselIdentity, 'shipname'),
          ssvid: getVesselProperty(vesselIdentity, 'ssvid'),
          sources: deprecatedDatasets[vesselDatasetId]
            ? [deprecatedDatasets[vesselDatasetId]]
            : undefined,
          flag: getVesselProperty(vesselIdentity, 'flag')
            ? [getVesselProperty(vesselIdentity, 'flag')]
            : undefined,
        },
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
