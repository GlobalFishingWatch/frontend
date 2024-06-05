import cx from 'classnames'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '@globalfishingwatch/ui-components/button'
import { Choice, ChoiceOption } from '@globalfishingwatch/ui-components/choice'
import { Spinner } from '@globalfishingwatch/ui-components/spinner'
import { useSetTaskMutation } from '../../api/task'
import styles from './Task.module.css'

export type LabellingTask = {
  id: string
  labels: string[]
  metadata: {
    score: number
  }
  thumbnails: string[]
}

type TaskProps = {
  projectId: string
  task: LabellingTask
  open: boolean
  onClick?: () => void
  onFinishTask: (taskId: string) => void
}

export function Task({ projectId, task, open, onClick, onFinishTask }: TaskProps) {
  const options: ChoiceOption[] = useMemo(
    () =>
      task.labels.map((label, index) => ({
        id: label,
        label: `${label} (${index + 1})`,
      })),
    [task.labels]
  )
  const [activeOption, setActiveOption] = useState<string>()
  const [setTask, { isLoading, data, error }] = useSetTaskMutation({
    fixedCacheKey: [projectId, task.id].join(),
  })

  const setFinishedTask = useCallback(() => {
    onFinishTask(task.id)
  }, [onFinishTask, task.id])

  const handleSubmit = useCallback(() => {
    if (activeOption) {
      setFinishedTask()
      setTask({ projectId, taskId: task.id, label: activeOption })
    }
  }, [activeOption, setFinishedTask, projectId, setTask, task.id])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // e.preventDefault()
      if (e.key === 'Enter') {
        handleSubmit()
        return
      }
      if (e.key === 'Escape') {
        setActiveOption(undefined)
        setFinishedTask()
        return
      }
      const option = options[parseInt(e.key) - 1]
      if (option) {
        setOption(option)
      }
    }
    if (open) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      if (open) {
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [handleSubmit, setFinishedTask, open, options, task.id])

  const setOption = (option: ChoiceOption) => {
    setActiveOption(option.id)
  }

  return (
    <div
      onClick={open || isLoading ? undefined : onClick}
      className={cx(styles.task, { [styles.open]: open })}
    >
      <div className={styles.images}>
        {task.thumbnails.map((thumbnail, index) => (
          <img src={thumbnail} alt="thumbnail" key={index} />
        ))}
      </div>
      {open ? (
        <div className={styles.labels}>
          <Choice
            options={options}
            activeOption={data?.label || activeOption}
            onSelect={setOption}
          />
          <div className={styles.buttons}>
            <Button onClick={setFinishedTask} type="secondary">
              Skip (Esc)
            </Button>
            <Button
              onClick={handleSubmit}
              type={activeOption ? 'default' : 'secondary'}
              disabled={!activeOption}
            >
              {activeOption ? 'Confirm (Enter)' : 'Select a label'}
            </Button>
          </div>
        </div>
      ) : (
        <div>
          {isLoading ? <Spinner size="small" /> : <label>{data?.label || 'Unlabeled'}</label>}
          {error !== undefined && <p>{JSON.stringify(error)}</p>}
        </div>
      )}
    </div>
  )
}

export default Task
