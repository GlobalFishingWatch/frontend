import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from '@tanstack/react-router'

import type { Workspace } from '@globalfishingwatch/api-types'
import { IconButton } from '@globalfishingwatch/ui-components'

import { DEFAULT_WORKSPACE_CATEGORY } from 'data/workspaces'
import { useSetMapCoordinates } from 'features/map/map-viewport.hooks'
import { getWorkspaceLabel } from 'features/workspace/workspace.utils'
import { selectWorkspaceListStatus } from 'features/workspaces-list/workspaces-list.slice'
import { useReplaceQueryParams } from 'router/routes.hook'
import { AsyncReducerStatus } from 'utils/async-slice'
import { sortByCreationDate } from 'utils/dates'
import { getHighlightedText } from 'utils/text'

import { selectUserWorkspacesPrivate } from './selectors/user.permissions.selectors'

import styles from './User.module.css'

function UserWorkspacesPrivate({ searchQuery }: { searchQuery: string }) {
  const { t } = useTranslation()
  const { replaceQueryParams } = useReplaceQueryParams()
  const workspaces = useSelector(selectUserWorkspacesPrivate)
  const workspacesStatus = useSelector(selectWorkspaceListStatus)
  const setMapCoordinates = useSetMapCoordinates()

  const onWorkspaceClick = (workspace: Workspace) => {
    if (workspace.viewport) {
      setMapCoordinates(workspace.viewport)
      replaceQueryParams(workspace.viewport)
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
        <label>{t((t) => t.workspace.privateTitle)}</label>
      </div>
      <ul>
        {sortByCreationDate<Workspace>(workspaces).map((workspace) => {
          const label = getWorkspaceLabel(workspace as any)
          if (!label.toLowerCase().includes(searchQuery.toLowerCase())) {
            return null
          }
          return (
            <li className={styles.workspace} key={workspace.id}>
              <Link
                className={styles.workspaceLink}
                to="/$category/$workspaceId"
                params={{
                  category: workspace.category || DEFAULT_WORKSPACE_CATEGORY,
                  workspaceId: workspace.id,
                }}
                search={{}}
                replace
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

export default UserWorkspacesPrivate
