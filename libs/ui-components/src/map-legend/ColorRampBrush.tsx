import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'
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
  extent?: [number, number]
}

type ColorRampBrushProps = Omit<ColorRampBrushConfig, 'extent'> & {
  valueToPercent: (value: number) => number
  percentToValue: (percent: number) => number
  formatValue: (value: number) => string
  roundValue: (value: number) => number
  inset?: [boolean, boolean]
  extent?: [number, number]
  gradientStyle?: React.CSSProperties
}

type Bound = 0 | 1

type Drag = {
  bound: Bound
  percents: [number, number]
  startX: number
  moved: boolean
  fromHandle: boolean
  from: ColorRampBrushRange
  outer?: { depth: number; value: number; edge: number; paused: boolean }
}

const CLICK_SLOP = 2
// Share of the remaining distance to the extent covered per ms at full depth: ~86% per second.
// Relative to the gap rather than to the ramp scale, which on skewed data crawls on the low end
const OUTER_SPEED = 0.002
// Close enough to the extent to snap to it, which the approach never reaches on its own: 1% of the
// target, floored by a sliver of the span so a target near 0 still arrives
const OUTER_SNAP = 0.01
const OUTER_COMMIT_MS = 100
// Keeps inset handles from crossing, in percent of the inner ramp
const HANDLE_MIN_GAP = 5
const INSET = 'var(--brush-inset)'

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
  inset = [false, false],
  extent,
  gradientStyle,
}: ColorRampBrushProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [state, setDrag] = useState<Drag>()
  const [editing, setEditing] = useState<Bound>()
  const isInset = inset[0] || inset[1]

  const [min, max] = range

  // A committed drag lingers until its new range arrives, and is dropped once it does: kept, it
  // would come back to life as soon as the range returned to the one it started from (clearing
  // a filter brushed from scratch)
  const [rangeKey, setRangeKey] = useState(`${min}-${max}`)
  if (rangeKey !== `${min}-${max}`) {
    setRangeKey(`${min}-${max}`)
    if (state && !state.outer) {
      setDrag(undefined)
    }
  }

  // A committed range change ends the drag, except the zoom out one, which commits while it runs
  const drag =
    state && !state.outer && (state.from[0] !== min || state.from[1] !== max) ? undefined : state

  const percents: [number, number] = drag?.percents ?? [
    min === undefined || inset[0] ? 0 : clamp(valueToPercent(min)),
    max === undefined || inset[1] ? 100 : clamp(valueToPercent(max)),
  ]

  // Percent of the inner ramp, which in inset mode is the parent: the track spills over the insets
  const percentAt = (clientX: number, unclamped = false) => {
    const box = (
      isInset ? trackRef.current?.parentElement : trackRef.current
    )?.getBoundingClientRect()
    if (!box) return 0
    const percent = ((clientX - box.left) / box.width) * 100
    return unclamped ? percent : clamp(percent)
  }

  // Width of one inset, in inner ramp percents
  const insetPercent = () => {
    const track = trackRef.current?.getBoundingClientRect().width ?? 0
    const inner = trackRef.current?.parentElement?.getBoundingClientRect().width || 1
    return ((track - inner) / (inset[0] && inset[1] ? 2 : 1) / inner) * 100
  }

  // Positions are in inner ramp percents, the track is wider than it in inset mode
  const toLeft = (percent: number) =>
    isInset
      ? `calc(${inset[0] ? INSET : '0px'} + (100% - ${inset[0] ? INSET : '0px'} - ${inset[1] ? INSET : '0px'}) * ${percent / 100})`
      : `${percent}%`

  const commit = (next: [number, number], movedBound?: Bound) => {
    const lowBound: Bound = next[0] <= next[1] ? 0 : 1
    const highBound: Bound = lowBound === 0 ? 1 : 0
    const stored: ColorRampBrushRange = [min, max]
    const boundValue = (bound: Bound, isLow: boolean) => {
      if (movedBound !== undefined && bound !== movedBound) {
        return stored[bound]
      }
      const percent = next[bound]
      // An inset handle back at its resting place is not a new value
      if (inset[bound] && (isLow ? percent <= 0 : percent >= 100)) {
        return stored[bound]
      }
      return (isLow ? percent <= 0 : percent >= 100)
        ? undefined
        : roundValue(percentToValue(percent))
    }
    const committed: ColorRampBrushRange = [
      boundValue(lowBound, true),
      boundValue(highBound, false),
    ]
    if (committed[0] === min && committed[1] === max) {
      setDrag(undefined)
      return
    }
    onChange(committed)
  }

  const isAtExtent = (bound: Bound, value: number) =>
    extent !== undefined && (bound === 0 ? value <= extent[0] : value >= extent[1])

  // Timebar style zoom out: while an inset handle sits in its outer zone the bound keeps moving
  // outwards, faster the deeper it is, and is committed every OUTER_COMMIT_MS so the ramp re-fits
  const dragRef = useRef(drag)
  const latestRef = useRef({ onChange, roundValue, range })
  useLayoutEffect(() => {
    dragRef.current = drag
    latestRef.current = { onChange, roundValue, range }
  })
  const isOuterDrag = drag?.outer !== undefined
  useEffect(() => {
    if (!isOuterDrag || !extent) return
    let raf = 0
    let last = performance.now()
    let lastCommit = last
    let heldCommit: number | undefined
    const onFrame = (now: number) => {
      const current = dragRef.current
      const { onChange, roundValue, range } = latestRef.current
      if (!current?.outer) return
      const { bound, outer } = current
      if (outer.paused) {
        last = now
        // settle the map on the held value instead of the last throttled commit
        const held = roundValue(outer.value)
        if (held !== range[bound] && held !== heldCommit) {
          heldCommit = held
          const next: ColorRampBrushRange = [...range]
          next[bound] = held
          onChange(next)
        }
        raf = requestAnimationFrame(onFrame)
        return
      }
      const target = extent[bound]
      const step = Math.min(OUTER_SPEED * (now - last) * outer.depth, 1)
      last = now
      const moved = outer.value + (target - outer.value) * step
      const snap = Math.max(Math.abs(target) * OUTER_SNAP, Math.abs(extent[1] - extent[0]) * 1e-4)
      const value = Math.abs(target - moved) <= snap ? target : moved
      if (now - lastCommit > OUTER_COMMIT_MS && roundValue(value) !== range[bound]) {
        lastCommit = now
        const next: ColorRampBrushRange = [...range]
        // The extent itself is only turned into "no bound" on release, clearing it mid drag would
        // take the brush out of inset mode under the pointer
        next[bound] = roundValue(value)
        onChange(next)
      }
      // Only the value is the loop's to write: a pointer move not rendered yet (the pause, the
      // depth) has to survive, which a copy of the ref's snapshot would overwrite
      setDrag((prev) => (prev?.outer ? { ...prev, outer: { ...prev.outer, value } } : prev))
      raf = requestAnimationFrame(onFrame)
    }
    raf = requestAnimationFrame(onFrame)
    return () => cancelAnimationFrame(raf)
  }, [isOuterDrag, extent])

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
    const { bound } = drag
    if (!(drag.fromHandle && inset[bound])) {
      next[bound] = percentAt(event.clientX)
      setDrag({ ...drag, percents: next, moved: true })
      return
    }
    const percent = percentAt(event.clientX, true)
    const insetWidth = insetPercent()
    const outerDistance = bound === 0 ? -percent : percent - 100
    if (outerDistance > 0 && extent) {
      const depth = Math.min(outerDistance / (insetWidth || 1), 1)
      next[bound] = bound === 0 ? -depth * insetWidth : 100 + depth * insetWidth
      // Functional, as the zoom out loop keeps writing the value in between pointer moves
      setDrag((prev) => {
        if (!prev) return prev
        const previous = prev.outer
        return {
          ...prev,
          percents: next,
          moved: true,
          outer: {
            depth,
            value: previous?.value ?? (range[bound] as number),
            edge: bound === 0 ? -insetWidth : 100 + insetWidth,
            // Pulling back stops the push until the pointer heads outwards again
            paused: previous
              ? depth < previous.depth || (depth === previous.depth && previous.paused)
              : false,
          },
        }
      })
      return
    }
    next[bound] =
      bound === 0
        ? Math.min(clamp(percent), next[1] - HANDLE_MIN_GAP)
        : Math.max(clamp(percent), next[0] + HANDLE_MIN_GAP)
    setDrag({ ...drag, percents: next, moved: true, outer: undefined, from: range })
  }

  const onPointerUp = () => {
    if (!drag) {
      return
    }
    if (drag.outer) {
      const { bound, outer } = drag
      const next: ColorRampBrushRange = [min, max]
      next[bound] = isAtExtent(bound, outer.value) ? undefined : roundValue(outer.value)
      setDrag(undefined)
      if (next[0] !== min || next[1] !== max) {
        onChange(next)
      }
      return
    }
    if (drag.moved) {
      commit(drag.percents, drag.fromHandle ? drag.bound : undefined)
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
    commit(next, bound)
  }

  const commitBound = (bound: Bound, raw: string) => {
    const trimmed = raw.trim()
    const typed = trimmed === '' ? undefined : Number(trimmed)
    if (typed !== undefined && isNaN(typed)) {
      return
    }
    const next: ColorRampBrushRange = [min, max]
    next[bound] = typed
    if (next[0] !== min || next[1] !== max) {
      onChange(sorted(next))
    }
  }

  const closeAndCommit = (bound: Bound) => {
    const raw = inputRef.current?.value ?? ''
    setEditing(undefined)
    commitBound(bound, raw)
  }

  // The value can reach the extent before the pointer reaches the zone's edge, and the delete it
  // then means belongs at the very end of the track
  const shown: [number, number] = [...percents]
  if (drag?.outer && isAtExtent(drag.bound, drag.outer.value)) {
    shown[drag.bound] = drag.outer.edge
  }
  const [low, high] = [Math.min(...shown), Math.max(...shown)]
  const isLowerHandle = (bound: Bound) => {
    const other = shown[bound === 0 ? 1 : 0]
    return shown[bound] === other ? bound === 0 : shown[bound] < other
  }

  const isIdleHandle = (bound: Bound) => !drag && range[bound] === undefined
  const atStart =
    drag !== undefined &&
    (drag.outer ? drag.bound === 0 && isAtExtent(0, drag.outer.value) : percents[drag.bound] <= 0)
  const atEnd =
    drag !== undefined &&
    (drag.outer ? drag.bound === 1 && isAtExtent(1, drag.outer.value) : percents[drag.bound] >= 100)
  // An inset handle resting at its edge still holds a value, only the outer extent removes it
  const showsDelete = drag?.outer
    ? atStart || atEnd
    : (atStart && !inset[0]) || (atEnd && !inset[1])
  const dragValue = drag?.outer?.value ?? (drag && percentToValue(percents[drag.bound]))

  return (
    <Fragment>
      <div
        ref={trackRef}
        data-test="color-ramp-brush"
        // read by ColorRamp's stylesheet, which cannot reach this module's class names
        data-moving={drag?.moved || undefined}
        className={cx(styles.root, className, {
          [styles.rootDragging]: drag?.fromHandle,
          [styles.rootMoving]: drag?.moved,
          [styles.rootInsetStart]: inset[0],
          [styles.rootInsetEnd]: inset[1],
        })}
        onPointerDown={onTrackPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        // A cancelled drag never gets its pointerup, and a leftover drag would then follow the
        // pointer around with no button held
        onPointerCancel={() => setDrag(undefined)}
      >
        {(isInset || (!drag && (min !== undefined || max !== undefined))) && (
          <Fragment>
            {/* Hides the ramp's own gradient, which stays put while the handles move */}
            <span className={styles.backdrop} />
            <span
              className={styles.gradient}
              style={{ ...gradientStyle, left: toLeft(low), right: `calc(100% - ${toLeft(high)})` }}
            />
          </Fragment>
        )}
        <span className={styles.scrim} style={{ left: 0, width: toLeft(low) }} />
        <span className={styles.scrim} style={{ left: toLeft(high), right: 0 }} />
        {([0, 1] as Bound[]).map((bound) => (
          <Tooltip key={bound} content={handleTooltip}>
            <span className={styles.handleAnchor} style={{ left: toLeft(shown[bound]) }}>
              <span
                className={cx(
                  styles.handle,
                  styles[`handle${isLowerHandle(bound) ? 'Left' : 'Right'}`],
                  { [styles.handleDimmed]: isIdleHandle(bound) }
                )}
                role="slider"
                tabIndex={0}
                aria-label={isLowerHandle(bound) ? 'min' : 'max'}
                aria-valuenow={shown[bound]}
                onPointerDown={onHandlePointerDown(bound)}
                onKeyDown={onHandleKeyDown(bound)}
              />
            </span>
          </Tooltip>
        ))}
        {/* The step labels are hidden while dragging a fitted ramp (ColorRamp), so the handle that
            stays put keeps its value on show too */}
        {drag?.moved &&
          isInset &&
          ([0, 1] as Bound[]).map((bound) =>
            bound !== drag.bound && range[bound] !== undefined ? (
              <span key={bound} className={styles.value} style={{ left: toLeft(shown[bound]) }}>
                {formatValue(range[bound] as number)}
              </span>
            ) : null
          )}
        {drag?.moved && (
          <span
            className={cx(styles.value, {
              [styles.valueAtStart]: showsDelete && atStart,
              [styles.valueAtEnd]: showsDelete && atEnd,
            })}
            style={{ left: toLeft(shown[drag.bound]) }}
          >
            {showsDelete ? (
              <Icon icon="delete" className={styles.valueIcon} />
            ) : (
              formatValue(dragValue as number)
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
              <div className={styles.inputWrapper}>
                <InputText
                  key={editing}
                  ref={inputRef}
                  type="number"
                  inputSize="small"
                  aria-label={editing === 0 ? 'min' : ' max'}
                  defaultValue={(editing === 0 ? min : max) ?? ''}
                  onKeyDown={(event) => event.key === 'Enter' && closeAndCommit(editing)}
                />
                {/* <span className={styles.inputHint}>⏎</span> */}
              </div>
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
          {/* A sibling of the track, so in the inner ramp's coordinates: no toLeft */}
          <span className={styles.anchor} style={{ left: `${percents[editing]}%` }} />
        </Popover>
      )}
    </Fragment>
  )
}
