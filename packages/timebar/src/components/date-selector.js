import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ReactComponent as IconArrowUp } from '../icons/arrowUp.svg'
import { ReactComponent as IconArrowDown } from '../icons/arrowDown.svg'
import styles from './date-selector.module.css'

class DateSelector extends Component {
  pressing = 0
  pressingInterval = null
  pressingTimeout = null

  onMouseDown(increment) {
    this.clear()
    const { onChange } = this.props
    this.pressing = increment
    onChange(this.pressing)
    this.pressingTimeout = window.setTimeout(this.startTimeout, 800)
    window.addEventListener('mouseup', this.onMouseUp)
  }

  startTimeout = () => {
    this.pressingInterval = window.setInterval(this.onInterval, 80)
  }

  onInterval = () => {
    const { onChange } = this.props
    onChange(this.pressing)
  }

  onMouseUp = () => {
    this.clear()
    this.pressing = 0
  }

  clear() {
    window.clearInterval(this.pressingInterval)
    window.clearTimeout(this.pressingTimeout)
    window.removeEventListener('mouseup', this.onMouseUp)
  }

  componentWillUnmount() {
    this.clear()
  }

  render() {
    const { value, canIncrement, canDecrement } = this.props
    return (
      <div className={styles.DateSelector}>
        <button
          type="button"
          className={styles.arrowButton}
          disabled={!canIncrement}
          onMouseDown={() => {
            this.onMouseDown(+1)
          }}
        >
          <IconArrowUp />
        </button>
        <span className={styles.value}>{value}</span>
        <button
          type="button"
          className={styles.arrowButton}
          disabled={!canDecrement}
          onMouseDown={() => {
            this.onMouseDown(-1)
          }}
        >
          <IconArrowDown />
        </button>
      </div>
    )
  }
}

DateSelector.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  canIncrement: PropTypes.bool.isRequired,
  canDecrement: PropTypes.bool.isRequired,
}

export default DateSelector
