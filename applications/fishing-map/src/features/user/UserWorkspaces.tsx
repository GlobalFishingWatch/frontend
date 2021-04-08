import React, { useCallback, useState } from 'react'
import Link from 'redux-first-router-link'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import Button from '@globalfishingwatch/ui-components/dist/button'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import { Workspace } from '@globalfishingwatch/api-types/dist'
import TooltipContainer from 'features/workspace/shared/TooltipContainer'
import { WORKSPACE } from 'routes/routes'
import { WorkspaceCategories } from 'data/workspaces'
import {
  deleteWorkspaceThunk,
  selectWorkspaceListStatus,
  selectWorkspaceListStatusId,
  updateWorkspaceThunk,
} from 'features/workspaces-list/workspaces-list.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import useViewport from 'features/map/map-viewport.hooks'
import { selectWorkspacesByUserGroup } from 'features/workspaces-list/workspaces-list.selectors'
import styles from './User.module.css'
import { selectUserGroups, selectUserWorkspaces } from './user.selectors'

function UserWorkspaces() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [workspaceTemplatesOpen, setWorkspaceTemplatesOpen] = useState(false)
  const [workspaceTemplates, setWorkspaceTemplates] = useState<string[] | undefined>()
  const { setMapCoordinates } = useViewport()
  const workspaces = useSelector(selectUserWorkspaces)
  const userGroups = useSelector(selectUserGroups)
  const workspacesByUserGroup = useSelector(selectWorkspacesByUserGroup)
  const workspacesStatus = useSelector(selectWorkspaceListStatus)
  const workspacesStatusId = useSelector(selectWorkspaceListStatusId)

  const loading = workspacesStatus === AsyncReducerStatus.Loading
  const updateLoading = workspacesStatus === AsyncReducerStatus.LoadingUpdate
  const deleteLoading = workspacesStatus === AsyncReducerStatus.LoadingDelete

  const onEditClick = useCallback(
    async (workspace: Workspace) => {
      const name = prompt(t('workspace.nameInput', 'Workspace name'), workspace.name)
      if (name) {
        await dispatch(updateWorkspaceThunk({ id: workspace.id, name }))
      }
    },
    [dispatch, t]
  )

  const onNewWorkspaceClick = useCallback(() => {
    const groupsWithTemplates = userGroups?.filter(
      (group) => workspacesByUserGroup[group] !== undefined
    )
    if (!groupsWithTemplates) {
      console.warn('Missing template for user groups', userGroups)
      return
    }
    if (groupsWithTemplates.length === 1) {
      console.log('do default')
    } else {
      console.log('prompt to select')
      setWorkspaceTemplates(groupsWithTemplates)
      setWorkspaceTemplatesOpen(true)
    }
  }, [userGroups, workspacesByUserGroup])

  const onWorkspaceClick = useCallback(
    (workspace: Workspace) => {
      if (workspace.viewport) {
        setMapCoordinates(workspace.viewport)
      }
    },
    [setMapCoordinates]
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
      }
    },
    [dispatch, t]
  )
  console.log(workspaceTemplates)
  return (
    <div className={styles.views}>
      <div className={styles.viewsHeader}>
        <label>{t('workspace.title_plural', 'Workspaces')}</label>
        <TooltipContainer
          visible={workspaceTemplatesOpen}
          onClickOutside={() => {
            setWorkspaceTemplatesOpen(false)
          }}
          component={
            <ul className={styles.workspaceTemplatesList}>
              {workspaceTemplates?.map((template) => (
                <li key={template} className={styles.workspaceTemplate}>
                  {template}
                </li>
              ))}
            </ul>
          }
        >
          {/* Div needed because of https://github.com/atomiks/tippyjs-react#component-children */}
          <div>
            <Button disabled={loading} type="secondary" onClick={onNewWorkspaceClick}>
              {t('workspace.new', 'New Workspace') as string}
            </Button>
          </div>
        </TooltipContainer>
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
                    onClick={() => onWorkspaceClick(workspace)}
                  >
                    <span className={styles.workspaceTitle}>{workspace.name}</span>
                    <IconButton icon="arrow-right" />
                  </Link>
                  <IconButton
                    icon="edit"
                    loading={workspace.id === workspacesStatusId && updateLoading}
                    tooltip={t('workspace.editName', 'Edit workspace name')}
                    onClick={() => onEditClick(workspace)}
                  />
                  <IconButton
                    icon="delete"
                    type="warning"
                    loading={workspace.id === workspacesStatusId && deleteLoading}
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
