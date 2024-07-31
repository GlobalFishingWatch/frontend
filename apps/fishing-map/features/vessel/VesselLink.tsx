import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'redux-first-router-link'
import { useTranslation } from 'react-i18next'
import { DataviewInstance, VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { Tooltip } from '@globalfishingwatch/ui-components'
import {
  selectCurrentWorkspaceCategory,
  selectCurrentWorkspaceId,
} from 'features/workspace/workspace.selectors'
import {
  VesselDataIdentity,
  resetVesselState,
  setVesselFitBoundsOnLoad,
} from 'features/vessel/vessel.slice'
import { VESSEL, WORKSPACE_VESSEL } from 'routes/routes'
import {
  selectIsStandaloneSearchLocation,
  selectIsVesselLocation,
  selectLocationQuery,
} from 'routes/routes.selectors'
import { DEFAULT_VESSEL_IDENTITY_ID } from 'features/vessel/vessel.config'
import { QueryParams } from 'types'
import { getVesselIdentityId } from 'features/vessel/vessel.utils'
import { selectVesselInfoDataId } from 'features/vessel/selectors/vessel.selectors'
import { DEFAULT_WORKSPACE_CATEGORY } from 'data/workspaces'

type VesselLinkProps = {
  datasetId?: string
  dataviewId?: string
  vesselId?: string
  identity?: VesselDataIdentity
  children: any
  onClick?: (e: MouseEvent) => void
  tooltip?: React.ReactNode
  fitBounds?: boolean
  className?: string
  query?: Partial<Record<keyof QueryParams, string | number>>
  testId?: string
}
const VesselLink = ({
  vesselId: vesselIdProp,
  datasetId,
  dataviewId,
  identity,
  children,
  onClick,
  tooltip,
  fitBounds = true,
  className = '',
  query,
  testId = 'link-vessel-profile',
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
        if (fitBounds) {
          // This needs to happen after dispatch resetVesselState so there is no override
          dispatch(setVesselFitBoundsOnLoad(true))
        }
      }
      if (onClick) {
        onClick(e)
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
                if (instance.id === dataviewId) {
                  return {
                    ...instance,
                    config: {
                      ...instance.config,
                      visible: true,
                    },
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
      <Tooltip
        maxWidth="none"
        content={tooltip || t('vessel.clickToSeeMore', 'Click to see more information')}
      >
        <span>{children}</span>
      </Tooltip>
    </Link>
  )
}

export default VesselLink
