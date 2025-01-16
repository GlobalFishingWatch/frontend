import type { ReactEventHandler } from 'react';
import React from 'react'
import cx from 'classnames'

import { Icon } from '@globalfishingwatch/ui-components'

import styles from './timeline-handler.module.css'

type HandlerProps = {
  dragLabel?: string
  onMouseDown: ReactEventHandler
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
    <Icon icon="drag-timebar" />
  </button>
)

export default Handler
