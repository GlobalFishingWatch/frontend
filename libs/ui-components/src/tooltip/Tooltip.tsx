import * as React from 'react'
import Tippy, { TippyProps } from '@tippyjs/react'
import styles from './Tooltip.module.css'

export function Tooltip(props: TippyProps) {
  if (!props.content) return props.children
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
