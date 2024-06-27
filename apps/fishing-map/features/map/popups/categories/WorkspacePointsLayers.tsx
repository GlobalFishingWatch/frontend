import { Fragment, useCallback } from 'react'
import cx from 'classnames'
import Link from 'redux-first-router-link'
import { WorkspacesPickingObject } from '@globalfishingwatch/deck-layers'
import { IconButton } from '@globalfishingwatch/ui-components'
import { WORKSPACE } from 'routes/routes'
import { DEFAULT_WORKSPACE_CATEGORY } from 'data/workspaces'
import { useSetViewState } from 'features/map/map-viewport.hooks'
import { MapCoordinates } from 'types'
import { useAppDispatch } from 'features/app/app.hooks'
import { setClickedEvent } from '../../map.slice'
import styles from '../Popup.module.css'

type WorkspacePointsLayersProps = {
  features: WorkspacesPickingObject[]
  showFeaturesDetails?: boolean
}

function WorkspacePointsTooltipSection({
  features,
  showFeaturesDetails,
}: WorkspacePointsLayersProps) {
  const setViewState = useSetViewState()
  const dispatch = useAppDispatch()

  const onWorkspaceClick = useCallback(
    (viewport: MapCoordinates) => {
      if (viewport) {
        setViewState(viewport)
        dispatch(setClickedEvent(null))
      }
    },
    [dispatch, setViewState]
  )

  const WorkspaceLabel = ({
    label,
    viewAccess,
  }: Partial<WorkspacesPickingObject['properties']>) => {
    return (
      <span className={styles.workspaceLabel}>
        {viewAccess === 'private' && '🔒 '}
        {viewAccess === 'password' && '🔐 '}
        {label}
      </span>
    )
  }

  return (
    <Fragment>
      {features.map((feature) => {
        return (
          <div key={feature.properties.id} className={cx(styles.popupSection, styles.noIcon)}>
            {showFeaturesDetails ? (
              <Link
                className={styles.workspaceLink}
                to={{
                  type: WORKSPACE,
                  payload: {
                    category: feature.properties.category || DEFAULT_WORKSPACE_CATEGORY,
                    workspaceId: feature.properties.id,
                  },
                  query: {},
                }}
                onClick={() =>
                  onWorkspaceClick({
                    latitude: feature.properties.latitude,
                    longitude: feature.properties.longitude,
                    zoom: feature.properties.zoom,
                  })
                }
              >
                <WorkspaceLabel
                  label={feature.properties.label}
                  viewAccess={feature.properties.viewAccess}
                />
                <IconButton icon="arrow-right" size="small" />
              </Link>
            ) : (
              <WorkspaceLabel
                label={feature.properties.label}
                viewAccess={feature.properties.viewAccess}
              />
            )}
          </div>
        )
      })}
    </Fragment>
  )
}

export default WorkspacePointsTooltipSection