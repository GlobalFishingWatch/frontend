import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'redux-first-router-link'
import {
  selectCurrentWorkspaceCategory,
  selectCurrentWorkspaceId,
} from 'features/workspace/workspace.selectors'
import {
  VesselDataIdentity,
  resetVesselState,
  selectVesselInfoDataId,
} from 'features/vessel/vessel.slice'
import { VESSEL, WORKSPACE_VESSEL } from 'routes/routes'
import {
  selectIsStandaloneSearchLocation,
  selectIsVesselLocation,
  selectLocationQuery,
} from 'routes/routes.selectors'
import { DEFAULT_VESSEL_IDENTITY_ID } from 'features/vessel/vessel.config'
import { QueryParams, TimebarVisualisations } from 'types'
import { getVesselIdentyId } from 'features/vessel/vessel.utils'

export type VesselLinkProps = {
  datasetId?: string
  vesselId?: string
  identity?: VesselDataIdentity
  children: any
  onClick?: (e: MouseEvent) => void
  className?: string
  query?: Partial<Record<keyof QueryParams, string | number>>
}
const VesselLink = ({
  vesselId: vesselIdProp,
  datasetId,
  identity,
  children,
  onClick,
  className = '',
  query,
}: VesselLinkProps) => {
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
    (e) => {
      if (vesselId !== vesselInfoDataId) {
        dispatch(resetVesselState())
      }
      if (onClick) {
        onClick(e)
      }
    },
    [dispatch, onClick, vesselId, vesselInfoDataId]
  )
  if (identity) {
    console.log(identity.shipname)
    console.log({
      vesselIdentitySource: identity.identitySource,
      vesselIdentityId: getVesselIdentyId(identity),
    })
  }

  if (!vesselId) return children

  return (
    <Link
      className={className}
      to={{
        type: standaloneLink ? VESSEL : WORKSPACE_VESSEL,
        payload: {
          ...(!standaloneLink &&
            workspaceId && {
              category: workspaceCategory,
              workspaceId: workspaceId,
            }),
          vesselId,
        },
        query: {
          ...locationQuery,
          // Clean search url when clicking on vessel link
          qry: undefined,
          timebarVisualisation: TimebarVisualisations.Vessel,
          vesselDatasetId,
          ...(identity && {
            vesselIdentitySource: identity.identitySource,
            vesselIdentityId: getVesselIdentyId(identity),
          }),
          ...(query || {}),
        } as QueryParams,
      }}
      onClick={onLinkClick}
    >
      {children}
    </Link>
  )
}

export default VesselLink
