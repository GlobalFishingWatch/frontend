import React, { useMemo, useState } from 'react'
import ReactMapGL from 'react-map-gl'
import { useSelector } from 'react-redux'
import { useWorkspace, useDataviews, useLayerComposer } from '@globalfishingwatch/react-hooks'
import { useTimeConnect } from 'features/timebar/timebar.hooks'
import { selectAddedDataviews } from 'features/dataviews/dataviews.selectors'
import { selectResources } from 'features/dataviews/resources.slice'
import styles from './Map.module.css'

const Map = () => {
  const { start, end } = useTimeConnect()
  const dataviews = useWorkspace(useSelector(selectAddedDataviews))
  const generatorConfigs = useDataviews(dataviews, useSelector(selectResources))
  const globalGeneratorConfig = useMemo(
    () => ({
      start,
      end,
    }),
    [start, end]
  )
  const { style, error } = useLayerComposer(generatorConfigs, globalGeneratorConfig)

  const [viewport, updateViewport] = useState({
    zoom: 1,
    latitude: 0,
    longitude: 0,
  })

  return (
    <div className={styles.container}>
      {error && <div className={styles.error}>{error.toString()}</div>}
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
    </div>
  )
}

export default Map
