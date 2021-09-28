import React, { useCallback, useState } from 'react'
import Link from 'redux-first-router-link'
import { event as uaEvent } from 'react-ga'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Button from '@globalfishingwatch/ui-components/src/button'
import IconButton from '@globalfishingwatch/ui-components/src/icon-button'
import Spinner from '@globalfishingwatch/ui-components/src/spinner'
import { Workspace } from '@globalfishingwatch/api-types/dist'
import TooltipContainer, { TooltipListContainer } from 'features/workspace/shared/TooltipContainer'
import { WORKSPACE } from 'routes/routes'
import { WorkspaceCategories } from 'data/workspaces'
import {
  createWorkspaceThunk,
  deleteWorkspaceThunk,
  selectWorkspaceListStatus,
  selectWorkspaceListStatusId,
  updateWorkspaceThunk,
} from 'features/workspaces-list/workspaces-list.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import useViewport from 'features/map/map-viewport.hooks'
import {
  selectDefaultWorkspace,
  selectWorkspacesByUserGroup,
} from 'features/workspaces-list/workspaces-list.selectors'
import { useAppDispatch } from 'features/app/app.hooks'
import { useLocationConnect } from 'routes/routes.hook'
import { getEventLabel } from 'utils/analytics'
import styles from './User.module.css'
import { selectUserGroups, selectUserWorkspaces } from './user.selectors'

function UserWorkspaces() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { dispatchLocation } = useLocationConnect()
  const [creatingLoading, setCreatingLoading] = useState(false)
  const [workspaceTemplatesOpen, setWorkspaceTemplatesOpen] = useState(false)
  const [workspaceTemplates, setWorkspaceTemplates] = useState<string[] | undefined>()
  const { setMapCoordinates } = useViewport()
  const defaultWorkspace = useSelector(selectDefaultWorkspace)
  const workspaces = useSelector(selectUserWorkspaces)
  const userGroups = useSelector(selectUserGroups)
  const workspacesByUserGroup = useSelector(selectWorkspacesByUserGroup)
  const workspacesStatus = useSelector(selectWorkspaceListStatus)
  const workspacesStatusId = useSelector(selectWorkspaceListStatusId)

  const loading =
    workspacesStatus === AsyncReducerStatus.Loading ||
    workspacesStatus === AsyncReducerStatus.LoadingItem
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

  const createWorkspaceByUserGroup = useCallback(
    async (userGroup: string) => {
      const workspaceId = workspacesByUserGroup[userGroup]
      let defaultTemplate = false
      let template = workspaces.find((w) => w?.id === workspaceId)
      if (!template) {
        defaultTemplate = true
        template = defaultWorkspace
      }
      if (template) {
        const name = prompt(
          t('workspace.nameInput', 'Workspace name'),
          defaultTemplate ? '' : template.name
        )
        if (name) {
          if (name !== template.name) {
            setCreatingLoading(true)
            setWorkspaceTemplatesOpen(false)
            const workspace = {
              ...template,
              name,
            }
            const action = await dispatch(createWorkspaceThunk(workspace))
            uaEvent({
              category: 'Workspace Management',
              action: 'Save current workspace',
              label: getEventLabel([`base: ${template.name}`, name]),
            })
            if (createWorkspaceThunk.fulfilled.match(action)) {
              dispatchLocation(
                WORKSPACE,
                {
                  category: action.payload.category || WorkspaceCategories.FishingActivity,
                  workspaceId: action.payload.id,
                },
                true
              )
            } else {
              alert(
                t(
                  'errors.workspaceCreate',
                  'There was an error creating the workspace, please try again later'
                )
              )
            }
            setCreatingLoading(false)
          } else {
            alert(
              t('errors.workspaceDuplicatedName', 'There is already a workspace with this name')
            )
            createWorkspaceByUserGroup(userGroup)
          }
        } else if (name === '') {
          alert(t('errors.workspaceMissingName', 'Workspace name is needed'))
          createWorkspaceByUserGroup(userGroup)
        }
      }
    },
    [defaultWorkspace, dispatch, dispatchLocation, t, workspaces, workspacesByUserGroup]
  )

  const onWorkspaceUserGroupClick = useCallback(
    (userGroup: string) => {
      setWorkspaceTemplatesOpen(false)
      createWorkspaceByUserGroup(userGroup)
    },
    [createWorkspaceByUserGroup]
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
      createWorkspaceByUserGroup(groupsWithTemplates[0])
    } else {
      setWorkspaceTemplates(groupsWithTemplates)
      setWorkspaceTemplatesOpen(true)
    }
  }, [createWorkspaceByUserGroup, userGroups, workspacesByUserGroup])

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

  return (
    <div className={styles.views}>
      <div className={styles.viewsHeader}>
        <label>{t('workspace.title_other', 'Workspaces')}</label>
        <TooltipContainer
          visible={workspaceTemplatesOpen}
          onClickOutside={() => {
            setWorkspaceTemplatesOpen(false)
          }}
          component={
            <TooltipListContainer>
              {workspaceTemplates?.map((template) => (
                <li key={template}>
                  <button onClick={() => onWorkspaceUserGroupClick(template)}>{template}</button>
                </li>
              ))}
            </TooltipListContainer>
          }
        >
          {/* Div needed because of https://github.com/atomiks/tippyjs-react#component-children */}
          <div>
            <Button
              disabled={loading}
              loading={creatingLoading}
              type="secondary"
              onClick={onNewWorkspaceClick}
            >
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
