import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { AsyncReducerStatus } from 'types'
import { createPortal } from 'react-dom'
import { useSelector } from 'react-redux'
import {
  MiniGlobe,
  IconButton,
  MiniglobeBounds,
  MapLegend,
} from '@globalfishingwatch/ui-components/dist'
import { InteractiveMap, ScaleControl, MapRequest } from '@globalfishingwatch/react-map-gl'
import GFWAPI from '@globalfishingwatch/api-client'
import { useLayerComposer, useMapClick } from '@globalfishingwatch/react-hooks'
import { useClickedEventConnect, useMapTooltip } from 'features/map/map.hooks'
import { selectWorkspaceDataviewsResolved } from 'features/workspace/workspace.selectors'
import { ClickPopup } from 'features/map/Popup'
import { useGeneratorsConnect } from './map.hooks'
import useViewport from './map-viewport.hooks'
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

  const onMapError = useCallback((error: any) => {
    // TODO: Handle auth errors and retry to load tile
    // console.log(error)
  }, [])
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

  const { clickedEvent, clickedEventStatus, dispatchClickedEvent } = useClickedEventConnect()
  const onMapClick = useMapClick(dispatchClickedEvent)
  const clickedTooltipEvent = useMapTooltip(clickedEvent)
  const closePopup = useCallback(() => {
    dispatchClickedEvent(null)
  }, [dispatchClickedEvent])

  // useLayerComposer is a convenience hook to easily generate a Mapbox GL style (see https://docs.mapbox.com/mapbox-gl-js/style-spec/) from
  // the generatorsConfig (ie the map "layers") and the global configuration
  const { style } = useLayerComposer(generatorsConfig, globalConfig)

  const dataviews = useSelector(selectWorkspaceDataviewsResolved)
  const layersWithLegend = useMemo(() => {
    if (!style) return []
    return style.layers?.flatMap((layer) => {
      if (!layer.metadata?.legend) return []
      const sublayerLegendsMetadata = Array.isArray(layer.metadata.legend)
        ? layer.metadata.legend
        : [layer.metadata.legend]

      return sublayerLegendsMetadata.map((sublayerLegendMetadata) => {
        const id = sublayerLegendMetadata.id || (layer.metadata?.generatorId as string)
        // TODO remove the parseInt
        const dataview = dataviews?.find((d) => d.id === parseInt(id))
        const sublayerLegend = {
          ...sublayerLegendMetadata,
          id: `legend_${id}`,
          color: layer.metadata?.color || dataview?.config.color || 'red',
          // TODO Get that from dataview
          label: 'Soy leyenda ✌️',
          unit: 'hours',
        }
        return sublayerLegend
      })
    })
  }, [style, dataviews])

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
          onError={onMapError}
          onClick={onMapClick}
          interactiveLayerIds={style.metadata.interactiveLayerIds}
        >
          <div className={styles.scale}>
            <ScaleControl maxWidth={100} unit="nautical" />
          </div>
          {clickedEvent && (
            <ClickPopup
              event={clickedTooltipEvent}
              onClose={closePopup}
              loading={clickedEventStatus === AsyncReducerStatus.Loading}
            />
          )}
        </InteractiveMap>
      )}
      <div className={styles.mapControls}>
        <MiniGlobe size={60} bounds={bounds} center={{ latitude, longitude }} />
        <IconButton icon="plus" type="map-tool" tooltip="Zoom in" onClick={onZoomInClick} />
        <IconButton icon="minus" type="map-tool" tooltip="Zoom out" onClick={onZoomOutClick} />
        <IconButton icon="ruler" type="map-tool" tooltip="Ruler (Coming soon)" />
        <IconButton icon="camera" type="map-tool" tooltip="Capture (Coming soon)" />
      </div>
      {layersWithLegend?.map(
        (legend) =>
          document.getElementById(legend.id) &&
          createPortal(<MapLegend layer={legend} />, document.getElementById(legend.id) as Element)
      )}
    </div>
  )
}

export default Map
