import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { MiniGlobe, IconButton, MiniglobeBounds } from '@globalfishingwatch/ui-components'
import { InteractiveMap, ScaleControl, MapRequest } from '@globalfishingwatch/react-map-gl'
import GFWAPI from '@globalfishingwatch/api-client'
import useLayerComposer from '@globalfishingwatch/react-hooks/dist/use-layer-composer'
import {
  AnyGeneratorConfig,
  TrackGeneratorConfig,
} from '@globalfishingwatch/layer-composer/dist/generators/types'
import { trackValueArrayToSegments, Field, Segment } from '@globalfishingwatch/data-transforms'
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

  const [track, setTrack] = useState<Segment[] | null>(null)
  useEffect(() => {
    const fields = [Field.lonlat, Field.timestamp, Field.speed, Field.fishing]
    fetch(
      `https://gateway.api.dev.globalfishingwatch.org/datasets/fishing/vessels/00ba29183-3b86-9e36-cf20-ee340e409521/tracks?startDate=2017-01-01T00:00:00.000Z&endDate=2020-09-14T18:31:59.567Z&fields=${fields}&wrapLongitudes=false&format=valueArray`
      // &binary=true &format=valueArray
    )
      .then((r) => r.json())
      .then((data) => {
        const segments = trackValueArrayToSegments(data, fields)
        setTrack(segments)
      })
  }, [])

  const generatorsConfigWithTrack = useMemo<AnyGeneratorConfig[]>(() => {
    const genConfigs = [...generatorsConfig]
    const trackAt = genConfigs.findIndex((generator) => generator.id === 'track')
    const oldTrackGenerator = genConfigs[trackAt] as TrackGeneratorConfig
    const trackGenerator: TrackGeneratorConfig = {
      ...oldTrackGenerator,
      data: track,
    }
    console.log(track)
    genConfigs[trackAt] = trackGenerator
    return genConfigs
  }, [track, generatorsConfig])

  // useLayerComposer is a convenience hook to easily generate a Mapbox GL style (see https://docs.mapbox.com/mapbox-gl-js/style-spec/) from
  // the generatorsConfig (ie the map "layers") and the global configuration
  const { style } = useLayerComposer(generatorsConfigWithTrack, globalConfig)

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
        >
          <div className={styles.scale}>
            <ScaleControl maxWidth={100} unit="nautical" />
          </div>
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
