import { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { DndContext } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove } from '@dnd-kit/sortable'
import { Spinner, Button, IconButton, Modal, InputText } from '@globalfishingwatch/ui-components'
import { useLocationConnect } from 'routes/routes.hook'
import { selectWorkspaceStatus, selectWorkspace } from 'features/workspace/workspace.selectors'
import { fetchResourceThunk } from 'features/resources/resources.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import { isGFWUser } from 'features/user/user.slice'
import { selectLocationCategory } from 'routes/routes.selectors'
import { selectReadOnly, selectSearchQuery } from 'features/app/app.selectors'
import { PRIVATE_SUFIX, PUBLIC_SUFIX, ROOT_DOM_ELEMENT, USER_SUFIX } from 'data/config'
import { DEFAULT_WORKSPACE_ID, WorkspaceCategories } from 'data/workspaces'
import {
  selectDataviewInstancesMergedOrdered,
  selectDataviewsResources,
} from 'features/dataviews/dataviews.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { parseTrackEventChunkProps } from 'features/timebar/timebar.utils'
import { parseUserTrackCallback } from 'features/resources/resources.utils'
import DetectionsSection from 'features/workspace/detections/DetectionsSection'
import { selectWorkspaceVessselGroupsIds } from 'features/vessel-groups/vessel-groups.selectors'
import { useHideLegacyActivityCategoryDataviews } from 'features/workspace/legacy-activity-category.hook'
import { updateWorkspaceThunk } from 'features/workspaces-list/workspaces-list.slice'
import { WIZARD_TEMPLATE_ID } from 'data/default-workspaces/marine-manager'
import {
  fetchWorkspaceVesselGroupsThunk,
  selectWorkspaceVesselGroupsStatus,
} from 'features/vessel-groups/vessel-groups.slice'
import WorkspaceError from 'features/workspace/WorkspaceError'
import ActivitySection from './activity/ActivitySection'
import VesselsSection from './vessels/VesselsSection'
import EventsSection from './events/EventsSection'
import EnvironmentalSection from './environmental/EnvironmentalSection'
import ContextAreaSection from './context-areas/ContextAreaSection'
import styles from './Workspace.module.css'

const Search = dynamic(() => import(/* webpackChunkName: "Search" */ 'features/search/Search'))

function Workspace() {
  useHideLegacyActivityCategoryDataviews()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const searchQuery = useSelector(selectSearchQuery)
  const readOnly = useSelector(selectReadOnly)
  const gfwUser = useSelector(isGFWUser)
  const workspace = useSelector(selectWorkspace)
  const dataviews = useSelector(selectDataviewInstancesMergedOrdered)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const workspaceVesselGroupsStatus = useSelector(selectWorkspaceVesselGroupsStatus)
  const locationCategory = useSelector(selectLocationCategory)
  const dataviewsResources = useSelector(selectDataviewsResources)
  const workspaceVesselGroupsIds = useSelector(selectWorkspaceVessselGroupsIds)
  const isUserWorkspace =
    workspace?.id?.endsWith(`-${USER_SUFIX}`) ||
    workspace?.id?.endsWith(`-${USER_SUFIX}-${PUBLIC_SUFIX}`)
  const { dispatchQueryParams } = useLocationConnect()
  const [workspaceEditName, setWorkspaceEditName] = useState(workspace?.name)
  const [workspaceEditDescription, setWorkspaceEditDescription] = useState(workspace?.description)
  const [workspaceEditModalOpen, setWorkspaceEditModalOpen] = useState(false)
  const [editWorkspaceLoading, setEditWorkspaceLoading] = useState(false)

  useEffect(() => {
    if (workspace) {
      setWorkspaceEditName(workspace.name)
      setWorkspaceEditDescription(workspace.description)
    }
  }, [workspace])

  useEffect(() => {
    if (dataviewsResources) {
      const { resources } = dataviewsResources
      resources.forEach((resource) => {
        dispatch(
          fetchResourceThunk({
            resource,
            resourceKey: resource.key,
            parseEventCb: parseTrackEventChunkProps,
            parseUserTrackCb: parseUserTrackCallback,
          })
        )
      })
    }
  }, [dispatch, dataviewsResources])

  useEffect(() => {
    if (workspaceVesselGroupsIds.length) {
      dispatch(fetchWorkspaceVesselGroupsThunk(workspaceVesselGroupsIds))
    }
  }, [workspaceVesselGroupsIds, dispatch])

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event
      if (active && over && active.id !== over.id) {
        const oldIndex = dataviews.findIndex((d) => d.id === active.id)
        const newIndex = dataviews.findIndex((d) => d.id === over.id)
        const dataviewInstancesId = arrayMove(dataviews, oldIndex, newIndex).map((d) => d.id)
        dispatchQueryParams({ dataviewInstancesOrder: dataviewInstancesId })
      }
    },
    [dataviews, dispatchQueryParams]
  )

  const onWorkspaceUpdateClose = useCallback(() => {
    setEditWorkspaceLoading(false)
    setWorkspaceEditModalOpen(false)
  }, [])

  const onWorkspaceUpdateClick = useCallback(
    async (workspaceId) => {
      setEditWorkspaceLoading(true)
      await dispatch(
        updateWorkspaceThunk({
          id: workspaceId,
          name: workspaceEditName,
          description: workspaceEditDescription,
        })
      )
      onWorkspaceUpdateClose()
    },
    [dispatch, onWorkspaceUpdateClose, workspaceEditDescription, workspaceEditName]
  )

  if (
    workspaceStatus === AsyncReducerStatus.Idle ||
    workspaceStatus === AsyncReducerStatus.Loading
  ) {
    return (
      <div className={styles.placeholder}>
        <Spinner />
      </div>
    )
  }

  if (
    workspaceStatus === AsyncReducerStatus.Error ||
    workspaceVesselGroupsStatus === AsyncReducerStatus.Error
  ) {
    return <WorkspaceError />
  }

  if (searchQuery !== undefined) {
    return <Search />
  }

  return (
    <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
      {(locationCategory === WorkspaceCategories.MarineManager ||
        locationCategory === WorkspaceCategories.FishingActivity) &&
        workspace?.name &&
        workspace?.id !== WIZARD_TEMPLATE_ID &&
        workspace?.id !== DEFAULT_WORKSPACE_ID &&
        !readOnly && (
          <div className={styles.header}>
            {isUserWorkspace && (
              <label className={styles.subTitle}>{t('workspace.user', 'User workspace')}</label>
            )}
            <h2 className={styles.title}>
              {workspace.id.startsWith(PRIVATE_SUFIX) && '🔒 '}
              {workspace.name}
              {gfwUser && (
                <IconButton
                  className="print-hidden"
                  size="small"
                  icon="edit"
                  onClick={() => setWorkspaceEditModalOpen(true)}
                />
              )}
            </h2>
            <Modal
              appSelector={ROOT_DOM_ELEMENT}
              title={t('workspace.edit', 'Edit workspace')}
              isOpen={workspaceEditModalOpen}
              contentClassName={styles.modalContainer}
              onClose={onWorkspaceUpdateClose}
            >
              <div className={styles.content}>
                <InputText
                  value={workspaceEditName}
                  className={styles.input}
                  inputSize="small"
                  label={t('common.name', 'Name')}
                  onChange={(e) => setWorkspaceEditName(e.target.value)}
                />
                <InputText
                  value={workspaceEditDescription}
                  className={styles.input}
                  inputSize="small"
                  label={t('common.description', 'Description')}
                  onChange={(e) => setWorkspaceEditDescription(e.target.value)}
                />
              </div>
              <div className={styles.modalFooter}>
                <Button
                  className={styles.saveBtn}
                  loading={editWorkspaceLoading}
                  onClick={() => onWorkspaceUpdateClick(workspace?.id)}
                >
                  {t('common.update', 'Update') as string}
                </Button>
              </div>
            </Modal>
          </div>
        )}
      <ActivitySection />
      <DetectionsSection />
      <VesselsSection />
      <EventsSection />
      <EnvironmentalSection />
      <ContextAreaSection />
    </DndContext>
  )
}

export default Workspace
