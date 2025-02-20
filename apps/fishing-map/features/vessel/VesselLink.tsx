import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'redux-first-router-link'

import type { DataviewInstance } from '@globalfishingwatch/api-types'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { Tooltip } from '@globalfishingwatch/ui-components'

import { DEFAULT_WORKSPACE_CATEGORY } from 'data/workspaces'
import { selectVesselInfoDataId } from 'features/vessel/selectors/vessel.selectors'
import { DEFAULT_VESSEL_IDENTITY_ID } from 'features/vessel/vessel.config'
import type { VesselDataIdentity } from 'features/vessel/vessel.slice'
import { resetVesselState, setVesselFitBoundsOnLoad } from 'features/vessel/vessel.slice'
import { getVesselIdentityId } from 'features/vessel/vessel.utils'
import {
  selectCurrentWorkspaceCategory,
  selectCurrentWorkspaceId,
} from 'features/workspace/workspace.selectors'
import { VESSEL, WORKSPACE_VESSEL } from 'routes/routes'
import {
  selectIsStandaloneSearchLocation,
  selectIsVesselLocation,
  selectLocationQuery,
} from 'routes/routes.selectors'
import type { QueryParams } from 'types'

import styles from './Vessel.module.css'

type VesselLinkProps = {
  datasetId?: string
  dataviewId?: string
  vesselId?: string
  identity?: VesselDataIdentity
  children?: any
  onClick?: (e: MouseEvent, vesselId?: string) => void
  tooltip?: React.ReactNode
  fitBounds?: boolean
  className?: string
  query?: Partial<Record<keyof QueryParams, string | number>>
  testId?: string
  showTooltip?: boolean
}
const VesselLink = ({
  vesselId: vesselIdProp,
  datasetId,
  dataviewId,
  identity,
  children = '',
  onClick,
  tooltip,
  fitBounds = false,
  className = '',
  query,
  testId = 'link-vessel-profile',
  showTooltip = true,
}: VesselLinkProps) => {
  const { t } = useTranslation()
  const workspaceId = useSelector(selectCurrentWorkspaceId)
  const locationQuery = useSelector(selectLocationQuery)
  const isSearchLocation = useSelector(selectIsStandaloneSearchLocation)
  const isVesselLocation = useSelector(selectIsVesselLocation)
  const vesselInfoDataId = useSelector(selectVesselInfoDataId)
  const workspaceCategory = useSelector(selectCurrentWorkspaceCategory)
  const dispatch = useDispatch()
  const vesselId = vesselIdProp || identity?.id
  const vesselDatasetId = datasetId || DEFAULT_VESSEL_IDENTITY_ID
  const standaloneLink = isSearchLocation || isVesselLocation

  const onLinkClick = useCallback(
    (e: any) => {
      if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        if (vesselId !== vesselInfoDataId) {
          dispatch(resetVesselState())
        }
        // This needs to happen after dispatch resetVesselState so there is no override
        dispatch(setVesselFitBoundsOnLoad(fitBounds))
      }
      if (onClick) {
        onClick(e, vesselId)
      }
    },
    [dispatch, fitBounds, onClick, vesselId, vesselInfoDataId]
  )

  if (!vesselId) return children

  return (
    <Link
      {...(testId && { 'data-test': testId })}
      className={className}
      to={{
        type: standaloneLink ? VESSEL : WORKSPACE_VESSEL,
        payload: {
          ...(!standaloneLink &&
            workspaceId && {
              category: workspaceCategory || DEFAULT_WORKSPACE_CATEGORY,
              workspaceId: workspaceId,
            }),
          vesselId,
        },
        query: {
          ...locationQuery,
          // Clean search url when clicking on vessel link
          query: undefined,
          vesselDatasetId,
          ...(identity && {
            vesselIdentitySource: identity.identitySource,
            ...(identity.identitySource === VesselIdentitySourceEnum.SelfReported
              ? {
                  vesselSelfReportedId: getVesselIdentityId(identity),
                }
              : { vesselRegistryId: getVesselIdentityId(identity) }),
          }),
          ...(query || {}),
          ...(locationQuery?.dataviewInstances?.length && {
            dataviewInstances: locationQuery?.dataviewInstances?.map(
              (instance: DataviewInstance) => {
                const matches = instance.id.includes(vesselId) || instance.id === dataviewId
                if (matches) {
                  return {
                    ...instance,
                    config: {
                      ...instance.config,
                      visible: true,
                    },
                    deleted: false,
                  }
                }
                return instance
              }
            ),
          }),
        },
      }}
      onClick={onLinkClick}
    >
      {showTooltip ? (
        <Tooltip
          className={styles.linkTooltip}
          content={tooltip || t('vessel.clickToSeeMore', 'Click to see more information')}
        >
          <span>{children}</span>
        </Tooltip>
      ) : (
        children
      )}
    </Link>
  )
}

export default VesselLink
