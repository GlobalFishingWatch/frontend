import { Fragment, useCallback, useEffect, useMemo } from 'react'
import cx from 'classnames'

import { Button } from '@globalfishingwatch/ui-components/button'
import type { ChoiceOption } from '@globalfishingwatch/ui-components/choice';
import { Choice } from '@globalfishingwatch/ui-components/choice'
import { Spinner } from '@globalfishingwatch/ui-components/spinner'

import { useSetTaskMutation } from '../../api/task'
import type { LabellingTask } from '../../types'

import TaskImage from './TaskImage'

import styles from './Task.module.css'

type TaskProps = {
  projectId: string
  task: LabellingTask
  open: boolean
  onClick?: () => void
  onFinishTask: (taskId: string) => void
  scale?: number
  imageStyle?: React.CSSProperties
}

export function Task({
  projectId,
  task,
  open,
  onClick,
  onFinishTask,
  scale,
  imageStyle,
}: TaskProps) {
  const options: ChoiceOption[] = useMemo(
    () =>
      task.labels.map((label, index) => ({
        id: label,
        label: `${label} (${index + 1})`,
      })),
    [task.labels]
  )
  const [setTask, { isLoading, data, error }] = useSetTaskMutation({
    fixedCacheKey: [projectId, task.id].join(),
  })

  const setFinishedTask = useCallback(() => {
    onFinishTask(task.id)
  }, [onFinishTask, task.id])

  const setOption = useCallback(
    (option: ChoiceOption) => {
      setFinishedTask()
      setTask({ projectId, taskId: task.id, label: option.id })
    },
    [projectId, setFinishedTask, setTask, task.id]
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // e.preventDefault()
      if (e.key === 'Escape') {
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
  }, [setFinishedTask, open, options, task.id, setOption])

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
            {Object.entries(task.metadata).map(([key, value], index) => {
              if (key === 'lon') return null
              if (key === 'lat' && Object.keys(task.metadata).includes('lon')) {
                const lat = value
                const lon = task.metadata.lon
                return (
                  <Fragment key={key}>
                    <span>
                      Location:{' '}
                      <a
                        className={styles.link}
                        href={`https://maps.google.com/maps?t=k&q=loc:${lat}+${lon}`}
                        target="_blank"
                        rel="noreferrer"
                        title="See on Google Maps"
                      >
                        {lat.toFixed(5)}, {lon.toFixed(5)}
                      </a>
                    </span>
                    {index < Object.keys(task.metadata).length - 1 && <span> | </span>}
                  </Fragment>
                )
              }
              return (
                <Fragment key={key}>
                  <span>
                    {key}: {JSON.stringify(value)}
                  </span>
                  {index < Object.keys(task.metadata).length - 1 && <span> | </span>}
                </Fragment>
              )
            })}
            <div>
              <span>ID: {JSON.stringify(task.id)}</span>
            </div>
          </label>
        </div>
      )}
      <div className={styles.images}>
        {task.thumbnails.map((thumbnail, index) => (
          <TaskImage
            thumbnail={thumbnail}
            key={index}
            scale={scale}
            open={open}
            imageStyle={imageStyle}
          />
        ))}
      </div>
      {
        <div className={cx(styles.labels, { [styles.hidden]: !open })}>
          <Choice options={options} activeOption={data?.label} onSelect={setOption} />
          <Button onClick={setFinishedTask} type="secondary">
            Skip (Esc)
          </Button>
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
