import React, { Fragment } from 'react'
import Tippy, { TippyProps } from '@tippyjs/react'
import styles from './Tooltip.module.css'

const Tooltip = (props: TippyProps) => {
  if (!props.content) return <Fragment>{props.children}</Fragment>
  return (
    <Tippy className={styles.tooltip} duration={100} {...props}>
      {props.children}
    </Tippy>
  )
}

export default Tooltip
