import React, { Component } from 'react'
import cx from 'classnames'
import memoize from 'memoize-one'
import { scaleLinear } from 'd3-scale'
import { DateTime } from 'luxon'
import {
  getFourwingsInterval,
  FOURWINGS_INTERVALS_ORDER,
  FourwingsInterval,
} from '@globalfishingwatch/deck-loaders'
import { Icon } from '@globalfishingwatch/ui-components/icon'
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
    const startMs = new Date(start).getTime()
    const endMs = new Date(end).getTime()

    const scale = scaleLinear().range([0, 1]).domain([startMs, endMs])
    const step = scale.invert(baseStepWithSpeed) - startMs
    return step
  })

  update = (deltaMultiplicator: number, { byIntervals = false } = {}) => {
    const { onTick, start, end, absoluteStart, intervals, getCurrentInterval } = this.props
    const { speedStep, loop } = this.state
    let newStartMs
    let newEndMs
    if (byIntervals && getCurrentInterval) {
      const interval = getCurrentInterval(start, end, intervals)
      const intervalStartMs =
        interval === 'MONTH'
          ? DateTime.fromISO(start, { zone: 'utc' })?.daysInMonth! * MS_IN_INTERVAL.DAY
          : MS_IN_INTERVAL[interval]
      const intervalEndMs =
        interval === 'MONTH'
          ? DateTime.fromISO(end, { zone: 'utc' })?.daysInMonth! * MS_IN_INTERVAL.DAY
          : MS_IN_INTERVAL[interval]
      newStartMs = new Date(start).getTime() + intervalStartMs * deltaMultiplicator
      newEndMs = new Date(end).getTime() + intervalEndMs * deltaMultiplicator
    } else {
      const deltaMs = this.getStep(start, end, speedStep) * deltaMultiplicator
      newStartMs = new Date(start).getTime() + deltaMs
      newEndMs = new Date(end).getTime() + deltaMs
    }
    const currentStartEndDeltaMs = newEndMs - newStartMs
    const playbackAbsoluteEnd = new Date(Date.now()).toISOString()
    const { newStartClamped, newEndClamped, clamped } = clampToAbsoluteBoundaries(
      new Date(newStartMs).toISOString(),
      new Date(newEndMs).toISOString(),
      currentStartEndDeltaMs,
      absoluteStart,
      playbackAbsoluteEnd
    )

    onTick(newStartClamped, newEndClamped)

    if (clamped === 'end') {
      if (loop === true) {
        // start again from absoluteStart
        const newEnd = new Date(
          new Date(absoluteStart).getTime() + currentStartEndDeltaMs
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

    onTogglePlay && onTogglePlay(playingNext)
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
    const { labels, end, absoluteEnd } = this.props
    const stoppedAtEnd = end === absoluteEnd && loop !== true

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
          title={playing === true ? labels.pauseAnimation : labels.playAnimation}
          onClick={this.onPlayToggleClick}
          disabled={stoppedAtEnd}
          className={cx(uiStyles.uiButton, styles.buttonBigger, styles.play)}
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
