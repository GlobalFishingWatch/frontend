import React, { Fragment } from 'react'
import Logo, { SubBrands } from '@globalfishingwatch/ui-components/src/logo'

const LogosSection = () => {
  return (
    <Fragment>
      <h3>Default</h3>
      <Logo />
      <Logo subBrand={SubBrands.MarinReserves} />
      <div style={{ padding: '2rem', backgroundColor: 'black' }}>
        <Logo type="invert" />
        <Logo type="invert" subBrand={SubBrands.CarrierVessels} />
      </div>
    </Fragment>
  )
}

export default LogosSection
