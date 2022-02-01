import React, { Fragment } from 'react'
import Tippy, { TippyProps } from '@tippyjs/react'

import './tooltip.module.css'

const Tooltip = (props: TippyProps) => {
  if (!props.content) return <Fragment>{props.children}</Fragment>
  return (
    <Tippy duration={0} {...props}>
      {props.children}
    </Tippy>
  )
}

export default Tooltip
