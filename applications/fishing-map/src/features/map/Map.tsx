import React, { useCallback, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useSelector, useDispatch } from 'react-redux'
import { MapLegend } from '@globalfishingwatch/ui-components/dist'
import { InteractiveMap, MapRequest } from '@globalfishingwatch/react-map-gl'
import GFWAPI from '@globalfishingwatch/api-client'
import useTilesLoading from '@globalfishingwatch/react-hooks/dist/use-tiles-loading'
import useLayerComposer from '@globalfishingwatch/react-hooks/dist/use-layer-composer'
import {
  useMapClick,
  useMapHover,
  useFeatureState,
  InteractionEventCallback,
  InteractionEvent,
} from '@globalfishingwatch/react-hooks/dist/use-map-interaction'
import {
  LegendLayer,
  LegendLayerBivariate,
} from '@globalfishingwatch/ui-components/dist/map-legend'
import {
  ExtendedStyle,
  ExtendedStyleMeta,
  Generators,
  LayerMetadataLegend,
} from '@globalfishingwatch/layer-composer'
import useMapInstance from 'features/map/map-context.hooks'
import { UrlDataviewInstance } from 'types'
import i18n from 'features/i18n/i18n'
import { useClickedEventConnect, useMapTooltip, useGeneratorsConnect } from 'features/map/map.hooks'
import { selectDataviewInstancesResolved } from 'features/workspace/workspace.selectors'
import { selectEditing, moveCurrentRuler } from 'features/map/controls/rulers.slice'
import MapInfo from 'features/map/controls/MapInfo'
import MapControls from 'features/map/controls/MapControls'
import MapScreenshot from 'features/map/MapScreenshot'
import { selectDebugOptions } from 'features/debug/debug.slice'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import PopupWrapper from './popups/PopupWrapper'
import useViewport, { useMapBounds } from './map-viewport.hooks'
import styles from './Map.module.css'
import '@globalfishingwatch/mapbox-gl/dist/mapbox-gl.css'

// TODO: Abstract this away
const transformRequest: (...args: any[]) => MapRequest = (url: string, resourceType: string) => {
  const response: MapRequest = { url }
  if (resourceType === 'Tile' && url.includes('globalfishingwatch')) {
    response.headers = {
      Authorization: 'Bearer ' + GFWAPI.getToken(),
    }
  }
  return response
}

const handleError = ({ error }: any) => {
  if (
    (error?.status === 401 || error?.status === 403) &&
    error?.url.includes('globalfishingwatch')
  ) {
    GFWAPI.refreshAPIToken()
  }
}

// TODO: move this to shared package
const getLegendLayers = (
  style?: ExtendedStyle,
  dataviews?: UrlDataviewInstance[],
  hoveredEvent?: InteractionEvent | null
) => {
  if (!style) return []
  return style.layers?.flatMap((layer) => {
    if (!layer.metadata?.legend) return []

    const sublayerLegendsMetadata: LayerMetadataLegend[] = Array.isArray(layer.metadata.legend)
      ? layer.metadata.legend
      : [layer.metadata.legend]
    return sublayerLegendsMetadata.map((sublayerLegendMetadata, sublayerIndex) => {
      const id = sublayerLegendMetadata.id || (layer.metadata?.generatorId as string)
      const dataview = dataviews?.find((d) => d.id === id)
      const isSquareKm = (sublayerLegendMetadata.gridArea as number) > 50000
      let label = sublayerLegendMetadata.unit
      if (!label) {
        const gridArea = isSquareKm
          ? (sublayerLegendMetadata.gridArea as number) / 1000000
          : sublayerLegendMetadata.gridArea
        const gridAreaFormatted = gridArea
          ? formatI18nNumber(gridArea, {
              style: 'unit',
              unit: isSquareKm ? 'kilometer' : 'meter',
              unitDisplay: 'short',
            })
          : ''
        label = `${i18n.t('common.hour_plural', 'hours')} / ${gridAreaFormatted}`
      }
      const sublayerLegend: LegendLayer | LegendLayerBivariate = {
        ...sublayerLegendMetadata,
        id: `legend_${id}`,
        color: layer.metadata?.color || dataview?.config?.color || 'red',
        label,
      }

      const generatorType = layer.metadata?.generatorType

      if (generatorType === Generators.Type.Heatmap) {
        const value = hoveredEvent?.features?.find(
          (f) => f.generatorId === layer.metadata?.generatorId
        )?.value
        if (value) {
          sublayerLegend.currentValue = value
        }
      } else if (generatorType === Generators.Type.HeatmapAnimated) {
        const getHoveredFeatureValueForSublayerIndex = (index: number): number => {
          const hoveredFeature = hoveredEvent?.features?.find(
            (f) => f.temporalgrid?.sublayerIndex === index
          )
          return hoveredFeature?.value
        }
        // Both bivariate sublayers come in the same sublayerLegend (see getLegendsBivariate in LC)
        if (sublayerLegend.type === 'bivariate') {
          sublayerLegend.currentValues = [
            getHoveredFeatureValueForSublayerIndex(0),
            getHoveredFeatureValueForSublayerIndex(1),
          ]
        } else {
          sublayerLegend.currentValue = getHoveredFeatureValueForSublayerIndex(sublayerIndex)
        }
      } else if (generatorType === Generators.Type.UserContext) {
        // TODO use dataset propertyToInclude value
        sublayerLegend.label = ''
      }
      return sublayerLegend
    })
  })
}

const MapWrapper = (): React.ReactElement | null => {
  const map = useMapInstance()

  const dispatch = useDispatch()
  const { generatorsConfig, globalConfig } = useGeneratorsConnect()

  // useLayerComposer is a convenience hook to easily generate a Mapbox GL style (see https://docs.mapbox.com/mapbox-gl-js/style-spec/) from
  // the generatorsConfig (ie the map "layers") and the global configuration
  const { style } = useLayerComposer(generatorsConfig, globalConfig)

  const { clickedEvent, dispatchClickedEvent } = useClickedEventConnect()
  const { cleanFeatureState } = useFeatureState(map)
  const onMapClick = useMapClick(dispatchClickedEvent, style?.metadata as ExtendedStyleMeta, map)
  const clickedTooltipEvent = useMapTooltip(clickedEvent)
  const rulersEditing = useSelector(selectEditing)
  const closePopup = useCallback(() => {
    cleanFeatureState('click')
    dispatchClickedEvent(null)
  }, [cleanFeatureState, dispatchClickedEvent])

  const [hoveredEvent, setHoveredEvent] = useState<InteractionEvent | null>(null)
  const handleHoverEvent = useCallback(
    (event) => {
      if (rulersEditing) {
        const center = {
          longitude: event.longitude,
          latitude: event.latitude,
        }
        dispatch(moveCurrentRuler(center))
      } else {
        setHoveredEvent(event)
      }
    },
    [dispatch, rulersEditing]
  )
  const [hoveredDebouncedEvent, setHoveredDebouncedEvent] = useState<InteractionEvent | null>(null)
  const onMapHover = useMapHover(
    handleHoverEvent as InteractionEventCallback,
    setHoveredDebouncedEvent as InteractionEventCallback,
    map,
    style?.metadata
  )
  const hoveredTooltipEvent = useMapTooltip(hoveredEvent)

  const resetHoverState = useCallback(() => {
    setHoveredEvent(null)
    setHoveredDebouncedEvent(null)
    cleanFeatureState('hover')
  }, [cleanFeatureState])

  const { viewport, onViewportChange } = useViewport()

  const { setMapBounds } = useMapBounds()
  useEffect(() => {
    setMapBounds()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewport])

  const dataviews = useSelector(selectDataviewInstancesResolved)
  const layersWithLegend = getLegendLayers(style, dataviews, hoveredEvent)

  const debugOptions = useSelector(selectDebugOptions)

  const getRulersCursor = useCallback(() => {
    return 'crosshair'
  }, [])

  const getCursor = useCallback(
    (state) => {
      // The default implementation of getCursor returns 'pointer' if isHovering, 'grabbing' if isDragging and 'grab' otherwise.
      if (state.isHovering && hoveredTooltipEvent) {
        const isCluster = hoveredTooltipEvent.features.find(
          (f) => f.type === Generators.Type.TileCluster && parseInt(f.properties.count) > 1
        )
        return isCluster ? 'zoom-in' : 'pointer'
      } else if (state.isDragging) {
        return 'grabbing'
      }
      return 'grab'
    },
    [hoveredTooltipEvent]
  )

  // TODO handle also in case of error
  // https://docs.mapbox.com/mapbox-gl-js/api/map/#map.event:sourcedataloading
  const tilesLoading = useTilesLoading(map)

  useEffect(() => {
    if (map) {
      map.showTileBoundaries = debugOptions.debug
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, debugOptions])

  useEffect(() => {
    if (map) {
      map.showTileBoundaries = debugOptions.debug
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, debugOptions])

  return (
    <div className={styles.container}>
      {<MapScreenshot map={map} />}
      {style && (
        <InteractiveMap
          disableTokenWarning={true}
          width="100%"
          height="100%"
          zoom={viewport.zoom}
          latitude={viewport.latitude}
          longitude={viewport.longitude}
          pitch={debugOptions.extruded ? 40 : 0}
          onViewportChange={onViewportChange}
          mapStyle={style}
          transformRequest={transformRequest}
          onResize={setMapBounds}
          getCursor={rulersEditing ? getRulersCursor : getCursor}
          interactiveLayerIds={rulersEditing ? undefined : style?.metadata?.interactiveLayerIds}
          onClick={onMapClick}
          onHover={onMapHover}
          onError={handleError}
          onMouseOut={resetHoverState}
          transitionDuration={viewport.transitionDuration}
        >
          {clickedEvent && (
            <PopupWrapper
              type="click"
              event={clickedTooltipEvent}
              onClose={closePopup}
              closeOnClick={false}
              closeButton
            />
          )}
          {hoveredEvent?.latitude === hoveredDebouncedEvent?.latitude &&
            hoveredEvent?.longitude === hoveredDebouncedEvent?.longitude &&
            !clickedEvent && (
              <PopupWrapper type="hover" event={hoveredTooltipEvent} anchor="top-left" />
            )}
          <MapInfo center={hoveredEvent} />
        </InteractiveMap>
      )}
      <MapControls onMouseEnter={resetHoverState} mapLoading={tilesLoading} />
      {layersWithLegend?.map((legend) => {
        const legendDomElement = document.getElementById(legend.id as string)
        if (legendDomElement) {
          return createPortal(
            <MapLegend
              layer={legend}
              className={styles.legend}
              currentValueClassName={styles.currentValue}
              labelComponent={
                <span className={styles.legendLabel}>
                  {legend.label}
                  {legend.gridArea && <sup>2</sup>}
                </span>
              }
            />,
            legendDomElement
          )
        }
        return null
      })}
    </div>
  )
}

export default MapWrapper
