import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import { fitBounds } from 'viewport-mercator-project'
import GFWAPI from '@globalfishingwatch/api-client'
import { InteractiveMap, MapRequest } from '@globalfishingwatch/react-map-gl'
import Miniglobe, { MiniglobeBounds } from '@globalfishingwatch/ui-components/dist/miniglobe'
import MapLegend from '@globalfishingwatch/ui-components/dist/map-legend'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import useLayerComposer from '@globalfishingwatch/react-hooks/dist/use-layer-composer'
import { ExtendedLayer, ExtendedStyle } from '@globalfishingwatch/layer-composer/dist/types'
import { useAOIConnect } from 'features/areas-of-interest/areas-of-interest.hook'
import { useUserConnect } from 'features/user/user.hook'
import { useGeneratorsConnect, useViewport } from './map.hooks'
import styles from './Map.module.css'

import '@globalfishingwatch/mapbox-gl/dist/mapbox-gl.css'

type LegendConfig = Record<string, number>

// TODO: move this to its own component?
function useLegendComposer(style: ExtendedStyle, currentValues: LegendConfig) {
  const layersWithLegend = useMemo(() => {
    return style
      ? style?.layers?.flatMap((layer) => {
          if (!layer.metadata?.legend) return []

          return {
            ...layer,
            ...(currentValues[layer.id] !== undefined && {
              metadata: {
                ...layer.metadata,
                legend: { ...layer.metadata.legend, currentValue: currentValues[layer.id] },
              },
            }),
          }
        })
      : ([] as ExtendedLayer[])
  }, [currentValues, style])
  return layersWithLegend
}

const Map = (): React.ReactElement => {
  const mapRef = useRef<any>(null)
  const { viewport, onViewportChange, setMapCoordinates } = useViewport()
  const { latitude, longitude, zoom } = viewport
  const { currentAOI } = useAOIConnect()
  const { logged } = useUserConnect()
  const { generatorsConfig, globalConfig } = useGeneratorsConnect()
  const token = GFWAPI.getToken()
  // Updating token at render time instead of selector in case it was refreshed
  globalConfig.token = token
  // useLayerComposer is a convenience hook to easily generate a Mapbox GL style (see https://docs.mapbox.com/mapbox-gl-js/style-spec/) from
  // the generatorsConfig (ie the map "layers") and the global configuration
  const { style } = useLayerComposer(generatorsConfig, globalConfig)
  const [currentValues, setCurrentValues] = useState<LegendConfig>({})
  const legendLayers = useLegendComposer(style as ExtendedStyle, currentValues)

  const [bounds, setBounds] = useState<MiniglobeBounds | undefined>()

  const transformRequest: any = useCallback(
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

  useEffect(() => {
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
  }, [zoom, latitude, longitude, mapRef])

  useEffect(() => {
    const map = mapRef.current?.getMap()
    if (map) {
      if (currentAOI && currentAOI.bbox) {
        const [minLng, minLat, maxLng, maxLat] = currentAOI.bbox
        const { latitude, longitude, zoom } = fitBounds({
          bounds: [
            [minLng, minLat],
            [maxLng, maxLat],
          ],
          width: mapRef.current?._width,
          height: mapRef.current?._height,
          padding: 60,
        })
        setMapCoordinates({ latitude, longitude, zoom })
      } else {
        setMapCoordinates({ latitude: 0, longitude: 0, zoom: 0 })
      }
    }
  }, [currentAOI, setMapCoordinates])

  const onZoomInClick = useCallback(() => {
    setMapCoordinates({ latitude, longitude, zoom: zoom + 1 })
  }, [latitude, longitude, setMapCoordinates, zoom])
  const onZoomOutClick = useCallback(() => {
    setMapCoordinates({ latitude, longitude, zoom: Math.max(1, zoom - 1) })
  }, [latitude, longitude, setMapCoordinates, zoom])

  const handleMapHover = useCallback(({ lngLat, features }) => {
    const heatmapFeatures = (features || []).filter((feature: any) =>
      feature.layer.id.includes('fourwings')
    )

    const values = heatmapFeatures.reduce(
      (acc: any, { layer, properties }: any) => ({
        ...acc,
        ...(properties.value && { [layer.id]: properties.value }),
      }),
      {}
    )
    setCurrentValues(values)
  }, [])

  return (
    <div className={styles.container}>
      {style && logged && token && (
        <InteractiveMap
          ref={mapRef}
          width="100%"
          height="100%"
          zoom={zoom}
          latitude={latitude}
          longitude={longitude}
          onHover={handleMapHover}
          transformRequest={transformRequest}
          onViewportChange={onViewportChange}
          mapStyle={style}
        />
      )}
      <div className={styles.mapControls}>
        <Miniglobe size={60} bounds={bounds} center={{ latitude, longitude }} />
        <IconButton icon="plus" type="map-tool" tooltip="Zoom in" onClick={onZoomInClick} />
        <IconButton icon="minus" type="map-tool" tooltip="Zoom out" onClick={onZoomOutClick} />
        <IconButton icon="ruler" type="map-tool" tooltip="Open ruler tool (Coming soon)" />
        <IconButton icon="camera" type="map-tool" tooltip="Capture the map (Coming soon)" />
      </div>
      <div className={styles.mapLegend}>
        <MapLegend layers={legendLayers} />
      </div>
    </div>
  )
}

export default Map
