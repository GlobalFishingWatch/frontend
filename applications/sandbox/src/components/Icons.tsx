import React, { Fragment } from 'react'
import Icon from '@globalfishingwatch/ui-components/src/icon'

const IconsSection = () => {
  return (
    <Fragment>
      <label>Default</label>
      <Icon icon="menu" />
      <label>Custom fill</label>
      <span style={{ color: 'red' }}>
        <Icon icon="delete" />
      </span>
    </Fragment>
  )
}

export default IconsSection
