import React, { Fragment } from 'react'
import Logo from '@globalfishingwatch/ui-components/src/logo'

const LogosSection = () => {
  return (
    <Fragment>
      <h3>Default</h3>
      <Logo />
      <Logo subBrand="Marine Reserves" />
      <div style={{ padding: '2rem', backgroundColor: 'black' }}>
        <Logo type="invert" />
        <Logo type="invert" subBrand="Carrier Vessels" />
      </div>
    </Fragment>
  )
}

export default LogosSection
