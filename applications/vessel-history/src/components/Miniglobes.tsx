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
          north: 35,
          south: -14,
          west: -70,
          east: 80,
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
