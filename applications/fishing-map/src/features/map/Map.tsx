import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { MiniGlobe, IconButton, MiniglobeBounds } from '@globalfishingwatch/ui-components'
import { InteractiveMap, ScaleControl, MapRequest } from '@globalfishingwatch/react-map-gl'
import GFWAPI from '@globalfishingwatch/api-client'
import {
  ExtendedFeature,
  useLayerComposer,
  useMapClick,
  useMapTooltip,
} from '@globalfishingwatch/react-hooks'
import { Generators } from '@globalfishingwatch/layer-composer'
import { resolveEndpoint } from '@globalfishingwatch/dataviews-client'
import { useClickedEventConnect } from '../map-features/map-features.hooks'
import { selectWorkspaceDataviews } from '../workspace/workspace.selectors'
import { ClickPopup } from '../map-features/Popup'
import { useGeneratorsConnect, useViewport } from './map.hooks'
import { useMapboxRef } from './map.context'
import styles from './Map.module.css'

import '@globalfishingwatch/mapbox-gl/dist/mapbox-gl.css'

const mapOptions = {
  customAttribution: 'Global Fishing Watch 2020',
}

const Map = (): React.ReactElement => {
  const mapRef = useMapboxRef()
  const { viewport, onViewportChange, setMapCoordinates } = useViewport()
  const { latitude, longitude, zoom } = viewport
  const { generatorsConfig, globalConfig } = useGeneratorsConnect()
  const [bounds, setBounds] = useState<MiniglobeBounds | undefined>()

  const onZoomInClick = useCallback(() => {
    setMapCoordinates({ latitude, longitude, zoom: zoom + 1 })
  }, [latitude, longitude, setMapCoordinates, zoom])
  const onZoomOutClick = useCallback(() => {
    setMapCoordinates({ latitude, longitude, zoom: Math.max(1, zoom - 1) })
  }, [latitude, longitude, setMapCoordinates, zoom])

  const setMapBounds = useCallback(() => {
    const mapboxRef = mapRef?.current?.getMap()
    if (mapboxRef) {
      const rawBounds = mapboxRef.getBounds()
      if (rawBounds) {
        setBounds({
          north: rawBounds.getNorth() as number,
          south: rawBounds.getSouth() as number,
          west: rawBounds.getWest() as number,
          east: rawBounds.getEast() as number,
        })
      }
    }
  }, [mapRef])

  useEffect(() => {
    setMapBounds()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, latitude, longitude])

  // TODO: Abstract this away
  const token = GFWAPI.getToken()
  const transformRequest: (...args: any[]) => MapRequest = useCallback(
    (url: string, resourceType: string) => {
      const response: MapRequest = { url }
      if (resourceType === 'Tile' && url.includes('globalfishingwatch')) {
        response.headers = {
          Authorization: 'Bearer ' + token,
        }
      }
      return response
    },
    [token]
  )

  const dataviews = useSelector(selectWorkspaceDataviews)

  const { clickedEvent, dispatchClickedEvent } = useClickedEventConnect()
  const onEventClick = useCallback(
    (event) => {
      dispatchClickedEvent(event)
      // TODO should work for multiple features
      const feature: ExtendedFeature = event.features[0]
      if (!dataviews || !feature || !feature.temporalgrid) return
      const allTemporalgridDataviews = dataviews.filter(
        (dataview) => dataview.config.type === Generators.Type.HeatmapAnimated
      )
      // TODO We assume here that temporalgrid dataviews appear in the same order as sublayers are set in the generator, ie indices will match feature.temporalgrid.sublayerIndex
      const dataview = allTemporalgridDataviews[feature.temporalgrid.sublayerIndex]
      // TODO How to get the proper id? Should be fishing_v4
      const DATASET_ID = 'dgg_fishing_galapagos'
      const dataset = dataview.datasets?.find((dataset) => dataset.id === DATASET_ID)
      if (!dataset) return []
      const datasetConfig = {
        params: [
          { id: 'z', value: feature.tile.z },
          { id: 'x', value: feature.tile.x },
          { id: 'y', value: feature.tile.y },
          { id: 'rows', value: feature.temporalgrid.row },
          { id: 'cols', value: feature.temporalgrid.col },
        ],
        endpoint: '4wings-interaction',
      }
      const url = resolveEndpoint(dataset, datasetConfig)
      if (url) {
        GFWAPI.fetch(url).then((vessels) => {
          console.log(vessels)
        })
      }
    },
    [dispatchClickedEvent, dataviews]
  )
  const onMapClick = useMapClick(onEventClick)
  const clickedTooltipEvent = useMapTooltip(dataviews, clickedEvent)
  const closePopup = useCallback(() => {
    dispatchClickedEvent(null)
  }, [dispatchClickedEvent])

  // useLayerComposer is a convenience hook to easily generate a Mapbox GL style (see https://docs.mapbox.com/mapbox-gl-js/style-spec/) from
  // the generatorsConfig (ie the map "layers") and the global configuration
  const { style } = useLayerComposer(generatorsConfig, globalConfig)

  return (
    <div className={styles.container}>
      {style && (
        <InteractiveMap
          ref={mapRef}
          width="100%"
          height="100%"
          latitude={viewport.latitude}
          longitude={viewport.longitude}
          zoom={viewport.zoom}
          onViewportChange={onViewportChange}
          mapStyle={style}
          mapOptions={mapOptions}
          transformRequest={transformRequest}
          onLoad={setMapBounds}
          onResize={setMapBounds}
          interactiveLayerIds={style.metadata.interactiveLayerIds}
          onClick={onMapClick}
        >
          <div className={styles.scale}>
            <ScaleControl maxWidth={100} unit="nautical" />
          </div>
          {clickedEvent && <ClickPopup event={clickedTooltipEvent} onClose={closePopup} />}
        </InteractiveMap>
      )}
      <div className={styles.mapControls}>
        <MiniGlobe size={60} bounds={bounds} center={{ latitude, longitude }} />
        <IconButton icon="plus" type="map-tool" tooltip="Zoom in" onClick={onZoomInClick} />
        <IconButton icon="minus" type="map-tool" tooltip="Zoom out" onClick={onZoomOutClick} />
        <IconButton icon="ruler" type="map-tool" tooltip="Ruler (Coming soon)" />
        <IconButton icon="camera" type="map-tool" tooltip="Capture (Coming soon)" />
      </div>
    </div>
  )
}

export default Map
