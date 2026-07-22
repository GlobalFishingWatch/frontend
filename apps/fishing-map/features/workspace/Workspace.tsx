import { Fragment, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { DndContext } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove } from '@dnd-kit/sortable'

import { Spinner } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectDataviewInstancesMergedOrdered } from 'features/dataviews/selectors/dataviews.resolvers.selectors'
import { useFetchDataviewResources } from 'features/resources/resources.hooks'
import { useUserExpiredToast } from 'features/user/user-expired.hooks'
import { selectWorkspaceVessselGroupsIds } from 'features/vessel-groups/vessel-groups.selectors'
import {
  fetchWorkspaceVesselGroupsThunk,
  selectWorkspaceVesselGroupsStatus,
} from 'features/vessel-groups/vessel-groups.slice'
import DetectionsSection from 'features/workspace/detections/DetectionsSection'
import { useHideLegacyActivityCategoryDataviews } from 'features/workspace/legacy-activity-category.hook'
import UserSection from 'features/workspace/user/UserSection/UserSection'
import {
  selectIsWorkspacePasswordRequired,
  selectTimeMode,
  selectWorkspace,
  selectWorkspaceStatus,
} from 'features/workspace/workspace.selectors'
import { isPrivateWorkspaceNotAllowed } from 'features/workspace/workspace.utils'
import { useMigrateWorkspaceToast } from 'features/workspace/workspace-migration.hooks'
import WorkspaceError from 'features/workspace/WorkspaceError'
import WorkspacePassword from 'features/workspace/WorkspacePassword'
import WorkspaceTitle from 'features/workspace/WorkspaceTitle'
import { useReplaceQueryParams } from 'router/routes.hook'
import { AsyncReducerStatus } from 'utils/async-slice'

import ActivitySection from './activity/ActivitySection'
import ContextAreaSection from './context-areas/ContextAreaSection'
import EnvironmentalSection from './environmental/EnvironmentalSection'
import EventsSection from './events/EventsSection'
import VesselGroupSection from './vessel-groups/VesselGroupsSection'
import VesselsSection from './vessels/VesselsSection'

import styles from './Workspace.module.css'

function Workspace() {
  const { t } = useTranslation()
  useHideLegacyActivityCategoryDataviews()
  useUserExpiredToast()
  useMigrateWorkspaceToast()
  const dispatch = useAppDispatch()
  const { replaceQueryParams } = useReplaceQueryParams()
  const isWorkspacePasswordRequired = useSelector(selectIsWorkspacePasswordRequired)
  const workspace = useSelector(selectWorkspace)
  const timeMode = useSelector(selectTimeMode)
  const dataviews = useSelector(selectDataviewInstancesMergedOrdered)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const workspaceVesselGroupsStatus = useSelector(selectWorkspaceVesselGroupsStatus)
  const workspaceVesselGroupsIds = useSelector(selectWorkspaceVessselGroupsIds)

  useFetchDataviewResources()

  const workspaceVesselGroupsIdsHash = workspaceVesselGroupsIds.join(',')
  useEffect(() => {
    if (workspaceVesselGroupsIds.length) {
      dispatch(fetchWorkspaceVesselGroupsThunk(workspaceVesselGroupsIds))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceVesselGroupsIdsHash, dispatch])

  const handleDragEnd = useCallback(
    (event: any) => {
      const { active, over } = event
      if (active && over && active.id !== over.id) {
        const oldIndex = dataviews.findIndex((d) => d.id === active.id)
        const newIndex = dataviews.findIndex((d) => d.id === over.id)
        const dataviewInstancesId = arrayMove(dataviews, oldIndex, newIndex).map((d) => d.id)
        replaceQueryParams({ dataviewInstancesOrder: dataviewInstancesId })
      }
    },
    [dataviews, replaceQueryParams]
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

  if (isWorkspacePasswordRequired) {
    return <WorkspacePassword />
  }

  if (
    isPrivateWorkspaceNotAllowed(workspace) ||
    workspaceStatus === AsyncReducerStatus.Error ||
    workspaceVesselGroupsStatus === AsyncReducerStatus.Error
  ) {
    return <WorkspaceError />
  }

  return (
    <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
      <WorkspaceTitle />
      <Fragment>
        <ActivitySection />
        {timeMode === 'historical' && <DetectionsSection />}
        {timeMode === 'historical' && <EventsSection />}
        <VesselsSection />
        {timeMode === 'historical' && <VesselGroupSection />}
        {timeMode === 'historical' && <EnvironmentalSection />}
        <ContextAreaSection />
        <UserSection />
      </Fragment>
    </DndContext>
  )
}

export default Workspace
