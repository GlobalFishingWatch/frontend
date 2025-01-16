import React, { Component } from 'react'
import cx from 'classnames'
import { scaleLinear } from 'd3-scale'
import { DateTime } from 'luxon'
import memoize from 'memoize-one'

import { getUTCDate } from '@globalfishingwatch/data-transforms'
import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { FOURWINGS_INTERVALS_ORDER,getFourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { Icon } from '@globalfishingwatch/ui-components'

import { clampToAbsoluteBoundaries } from '../utils/internal-utils'

import uiStyles from '../timebar.module.css'
import styles from './playback.module.css'

const BASE_STEP = 0.001
const SPEED_STEPS = [1, 2, 3, 5, 10]

const MS_IN_INTERVAL = {
  HOUR: 1000 * 60 * 60,
  DAY: 1000 * 60 * 60 * 24,
  YEAR: 1000 * 60 * 60 * 24 * 365,
}

type PlaybackProps = {
  labels: {
    playAnimation?: string
    pauseAnimation?: string
    toogleAnimationLooping?: string
    moveBack?: string
    moveForward?: string
    changeAnimationSpeed?: string
  }
  onTick: (newStart: string, newEnd: string) => void
  start: string
  end: string
  absoluteStart: string
  absoluteEnd: string
  intervals?: FourwingsInterval[]
  onTogglePlay?: (isPlaying: boolean) => void
  getCurrentInterval: typeof getFourwingsInterval
  disabled?: boolean
  disabledPlaybackTooltip?: string
}

type PlaybackState = {
  playing: boolean
  speedStep: number
  loop: boolean
}

class Playback extends Component<PlaybackProps> {
  lastUpdateMs: number | null = null
  requestAnimationFrame: number | null = null
  state: PlaybackState

  static defaultProps = {
    labels: {
      playAnimation: 'Play animation',
      pauseAnimation: 'Pause animation',
      toogleAnimationLooping: 'Toggle animation looping',
      moveBack: 'Move back',
      moveForward: 'Move forward',
      changeAnimationSpeed: 'Change animation speed',
    },
    onTogglePlay: () => {
      // do nothing
    },
    intervals: FOURWINGS_INTERVALS_ORDER,
    getCurrentInterval: getFourwingsInterval,
    disabled: false,
    disabledPlaybackTooltip: '',
  }

  constructor(props: PlaybackProps) {
    super(props)
    this.state = {
      playing: false,
      speedStep: 0,
      loop: false,
    }
  }

  getStep = memoize((start, end, speedStep) => {
    const baseStepWithSpeed = BASE_STEP * SPEED_STEPS[speedStep]
    const startMs = getUTCDate(start).getTime()
    const endMs = getUTCDate(end).getTime()

    const scale = scaleLinear().range([0, 1]).domain([startMs, endMs])
    const step = scale.invert(baseStepWithSpeed) - startMs
    return step
  })

  update = (deltaMultiplicator: number, { byIntervals = false } = {}) => {
    const { onTick, start, end, absoluteStart, intervals, getCurrentInterval } = this.props
    if (!start || !end) {
      return
    }
    const { speedStep, loop } = this.state
    let newStartMs
    let newEndMs
    if (byIntervals && getCurrentInterval) {
      const interval = getCurrentInterval(start, end, intervals)
      const intervalStartMs =
        interval === 'MONTH'
          ? DateTime.fromISO(start, { zone: 'utc' }).daysInMonth! * MS_IN_INTERVAL.DAY
          : MS_IN_INTERVAL[interval]
      const intervalEndMs =
        interval === 'MONTH'
          ? DateTime.fromISO(end, { zone: 'utc' }).daysInMonth! * MS_IN_INTERVAL.DAY
          : MS_IN_INTERVAL[interval]
      newStartMs = getUTCDate(start).getTime() + intervalStartMs * deltaMultiplicator
      newEndMs = getUTCDate(end).getTime() + intervalEndMs * deltaMultiplicator
    } else {
      const deltaMs = this.getStep(start, end, speedStep) * deltaMultiplicator
      newStartMs = getUTCDate(start).getTime() + deltaMs
      newEndMs = getUTCDate(end).getTime() + deltaMs
    }
    const currentStartEndDeltaMs = newEndMs - newStartMs
    const playbackAbsoluteEnd = getUTCDate(Date.now()).toISOString()
    const { newStartClamped, newEndClamped, clamped } = clampToAbsoluteBoundaries(
      getUTCDate(newStartMs).toISOString(),
      getUTCDate(newEndMs).toISOString(),
      currentStartEndDeltaMs,
      absoluteStart,
      playbackAbsoluteEnd
    )

    onTick(newStartClamped, newEndClamped)

    if (clamped === 'end') {
      if (loop === true) {
        // start again from absoluteStart
        const newEnd = getUTCDate(
          getUTCDate(absoluteStart).getTime() + currentStartEndDeltaMs
        ).toISOString()
        onTick(absoluteStart, newEnd)
      } else {
        this.togglePlay(false)
      }
    }
    if (clamped !== 'end' || loop === true) {
      return true
    }
  }

  tick = (elapsedMs: number) => {
    if (this.lastUpdateMs === null) {
      this.lastUpdateMs = elapsedMs
    }
    // "compare" elapsed with theoretical 60 fps frame
    const progressRatio = (elapsedMs - this.lastUpdateMs) / (1000 / 60)

    const requireNextTick = this.update(progressRatio)

    this.lastUpdateMs = elapsedMs

    if (requireNextTick === true) {
      this.requestAnimationFrame = window.requestAnimationFrame(this.tick)
    }
  }

  togglePlay = (force?: boolean) => {
    const { playing } = this.state
    const { onTogglePlay } = this.props

    const playingNext = force === undefined ? !playing : force

    this.lastUpdateMs = null

    if (playingNext) {
      // TODO:timebar store playing state in its place instead of using inmmediate
      // this.context.toggleImmediate(true)
      this.requestAnimationFrame = window.requestAnimationFrame(this.tick)
    } else {
      // TODO:timebar store playing state in its place instead of using inmmediate
      // this.context.toggleImmediate(false)
      if (this.requestAnimationFrame) {
        window.cancelAnimationFrame(this.requestAnimationFrame)
      }
    }

    this.setState({
      playing: playingNext,
    })

    if (onTogglePlay) {
      onTogglePlay(playingNext)
    }
  }

  componentWillUnmount() {
    if (this.requestAnimationFrame) {
      window.cancelAnimationFrame(this.requestAnimationFrame)
    }
  }

  onPlayToggleClick = () => {
    this.togglePlay()
  }

  toggleLoop = () => {
    this.setState((prevState: PlaybackState) => ({
      loop: !prevState.loop,
    }))
  }

  onForwardClick = () => {
    // TODO:timebar fix this
    this.update(1, { byIntervals: true })
  }

  onBackwardClick = () => {
    this.update(-1, { byIntervals: true })
  }

  onSpeedClick = () => {
    const { speedStep } = this.state
    const nextStep = speedStep === SPEED_STEPS.length - 1 ? 0 : speedStep + 1
    this.setState({ speedStep: nextStep })
  }

  render() {
    const { playing, loop, speedStep } = this.state
    const { labels, end, absoluteEnd, disabled, disabledPlaybackTooltip } = this.props
    const stoppedAtEnd = end === absoluteEnd && loop !== true

    const playbackDisabled = disabled || stoppedAtEnd

    return (
      <div
        className={cx('print-hidden', styles.playbackActions, {
          [styles.playbackActionsActive]: playing,
        })}
      >
        <button
          type="button"
          title={labels.toogleAnimationLooping}
          onClick={this.toggleLoop}
          className={cx(uiStyles.uiButton, styles.secondary, styles.loop, {
            [styles.secondaryActive]: loop,
          })}
        >
          <Icon icon="loop" />
        </button>
        <button
          type="button"
          title={labels.moveBack}
          onClick={this.onBackwardClick}
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
          onClick={playbackDisabled ? undefined : this.onPlayToggleClick}
          className={cx(uiStyles.uiButton, styles.buttonBigger, styles.play, {
            [styles.disabled]: playbackDisabled,
          })}
        >
          {playing === true ? <Icon icon="pause" /> : <Icon icon="play" />}
        </button>
        <button
          type="button"
          title={labels.moveForward}
          onClick={this.onForwardClick}
          className={cx(uiStyles.uiButton, styles.secondary, styles.forward)}
        >
          <Icon icon="forward" />
        </button>
        <button
          type="button"
          title={labels.changeAnimationSpeed}
          onClick={this.onSpeedClick}
          className={cx(uiStyles.uiButton, styles.secondary, styles.speed)}
        >
          {SPEED_STEPS[speedStep]}x
        </button>
      </div>
    )
  }
}

export default Playback
