import Link from 'redux-first-router-link'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import Button from '@globalfishingwatch/ui-components/dist/button'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import { Workspace } from '@globalfishingwatch/api-types/dist'
import { WORKSPACE } from 'routes/routes'
import { WorkspaceCategories } from 'data/workspaces'
import {
  fetchWorkspacesThunk,
  selectWorkspaceListStatus,
} from 'features/workspaces-list/workspaces-list.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import { deleteWorkspaceThunk, updateWorkspaceNameThunk } from 'features/workspace/workspace.slice'
import styles from './User.module.css'
import { selectUserWorkspaces } from './user.selectors'
import { selectUserData } from './user.slice'

function UserWorkspaces() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const userData = useSelector(selectUserData)
  const workspaces = useSelector(selectUserWorkspaces)
  const workspacesStatus = useSelector(selectWorkspaceListStatus)

  const loading = workspacesStatus === AsyncReducerStatus.Loading

  const onEditClick = useCallback(
    async (workspace: Workspace) => {
      const name = prompt(t('workspace.nameInput', 'Workspace name'), workspace.name)
      if (name) {
        await dispatch(updateWorkspaceNameThunk({ id: workspace.id, name }))
        dispatch(fetchWorkspacesThunk({ userId: userData?.id }))
      }
    },
    [dispatch, t]
  )

  const onDeleteClick = useCallback(
    async (workspace: Workspace) => {
      const confirmation = window.confirm(
        `${t(
          'workspace.confirmRemove',
          'Are you sure you want to permanently delete this workspace?'
        )}\n${workspace.name}`
      )
      if (confirmation) {
        await dispatch(deleteWorkspaceThunk(workspace.id))
        dispatch(fetchWorkspacesThunk({ userId: userData?.id }))
      }
    },
    [dispatch, t]
  )

  return (
    <div className={styles.views}>
      <div className={styles.viewsHeader}>
        <label>{t('workspace.title_plural', 'Workspaces')}</label>
        <Button disabled={loading} type="secondary" tooltip="Coming soon">
          {t('workspace.new', 'New Workspace') as string}
        </Button>
      </div>
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
                        category: workspace.category || WorkspaceCategories.FishingActivity,
                        workspaceId: workspace.id,
                      },
                      query: {},
                    }}
                  >
                    <span className={styles.workspaceTitle}>{workspace.name}</span>
                    <IconButton icon="arrow-right" />
                  </Link>
                  <IconButton
                    icon="edit"
                    tooltip={t('workspace.editName', 'Edit workspace name')}
                    onClick={() => onEditClick(workspace)}
                  />
                  <IconButton
                    icon="delete"
                    type="warning"
                    tooltip={t('workspace.remove', 'Remove workspace')}
                    onClick={() => onDeleteClick(workspace)}
                  />
                </li>
              )
            })
          ) : (
            <div className={styles.placeholder}>
              {t('workspace.emptyState', 'Your workspaces will appear here')}
            </div>
          )}
        </ul>
      )}
    </div>
  )
}

export default UserWorkspaces
