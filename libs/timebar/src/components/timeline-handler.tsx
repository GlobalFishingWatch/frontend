import React from 'react'
import cx from 'classnames'
import { ReactComponent as IconDrag } from '../icons/drag.svg'
import styles from './timeline-handler.module.css'

type HandlerProps = {
  dragLabel?: string
  onMouseDown: (...args: unknown[]) => unknown
  dragging: boolean
  x: number
  mouseX?: number
}

const Handler = (props: HandlerProps) => (
  <button
    onMouseDown={props.onMouseDown}
    onTouchStart={props.onMouseDown}
    type="button"
    title={props.dragLabel || 'Drag to change the time range'}
    className={cx(styles.handler, {
      [styles._immediate]: props.dragging === true,
    })}
    style={{ left: props.dragging === true ? props.mouseX || 0 : props.x }}
  >
    <IconDrag />
  </button>
)

export default Handler
