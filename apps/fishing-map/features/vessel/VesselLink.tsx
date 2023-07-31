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
import { IDENTITY_VESSEL_DATASET_ID } from 'features/datasets/datasets.mock'

type VesselLinkProps = {
  vesselId: string
  datasetId?: string
  children: any
  onClick?: () => void
}
const VesselLink = ({
  vesselId,
  datasetId = IDENTITY_VESSEL_DATASET_ID,
  children,
  onClick,
}: VesselLinkProps) => {
  const workspaceId = useSelector(selectCurrentWorkspaceId)
  const query = useSelector(selectLocationQuery)
  const vesselInfoDataId = useSelector(selectVesselInfoDataId)
  const workspaceCategory = useSelector(selectCurrentWorkspaceCategory)
  const dispatch = useDispatch()

  const onInfoClick = useCallback(() => {
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
          ...query,
          // Clean search url when clicking on vessel link
          qry: undefined,
          vesselDatasetId: datasetId,
        },
      }}
      onClick={onInfoClick}
    >
      {children}
    </Link>
  )
}

export default VesselLink
