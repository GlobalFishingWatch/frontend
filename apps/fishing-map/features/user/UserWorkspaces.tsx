import { useCallback, useState } from 'react'
import Link from 'redux-first-router-link'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Spinner, IconButton, Modal } from '@globalfishingwatch/ui-components'
// import TooltipContainer, { TooltipListContainer } from 'features/workspace/shared/TooltipContainer'
import { WORKSPACE } from 'routes/routes'
import { DEFAULT_WORKSPACE_CATEGORY } from 'data/workspaces'
import {
  AppWorkspace,
  deleteWorkspaceThunk,
  selectWorkspaceListStatus,
  selectWorkspaceListStatusId,
} from 'features/workspaces-list/workspaces-list.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import { useSetViewState } from 'features/map/map-viewport.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { getWorkspaceLabel } from 'features/workspace/workspace.utils'
import EditWorkspace from 'features/workspace/save/WorkspaceEdit'
import { ROOT_DOM_ELEMENT } from 'data/config'
import styles from './User.module.css'
import { selectUserWorkspaces } from './selectors/user.permissions.selectors'

function UserWorkspaces() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const setViewState = useSetViewState()
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
        setViewState(workspace.viewport)
      }
    },
    [setViewState]
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
                      {getWorkspaceLabel(workspace)}
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

export default UserWorkspaces
