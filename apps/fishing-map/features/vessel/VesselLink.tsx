import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'redux-first-router-link'
import { selectCurrentWorkspaceCategory } from 'features/workspace/workspace.selectors'
import { resetVesselState, selectVesselInfoDataId } from 'features/vessel/vessel.slice'
import { VESSEL, WORKSPACE_VESSEL } from 'routes/routes'
import { selectWorkspaceId } from 'routes/routes.selectors'

type VesselLinkProps = {
  vesselId: string
  datasetId: string
  children: any
}
const VesselLink = ({ vesselId, datasetId, children }: VesselLinkProps) => {
  const workspaceId = useSelector(selectWorkspaceId)
  const vesselInfoDataId = useSelector(selectVesselInfoDataId)
  const workspaceCategory = useSelector(selectCurrentWorkspaceCategory)
  const dispatch = useDispatch()

  const onInfoClick = useCallback(() => {
    if (vesselId !== vesselInfoDataId) {
      dispatch(resetVesselState())
    }
  }, [dispatch, vesselId, vesselInfoDataId])

  return (
    <Link
      // className={styles.workspaceLink}
      to={{
        type: workspaceId ? WORKSPACE_VESSEL : VESSEL,
        payload: {
          category: workspaceCategory,
          workspaceId: workspaceId,
          vesselId,
        },
        query: {
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
