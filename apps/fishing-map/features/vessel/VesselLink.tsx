import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'redux-first-router-link'
import {
  selectCurrentWorkspaceCategory,
  selectCurrentWorkspaceId,
} from 'features/workspace/workspace.selectors'
import { resetVesselState, selectVesselInfoDataId } from 'features/vessel/vessel.slice'
import { VESSEL, WORKSPACE_VESSEL } from 'routes/routes'
import { selectIsStandaloneSearchLocation, selectLocationQuery } from 'routes/routes.selectors'
import { DEFAULT_VESSEL_IDENTITY_ID } from 'features/vessel/vessel.config'
import { QueryParams } from 'types'

export type VesselLinkProps = {
  vesselId: string
  datasetId?: string
  query?: Partial<Record<keyof QueryParams, string | number>>
  children: any
  onClick?: () => void
  className?: string
}
const VesselLink = ({
  vesselId,
  datasetId = DEFAULT_VESSEL_IDENTITY_ID,
  children,
  onClick,
  query,
  className = '',
}: VesselLinkProps) => {
  const workspaceId = useSelector(selectCurrentWorkspaceId)
  const locationQuery = useSelector(selectLocationQuery)
  const isSearchLocation = useSelector(selectIsStandaloneSearchLocation)
  const vesselInfoDataId = useSelector(selectVesselInfoDataId)
  const workspaceCategory = useSelector(selectCurrentWorkspaceCategory)
  const dispatch = useDispatch()

  const onLinkClick = useCallback(() => {
    if (vesselId !== vesselInfoDataId) {
      dispatch(resetVesselState())
    }
    if (onClick) {
      onClick()
    }
  }, [dispatch, onClick, vesselId, vesselInfoDataId])

  if (!vesselId) return children

  return (
    <Link
      className={className}
      to={{
        type: isSearchLocation || !workspaceId ? VESSEL : WORKSPACE_VESSEL,
        payload: {
          ...(!isSearchLocation && {
            category: workspaceCategory,
            workspaceId: workspaceId,
          }),
          vesselId,
        },
        query: {
          ...locationQuery,
          // Clean search url when clicking on vessel link
          qry: undefined,
          vesselDatasetId: datasetId,
          ...(query || {}),
        },
      }}
      onClick={onLinkClick}
    >
      {children}
    </Link>
  )
}

export default VesselLink
