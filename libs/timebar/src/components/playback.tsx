import { useCallback, useEffect, useRef, useState } from 'react'
import cx from 'classnames'

import { getUTCDate } from '@globalfishingwatch/data-transforms'
import { Icon } from '@globalfishingwatch/ui-components/icon'

import { EVENT_SOURCE } from '../constants'
import { useTimebar } from '../timebar-context'
import { useLatest } from '../utils'

import { getTimebarStepByDelta } from './playback.utils'

import uiStyles from '../timebar.module.css'
import styles from './playback.module.css'

const SPEED_STEPS = [1, 2, 3, 5, 10]

type PlaybackProps = {
  disabled?: boolean
  disabledTooltip?: string
  onTogglePlay?: (isPlaying: boolean) => void
}

export function TimebarPlayback({ disabled, disabledTooltip, onTogglePlay }: PlaybackProps) {
  const {
    labels: { playback: labels },
    absoluteStart,
    absoluteEnd,
    intervals,
    getCurrentInterval,
    notifyChange,
    rangeRef,
    end,
  } = useTimebar()
  const onPlaybackTick = useCallback(
    (newStart: string, newEnd: string) => {
      notifyChange(newStart, newEnd, EVENT_SOURCE.PLAYBACK_FRAME)
    },
    [notifyChange]
  )
  const [playing, setPlaying] = useState(false)
  const [speedStep, setSpeedStep] = useState(0)
  const [loop, setLoop] = useState(false)

  const rafRef = useRef<number | null>(null)
  const lastUpdateMsRef = useRef<number | null>(null)

  // Fresh values for the rAF loop / button handlers, so their callbacks never read
  // stale state. The live range itself lives in the shared rangeRef (single writer:
  // notifyChange), so it isn't mirrored here.
  const latestRef = useLatest({
    absoluteStart,
    absoluteEnd,
    intervals,
    getCurrentInterval,
    onPlaybackTick,
    onTogglePlay,
    speedStep,
    loop,
    playing,
  })

  const stop = useCallback(() => {
    if (rafRef.current) {
      window.cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    latestRef.current.onTogglePlay?.(false)
    setPlaying(false)
  }, [latestRef])

  const update = useCallback(
    (deltaMultiplicator: number, { byIntervals = false } = {}) => {
      const {
        absoluteStart,
        absoluteEnd,
        intervals,
        getCurrentInterval,
        onPlaybackTick,
        speedStep,
        loop,
      } = latestRef.current
      // Live range is the shared truth; notifyChange advances it synchronously, so the
      // next frame/click reads the value just emitted (no optimistic write-back needed).
      const { start, end } = rangeRef.current
      if (!start || !end) return

      const {
        start: newStart,
        end: newEnd,
        clamped,
      } = getTimebarStepByDelta({
        start,
        end,
        absoluteStart,
        absoluteEnd,
        intervals,
        byIntervals,
        speedStep: SPEED_STEPS[speedStep],
        getCurrentInterval,
        deltaMultiplicator,
      })

      if (newStart && newEnd) {
        onPlaybackTick(newStart, newEnd)
      }

      if (clamped === 'end') {
        if (loop === true) {
          const currentStartEndDeltaMs =
            getUTCDate(newEnd).getTime() - getUTCDate(newStart).getTime()
          // start again from absoluteStart
          const newEndLoop = getUTCDate(
            getUTCDate(absoluteStart).getTime() + currentStartEndDeltaMs
          ).toISOString()
          onPlaybackTick(absoluteStart, newEndLoop)
        } else {
          stop()
        }
      }
      if (clamped !== 'end' || loop === true) {
        return true
      }
    },
    [stop]
  )

  const startLoop = useCallback(() => {
    lastUpdateMsRef.current = null
    const tick = (elapsedMs: number) => {
      if (lastUpdateMsRef.current === null) {
        lastUpdateMsRef.current = elapsedMs
      }
      // "compare" elapsed with theoretical 60 fps frame
      const progressRatio = (elapsedMs - lastUpdateMsRef.current) / (1000 / 60)
      const requireNextTick = update(progressRatio)
      lastUpdateMsRef.current = elapsedMs
      if (requireNextTick === true) {
        rafRef.current = window.requestAnimationFrame(tick)
      }
    }
    rafRef.current = window.requestAnimationFrame(tick)
  }, [update])

  const togglePlay = useCallback(
    (force?: boolean) => {
      const playingNext = force === undefined ? !latestRef.current.playing : force
      if (!playingNext) {
        stop()
        return
      }
      startLoop()
      latestRef.current.onTogglePlay?.(true)
      setPlaying(true)
    },
    [latestRef, startLoop, stop]
  )

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  const stoppedAtEnd = end === absoluteEnd && loop !== true
  const playbackDisabled = disabled || stoppedAtEnd

  return (
    <div
      data-testid="timebar-playback"
      className={cx('print-hidden', styles.playbackActions, {
        [styles.playbackActionsActive]: playing,
      })}
    >
      <button
        type="button"
        title={labels.toogleAnimationLooping}
        onClick={() => setLoop((prev) => !prev)}
        className={cx(uiStyles.uiButton, styles.secondary, styles.loop, {
          [styles.secondaryActive]: loop,
        })}
      >
        <Icon icon="loop" />
      </button>
      <button
        type="button"
        title={labels.moveBack}
        onClick={() => update(-1, { byIntervals: true })}
        className={cx(uiStyles.uiButton, styles.secondary, styles.back)}
      >
        <Icon icon="back" />
      </button>
      <button
        type="button"
        title={
          disabled && disabledTooltip
            ? disabledTooltip
            : playing === true
              ? labels.pauseAnimation
              : labels.playAnimation
        }
        onClick={playbackDisabled ? undefined : () => togglePlay()}
        className={cx(uiStyles.uiButton, styles.buttonBigger, styles.play, {
          [styles.disabled]: playbackDisabled,
        })}
      >
        {playing === true ? <Icon icon="pause" /> : <Icon icon="play" />}
      </button>
      <button
        type="button"
        title={labels.moveForward}
        onClick={() => update(1, { byIntervals: true })}
        className={cx(uiStyles.uiButton, styles.secondary, styles.forward)}
      >
        <Icon icon="forward" />
      </button>
      <button
        type="button"
        title={labels.changeAnimationSpeed}
        onClick={() => setSpeedStep((prev) => (prev === SPEED_STEPS.length - 1 ? 0 : prev + 1))}
        className={cx(uiStyles.uiButton, styles.secondary, styles.speed)}
      >
        {SPEED_STEPS[speedStep]}x
      </button>
    </div>
  )
}
