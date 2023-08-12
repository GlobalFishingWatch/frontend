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
import useAddVesselDataviewInstance, {
  VesselDataviewInstanceParams,
} from 'features/vessel/vessel.hooks'

export type VesselLinkProps = {
  vesselId?: string
  datasetId?: string
  vessel?: VesselDataviewInstanceParams
  children: any
  onClick?: () => void
  className?: string
  addDataviewInstance?: boolean
  query?: Partial<Record<keyof QueryParams, string | number>>
}
const VesselLink = ({
  vesselId: vesselIdProp,
  datasetId,
  vessel,
  children,
  onClick,
  className = '',
  addDataviewInstance = false,
  query,
}: VesselLinkProps) => {
  const workspaceId = useSelector(selectCurrentWorkspaceId)
  const locationQuery = useSelector(selectLocationQuery)
  const isSearchLocation = useSelector(selectIsStandaloneSearchLocation)
  const vesselInfoDataId = useSelector(selectVesselInfoDataId)
  const workspaceCategory = useSelector(selectCurrentWorkspaceCategory)
  const addVesselDataviewInstance = useAddVesselDataviewInstance()
  const dispatch = useDispatch()
  const vesselId = vesselIdProp || vessel?.id
  const vesselDatasetId = datasetId || vessel?.dataset?.id || DEFAULT_VESSEL_IDENTITY_ID

  const onLinkClick = useCallback(() => {
    if (vessel && addDataviewInstance) {
      addVesselDataviewInstance(vessel)
    }
    if (vesselId !== vesselInfoDataId) {
      dispatch(resetVesselState())
    }
    if (onClick) {
      onClick()
    }
  }, [
    addDataviewInstance,
    addVesselDataviewInstance,
    dispatch,
    onClick,
    vessel,
    vesselId,
    vesselInfoDataId,
  ])

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
          vesselDatasetId,
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
