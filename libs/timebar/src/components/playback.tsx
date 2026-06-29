import { useCallback, useEffect, useRef, useState } from 'react'
import cx from 'classnames'

import { getUTCDate } from '@globalfishingwatch/data-transforms'
import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { FOURWINGS_INTERVALS_ORDER, getFourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { Icon } from '@globalfishingwatch/ui-components/icon'

import type { TimebarLabels } from '../timebar-labels'
import { DEFAULT_LABELS } from '../timebar-labels'
import { getTimebarStepByDelta } from '../utils'

import uiStyles from '../timebar.module.css'
import styles from './playback.module.css'

const SPEED_STEPS = [1, 2, 3, 5, 10]

type PlaybackProps = {
  labels?: TimebarLabels['playback']
  onTick: (newStart: string, newEnd: string) => void
  start: string
  end: string
  absoluteStart: string
  absoluteEnd: string
  intervals?: FourwingsInterval[]
  onTogglePlay?: (isPlaying: boolean) => void
  getCurrentInterval?: typeof getFourwingsInterval
  disabled?: boolean
  disabledPlaybackTooltip?: string
}

function Playback({
  labels = DEFAULT_LABELS.playback,
  onTick,
  start,
  end,
  absoluteStart,
  absoluteEnd,
  intervals = FOURWINGS_INTERVALS_ORDER,
  onTogglePlay,
  getCurrentInterval = getFourwingsInterval,
  disabled = false,
  disabledPlaybackTooltip = '',
}: PlaybackProps) {
  const [playing, setPlaying] = useState(false)
  const [speedStep, setSpeedStep] = useState(0)
  const [loop, setLoop] = useState(false)

  const rafRef = useRef<number | null>(null)
  const lastUpdateMsRef = useRef<number | null>(null)

  // Latest values for the rAF loop, so its callbacks never read stale props/state.
  const latest = useRef({
    start,
    end,
    absoluteStart,
    intervals,
    getCurrentInterval,
    onTick,
    onTogglePlay,
    speedStep,
    loop,
    playing,
  })
  useEffect(() => {
    latest.current = {
      start,
      end,
      absoluteStart,
      intervals,
      getCurrentInterval,
      onTick,
      onTogglePlay,
      speedStep,
      loop,
      playing,
    }
  })

  const stop = useCallback(() => {
    if (rafRef.current) {
      window.cancelAnimationFrame(rafRef.current)
    }
    latest.current.onTogglePlay?.(false)
    setPlaying(false)
  }, [])

  const update = useCallback(
    (deltaMultiplicator: number, { byIntervals = false } = {}) => {
      const { start, end, absoluteStart, intervals, getCurrentInterval, onTick, speedStep, loop } =
        latest.current
      if (!start || !end) return

      const {
        start: newStart,
        end: newEnd,
        clamped,
      } = getTimebarStepByDelta({
        start,
        end,
        absoluteStart,
        intervals,
        byIntervals,
        speedStep: SPEED_STEPS[speedStep],
        getCurrentInterval,
        deltaMultiplicator,
      })

      if (newStart && newEnd) {
        onTick(newStart, newEnd)
      }

      if (clamped === 'end') {
        if (loop === true) {
          const currentStartEndDeltaMs =
            getUTCDate(newStart).getTime() - getUTCDate(newEnd).getTime()
          // start again from absoluteStart
          const newEndLoop = getUTCDate(
            getUTCDate(absoluteStart).getTime() + currentStartEndDeltaMs
          ).toISOString()
          onTick(absoluteStart, newEndLoop)
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
      const playingNext = force === undefined ? !latest.current.playing : force
      if (!playingNext) {
        stop()
        return
      }
      startLoop()
      latest.current.onTogglePlay?.(true)
      setPlaying(true)
    },
    [stop, startLoop]
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
          disabled && disabledPlaybackTooltip
            ? disabledPlaybackTooltip
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

export default Playback
