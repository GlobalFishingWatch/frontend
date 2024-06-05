import { getRouteApi } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Spinner } from '@globalfishingwatch/ui-components/spinner'
import { Button } from '@globalfishingwatch/ui-components/button'
import { useGetLabellingProjectTasksQuery } from '../../api/project'
import styles from './Project.module.css'
import Task, { LabellingTask } from './Task'

const route = getRouteApi('/project/$projectId')

export function Project() {
  const { projectId } = route.useParams()

  const { data, isLoading } = useGetLabellingProjectTasksQuery({ projectId, limit: 25 })

  const [activeTaskId, setActiveTaskId] = useState<string>()

  useEffect(() => {
    if (!activeTaskId) {
      setActiveTaskId(data?.entries[0]?.id)
    }
  }, [activeTaskId, data])

  if (isLoading || !data) {
    return <Spinner />
  }

  const setNextTask = () => {
    const currentIndex = (data?.entries as LabellingTask[]).findIndex(
      (task) => task.id === activeTaskId
    )
    setActiveTaskId((data?.entries as LabellingTask[])[currentIndex + 1]?.id)
    console.log(window)

    window.scrollTo(0, window.scrollY + 71)
  }

  const handleLoadMoreTasks = () => {
    window.scrollTo(0, 0)
    window.location.reload()
  }

  return (
    <div className={styles.project}>
      <h1 className={styles.pageTitle}>{data.metadata.name}</h1>
      <div className={styles.projectInfo}>
        <div className={styles.projectInfoItem}>
          <label>Big Query Table</label>
          <div>{data.metadata.bqTable}</div>
        </div>
        <div className={styles.projectInfoItem}>
          <label>Query</label>
          <code>{data.metadata.bqQuery}</code>
        </div>
        <div className={styles.projectInfoItem}>
          <label>Labels</label>
          <div>{data.metadata.labels.join(', ')}</div>
        </div>
      </div>

      <h2 className={styles.tasksTitle}>Tasks</h2>
      {(data?.entries as LabellingTask[]).map((task, index) => (
        <Task
          projectId={projectId}
          task={task}
          open={activeTaskId ? task.id === activeTaskId : index === 0}
          key={task.id}
          onFinishTask={setNextTask}
        />
      ))}
      <Button onClick={handleLoadMoreTasks} className={styles.loadMoreButton} type="secondary">
        Load more tasks
      </Button>
    </div>
  )
}

export default Project
