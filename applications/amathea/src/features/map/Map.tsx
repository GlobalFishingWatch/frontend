import React, { useEffect, useState, useCallback, useMemo } from 'react'
import GFWAPI from '@globalfishingwatch/api-client'
import { InteractiveMap, MapRequest } from '@globalfishingwatch/react-map-gl'
import Miniglobe, { MiniglobeBounds } from '@globalfishingwatch/ui-components/dist/miniglobe'
import MapLegends from '@globalfishingwatch/ui-components/dist/map-legend'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import useLayerComposer from '@globalfishingwatch/react-hooks/dist/use-layer-composer'
// import { useMapHover } from '@globalfishingwatch/react-hooks/dist/use-map-interaction'
// import useMapLegend from '@globalfishingwatch/react-hooks/dist/use-map-legend'
import { ExtendedStyle } from '@globalfishingwatch/layer-composer/dist/types'
import { LegendLayer } from '@globalfishingwatch/ui-components/dist/map-legend/MapLegend'
import { useUserConnect } from 'features/user/user.hook'
import { useMapboxRef } from './map.context'
import { useGeneratorsConnect, useViewport } from './map.hooks'
import styles from './Map.module.css'
import '@globalfishingwatch/mapbox-gl/dist/mapbox-gl.css'

type LegendConfig = Record<string, number>

function useLegendComposer(style: ExtendedStyle, currentValues: LegendConfig) {
  const layersWithLegend = useMemo(() => {
    return style
      ? style?.layers
          ?.flatMap((layer) => {
            if (!layer.metadata?.legend) return []
            const currentValue = currentValues[layer.id]
            return {
              ...layer.metadata.legend,
              color: layer.metadata.color || 'red',
              generatorId: layer.metadata.generatorId as string,
              currentValue,
            }
          })
          // Reverse again to keep dataviews sidebar and legend aligned
          .reverse()
      : ([] as LegendLayer[])
  }, [currentValues, style])
  return layersWithLegend
}

const Map = (): React.ReactElement => {
  const mapRef = useMapboxRef()
  const { viewport, onViewportChange, setMapCoordinates } = useViewport()
  const { latitude, longitude, zoom } = viewport
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
  // const [hoverEvent, setHoverEvent] = useState<any>()
  // const onMapHover = useMapHover(setHoverEvent, mapRef, { debounced: 0 })
  // const legendLayers = useMapLegend(style, hoverEvent)

  const [bounds, setBounds] = useState<MiniglobeBounds | undefined>()

  const handleError = useCallback(({ error }: any) => {
    if (error?.status === 401 && error?.url.includes('globalfishingwatch')) {
      GFWAPI.refreshAPIToken()
    }
  }, [])

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

  const onZoomInClick = useCallback(() => {
    setMapCoordinates({ latitude, longitude, zoom: zoom + 1 })
  }, [latitude, longitude, setMapCoordinates, zoom])
  const onZoomOutClick = useCallback(() => {
    setMapCoordinates({ latitude, longitude, zoom: Math.max(1, zoom - 1) })
  }, [latitude, longitude, setMapCoordinates, zoom])

  const handleMapHover = useCallback(({ lngLat, features }) => {
    const heatmapFeatures = (features || []).filter(
      (feature: any) =>
        feature.layer.id.includes('fourwings') || feature.layer.id.includes('user-context')
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
          onError={handleError}
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
        <MapLegends layers={legendLayers} />
      </div>
    </div>
  )
}

export default Map
