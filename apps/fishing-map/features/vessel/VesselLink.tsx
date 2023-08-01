import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'redux-first-router-link'
import {
  selectCurrentWorkspaceCategory,
  selectCurrentWorkspaceId,
} from 'features/workspace/workspace.selectors'
import { resetVesselState, selectVesselInfoDataId } from 'features/vessel/vessel.slice'
import { VESSEL, WORKSPACE_VESSEL } from 'routes/routes'
import { selectLocationQuery } from 'routes/routes.selectors'
import { DEFAULT_VESSEL_IDENTITY_ID } from 'features/vessel/vessel.config'
import { QueryParams } from 'types'

export type VesselLinkProps = {
  vesselId: string
  datasetId?: string
  query?: Partial<Record<keyof QueryParams, string | number>>
  children: any
  onClick?: () => void
}
const VesselLink = ({
  vesselId,
  datasetId = DEFAULT_VESSEL_IDENTITY_ID,
  children,
  onClick,
  query,
}: VesselLinkProps) => {
  const workspaceId = useSelector(selectCurrentWorkspaceId)
  const locationQuery = useSelector(selectLocationQuery)
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
      to={{
        type: workspaceId ? WORKSPACE_VESSEL : VESSEL,
        payload: {
          category: workspaceCategory,
          workspaceId: workspaceId,
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
