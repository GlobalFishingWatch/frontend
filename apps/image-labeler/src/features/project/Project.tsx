import { useCallback, useEffect, useMemo, useState } from 'react'
import { getRouteApi, Link, useNavigate } from '@tanstack/react-router'
import uniqBy from 'lodash/uniqBy'

import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Button, Choice, IconButton, Spinner } from '@globalfishingwatch/ui-components'

import {
  useGetLabellingProjectTasksByIdQuery,
  useGetLabellingProjectTasksQuery,
} from '../../api/project'
import type { LabellingTask } from '../../types'

import Task from './Task'

import styles from './Project.module.css'

const routePath = '/project/$projectId'
const route = getRouteApi(routePath)

export function Project() {
  const [rangeMode, setRangeMode] = useState<'compressed' | 'full'>('compressed')
  const rangeModeOptions: ChoiceOption[] = [
    { id: 'compressed', label: 'Compressed' },
    { id: 'full', label: 'Full' },
  ]
  const [normMode, setNormMode] = useState<'global' | 'per-channel'>('global')
  const [showCrosshair, setShowCrosshair] = useState(false)
  const normModeOptions: ChoiceOption[] = [
    { id: 'global', label: 'Global' },
    { id: 'per-channel', label: 'Per channel' },
  ]
  const { projectId } = route.useParams()
  const { activeTaskId } = route.useSearch()
  const navigate = useNavigate({ from: routePath })
  const initialActiveTaskId = useMemo(() => activeTaskId as string | undefined, [])

  const { data: taskData, isLoading: areTasksLoading } = useGetLabellingProjectTasksQuery({
    projectId,
    limit: 25,
  })
  const { data: activeTaskData, isLoading: isActiveTaskLoading } =
    useGetLabellingProjectTasksByIdQuery(
      {
        projectId,
        taskId: initialActiveTaskId as string,
      },
      { skip: initialActiveTaskId === undefined }
    )

  const isLoading = areTasksLoading || isActiveTaskLoading
  const data = useMemo(() => {
    if (!activeTaskData) {
      return taskData?.entries as LabellingTask[]
    }
    return uniqBy([activeTaskData, ...(taskData?.entries || [])], 'id') as LabellingTask[]
  }, [activeTaskData, taskData?.entries])

  const setActiveTaskId = useCallback(
    (activeTaskId: string) => {
      navigate({ search: { activeTaskId } })
    },
    [navigate]
  )

  const setNextTask = useCallback(
    (taskId: string) => {
      const currentIndex = data.findIndex((task) => task.id === taskId)
      setActiveTaskId(data[currentIndex + 1]?.id)
      window.scrollBy({ top: 71, behavior: 'smooth' })
    },
    [data, setActiveTaskId]
  )

  const handleLoadMoreTasks = useCallback(() => {
    window.scrollTo(0, 0)
    window.location.reload()
  }, [])

  useEffect(() => {
    if (!activeTaskId) {
      setActiveTaskId(data?.[0]?.id)
    }
  }, [activeTaskId, data, setActiveTaskId])

  if (isLoading || !data) {
    return <Spinner />
  }

  return (
    <div className={styles.project}>
      <h1 className={styles.pageTitle}>
        <Link to="/" className={styles.backLink}>
          <IconButton icon="arrow-left" type="border" />
        </Link>
        Project: {taskData.metadata.name}
      </h1>
      <div className={styles.projectInfo}>
        <div className={styles.projectInfoItem}>
          <label>Big Query Table</label>
          <div>{taskData.metadata.bqTable}</div>
        </div>
        <div className={styles.projectInfoItem}>
          <label>Query</label>
          <code>{taskData.metadata.bqQuery}</code>
        </div>
        <div className={styles.projectInfoItem}>
          <label>Labels</label>
          <div>{taskData.metadata.labels.join(', ')}</div>
        </div>
        <div className={styles.projectInfoItem}>
          <label>Scale</label>
          <div>
            {taskData.metadata.scale ? `${taskData.metadata.scale} meters per pixel` : 'Unknown'}
          </div>
        </div>
      </div>

      <h2 className={styles.tasksTitle}>Tasks</h2>
      <div className={styles.imageSettings}>
        <div>
          <label>Range</label>
          <Choice
            options={rangeModeOptions}
            activeOption={rangeMode}
            size="tiny"
            onSelect={(o) => setRangeMode(o.id as 'compressed' | 'full')}
          />
        </div>
        <div>
          <label>Normalization</label>
          <Choice
            options={normModeOptions}
            activeOption={normMode}
            size="tiny"
            onSelect={(o) => setNormMode(o.id as 'global' | 'per-channel')}
          />
        </div>
        <div>
          <IconButton
            icon="target"
            size="small"
            type={showCrosshair ? 'warning-border' : 'border'}
            tooltip="Toggle crosshair"
            onClick={() => setShowCrosshair((v) => !v)}
            style={{ display: 'flex' }}
          />
        </div>
      </div>
      {data.map((task, index) => (
        <Task
          projectId={projectId}
          task={task}
          open={activeTaskId ? task.id === activeTaskId : index === 0}
          key={task.id}
          onClick={() => setActiveTaskId(task.id)}
          onFinishTask={setNextTask}
          scale={taskData.metadata.scale}
          rangeMode={rangeMode}
          normMode={normMode}
          showCrosshair={showCrosshair}
        />
      ))}
      <Button onClick={handleLoadMoreTasks} className={styles.loadMoreButton} type="secondary">
        Load more tasks
      </Button>
    </div>
  )
}

export default Project
