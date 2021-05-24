import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import memoize from 'memoize-one'
import { scaleLinear } from 'd3-scale'
import { clampToAbsoluteBoundaries } from '../utils/internal-utils'
import ImmediateContext from '../immediateContext'
import { ReactComponent as IconLoop } from '../icons/loop.svg'
import { ReactComponent as IconBack } from '../icons/back.svg'
import { ReactComponent as IconPlay } from '../icons/play.svg'
import { ReactComponent as IconPause } from '../icons/pause.svg'
import { ReactComponent as IconForward } from '../icons/forward.svg'
import uiStyles from '../timebar.module.css'
import styles from './playback.module.css'

const BASE_STEP = 0.001
const SPEED_STEPS = [1, 2, 3, 5, 10]
const FAST_FORWARD_REWIND_MULTIPLICATOR = 100

class Playback extends Component {
  static contextType = ImmediateContext
  lastUpdateMs = null
  constructor() {
    super()
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

  update = (deltaMultiplicatorMs) => {
    const { onTick, start, end, absoluteStart } = this.props
    const { speedStep, loop } = this.state
    const deltaMs = this.getStep(start, end, speedStep) * deltaMultiplicatorMs

    const newStartMs = new Date(start).getTime() + deltaMs
    const newEndMs = new Date(end).getTime() + deltaMs

    const currentStartEndDeltaMs = newEndMs - newStartMs

    const newStart = new Date(newStartMs).toISOString()
    const newEnd = new Date(newEndMs).toISOString()

    const playbackAbsoluteEnd = new Date(Date.now()).toISOString()

    const { newStartClamped, newEndClamped, clamped } = clampToAbsoluteBoundaries(
      newStart,
      newEnd,
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

  tick = (elapsedMs) => {
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

  togglePlay = (force) => {
    const { playing } = this.state
    const { onTogglePlay } = this.props

    const playingNext = force === undefined ? !playing : force

    this.lastUpdateMs = null

    if (playingNext) {
      this.context.toggleImmediate(true)
      this.requestAnimationFrame = window.requestAnimationFrame(this.tick)
    } else {
      this.context.toggleImmediate(false)
      window.cancelAnimationFrame(this.requestAnimationFrame)
    }

    this.setState({
      playing: playingNext,
    })

    onTogglePlay(playingNext)
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.requestAnimationFrame)
  }

  onPlayToggleClick = () => {
    this.togglePlay()
  }

  toggleLoop = () => {
    this.setState((prevState) => ({
      loop: !prevState.loop,
    }))
  }

  onForwardClick = () => {
    this.update(FAST_FORWARD_REWIND_MULTIPLICATOR)
  }

  onBackwardClick = () => {
    this.update(-FAST_FORWARD_REWIND_MULTIPLICATOR)
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
          <IconLoop />
        </button>
        <button
          type="button"
          title={labels.moveBack}
          onClick={this.onBackwardClick}
          className={cx(uiStyles.uiButton, styles.secondary, styles.back)}
        >
          <IconBack />
        </button>
        <button
          type="button"
          title={playing === true ? labels.pauseAnimation : labels.playAnimation}
          onClick={this.onPlayToggleClick}
          disabled={stoppedAtEnd}
          className={cx(uiStyles.uiButton, styles.buttonBigger, styles.play)}
        >
          {playing === true ? <IconPause /> : <IconPlay />}
        </button>
        <button
          type="button"
          title={labels.moveForward}
          onClick={this.onForwardClick}
          className={cx(uiStyles.uiButton, styles.secondary, styles.forward)}
        >
          <IconForward />
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

Playback.propTypes = {
  labels: PropTypes.shape({
    playAnimation: PropTypes.string,
    pauseAnimation: PropTypes.string,
    toogleAnimationLooping: PropTypes.string,
    moveBack: PropTypes.string,
    moveForward: PropTypes.string,
    changeAnimationSpeed: PropTypes.string,
  }),
  onTick: PropTypes.func.isRequired,
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  absoluteStart: PropTypes.string.isRequired,
  absoluteEnd: PropTypes.string.isRequired,
  onTogglePlay: PropTypes.func,
}

Playback.defaultProps = {
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
}

export default Playback
