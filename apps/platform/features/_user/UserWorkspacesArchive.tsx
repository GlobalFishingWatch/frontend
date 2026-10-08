import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from '@tanstack/react-router'

import type { Workspace } from '@globalfishingwatch/api-types'
import { IconButton } from '@globalfishingwatch/ui-components'
import { DEFAULT_WORKSPACE_CATEGORY } from '@platform/config/map/workspaces'
import { ROUTE_PATHS } from '@platform/config/routes'

import { useSetMapCoordinates } from 'features/_map/map/map-viewport.hooks'
import { getWorkspaceLabel } from 'features/_map/workspace/workspace.utils'
import { selectWorkspaceListStatus } from 'features/_map/workspaces-list/workspaces-list.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import { getHighlightedText } from 'utils/text'

import { selectUserWorkspacesArchived } from './selectors/user.permissions.selectors'

import styles from './User.module.css'

function UserWorkspacesArchive({ searchQuery }: { searchQuery: string }) {
  const { t } = useTranslation()
  const workspaces = useSelector(selectUserWorkspacesArchived)
  const workspacesStatus = useSelector(selectWorkspaceListStatus)
  const setMapCoordinates = useSetMapCoordinates()

  const onWorkspaceClick = (workspace: Workspace) => {
    if (workspace.viewport) {
      setMapCoordinates(workspace.viewport)
    }
  }

  const loading =
    workspacesStatus === AsyncReducerStatus.Loading ||
    workspacesStatus === AsyncReducerStatus.LoadingItem

  if (loading || !workspaces || workspaces.length === 0) {
    return null
  }

  return (
    <div className={styles.views}>
      <div className={styles.viewsHeader}>
        <label>{t((t) => t.workspace.archiveTitle)}</label>
      </div>
      <ul>
        {workspaces.map((workspace) => {
          const label = getWorkspaceLabel(workspace as any)
          if (!label.toLowerCase().includes(searchQuery.toLowerCase())) {
            return null
          }
          return (
            <li className={styles.workspace} key={workspace.id}>
              <Link
                className={styles.workspaceLink}
                to={ROUTE_PATHS.WORKSPACE}
                params={{
                  category: workspace.category || DEFAULT_WORKSPACE_CATEGORY,
                  workspaceId: workspace.id,
                }}
                search={{}}
                onClick={() => onWorkspaceClick(workspace)}
              >
                <span className={styles.workspaceTitle}>
                  {getHighlightedText(label as string, searchQuery, styles)}
                </span>
                <IconButton icon="arrow-right" />
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default UserWorkspacesArchive
