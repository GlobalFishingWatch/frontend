import { getRouteApi } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { set } from 'lodash'
import { Spinner } from '@globalfishingwatch/ui-components/spinner'
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
  }

  return (
    <div>
      <h1 className={styles.pageTitle}>Project: {projectId}</h1>
      {(data?.entries as LabellingTask[]).map((task, index) => (
        <Task
          projectId={projectId}
          task={task}
          open={activeTaskId ? task.id === activeTaskId : index === 0}
          key={task.id}
          onFinishTask={setNextTask}
        />
      ))}
    </div>
  )
}

export default Project
