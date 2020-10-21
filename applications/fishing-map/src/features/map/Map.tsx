import React, { memo, useCallback, useState, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useSelector, useDispatch } from 'react-redux'
import { AsyncReducerStatus } from 'types'
import { MapLegend } from '@globalfishingwatch/ui-components/dist'
import { InteractiveMap, MapRequest } from '@globalfishingwatch/react-map-gl'
import GFWAPI from '@globalfishingwatch/api-client'
import {
  InteractionEventCallback,
  InteractionEvent,
  useLayerComposer,
  useMapClick,
  useMapHover,
} from '@globalfishingwatch/react-hooks'
import { LegendLayer } from '@globalfishingwatch/ui-components/dist/map-legend/MapLegend'
import { AnyGeneratorConfig } from '@globalfishingwatch/layer-composer/dist/generators/types'
import { useClickedEventConnect, useMapTooltip, useGeneratorsConnect } from 'features/map/map.hooks'
import { selectDataviewInstancesResolved } from 'features/workspace/workspace.selectors'
import { selectEditing, moveCurrentRuler } from 'features/map/controls/rulers.slice'
import MapInfo from 'features/map/controls/MapInfo'
import MapControls from 'features/map/controls/MapControls'
import { selectDebugOptions } from 'features/debug/debug.slice'
import { ClickPopup, HoverPopup } from './Popup'
import useViewport, { useMapBounds } from './map-viewport.hooks'
import { useMapboxRef } from './map.context'
import styles from './Map.module.css'
import '@globalfishingwatch/mapbox-gl/dist/mapbox-gl.css'

const mapOptions = {
  customAttribution: 'Global Fishing Watch 2020',
}

const Map = memo(
  ({ style, onMapClick, onMapHover, children }: any): React.ReactElement => {
    const mapRef = useMapboxRef()
    const { viewport, onViewportChange } = useViewport()
    const rulersEditing = useSelector(selectEditing)
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

    const { setMapBounds } = useMapBounds()
    useEffect(() => {
      setMapBounds()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewport])

    const debugOptions = useSelector(selectDebugOptions)

    const getRulersCursor = useCallback(() => {
      return 'crosshair'
    }, [])

    useEffect(() => {
      mapRef.current.getMap().showTileBoundaries = debugOptions.debug
    }, [mapRef, debugOptions])

    return (
      <InteractiveMap
        ref={mapRef}
        width="100%"
        height="100%"
        latitude={viewport.latitude}
        longitude={viewport.longitude}
        pitch={debugOptions.extruded ? 40 : 0}
        zoom={viewport.zoom}
        onViewportChange={onViewportChange}
        mapStyle={style}
        mapOptions={mapOptions}
        transformRequest={transformRequest}
        onResize={setMapBounds}
        getCursor={rulersEditing ? getRulersCursor : undefined}
        interactiveLayerIds={rulersEditing ? undefined : style.metadata.interactiveLayerIds}
        onClick={onMapClick}
        onHover={onMapHover}
        transitionDuration={viewport.transitionDuration}
      >
        {children}
      </InteractiveMap>
    )
  }
)

const MapWrapper = (): React.ReactElement => {
  const mapRef = useMapboxRef()

  const dispatch = useDispatch()
  const { generatorsConfig, globalConfig } = useGeneratorsConnect()
  const { clickedEvent, clickedEventStatus, dispatchClickedEvent } = useClickedEventConnect()
  const onMapClick = useMapClick(dispatchClickedEvent)
  const clickedTooltipEvent = useMapTooltip(clickedEvent)
  const rulersEditing = useSelector(selectEditing)
  const closePopup = useCallback(() => {
    dispatchClickedEvent(null)
  }, [dispatchClickedEvent])

  const [hoveredEvent, setHoveredEvent] = useState<InteractionEvent | null>(null)
  const handleHoverEvent = useCallback(
    (event) => {
      setHoveredEvent(event)
      if (rulersEditing === true) {
        const center = {
          longitude: event.longitude,
          latitude: event.latitude,
        }
        dispatch(moveCurrentRuler(center))
      }
    },
    [dispatch, rulersEditing]
  )
  const [hoveredDebouncedEvent, setHoveredDebouncedEvent] = useState<InteractionEvent | null>(null)
  const onMapHover = useMapHover(
    handleHoverEvent as InteractionEventCallback,
    setHoveredDebouncedEvent as InteractionEventCallback,
    mapRef?.current?.getMap()
  )
  const hoveredTooltipEvent = useMapTooltip(hoveredEvent)

  // useLayerComposer is a convenience hook to easily generate a Mapbox GL style (see https://docs.mapbox.com/mapbox-gl-js/style-spec/) from
  // the generatorsConfig (ie the map "layers") and the global configuration
  const { style } = useLayerComposer(generatorsConfig as AnyGeneratorConfig[], globalConfig)

  const dataviews = useSelector(selectDataviewInstancesResolved)
  const layersWithLegend = useMemo(() => {
    if (!style) return []
    return style.layers?.flatMap((layer) => {
      if (!layer.metadata?.legend) return []
      const sublayerLegendsMetadata = Array.isArray(layer.metadata.legend)
        ? layer.metadata.legend
        : [layer.metadata.legend]

      // TODO Move this to its own package
      return sublayerLegendsMetadata.map((sublayerLegendMetadata, sublayerIndex) => {
        const id = sublayerLegendMetadata.id || (layer.metadata?.generatorId as string)
        const dataview = dataviews?.find((d) => d.id === id)
        const sublayerLegend: LegendLayer = {
          ...sublayerLegendMetadata,
          id: `legend_${id}`,
          color: layer.metadata?.color || dataview?.config?.color || 'red',
          // TODO Get that from dataview
          label: 'Soy leyenda ✌️',
          unit: 'hours',
        }
        const hoveredFeatureForDataview = hoveredEvent?.features?.find(
          (f) => f.temporalgrid?.sublayerIndex === sublayerIndex
        )
        if (hoveredFeatureForDataview) {
          sublayerLegend.currentValue = hoveredFeatureForDataview.value
        }
        return sublayerLegend
      })
    })
  }, [style, dataviews, hoveredEvent])

  return (
    <div className={styles.container}>
      {style && (
        <Map style={style} onMapClick={onMapClick} onMapHover={onMapHover}>
          {clickedEvent && (
            <ClickPopup
              event={clickedTooltipEvent}
              onClose={closePopup}
              loading={clickedEventStatus === AsyncReducerStatus.Loading}
            />
          )}
          {hoveredEvent?.latitude === hoveredDebouncedEvent?.latitude &&
            hoveredEvent?.longitude === hoveredDebouncedEvent?.longitude &&
            !clickedEvent && <HoverPopup event={hoveredTooltipEvent} />}
          <MapInfo center={hoveredEvent} />
        </Map>
      )}
      <MapControls />
      {layersWithLegend?.map(
        (legend) =>
          document.getElementById(legend.id as string) &&
          createPortal(
            <MapLegend
              layer={legend}
              className={styles.legend}
              currentValueClassName={styles.currentValue}
            />,
            document.getElementById(legend.id as string) as Element
          )
      )}
    </div>
  )
}

export default MapWrapper
