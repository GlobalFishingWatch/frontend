import React, { lazy, Suspense, useMemo, useCallback, useEffect, useState, useRef } from 'react'
import throttle from 'lodash/throttle'
import { event as uaEvent } from 'react-ga'
import FlyToInterpolator from '@globalfishingwatch/react-map-gl/dist/esm/utils/transition/viewport-fly-to-interpolator'
import ScaleControl from '@globalfishingwatch/react-map-gl/dist/esm/components/scale-control'
import Popup from '@globalfishingwatch/react-map-gl/dist/esm/components/popup'
import GFWAPI from '@globalfishingwatch/api-client'
import useLayerComposer from '@globalfishingwatch/react-hooks/dist/use-layer-composer'
import LayerComposer, { sort, Generators, Group } from '@globalfishingwatch/layer-composer'
import defaultGenerators from '@globalfishingwatch/layer-composer/dist/generators'
import { AnyGeneratorConfig } from '@globalfishingwatch/layer-composer/dist/generators/types'
import { MapRequest } from '@globalfishingwatch/react-map-gl'
import { useViewport } from 'hooks/map.hooks'
import { useSmallScreen } from 'hooks/screen.hooks'
import usePrevious from 'hooks/previous.hooks'
import { getCoordinatesForBounds } from 'utils/map'
import { TOOLTIPS } from 'data/constants'
import { MapDimensions } from 'redux-modules/app/app.reducer'
import { Event } from 'types/api/models'
import { MapModuleBounds, CoordinatePosition } from 'types/app.types'
import MapScreeenshot from 'components/map/map-screenshot/map-screenshot.container'
import Loader from 'components/loader/loader'
import carrierGenerators from './layers/generators'
import { ClusterEventsGeneratorConfig } from './layers/generators/clusters-events-generator'
import PortPopup from './popups/port-popup/port-popup'
import CursorCoordinates from './cursor-coordinates/cursor-coordinates'
import EventPopup from './popups/event-popup/event-popup.container'
import MapLegend from './map-legend/map-legend.container'
import MapControls from './map-controls/map-controls.container'
import { HeatmapLayerId } from './map.selectors'
import styles from './map.module.css'

import './popups/popups.module.css'

const transitionInterpolator = new FlyToInterpolator()

const defaultCursor = 'grab'
const cursorDictionary: { [key: string]: string[] } = {
  // Ordered by priority
  'zoom-in': ['cp_encounters_clustering_cluster', 'cp_loitering_clustering_cluster'],
  pointer: [
    'cp_loitering_clustering_event',
    'cp_encounters_clustering_event',
    'cp_ports',
    'cp_vessel_events_background',
  ],
}

const MapComponent = lazy((): any => import('@globalfishingwatch/react-map-gl'))

const layerComposerConfig = {
  generators: {
    ...defaultGenerators,
    ...carrierGenerators,
  },
}
const layerComposer = new LayerComposer(layerComposerConfig)
const customSort = (style: any) => {
  const layers = style.layers.map((layer: any) => {
    if (layer.metadata?.generatorType !== Generators.Type.CartoPolygons) return layer

    return { ...layer, metadata: { ...layer.metadata, group: Group.OutlinePolygons } }
  })
  return sort({ ...style, layers })
}
const styleTransformations: any = [customSort]

interface MapLayerHandler {
  // key = id of the layer
  // return true to stop the event propagation
  [key: string]: (feature: any, position: CoordinatePosition) => void | boolean
}

interface MapProps {
  generatorsConfig: (Generators.AnyGeneratorConfig | ClusterEventsGeneratorConfig)[]
  dateRange: { start: string; end: string }
  filtersBounds: MapModuleBounds | null
  trackBounds: MapModuleBounds | null
  mapDimensions: MapDimensions | null
  currentEvent: Event | null
  goToVesselEvent: (timestamp: number) => void
  setMapDimensions: (mapDimensions: MapDimensions) => void
}

const Map: React.FC<MapProps> = (props): JSX.Element => {
  const {
    dateRange,
    generatorsConfig,
    filtersBounds,
    trackBounds,
    currentEvent,
    goToVesselEvent,
    mapDimensions,
    setMapDimensions,
  } = props
  const isSmallScreen = useSmallScreen()
  const { viewport, onViewportChange, setMapCoordinates } = useViewport()
  const [mapReady, setMapReady] = useState<boolean>(false)
  const [cursorCoordinates, setCursorCoordinates] = useState<CoordinatePosition | null>(null)
  const [popup, setPopup] = useState<{
    latitude: number
    longitude: number
    content: React.ReactElement
  } | null>(null)

  const mapRef = useRef<any>(null)
  const generatorsGlobalConfig = useMemo(
    () => ({
      zoom: viewport.zoom,
      start: dateRange.start,
      end: dateRange.end,
      token: GFWAPI.getToken(),
    }),
    [viewport, dateRange]
  )
  const { style } = useLayerComposer(
    // This needs to be extensible to allow external generators and this cast
    generatorsConfig as any,
    generatorsGlobalConfig,
    styleTransformations,
    layerComposer as any
  )
  const [heatmapCurrentValue, setHeatmapCurrentValue] = useState<number | null>(null)
  let heatmapLegend: { ramp: number[][]; area: number } | null = null
  if (style && style.layers) {
    // TODO this should be a addLegend() style ttransformation, ie:
    // const styleTransformations: any = [sort, addLegend]
    // heatmapLegend = style.metadata.legend
    const heatmapLayer: any = style.layers.find(
      (l: any) => l.id === HeatmapLayerId && l.layout?.visibility === 'visible'
    )
    if (heatmapLayer?.metadata?.legend?.ramp?.length) {
      heatmapLegend = {
        ramp: heatmapLayer.metadata.legend.ramp,
        area: heatmapLayer.metadata.gridArea,
      }
    }
  }

  const previousFiltersBounds = usePrevious(filtersBounds)
  useEffect(() => {
    if (mapReady && filtersBounds && filtersBounds !== previousFiltersBounds && mapDimensions) {
      const { coordinates, zoom } = getCoordinatesForBounds(mapDimensions, filtersBounds)
      setMapCoordinates({ ...coordinates, zoom })
    }
    // map dimensions changed not needed the update
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady, previousFiltersBounds, filtersBounds, setMapCoordinates])

  const previousCurrentEvent = usePrevious(currentEvent)
  useEffect(() => {
    if (mapReady) {
      const fitToTrackBounds = currentEvent === null && previousCurrentEvent === null
      if (trackBounds && fitToTrackBounds && mapDimensions) {
        const { coordinates, zoom } = getCoordinatesForBounds(mapDimensions, trackBounds)
        setMapCoordinates({ ...coordinates, zoom: Math.max(zoom, 0) })
      }
    }
    // only wants to set the initial position when trackGeometry loads in the vessel detail
    // and not current event selected it goes to geojson track bounds
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady, trackBounds, currentEvent])

  const onViewStateChange = useCallback(
    ({ viewState }) => {
      const { width, height } = viewState
      if (
        width &&
        height &&
        (!mapDimensions || width !== mapDimensions.width || height !== mapDimensions.height)
      ) {
        setMapDimensions({ width, height })
      }
      onViewportChange(viewState)
    },
    [mapDimensions, onViewportChange, setMapDimensions]
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setCursorCoordinatesThrottle = useCallback(
    throttle((position: { latitude: number; longitude: number }) => {
      setCursorCoordinates(position)
    }, 50),
    []
  )

  const onEventClick = useCallback(
    (feature: any, position: CoordinatePosition, eventType: string) => {
      const { eventId } = feature.properties
      setPopup({
        latitude: position.latitude,
        longitude: position.longitude,
        content: (
          <EventPopup
            id={eventId}
            onClick={() => {
              setPopup(null)
            }}
          />
        ),
      })

      return true
    },
    []
  )

  const onClusterClick = useCallback(
    (feature: any, position: CoordinatePosition, clusterType: string) => {
      const { properties } = feature
      const map = mapRef.current !== null && mapRef.current.getMap()
      const glSource: any = map && map.getSource(feature.source)
      if (glSource) {
        const clusterId = properties.cluster_id
        // getClusterExpansionZoom not included in the types
        glSource.getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
          if (!err && zoom) {
            setMapCoordinates({ ...position, zoom: zoom + 0.1 })
          }
          setPopup(null)
        })
      }

      uaEvent({
        category: clusterType === 'encounters' ? 'CVP - Encounters' : 'CVP - Loitering',
        action:
          clusterType === 'encounters'
            ? 'Click in cluster of encounters'
            : 'Click in cluster of Loitering',
        label: feature.properties.point_count,
      })
    },
    [setMapCoordinates]
  )

  const layerMapClickHandlers: MapLayerHandler = useMemo(
    () => ({
      cp_loitering_clustering_cluster: (feature: any, position: CoordinatePosition) => {
        onClusterClick(feature, position, 'loitering')
      },
      cp_encounters_clustering_cluster: (feature: any, position: CoordinatePosition) => {
        onClusterClick(feature, position, 'encounters')
      },
      cp_loitering_clustering_event: (feature: any, position: CoordinatePosition) => {
        onEventClick(feature, position, 'encounter')
      },
      cp_encounters_clustering_event: (feature: any, position: CoordinatePosition) => {
        onEventClick(feature, position, 'loitering')
      },
      cp_ports: (feature: any, position: CoordinatePosition) => {
        const port = {
          id: feature.properties.id,
          iso: feature.properties.iso,
          label: feature.properties.label,
          events: feature.properties.events,
        }
        setPopup({
          latitude: position.latitude,
          longitude: position.longitude,
          content: <PortPopup port={port} />,
        })
      },
      cp_vessel_events_background: (feature: any) => {
        const { timestamp } = feature.properties
        if (timestamp) {
          goToVesselEvent(timestamp)
        }
      },
    }),
    [goToVesselEvent, onClusterClick, onEventClick]
  )

  const handleMouseLeave = useCallback(() => {
    setCursorCoordinatesThrottle.cancel()
    setCursorCoordinates(null)
    setHeatmapCurrentValue(null)
  }, [setCursorCoordinatesThrottle])

  const cursor = useRef<string | null>(null)
  const getCursor = useCallback(({ isDragging }) => {
    return isDragging ? 'grabbing' : cursor.current
  }, [])

  const handleMapHover = useCallback(
    ({ lngLat, features }) => {
      const featureLayersId = (features || []).map((feature: any) => feature.layer.id)
      const heatmapLayer = (features || []).filter(
        (feature: any) => feature.layer.id === HeatmapLayerId
      )
      const value = heatmapLayer[0]?.properties?.value
      if (value) {
        setHeatmapCurrentValue(value)
      } else if (heatmapCurrentValue) {
        setHeatmapCurrentValue(null)
      }
      const customCursor = Object.keys(cursorDictionary).some((layerCursor) => {
        const layerHasCursor = featureLayersId.some((feature: string) =>
          cursorDictionary[layerCursor].includes(feature)
        )
        if (layerHasCursor) cursor.current = layerCursor
        return layerHasCursor
      })
      if (!customCursor) {
        cursor.current = defaultCursor
      }
      if (!isSmallScreen) {
        setCursorCoordinatesThrottle({ latitude: lngLat[1], longitude: lngLat[0] })
      }
    },
    [heatmapCurrentValue, isSmallScreen, setCursorCoordinatesThrottle]
  )

  const handleMapClick = useCallback(
    (e: any) => {
      const { features } = e
      if (features && features.length) {
        const position = { latitude: e.lngLat[1], longitude: e.lngLat[0] }
        // .some() returns true as soon as any of the callbacks return true, short-circuiting the execution of the rest
        const hadHandler = features.some((feature: any) => {
          const eventHandler = layerMapClickHandlers[feature.layer.id]
          // returns true when is a single event so won't run the following ones
          return eventHandler ? eventHandler(feature, position) : false
        })
        if (!hadHandler && popup) {
          setPopup(null)
        }
      }
    },
    [layerMapClickHandlers, popup]
  )

  const closePopup = useCallback(() => {
    setPopup(null)
  }, [])

  const onReady = useCallback(async () => {
    setMapReady(true)
    const map = mapRef.current?.getMap()
    if (map) {
      const mapbox = await import('@globalfishingwatch/mapbox-gl')
      map.addControl(
        new mapbox.AttributionControl({
          customAttribution: `<span aria-label="${
            TOOLTIPS.copyright
          }" data-tip-pos="top-right" data-tip-wrap="multiline">© Copyright Global Fishing Watch 2020 ${
            process.env.REACT_APP_DEPLOYED_VERSION || ''
          }</span>`,
        }),
        isSmallScreen ? 'bottom-left' : 'bottom-right'
      )
    }
  }, [isSmallScreen])

  const handleError = useCallback(({ error }: any) => {
    if (error?.status === 401 && error?.url.includes('globalfishingwatch')) {
      GFWAPI.refreshAPIToken()
    }
  }, [])

  const transformRequest: any = useCallback((url: string, resourceType: string) => {
    const response: MapRequest = { url }
    if (resourceType === 'Tile' && url.includes('globalfishingwatch') && !url.includes('carto')) {
      response.headers = {
        Authorization: 'Bearer ' + GFWAPI.getToken(),
      }
    }
    return response
  }, [])

  return (
    <Suspense fallback={<Loader invert />}>
      {style && (
        <div className={styles.mapContainer}>
          <div className={styles.map} onMouseLeave={handleMouseLeave}>
            <MapComponent
              ref={mapRef}
              width="100%"
              height="100%"
              onLoad={onReady}
              latitude={viewport.latitude}
              longitude={viewport.longitude}
              zoom={viewport.zoom}
              transitionDuration={viewport.transitionDuration}
              transitionInterpolator={transitionInterpolator}
              mapStyle={style}
              getCursor={getCursor}
              onHover={handleMapHover}
              onClick={handleMapClick}
              onError={handleError}
              transformRequest={transformRequest}
              maxZoom={20}
              onViewStateChange={onViewStateChange}
              attributionControl={false}
            >
              {popup !== null && (
                <Popup
                  latitude={popup.latitude}
                  longitude={popup.longitude}
                  closeButton
                  onClose={closePopup}
                  anchor="bottom"
                  offsetTop={-10}
                  tipSize={4}
                  closeOnClick={false}
                >
                  {popup.content}
                </Popup>
              )}
              <div className={styles.scale}>
                {mapReady && <ScaleControl maxWidth={100} unit="nautical" />}
              </div>
            </MapComponent>
            <MapControls />
            {mapRef.current && (
              <MapScreeenshot map={mapRef.current.getMap()} heatmapLegend={heatmapLegend} />
            )}
            {mapReady && (
              <CursorCoordinates
                coordinates={cursorCoordinates}
                floating={heatmapLegend !== null}
              />
            )}
          </div>
          <MapLegend
            coordinates={cursorCoordinates}
            heatmapLegend={heatmapLegend}
            heatmapCurrentValue={heatmapCurrentValue}
          />
        </div>
      )}
    </Suspense>
  )
}

export default Map
