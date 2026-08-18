import { Fragment, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from '@tanstack/react-router'

import { Button, Icon } from '@globalfishingwatch/ui-components'

import GFWOnly from 'features/_user/GFWOnly'
import { selectIsGFWUser } from 'features/_user/selectors/user.selectors'
import { selectVesselInfoStatus } from 'features/_vessels/vessel/selectors/vessel.selectors'
import {
  DEFAULT_VESSEL_IDENTITY_ID,
  VESSEL_IDENTITY_ID_V5,
} from 'features/_vessels/vessel/vessel.config'
import {
  selectIncludeRelatedIdentities,
  selectVesselDatasetId,
} from 'features/_vessels/vessel/vessel.config.selectors'
import { useReplaceQueryParams } from 'router/routes.hook'
import { selectVesselId, selectWorkspaceId } from 'router/routes.selectors'
import type { QueryParams } from 'types'
import { AsyncReducerStatus } from 'utils/async-slice'

import styles from './Vessel.module.css'

const PIPE_5_WORKSPACE_ID = 'pipe_v_5-public'

const VesselSubHeader = () => {
  const router = useRouter()
  const { replaceQueryParams } = useReplaceQueryParams()
  const vesselId = useSelector(selectVesselId)
  const workspaceId = useSelector(selectWorkspaceId)
  const isGFWUser = useSelector(selectIsGFWUser)
  const includeRelatedIdentities = useSelector(selectIncludeRelatedIdentities)
  const infoStatus = useSelector(selectVesselInfoStatus)
  const datasetId = useSelector(selectVesselDatasetId)
  const isPipe5Workspace = workspaceId === PIPE_5_WORKSPACE_ID

  const handleFullProfileClick = useCallback(() => {
    replaceQueryParams({
      includeRelatedIdentities: true,
      start: undefined,
      end: undefined,
      vesselSelfReportedId: undefined,
    })
  }, [replaceQueryParams])

  const getSwitchVersionHref = useCallback(
    (otherVesselDatasetId: string) => {
      const location = router.buildLocation({
        search: (prev: QueryParams) => ({ ...prev, vesselDatasetId: otherVesselDatasetId }),
      } as any)
      return location.href
    },
    [router]
  )

  if (!isGFWUser) {
    return null
  }

  return (
    <Fragment>
      {infoStatus === AsyncReducerStatus.Finished && !includeRelatedIdentities && (
        <div className={styles.fullProfileMessage}>
          <div>
            Identity and activity of a single vessel id (only for GFW users):
            <br />
            {vesselId}
          </div>
          <Button type="secondary" size="small" className="" onClick={handleFullProfileClick}>
            See full profile
          </Button>
        </div>
      )}
      {infoStatus === AsyncReducerStatus.Finished && isPipe5Workspace && (
        <div className={styles.fullProfileMessage}>
          <div>
            <GFWOnly className={styles.pipe4Disclaimer}>
              This vessel profile is using{' '}
              {datasetId === VESSEL_IDENTITY_ID_V5 ? 'pipe 5' : 'pipe 4'} dataset.
              <a
                href={getSwitchVersionHref(
                  datasetId === VESSEL_IDENTITY_ID_V5
                    ? DEFAULT_VESSEL_IDENTITY_ID
                    : VESSEL_IDENTITY_ID_V5
                )}
                className={styles.pipe4DisclaimerLink}
                target="_blank"
              >
                Open in {datasetId === VESSEL_IDENTITY_ID_V5 ? 'pipe 4' : 'pipe 5'}
                <Icon icon="external-link" />
              </a>
            </GFWOnly>
          </div>
        </div>
      )}
    </Fragment>
  )
}

export default VesselSubHeader
