import { useCallback } from 'react'
import Link from 'redux-first-router-link'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { IconButton } from '@globalfishingwatch/ui-components'
import { Workspace } from '@globalfishingwatch/api-types'
import { WORKSPACE } from 'routes/routes'
import { WorkspaceCategory } from 'data/workspaces'
import { selectWorkspaceListStatus } from 'features/workspaces-list/workspaces-list.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import useViewport from 'features/map/map-viewport.hooks'
import { getWorkspaceLabel } from 'features/workspace/workspace.utils'
import { sortByCreationDate } from 'utils/dates'
import { selectUserWorkspacesPrivate } from './user.selectors'
import styles from './User.module.css'

function UserWorkspacesPrivate() {
  const { t } = useTranslation()
  const { setMapCoordinates } = useViewport()
  const workspaces = useSelector(selectUserWorkspacesPrivate)
  const workspacesStatus = useSelector(selectWorkspaceListStatus)

  const onWorkspaceClick = useCallback(
    (workspace: Workspace) => {
      if (workspace.viewport) {
        setMapCoordinates(workspace.viewport)
      }
    },
    [setMapCoordinates]
  )

  const loading =
    workspacesStatus === AsyncReducerStatus.Loading ||
    workspacesStatus === AsyncReducerStatus.LoadingItem

  if (loading || !workspaces || workspaces.length === 0) {
    return null
  }

  return (
    <div className={styles.views}>
      <div className={styles.viewsHeader}>
        <label>{t('workspace.privateTitle_other', 'Private workspaces')}</label>
      </div>
      <ul>
        {sortByCreationDate<Workspace>(workspaces).map((workspace) => {
          return (
            <li className={styles.workspace} key={workspace.id}>
              <Link
                className={styles.workspaceLink}
                to={{
                  type: WORKSPACE,
                  payload: {
                    category: workspace.category || WorkspaceCategory.FishingActivity,
                    workspaceId: workspace.id,
                  },
                  query: {},
                }}
                onClick={() => onWorkspaceClick(workspace)}
              >
                <span className={styles.workspaceTitle}>{getWorkspaceLabel(workspace)}</span>
                <IconButton icon="arrow-right" />
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default UserWorkspacesPrivate
