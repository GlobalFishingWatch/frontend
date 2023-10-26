import * as React from 'react'
import Tippy, { TippyProps } from '@tippyjs/react'
import cx from 'classnames'
import styles from './Tooltip.module.css'

export function Tooltip(props: TippyProps) {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!props.content) return <React.Fragment>{props.children}</React.Fragment>
  return (
    <Tippy
      className={cx(styles.tooltip, props.className)}
      duration={props.duration || 100}
      delay={props.delay || 500}
      {...props}
    >
      {props.children}
    </Tippy>
  )
}
