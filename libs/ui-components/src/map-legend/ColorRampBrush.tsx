import { Fragment, useRef, useState } from 'react'
import cx from 'classnames'

import { IconButton } from '../icon-button'
import { InputText } from '../input-text'
import { Popover } from '../popover'

import { roundLegendNumber } from './map-legend.utils'

import styles from './ColorRampBrush.module.css'

export type ColorRampBrushRange = [number | undefined, number | undefined]

export type ColorRampBrushConfig = {
  range: ColorRampBrushRange
  onChange: (range: ColorRampBrushRange) => void
  className?: string
}

type ColorRampBrushProps = ColorRampBrushConfig & {
  valueToPercent: (value: number) => number
  percentToValue: (percent: number) => number
  formatValue: (value: number) => string
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
  valueToPercent,
  percentToValue,
  formatValue,
}: ColorRampBrushProps) {
  const trackRef = useRef<HTMLDivElement>(null)
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
      low <= 0 ? undefined : roundLegendNumber(percentToValue(low)),
      high >= 100 ? undefined : roundLegendNumber(percentToValue(high)),
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

  const commitBound = (bound: Bound, raw: string) => {
    const trimmed = raw.trim()
    const value = trimmed === '' ? undefined : Number(trimmed)
    if (value !== undefined && isNaN(value)) {
      return
    }
    const next: ColorRampBrushRange = [min, max]
    next[bound] = value
    if (next[0] !== min || next[1] !== max) {
      onChange(sorted(next))
    }
  }

  const [low, high] = [Math.min(...percents), Math.max(...percents)]

  return (
    <Fragment>
      <div
        ref={trackRef}
        data-test="color-ramp-brush"
        className={cx(styles.root, className)}
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
          <span
            key={bound}
            className={cx(styles.handle, styles[`handle${bound === 0 ? 'Left' : 'Right'}`])}
            style={{ left: `${percents[bound]}%` }}
            role="slider"
            tabIndex={0}
            aria-label={bound === 0 ? 'min' : 'max'}
            aria-valuenow={percents[bound]}
            onPointerDown={onHandlePointerDown(bound)}
            onKeyDown={onHandleKeyDown(bound)}
          />
        ))}
        {drag?.moved && (
          <span className={styles.value} style={{ left: `${percents[drag.bound]}%` }}>
            {formatValue(percentToValue(percents[drag.bound]))}
          </span>
        )}
      </div>
      {editing !== undefined && (
        <Popover
          placement="bottom"
          portal
          ariaLabel={'Filter values'}
          open
          onOpenChange={(open) => !open && setEditing(undefined)}
          className={styles.popoverContainer}
          content={
            <div className={styles.popover}>
              <InputText
                key={editing}
                type="number"
                inputSize="small"
                aria-label={editing === 0 ? 'min' : ' max'}
                defaultValue={(editing === 0 ? min : max) ?? ''}
                onBlur={(event) => commitBound(editing, event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && event.currentTarget.blur()}
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
