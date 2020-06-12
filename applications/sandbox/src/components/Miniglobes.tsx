import React, { Fragment } from 'react'
import MiniGlobe from '@globalfishingwatch/ui-components/src/miniglobe'

const MiniglobesSection = () => {
  return (
    <Fragment>
      <label>Viewport</label>
      <MiniGlobe
        size={60}
        center={{ latitude: 0, longitude: 0 }}
        bounds={{
          north: 30,
          south: -30,
          west: -30,
          east: 30,
        }}
      />
      <label>Point</label>
      <MiniGlobe
        size={60}
        center={{ latitude: 0, longitude: 0 }}
        bounds={{
          north: 1,
          south: -1,
          west: -1,
          east: 1,
        }}
      />
    </Fragment>
  )
}

export default MiniglobesSection
