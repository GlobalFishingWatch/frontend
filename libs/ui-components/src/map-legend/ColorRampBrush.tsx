import { Fragment, useRef, useState } from 'react'
import cx from 'classnames'

import { Icon } from '../icon'
import { IconButton } from '../icon-button'
import { InputText } from '../input-text'
import { Popover } from '../popover'
import { Tooltip } from '../tooltip'

import styles from './ColorRampBrush.module.css'

export type ColorRampBrushRange = [number | undefined, number | undefined]

export type ColorRampBrushConfig = {
  range: ColorRampBrushRange
  onChange: (range: ColorRampBrushRange) => void
  className?: string
  handleTooltip?: string
}

type ColorRampBrushProps = ColorRampBrushConfig & {
  valueToPercent: (value: number) => number
  percentToValue: (percent: number) => number
  formatValue: (value: number) => string
  roundValue: (value: number) => number
  /** First break of the ramp, ie. the lowest value it prints */
  rampMin: number
}

type Bound = 0 | 1

type Drag = {
  bound: Bound
  percents: [number, number]
  startX: number
  moved: boolean
  fromHandle: boolean
  from: ColorRampBrushRange
}

const CLICK_SLOP = 2

const clamp = (percent: number) => Math.min(Math.max(percent, 0), 100)

const sorted = ([min, max]: ColorRampBrushRange): ColorRampBrushRange =>
  min !== undefined && max !== undefined && min > max ? [max, min] : [min, max]

export function ColorRampBrush({
  range,
  onChange,
  className,
  handleTooltip,
  valueToPercent,
  percentToValue,
  formatValue,
  roundValue,
  rampMin,
}: ColorRampBrushProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [state, setDrag] = useState<Drag>()
  const [editing, setEditing] = useState<Bound>()

  const [min, max] = range

  const drag = state && (state.from[0] !== min || state.from[1] !== max) ? undefined : state

  const percents: [number, number] = drag?.percents ?? [
    min === undefined ? 0 : clamp(valueToPercent(min)),
    max === undefined ? 100 : clamp(valueToPercent(max)),
  ]

  const percentAt = (clientX: number) => {
    const track = trackRef.current?.getBoundingClientRect()
    return track ? clamp(((clientX - track.left) / track.width) * 100) : 0
  }

  const commit = (next: [number, number]) => {
    const low = Math.min(...next)
    const high = Math.max(...next)
    const committed: ColorRampBrushRange = [
      low <= 0 ? undefined : roundValue(percentToValue(low)),
      high >= 100 ? undefined : roundValue(percentToValue(high)),
    ]
    if (committed[0] === min && committed[1] === max) {
      setDrag(undefined)
      return
    }
    onChange(committed)
  }

  const onTrackPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return
    }
    // Handles stop propagation, so this only ever starts a brand new selection
    const percent = percentAt(event.clientX)
    trackRef.current?.setPointerCapture(event.pointerId)
    setDrag({
      bound: 1,
      percents: [percent, percent],
      startX: event.clientX,
      moved: false,
      fromHandle: false,
      from: range,
    })
  }

  const onHandlePointerDown = (bound: Bound) => (event: React.PointerEvent<HTMLSpanElement>) => {
    if (event.button !== 0) {
      return
    }
    event.stopPropagation()
    trackRef.current?.setPointerCapture(event.pointerId)
    setDrag({ bound, percents, startX: event.clientX, moved: false, fromHandle: true, from: range })
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag || (!drag.moved && Math.abs(event.clientX - drag.startX) <= CLICK_SLOP)) {
      return
    }
    const next: [number, number] = [...drag.percents]
    next[drag.bound] = percentAt(event.clientX)
    setDrag({ ...drag, percents: next, moved: true })
  }

  const onPointerUp = () => {
    if (!drag) {
      return
    }
    if (drag.moved) {
      commit(drag.percents)
      return
    }
    setDrag(undefined)
    // A click on the bare ramp does nothing on purpose, it is far too easy to hit by accident.
    // On a handle it opens the fine tune popover, which pointer capture rules out doing through
    // the popover's own click handler: the click is retargeted to the track
    if (drag.fromHandle) {
      setEditing(drag.bound)
    }
  }

  const onHandleKeyDown = (bound: Bound) => (event: React.KeyboardEvent<HTMLSpanElement>) => {
    const step = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0
    if (!step) {
      return
    }
    event.preventDefault()
    const next: [number, number] = [...percents]
    next[bound] = clamp(next[bound] + step * (event.shiftKey ? 10 : 1))
    commit(next)
  }

  const lowest = roundValue(rampMin)

  const commitBound = (bound: Bound, raw: string) => {
    const trimmed = raw.trim()
    const typed = trimmed === '' ? undefined : Number(trimmed)
    if (typed !== undefined && isNaN(typed)) {
      return
    }
    const value = typed === undefined || typed === 0 || typed <= lowest ? undefined : typed
    const next: ColorRampBrushRange = [min, max]
    next[bound] = value
    if (next[0] !== min || next[1] !== max) {
      onChange(sorted(next))
    }
  }

  const closeAndCommit = (bound: Bound) => {
    const raw = inputRef.current?.value ?? ''
    setEditing(undefined)
    commitBound(bound, raw)
  }

  const [low, high] = [Math.min(...percents), Math.max(...percents)]
  const isLowerHandle = (bound: Bound) => {
    const other = percents[bound === 0 ? 1 : 0]
    return percents[bound] === other ? bound === 0 : percents[bound] < other
  }
  const atStart = drag !== undefined && percents[drag.bound] <= 0
  const atEnd = drag !== undefined && percents[drag.bound] >= 100

  return (
    <Fragment>
      <div
        ref={trackRef}
        data-test="color-ramp-brush"
        className={cx(styles.root, className, { [styles.rootDragging]: drag?.fromHandle })}
        onPointerDown={onTrackPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        // A cancelled drag never gets its pointerup, and a leftover drag would then follow the
        // pointer around with no button held
        onPointerCancel={() => setDrag(undefined)}
      >
        <span className={styles.scrim} style={{ left: 0, width: `${low}%` }} />
        <span className={styles.scrim} style={{ left: `${high}%`, right: 0 }} />
        {([0, 1] as Bound[]).map((bound) => (
          <Tooltip key={bound} content={handleTooltip}>
            <span className={styles.handleAnchor} style={{ left: `${percents[bound]}%` }}>
              <span
                className={cx(
                  styles.handle,
                  styles[`handle${isLowerHandle(bound) ? 'Left' : 'Right'}`]
                )}
                role="slider"
                tabIndex={0}
                aria-label={isLowerHandle(bound) ? 'min' : 'max'}
                aria-valuenow={percents[bound]}
                onPointerDown={onHandlePointerDown(bound)}
                onKeyDown={onHandleKeyDown(bound)}
              />
            </span>
          </Tooltip>
        ))}
        {drag?.moved && (
          <span
            className={cx(styles.value, {
              [styles.valueAtStart]: atStart,
              [styles.valueAtEnd]: atEnd,
            })}
            style={{ left: `${percents[drag.bound]}%` }}
          >
            {atStart || atEnd ? (
              <Icon icon="delete" className={styles.valueIcon} />
            ) : (
              formatValue(percentToValue(percents[drag.bound]))
            )}
          </span>
        )}
      </div>
      {editing !== undefined && (
        <Popover
          open
          portal
          placement="bottom"
          ariaLabel={'Filter values'}
          onOpenChange={(open, _event, reason) => {
            if (open) {
              return
            }
            if (reason === 'escape-key') {
              setEditing(undefined)
            } else {
              closeAndCommit(editing)
            }
          }}
          className={styles.popoverContainer}
          content={
            <div className={styles.popover}>
              <InputText
                key={editing}
                ref={inputRef}
                type="number"
                inputSize="small"
                aria-label={editing === 0 ? 'min' : ' max'}
                defaultValue={(editing === 0 ? min : max) ?? ''}
                onKeyDown={(event) => event.key === 'Enter' && closeAndCommit(editing)}
              />
              <IconButton
                icon="delete"
                size="medium"
                testId="color-ramp-brush-remove"
                onClick={() => {
                  setEditing(undefined)
                  commitBound(editing, '')
                }}
              />
            </div>
          }
        >
          <span className={styles.anchor} style={{ left: `${percents[editing]}%` }} />
        </Popover>
      )}
    </Fragment>
  )
}
