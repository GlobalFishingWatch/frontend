import React, { useMemo, useState } from 'react'
import ReactMapGL from 'react-map-gl'
import { useSelector } from 'react-redux'
import useLayerComposer from '@globalfishingwatch/react-hooks/dist/use-layer-composer'
import { useTimeConnect } from 'features/timebar/timebar.hooks'
import { selectGeneratorConfigWithData } from './map.selectors'

const Map = () => {
  const { start, end } = useTimeConnect()
  const globalGeneratorConfig = useMemo(
    () => ({
      start,
      end,
    }),
    [start, end]
  )
  const generatorConfigs = useSelector(selectGeneratorConfigWithData)
  const { style } = useLayerComposer(generatorConfigs, globalGeneratorConfig)

  const [viewport, updateViewport] = useState({
    zoom: 1,
    latitude: 0,
    longitude: 0,
  })

  return (
    <ReactMapGL
      width="100%"
      height="100%"
      {...viewport}
      onViewportChange={updateViewport}
      mapStyle={style}
      mapOptions={{
        customAttribution: '© Copyright Global Fishing Watch 2020',
      }}
    />
  )
}

export default Map
