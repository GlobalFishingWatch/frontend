import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'redux-first-router-link'
import {
  selectCurrentWorkspaceCategory,
  selectWorkspace,
} from 'features/workspace/workspace.selectors'
import { resetVesselState, selectVesselInfoDataId } from 'features/vessel/vessel.slice'
import { VESSEL, WORKSPACE_VESSEL } from 'routes/routes'
import { selectLocationQuery } from 'routes/routes.selectors'

type VesselLinkProps = {
  vesselId: string
  datasetId: string
  children: any
}
const VesselLink = ({ vesselId, datasetId, children }: VesselLinkProps) => {
  const workspace = useSelector(selectWorkspace)
  const query = useSelector(selectLocationQuery)
  const vesselInfoDataId = useSelector(selectVesselInfoDataId)
  const workspaceCategory = useSelector(selectCurrentWorkspaceCategory)
  const dispatch = useDispatch()

  const onInfoClick = useCallback(() => {
    if (vesselId !== vesselInfoDataId) {
      dispatch(resetVesselState())
    }
  }, [dispatch, vesselId, vesselInfoDataId])

  if (!vesselId) return children

  return (
    <Link
      to={{
        type: workspace ? WORKSPACE_VESSEL : VESSEL,
        payload: {
          category: workspaceCategory,
          workspaceId: workspace?.id,
          vesselId,
        },
        query: {
          ...query,
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
