import React, { Fragment } from 'react'
import Spinner from '@globalfishingwatch/ui-components/src/spinner'

const SpinnersSection = () => {
  return (
    <Fragment>
      <h3>Basic</h3>
      <Spinner />
      <h3>Small with custom color</h3>
      <Spinner size="small" color="red" />
    </Fragment>
  )
}

export default SpinnersSection
