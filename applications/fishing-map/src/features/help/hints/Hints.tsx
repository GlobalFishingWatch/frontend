import React, { Fragment } from 'react'
import hintsConfig from './hints.content'
import Hint from './Hint'

function Hints() {
  if (!hintsConfig || hintsConfig.length === 0) return null

  return (
    <Fragment>
      {hintsConfig.map((hint) => (
        <Hint hint={hint} />
      ))}
    </Fragment>
  )
}

export default Hints
