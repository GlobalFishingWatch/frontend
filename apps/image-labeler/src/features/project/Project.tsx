import { Fragment, useCallback, useEffect, useMemo } from 'react'
import { getRouteApi, Link, useNavigate } from '@tanstack/react-router'
import uniqBy from 'lodash/uniqBy'

import { useLocalStorage } from '@globalfishingwatch/react-hooks/use-local-storage'
import { Button } from '@globalfishingwatch/ui-components/button'
import { Choice } from '@globalfishingwatch/ui-components/choice'
import { IconButton } from '@globalfishingwatch/ui-components/icon-button'
import { Slider } from '@globalfishingwatch/ui-components/slider'
import { Spinner } from '@globalfishingwatch/ui-components/spinner'

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
  const { projectId } = route.useParams()
  const { activeTaskId } = route.useSearch()
  const navigate = useNavigate({ from: routePath })
  const [imageStyleEditorOpen, setImageStyleOpen] = useLocalStorage('imageStyleEditorOpen', true)
  const [imageStyleSaturation, setImageStyleSaturation] = useLocalStorage('saturation', 1)
  const [imageStyleContrast, setImageStyleContrast] = useLocalStorage('contrast', 1)
  const [showEnhancedImage, setShowEnhancedImage] = useLocalStorage('showEnhancedImage', true)

   
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
      {data.map((task, index) => (
        <Task
          projectId={projectId}
          task={task}
          open={activeTaskId ? task.id === activeTaskId : index === 0}
          key={task.id}
          onClick={() => setActiveTaskId(task.id)}
          onFinishTask={setNextTask}
          scale={taskData.metadata.scale}
          imageStyle={{
            filter: ` saturate(${imageStyleSaturation}) contrast(${imageStyleContrast})`,
          }}
        />
      ))}
      <div
        className={styles.imageStyleEditor}
        style={{
          borderRadius: imageStyleEditorOpen ? '1rem' : '4rem',
        }}
      >
        {imageStyleEditorOpen && (
          <div className={styles.editorContent}>
            <div className={styles.switch}>
              <Choice
                label="image style"
                activeOption={showEnhancedImage ? 'normalized' : 'original'}
                options={[
                  {
                    id: 'original',
                    label: 'original',
                  },
                  {
                    id: 'normalized',
                    label: 'normalized',
                  },
                ]}
                onSelect={(selected) => {
                  setShowEnhancedImage(selected.id === 'normalized')
                }}
                size="small"
              />
            </div>
            {!showEnhancedImage && (
              <Fragment>
                <Slider
                  label="Saturation"
                  config={{
                    min: 0,
                    max: 4,
                    steps: [0, 4],
                  }}
                  initialValue={imageStyleSaturation}
                  onChange={(value) => setImageStyleSaturation(value)}
                  thumbsSize="small"
                  className={styles.slider}
                />
                <Slider
                  label="Contrast"
                  config={{
                    min: 0,
                    max: 4,
                    steps: [0, 4],
                  }}
                  initialValue={imageStyleContrast}
                  onChange={(value) => setImageStyleContrast(value)}
                  thumbsSize="small"
                  className={styles.slider}
                />
              </Fragment>
            )}
          </div>
        )}
        <IconButton
          onClick={() => setImageStyleOpen(!imageStyleEditorOpen)}
          icon={imageStyleEditorOpen ? 'close' : 'photo-edit'}
          type="border"
        />
      </div>
      <Button onClick={handleLoadMoreTasks} className={styles.loadMoreButton} type="secondary">
        Load more tasks
      </Button>
    </div>
  )
}

export default Project
