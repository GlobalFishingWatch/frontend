import React from "react"
import ReactMapGL from 'react-map-gl'

const Map = () => {
  return <ReactMapGL
    width="100%"
    height="100%"
    // {...viewport}
    // onViewportChange={onViewportChange as any}
    // mapStyle={style}
    mapOptions={{
      customAttribution: '© Copyright Global Fishing Watch 2020',
    }}
    // onClick={onMapClick}
    // onMouseMove={onMapMove}
  />
}

export default Map