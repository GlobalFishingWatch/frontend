import React, { Fragment, memo } from 'react'
import Tippy, { TippyProps } from '@tippyjs/react'
import styles from './Tooltip.module.css'

function Tooltip(props: TippyProps) {
  if (!props.content) return <Fragment>{props.children}</Fragment>
  return (
    <Tippy
      className={styles.tooltip}
      duration={props.duration || 100}
      delay={props.delay || 500}
      {...props}
    >
      {props.children}
    </Tippy>
  )
}

export default memo(Tooltip)
