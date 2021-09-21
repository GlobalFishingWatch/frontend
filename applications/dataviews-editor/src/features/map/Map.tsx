import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import ReactMapGL from 'react-map-gl'
import { useWorkspace, useDataviews, useLayerComposer } from '@globalfishingwatch/react-hooks'
import { useTimeConnect } from 'features/timebar/timebar.hooks'
import { selectAddedDataviews } from 'features/dataviews/dataviews.selectors'
import { selectResources } from 'features/dataviews/resources.slice'
import styles from './Map.module.css'

const Map = () => {
  const [viewport, updateViewport] = useState({
    zoom: 1,
    latitude: 0,
    longitude: 0,
  })
  const { start, end } = useTimeConnect()
  const dataviews = useWorkspace(useSelector(selectAddedDataviews))
  const generatorConfigs = useDataviews(dataviews, useSelector(selectResources))
  const globalGeneratorConfig = useMemo(
    () => ({
      start,
      end,
      zoom: viewport.zoom,
    }),
    [start, end, viewport.zoom]
  )
  const { style, error } = useLayerComposer(generatorConfigs, globalGeneratorConfig)

  return (
    <div className={styles.container}>
      {error && <div className={styles.error}>{error.toString()}</div>}
      {style && (
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
      )}
    </div>
  )
}

export default Map
