import { Fragment, useCallback } from 'react'
import { Link } from '@tanstack/react-router'
import cx from 'classnames'

import type { WorkspacesPickingObject } from '@globalfishingwatch/deck-layers'
import { IconButton } from '@globalfishingwatch/ui-components'

import { PRIVATE_ICON, PRIVATE_PASSWORD_ICON } from 'data/config'
import { DEFAULT_WORKSPACE_CATEGORY } from 'data/workspaces'
import { useClickedEventConnect } from 'features/map/map-interactions.hooks'
import { useSetMapCoordinates } from 'features/map/map-viewport.hooks'
import type { MapCoordinates } from 'types'

import styles from '../Popup.module.css'

type WorkspacePointsLayersProps = {
  features: WorkspacesPickingObject[]
  showFeaturesDetails?: boolean
}

function WorkspacePointsTooltipSection({
  features,
  showFeaturesDetails,
}: WorkspacePointsLayersProps) {
  const setMapCoordinates = useSetMapCoordinates()
  const { dispatchClickedEvent } = useClickedEventConnect()

  const onWorkspaceClick = useCallback(
    (viewport: MapCoordinates) => {
      if (viewport) {
        setMapCoordinates(viewport)
        dispatchClickedEvent(null)
      }
    },
    [dispatchClickedEvent, setMapCoordinates]
  )

  const WorkspaceLabel = ({
    label,
    viewAccess,
  }: Partial<WorkspacesPickingObject['properties']>) => {
    return (
      <span className={styles.workspaceLabel}>
        {viewAccess === 'private' && `${PRIVATE_ICON} `}
        {viewAccess === 'password' && `${PRIVATE_PASSWORD_ICON} `}
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
                to="/$category/$workspaceId"
                params={{
                  category: feature.properties.category || DEFAULT_WORKSPACE_CATEGORY,
                  workspaceId: feature.properties.id,
                }}
                search={{}}
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
