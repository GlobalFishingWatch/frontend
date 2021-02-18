import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { ReactComponent as IconDrag } from '../icons/drag.svg'
import styles from './timeline-handler.module.css'

const Handler = (props) => (
  <button
    onMouseDown={props.onMouseDown}
    onTouchStart={props.onMouseDown}
    type="button"
    title="Drag to change the time range"
    className={cx(styles.handler, {
      [styles._immediate]: props.dragging === true,
    })}
    style={{ left: props.dragging === true ? props.mouseX : props.x }}
  >
    <IconDrag />
  </button>
)

Handler.propTypes = {
  onMouseDown: PropTypes.func.isRequired,
  dragging: PropTypes.bool.isRequired,
  x: PropTypes.number.isRequired,
  mouseX: PropTypes.number,
}

Handler.defaultProps = {
  mouseX: 0,
}

export default Handler
