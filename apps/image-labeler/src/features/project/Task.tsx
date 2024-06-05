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
  onFinishTask: () => void
}

export function Task({ projectId, task, open, onFinishTask }: TaskProps) {
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

  const handleSubmit = useCallback(() => {
    if (activeOption) {
      console.log('activeOption:', activeOption)
      onFinishTask()
      setTask({ projectId, taskId: task.id, label: activeOption })
    }
  }, [activeOption, onFinishTask, projectId, setTask, task.id])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault()
      if (e.key === 'Enter') {
        handleSubmit()
        return
      }
      if (e.key === 'Escape') {
        setActiveOption(undefined)
        onFinishTask()
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
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleSubmit, onFinishTask, open, options])

  const setOption = (option: ChoiceOption) => {
    setActiveOption(option.id)
  }

  return (
    <div className={cx(styles.task, { [styles.open]: open })}>
      <div className={styles.images}>
        {task.thumbnails.map((thumbnail, index) => (
          <img src={thumbnail} alt="thumbnail" key={index} />
        ))}
      </div>
      {open ? (
        <div className={styles.labels}>
          <Choice options={options} activeOption={activeOption} onSelect={setOption} />
          <div className={styles.buttons}>
            <Button onClick={onFinishTask} type="secondary">
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
          {isLoading ? <Spinner size="small" /> : <label>{activeOption || 'Unlabeled'}</label>}
          {error !== undefined && <p>{JSON.stringify(error)}</p>}
        </div>
      )}
    </div>
  )
}

export default Task
