import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from '@tanstack/react-router'

import { Button, Icon, IconButton, Modal, Spinner } from '@globalfishingwatch/ui-components'

import { ROOT_DOM_ELEMENT } from 'data/map/config'
import { DEFAULT_WORKSPACE_CATEGORY } from 'data/map/workspaces'
import { selectDeprecatedDatasets } from 'features/_map/datasets/datasets.slice'
import { hasWorkspaceDataviewsDeprecated } from 'features/_map/dataviews/dataviews.utils'
import { useSetMapCoordinates } from 'features/_map/map/map-viewport.hooks'
import EditWorkspace from 'features/_map/workspace/save/WorkspaceEdit'
import { getWorkspaceLabel } from 'features/_map/workspace/workspace.utils'
import type { AppWorkspace } from 'features/_map/workspaces-list/workspaces-list.slice'
import {
  deleteWorkspaceThunk,
  selectWorkspaceListStatus,
  selectWorkspaceListStatusId,
} from 'features/_map/workspaces-list/workspaces-list.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { getModalParent } from 'features/modals/modals.utils'
import { ROUTE_PATHS } from 'router/routes.utils'
import { AsyncReducerStatus } from 'utils/async-slice'
import { getHighlightedText } from 'utils/text'

import { selectUserWorkspaces } from './selectors/user.permissions.selectors'

import styles from './User.module.css'

function UserWorkspacesPublic({ searchQuery }: { searchQuery: string }) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const setMapCoordinates = useSetMapCoordinates()
  const [editWorkspace, setEditWorkspace] = useState<AppWorkspace | undefined>()
  const workspaces = useSelector(selectUserWorkspaces)
  const workspacesStatus = useSelector(selectWorkspaceListStatus)
  const workspacesStatusId = useSelector(selectWorkspaceListStatusId)
  const deprecatedDatasets = useSelector(selectDeprecatedDatasets)

  const loading =
    workspacesStatus === AsyncReducerStatus.Loading ||
    workspacesStatus === AsyncReducerStatus.LoadingItem
  const updateLoading = workspacesStatus === AsyncReducerStatus.LoadingUpdate
  const deleteLoading = workspacesStatus === AsyncReducerStatus.LoadingDelete

  const onWorkspaceClick = useCallback(
    (workspace: AppWorkspace) => {
      if (workspace.viewport) {
        setMapCoordinates(workspace.viewport)
      }
    },
    [setMapCoordinates]
  )

  const onDeleteClick = useCallback(
    async (workspace: AppWorkspace) => {
      const confirmation = window.confirm(
        `${t((t) => t.workspace.confirmRemove)}\n${workspace.name}`
      )
      if (confirmation) {
        await dispatch(deleteWorkspaceThunk(workspace.id))
      }
    },
    [dispatch, t]
  )

  const onClose = () => {
    setEditWorkspace(undefined)
  }

  return (
    <div className={styles.views}>
      <div className={styles.viewsHeader}>
        <label>{t((t) => t.workspace.titlePlural)}</label>
      </div>
      {editWorkspace && (
        <Modal
          appSelector={ROOT_DOM_ELEMENT}
          title={t((t) => t.workspace.edit)}
          isOpen
          shouldCloseOnEsc
          contentClassName={styles.modal}
          onClose={onClose}
          parentSelector={getModalParent}
        >
          <EditWorkspace workspace={editWorkspace} isWorkspaceList onFinish={onClose} />
        </Modal>
      )}
      {loading ? (
        <div className={styles.placeholder}>
          <Spinner size="small" />
        </div>
      ) : (
        <ul>
          {workspaces && workspaces?.length > 0 ? (
            workspaces.map((workspace) => {
              const isOutdated = hasWorkspaceDataviewsDeprecated(workspace, deprecatedDatasets)
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
                    <span className={styles.workspaceTitle} data-test="workspace-name">
                      {getHighlightedText(label as string, searchQuery, styles)}
                    </span>
                    {isOutdated ? (
                      <IconButton
                        icon="warning"
                        type={'warning-invert'}
                        loading={loading}
                        disabled={loading}
                        tooltip={t((t) => t.workspace.updateDeprecatedDataviews)}
                        size="small"
                      />
                    ) : (
                      <IconButton icon="arrow-right" />
                    )}
                  </Link>
                  {!isOutdated && (
                    <IconButton
                      icon="edit"
                      loading={workspace.id === workspacesStatusId && updateLoading}
                      tooltip={t((t) => t.workspace.editName)}
                      onClick={() => setEditWorkspace(workspace)}
                    />
                  )}
                  <IconButton
                    icon="delete"
                    type="warning"
                    loading={workspace.id === workspacesStatusId && deleteLoading}
                    tooltip={t((t) => t.workspace.remove)}
                    onClick={() => onDeleteClick(workspace)}
                    testId="remove-workspace-button"
                    data-testid="remove-workspace-button"
                  />
                </li>
              )
            })
          ) : (
            <div className={styles.placeholder} data-test="user-workspaces">
              {t((t) => t.workspace.emptyState)}
            </div>
          )}
        </ul>
      )}
    </div>
  )
}

export default UserWorkspacesPublic
