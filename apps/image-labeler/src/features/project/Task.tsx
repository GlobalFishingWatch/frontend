import cx from 'classnames'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '@globalfishingwatch/ui-components/button'
import { Choice, ChoiceOption } from '@globalfishingwatch/ui-components/choice'
import { Spinner } from '@globalfishingwatch/ui-components/spinner'
import { useSetTaskMutation } from '../../api/task'
import { LabellingTask } from '../../types'
import styles from './Task.module.css'

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

  const isLabeled = data?.label !== undefined

  return (
    <div
      onClick={open || isLoading ? undefined : onClick}
      className={cx(styles.task, {
        [styles.open]: open,
        [styles.loading]: isLoading,
        [styles.labeled]: isLabeled,
      })}
    >
      {Object.keys(task.metadata).length > 0 && (
        <div className={cx(styles.metadata, { [styles.hidden]: !open })}>
          <label>
            {Object.entries(task.metadata).map(([key, value], index) => (
              <Fragment key={key}>
                <span>
                  {key}: {value}
                </span>
                {index < Object.keys(task.metadata).length - 1 && <span> | </span>}
              </Fragment>
            ))}
          </label>
        </div>
      )}
      <div className={styles.images}>
        {task.thumbnails.map((thumbnail, index) => (
          <div
            className={styles.img}
            style={{ backgroundImage: `url(${thumbnail})` }}
            key={index}
          />
        ))}
      </div>
      {
        <div className={cx(styles.labels, { [styles.hidden]: !open })}>
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
      }

      <div className={cx({ [styles.hidden]: open })}>
        {isLoading ? (
          <Spinner size="small" />
        ) : (
          <label className={cx({ [styles.assignedLabel]: isLabeled })}>
            {isLabeled ? data.label : 'Unlabeled'}
          </label>
        )}
        {error !== undefined && <p>{JSON.stringify(error)}</p>}
      </div>
    </div>
  )
}

export default Task
