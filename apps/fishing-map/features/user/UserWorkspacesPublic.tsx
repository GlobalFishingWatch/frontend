import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Link from 'redux-first-router-link'

import { IconButton, Modal,Spinner } from '@globalfishingwatch/ui-components'

import { ROOT_DOM_ELEMENT } from 'data/config'
import { DEFAULT_WORKSPACE_CATEGORY } from 'data/workspaces'
import { useAppDispatch } from 'features/app/app.hooks'
import { useSetMapCoordinates } from 'features/map/map-viewport.hooks'
import EditWorkspace from 'features/workspace/save/WorkspaceEdit'
import { getWorkspaceLabel } from 'features/workspace/workspace.utils'
import type { AppWorkspace } from 'features/workspaces-list/workspaces-list.slice'
import {
  deleteWorkspaceThunk,
  selectWorkspaceListStatus,
  selectWorkspaceListStatusId,
} from 'features/workspaces-list/workspaces-list.slice'
import { WORKSPACE } from 'routes/routes'
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
        `${t(
          'workspace.confirmRemove',
          'Are you sure you want to permanently delete this workspace?'
        )}\n${workspace.name}`
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
        <label>{t('workspace.title_other', 'Workspaces')}</label>
      </div>
      {editWorkspace && (
        <Modal
          appSelector={ROOT_DOM_ELEMENT}
          title={t('workspace.edit', 'Edit workspace')}
          isOpen
          shouldCloseOnEsc
          contentClassName={styles.modal}
          onClose={onClose}
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
              const label = getWorkspaceLabel(workspace as any)
              if (!label.toLowerCase().includes(searchQuery.toLowerCase())) {
                return null
              }
              return (
                <li className={styles.workspace} key={workspace.id}>
                  <Link
                    className={styles.workspaceLink}
                    to={{
                      type: WORKSPACE,
                      payload: {
                        category: workspace.category || DEFAULT_WORKSPACE_CATEGORY,
                        workspaceId: workspace.id,
                      },
                      query: {},
                    }}
                    onClick={() => onWorkspaceClick(workspace)}
                  >
                    <span className={styles.workspaceTitle} data-test="workspace-name">
                      {getHighlightedText(label as string, searchQuery, styles)}
                    </span>
                    <IconButton icon="arrow-right" />
                  </Link>
                  <IconButton
                    icon="edit"
                    loading={workspace.id === workspacesStatusId && updateLoading}
                    tooltip={t('workspace.editName', 'Edit workspace name')}
                    onClick={() => setEditWorkspace(workspace)}
                  />
                  <IconButton
                    icon="delete"
                    type="warning"
                    loading={workspace.id === workspacesStatusId && deleteLoading}
                    tooltip={t('workspace.remove', 'Remove workspace')}
                    onClick={() => onDeleteClick(workspace)}
                    testId="remove-workspace-button"
                  />
                </li>
              )
            })
          ) : (
            <div className={styles.placeholder} data-test="user-workspaces">
              {t('workspace.emptyState', 'Your workspaces will appear here')}
            </div>
          )}
        </ul>
      )}
    </div>
  )
}

export default UserWorkspacesPublic
