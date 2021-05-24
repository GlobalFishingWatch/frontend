import React, { useCallback, useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useSelector } from 'react-redux'
import { scaleLinear } from 'd3-scale'
import { event as uaEvent } from 'react-ga'
import { useTranslation } from 'react-i18next'
import { MapLegend, Tooltip } from '@globalfishingwatch/ui-components/dist'
import { InteractiveMap, MapRequest } from '@globalfishingwatch/react-map-gl'
import GFWAPI from '@globalfishingwatch/api-client'
import useLayerComposer from '@globalfishingwatch/react-hooks/dist/use-layer-composer'
import {
  useMapClick,
  useMapHover,
  useFeatureState,
  InteractionEventCallback,
} from '@globalfishingwatch/react-hooks/dist/use-map-interaction'
import { ExtendedStyleMeta, Generators } from '@globalfishingwatch/layer-composer'
import useMapLegend from '@globalfishingwatch/react-hooks/dist/use-map-legend'
import { GeneratorType } from '@globalfishingwatch/layer-composer/dist/generators'
import { POPUP_CATEGORY_ORDER } from 'data/config'
import useMapInstance from 'features/map/map-context.hooks'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import {
  useClickedEventConnect,
  useMapTooltip,
  useGeneratorsConnect,
  TooltipEventFeature,
} from 'features/map/map.hooks'
import { selectDataviewInstancesResolved } from 'features/dataviews/dataviews.selectors'
import MapInfo from 'features/map/controls/MapInfo'
import MapControls from 'features/map/controls/MapControls'
import MapScreenshot from 'features/map/MapScreenshot'
import { selectDebugOptions } from 'features/debug/debug.slice'
import { ENCOUNTER_EVENTS_SOURCE_ID } from 'features/dataviews/dataviews.utils'
import { getEventLabel } from 'utils/analytics'
import PopupWrapper from './popups/PopupWrapper'
import useViewport, { useMapBounds } from './map-viewport.hooks'
import styles from './Map.module.css'
import { SliceInteractionEvent } from './map.slice'
import { useHaveSourcesLoaded, useMapLoaded, useSetMapIdleAtom } from './map-features.hooks'
import useRulers from './rulers/rulers.hooks'

import '@globalfishingwatch/mapbox-gl/dist/mapbox-gl.css'

const clickRadiusScale = scaleLinear().domain([4, 12, 17]).rangeRound([1, 2, 8]).clamp(true)

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

const MapWrapper = (): React.ReactElement | null => {
  // Used it only once here to attach the listener only once
  useSetMapIdleAtom()
  const map = useMapInstance()
  const { t } = useTranslation()
  const { generatorsConfig, globalConfig } = useGeneratorsConnect()

  // useLayerComposer is a convenience hook to easily generate a Mapbox GL style (see https://docs.mapbox.com/mapbox-gl-js/style-spec/) from
  // the generatorsConfig (ie the map "layers") and the global configuration
  const { style, loading: layerComposerLoading } = useLayerComposer(generatorsConfig, globalConfig)

  const { clickedEvent, dispatchClickedEvent } = useClickedEventConnect()
  const clickedTooltipEvent = useMapTooltip(clickedEvent)
  const { cleanFeatureState } = useFeatureState(map)
  const { onMapHoverWithRuler, onMapClickWithRuler, getRulersCursor, rulersEditing } = useRulers()

  const onMapClick = useMapClick(dispatchClickedEvent, style?.metadata as ExtendedStyleMeta, map)

  const clickedCellLayers = useMemo(() => {
    if (!clickedEvent || !clickedTooltipEvent) return

    const layersByCategory = (clickedTooltipEvent?.features ?? [])
      .sort(
        (a, b) =>
          POPUP_CATEGORY_ORDER.indexOf(a.category) - POPUP_CATEGORY_ORDER.indexOf(b.category)
      )
      .reduce(
        (prev: Record<string, TooltipEventFeature[]>, current) => ({
          ...prev,
          [current.category]: [...(prev[current.category] ?? []), current],
        }),
        {}
      )

    return Object.entries(layersByCategory).map(
      ([featureCategory, features]) =>
        `${featureCategory}: ${features.map((f) => f.layerId).join(',')}`
    )
  }, [clickedEvent, clickedTooltipEvent])
  const currentClickCallback = useMemo(() => {
    const clickEvent = (event: any) => {
      uaEvent({
        category: 'Environmental data',
        action: `Click in grid cell`,
        label: getEventLabel(clickedCellLayers ?? []),
      })
      return rulersEditing ? onMapClickWithRuler(event) : onMapClick(event)
    }
    return clickEvent
  }, [clickedCellLayers, rulersEditing, onMapClickWithRuler, onMapClick])

  const closePopup = useCallback(() => {
    cleanFeatureState('click')
    dispatchClickedEvent(null)
  }, [cleanFeatureState, dispatchClickedEvent])

  const [hoveredEvent, setHoveredEvent] = useState<SliceInteractionEvent | null>(null)

  const [hoveredDebouncedEvent, setHoveredDebouncedEvent] =
    useState<SliceInteractionEvent | null>(null)
  const onMapHover = useMapHover(
    setHoveredEvent as InteractionEventCallback,
    setHoveredDebouncedEvent as InteractionEventCallback,
    map,
    style?.metadata
  )
  const currentMapHoverCallback = useMemo(() => {
    return rulersEditing ? onMapHoverWithRuler : onMapHover
  }, [rulersEditing, onMapHoverWithRuler, onMapHover])

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
  const mapLegends = useMapLegend(style, dataviews, hoveredEvent)

  const legendsTranslated = useMemo(() => {
    return mapLegends?.map((legend) => {
      const isSquareKm = (legend.gridArea as number) > 50000
      let label = legend.unit || ''
      if (legend.generatorType === GeneratorType.HeatmapAnimated) {
        const gridArea = isSquareKm ? (legend.gridArea as number) / 1000000 : legend.gridArea
        const gridAreaFormatted = gridArea
          ? formatI18nNumber(gridArea, {
              style: 'unit',
              unit: isSquareKm ? 'kilometer' : 'meter',
              unitDisplay: 'short',
            })
          : ''
        if (legend.unit === 'hours') {
          label = `${t('common.hour_plural', 'hours')} / ${gridAreaFormatted}²`
        }
      }
      return { ...legend, label }
    })
  }, [mapLegends, t])

  const debugOptions = useSelector(selectDebugOptions)

  const mapLoaded = useMapLoaded()
  const encounterSourceLoaded = useHaveSourcesLoaded(ENCOUNTER_EVENTS_SOURCE_ID)

  const getCursor = useCallback(
    (state) => {
      // The default implementation of getCursor returns 'pointer' if isHovering, 'grabbing' if isDragging and 'grab' otherwise.
      if (state.isHovering && hoveredTooltipEvent) {
        const isCluster = hoveredTooltipEvent.features.find(
          (f) => f.type === Generators.Type.TileCluster && parseInt(f.properties.count) > 1
        )
        if (isCluster) {
          return encounterSourceLoaded ? 'zoom-in' : 'progress'
        }
        return 'pointer'
      } else if (state.isDragging) {
        return 'grabbing'
      }
      return 'grab'
    },
    [hoveredTooltipEvent, encounterSourceLoaded]
  )

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
          clickRadius={clickRadiusScale(viewport.zoom)}
          onClick={currentClickCallback}
          onHover={currentMapHoverCallback}
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
      <MapControls onMouseEnter={resetHoverState} mapLoading={!mapLoaded || layerComposerLoading} />
      {legendsTranslated?.map((legend: any) => {
        const legendDomElement = document.getElementById(legend.id as string)
        if (legendDomElement) {
          return createPortal(
            <MapLegend
              layer={legend}
              className={styles.legend}
              currentValueClassName={styles.currentValue}
              labelComponent={
                <Tooltip
                  content={t('map.legend_help', 'Approximated grid cell area at the Equator')}
                >
                  <span className={styles.legendLabel}>{legend.label}</span>
                </Tooltip>
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
