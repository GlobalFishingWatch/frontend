import { useCallback, useState } from 'react'
import Link from 'redux-first-router-link'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Spinner, IconButton } from '@globalfishingwatch/ui-components'
// import TooltipContainer, { TooltipListContainer } from 'features/workspace/shared/TooltipContainer'
import { WORKSPACE } from 'routes/routes'
import { WorkspaceCategories } from 'data/workspaces'
import {
  AppWorkspace,
  deleteWorkspaceThunk,
  selectWorkspaceListStatus,
  selectWorkspaceListStatusId,
  updateWorkspaceThunk,
} from 'features/workspaces-list/workspaces-list.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import useViewport from 'features/map/map-viewport.hooks'
// import {
//   selectDefaultWorkspace,
//   selectWorkspacesByUserGroup,
// } from 'features/workspaces-list/workspaces-list.selectors'
import { useAppDispatch } from 'features/app/app.hooks'
import { useLocationConnect } from 'routes/routes.hook'
import NewWorkspaceModal from 'features/workspace/shared/NewWorkspaceModal'
import { cleanCurrentWorkspaceData } from 'features/workspace/workspace.slice'
import { getWorkspaceLabel } from 'features/workspace/workspace.utils'
import styles from './User.module.css'
import { selectUserWorkspaces } from './user.selectors'

function UserWorkspaces() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { dispatchLocation } = useLocationConnect()
  // const [workspaceTemplatesOpen, setWorkspaceTemplatesOpen] = useState(false)
  const [workspaceTemplateSelected, setWorkspaceTemplateSelected] = useState<
    AppWorkspace | undefined
  >()
  // const [workspaceTemplates, setWorkspaceTemplates] = useState<string[] | undefined>()
  const { setMapCoordinates } = useViewport()
  // const defaultWorkspace = useSelector(selectDefaultWorkspace)
  const workspaces = useSelector(selectUserWorkspaces)
  // const userGroups = useSelector(selectUserGroups)
  // const workspacesByUserGroup = useSelector(selectWorkspacesByUserGroup)
  const workspacesStatus = useSelector(selectWorkspaceListStatus)
  const workspacesStatusId = useSelector(selectWorkspaceListStatusId)

  const loading =
    workspacesStatus === AsyncReducerStatus.Loading ||
    workspacesStatus === AsyncReducerStatus.LoadingItem
  const updateLoading = workspacesStatus === AsyncReducerStatus.LoadingUpdate
  const deleteLoading = workspacesStatus === AsyncReducerStatus.LoadingDelete

  const onEditClick = useCallback(
    async (workspace: AppWorkspace) => {
      const name = prompt(t('workspace.nameInput', 'Workspace name'), workspace.name)
      if (name) {
        await dispatch(updateWorkspaceThunk({ id: workspace.id, name }))
      }
    },
    [dispatch, t]
  )

  // const createWorkspaceByUserGroup = useCallback(
  //   (userGroup: string) => {
  //     const workspaceId = workspacesByUserGroup[userGroup]
  //     const template = workspaces.find((w) => w?.id === workspaceId) || defaultWorkspace
  //     setWorkspaceTemplateSelected({
  //       ...template,
  //       name: '',
  //     })
  //   },
  //   [defaultWorkspace, workspaces, workspacesByUserGroup]
  // )

  const closeWorkspaceCreate = useCallback(() => {
    setWorkspaceTemplateSelected(undefined)
  }, [])

  const onWorkspaceCreateFinish = useCallback(
    (workspace: AppWorkspace) => {
      if (workspace) {
        closeWorkspaceCreate()
        dispatch(cleanCurrentWorkspaceData())
        dispatchLocation(
          WORKSPACE,
          {
            payload: {
              category: workspace.category || WorkspaceCategories.FishingActivity,
              workspaceId: workspace.id,
            },
          },
          true
        )
      }
    },
    [closeWorkspaceCreate, dispatch, dispatchLocation]
  )

  // const onWorkspaceUserGroupClick = useCallback(
  //   (userGroup: string) => {
  //     setWorkspaceTemplatesOpen(false)
  //     createWorkspaceByUserGroup(userGroup)
  //   },
  //   [createWorkspaceByUserGroup]
  // )

  // const onNewWorkspaceClick = useCallback(() => {
  //   const groupsWithTemplates = userGroups?.filter(
  //     (group) => workspacesByUserGroup?.[group] !== undefined
  //   )
  //   if (!groupsWithTemplates) {
  //     console.warn('Missing template for user groups', userGroups)
  //     return
  //   }
  //   if (groupsWithTemplates.length === 1) {
  //     createWorkspaceByUserGroup(groupsWithTemplates[0])
  //   } else {
  //     setWorkspaceTemplates(groupsWithTemplates)
  //     setWorkspaceTemplatesOpen(true)
  //   }
  // }, [createWorkspaceByUserGroup, userGroups, workspacesByUserGroup])

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

  return (
    <div className={styles.views}>
      <div className={styles.viewsHeader}>
        <label>{t('workspace.title_other', 'Workspaces')}</label>
        {/* COMMENTED OUT UNTIL WE HAVE THE WORKSPACE GENERATOR */}
        {/* <TooltipContainer
          visible={workspaceTemplatesOpen}
          placement="right"
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
          // Div needed because of https://github.com/atomiks/tippyjs-react#component-children
          <div>
            <Button disabled={loading} type="secondary" onClick={onNewWorkspaceClick}>
              {t('workspace.new', 'New Workspace') as string}
            </Button>
          </div>
        </TooltipContainer> */}
      </div>
      {workspaceTemplateSelected && (
        <NewWorkspaceModal
          title={t('workspace.new', 'New workspace')}
          isOpen={workspaceTemplateSelected !== undefined}
          onClose={closeWorkspaceCreate}
          onFinish={onWorkspaceCreateFinish}
          workspace={workspaceTemplateSelected}
          suggestName={false}
        />
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
                        category: workspace.category || WorkspaceCategories.FishingActivity,
                        workspaceId: workspace.id,
                      },
                      query: {},
                    }}
                    onClick={() => onWorkspaceClick(workspace)}
                  >
                    <span className={styles.workspaceTitle}>{getWorkspaceLabel(workspace)}</span>
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
