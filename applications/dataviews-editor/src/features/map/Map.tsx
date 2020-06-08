import React, { useMemo, useState } from 'react'
import ReactMapGL from 'react-map-gl'
import { useSelector } from 'react-redux'
import useLayerComposer from '@globalfishingwatch/react-hooks/dist/use-layer-composer'
import { useTimeConnect } from 'features/timebar/timebar.hooks'
import { selectAddedDataviews } from 'features/dataviews/dataviews.selectors'
import { selectResources } from 'features/dataviews/resources.slice'
import useDataviewsGenerators from './use-dataviews-generators'
import useWorkspaceDataviews from './use-workspace-dataviews'

const Map = () => {
  const { start, end } = useTimeConnect()
  const dataviews = useWorkspaceDataviews(useSelector(selectAddedDataviews))
  const generatorConfigs = useDataviewsGenerators(dataviews, useSelector(selectResources))
  const globalGeneratorConfig = useMemo(
    () => ({
      start,
      end,
    }),
    [start, end]
  )
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
