import React, { useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import MapComponent from 'react-map-gl/maplibre'
import type { MapRef } from 'react-map-gl/maplibre'
import { useLayerComposer } from '@globalfishingwatch/layer-composer'
import * as Generators from '@globalfishingwatch/layer-composer'
import type { ExtendedLayer, StyleTransformation } from '@globalfishingwatch/layer-composer'
import { getInteractiveLayerIds, Group } from '@globalfishingwatch/layer-composer'
import { MAP_BACKGROUND_COLOR } from '../../data/config'
import { selectRulers } from '../../features/rulers/rulers.selectors'
import { ActionType } from '../../types'
import {
  selectColorMode,
  selectHiddenLayers,
  selectProjectColors,
} from '../../routes/routes.selectors'
import { typedKeys } from '../../utils/shared'
import { getActionShortcuts } from '../../features/projects/projects.selectors'
import {
  getLayerComposerLayers,
  getMapboxPaintIcon,
  selectDirectionPointsLayers,
  selectLegendLabels,
} from './map.selectors'
import {
  useGeneratorsConnect,
  useMapBounds,
  useMapMove,
  useViewport,
  useMapClick,
} from './map.hooks'
import 'maplibre-gl/dist/maplibre-gl.css'
import styles from './Map.module.css'
import MapControls from './map-controls/MapControls'
import MapData from './map-data/map-data'
import { useMapboxRef, useMapboxRefCallback } from './map.context'
import { contextSourceStyle, getVisibleContextLayers } from './map-static-layers-style'

const GROUP_ORDER = [
  Group.Background,
  Group.Basemap,
  Group.Heatmap,
  Group.OutlinePolygonsBackground,
  Group.OutlinePolygons,
  Group.OutlinePolygonsHighlighted,
  Group.Default,
  Group.BasemapFill,
  Group.Track,
  Group.TrackHighlightedEvent,
  Group.TrackHighlighted,
  Group.Point,
  Group.BasemapForeground,
  Group.Tool,
  Group.Label,
  Group.Overlay,
]

const sort: StyleTransformation = (style) => {
  const layers = style.layers ? [...style.layers] : []
  const orderedLayers = layers.sort((a: ExtendedLayer, b: ExtendedLayer) => {
    const aGroup = a.metadata?.group || Group.Default
    const bGroup = b.metadata?.group || Group.Default
    const aPos = GROUP_ORDER.indexOf(aGroup)
    const bPos = GROUP_ORDER.indexOf(bGroup)
    return aPos - bPos
  })
  return { ...style, layers: orderedLayers }
}

const defaultTransformations: StyleTransformation[] = [sort, getInteractiveLayerIds as any]

const Map = (): React.ReactElement => {
  const mapRef: React.RefObject<MapRef> = useMapboxRef()
  const onRefReady = useMapboxRefCallback()
  const { viewport, onViewportChange } = useViewport()
  const { globalConfig } = useGeneratorsConnect()
  const generatorConfigs = useSelector(getLayerComposerLayers)
  const projectColors = useSelector(selectProjectColors)
  const hiddenLayers = useSelector(selectHiddenLayers)
  const actionShortcuts = useSelector(getActionShortcuts)
  const rulers = useSelector(selectRulers)
  const ruleColors = useSelector(getMapboxPaintIcon)
  const colorMode = useSelector(selectColorMode)
  const trackArrowsLayer = useSelector(selectDirectionPointsLayers)
  const legengLabels = useSelector(selectLegendLabels)
  const { onMapMove, hoverCenter } = useMapMove()
  const { onMapClick } = useMapClick()
  // added load state to improve the view of the globe
  const [loaded, setLoaded] = useState(false)
  const onLoadCallback = useCallback(() => {
    setLoaded(true)
    onRefReady()
  }, [onRefReady])
  const mapBounds = useMapBounds(loaded ? mapRef : null)

  const generatorConfigsWithRulers = useMemo(() => {
    const rulersConfig: Generators.RulersGeneratorConfig = {
      type: Generators.GeneratorType.Rulers,
      id: 'rulers',
      data: rulers,
    }
    return [...generatorConfigs, rulersConfig]
  }, [generatorConfigs, rulers])

  const { style } = useLayerComposer(
    generatorConfigsWithRulers,
    globalConfig,
    defaultTransformations
  )

  const styleWithArrows = useMemo(() => {
    const newStyle: any = {
      ...style,
      layers: style?.layers ?? [],
      // .filter((layer) => layer.id !== 'bathymetry'),
    }

    if (
      newStyle &&
      newStyle.sources &&
      newStyle.layers &&
      newStyle.sprite ===
        'https://raw.githubusercontent.com/GlobalFishingWatch/map-gl-sprites/master/out/sprites'
    ) {
      newStyle.sprite =
        'https://raw.githubusercontent.com/GlobalFishingWatch/map-gl-sprites/master/out/sprites-labeler'

      const customizedLayers = ['trackDirections', 'vesselTrack']
      const vesselTrackLayers = newStyle.layers
        .filter((layer: { source: string }) => layer.source === 'vesselTrack')
        .map((layer: any) => ({
          ...layer,
          paint: {
            'line-color': [
              'match',
              ['get', 'action'],
              ...typedKeys(projectColors)
                .map((key) => [key.toString(), projectColors[key]])
                .flat(),
              projectColors[ActionType.untracked],
            ],
            'line-opacity': 0.9,
            'line-width': 0,
          },
        }))
      // Used to debug tracks
      const vesselTrackLabels = vesselTrackLayers.map((layer: any) => ({
        id: `track-labels-${layer.id}`,
        type: 'symbol',
        source: 'vesselTrack',
        layout: {
          'text-field': ['get', 'action'],
          'text-font': ['Roboto Mono Light'],
          'text-size': 8,
          'text-allow-overlap': true,
          visibility: 'none',
        },
        paint: {
          'text-halo-color': 'hsl(320, 0%, 100%)',
          'text-halo-width': 2,
        },
      }))
      newStyle.layers = newStyle.layers
        .filter((layer: any) => !customizedLayers.includes(layer.source))
        .concat([...vesselTrackLayers, ...vesselTrackLabels])

      const onlyContent = colorMode === 'content'
      const onlyLabels = colorMode === 'labels'
      const fillVisible = colorMode === 'all' || onlyContent
      const outlineVisible = colorMode === 'all' || onlyLabels
      const fillColor = fillVisible
        ? ['interpolate', ['linear'], ['get', 'speed'], 0, '#FF6B6B', 6, '#CC4AA9', 12, '#185AD0']
        : MAP_BACKGROUND_COLOR

      newStyle.layers.push({
        id: 'arrow',
        type: 'symbol',
        source: 'trackDirections',
        layout: {
          'icon-allow-overlap': true,
          'icon-image': 'arrow-inner',
          // 'icon-size': ['interpolate', ['linear'], ['zoom'], 1, 0.002, 15, 2],
          'icon-rotate': ['get', 'course'],
          'icon-offset': [1.5, 0],
          // visibility: fillVisible || outlineVisible ? 'visible' : 'none',
          visibility: 'visible',
        },
        paint: {
          // Arrow Fill
          'icon-color': outlineVisible
            ? // When fill visible, use the label color
              ['case', ...ruleColors, 'black']
            : // if not use the fill color
              fillColor,
          // ['case', ['boolean', ['feature-state', 'highlight'], false], 'white', fillColor],
          // Arrow outline
          'icon-halo-color': outlineVisible
            ? // When fill visible, use the label color
              ['case', ...ruleColors, 'black']
            : // if not use the fill color
              fillColor,
          'icon-halo-width': 2,
        },
      })
    }

    if (newStyle.sources) {
      newStyle.sources.trackDirections = trackArrowsLayer
    }

    newStyle.sources = { ...newStyle.sources, ...contextSourceStyle }
    newStyle.layers = [...newStyle.layers, ...getVisibleContextLayers(hiddenLayers)]

    return newStyle
  }, [style, hiddenLayers, colorMode, ruleColors, projectColors, trackArrowsLayer])

  const [availableShortcuts, shortcuts] = useMemo(
    () => [
      Object.values(actionShortcuts),
      Object.assign({}, ...Object.entries(actionShortcuts).map(([a, b]) => ({ [b]: a }))),
    ],
    [actionShortcuts]
  )

  return (
    <div className={styles.container}>
      {style && (
        <MapComponent
          ref={mapRef}
          latitude={viewport.latitude}
          longitude={viewport.longitude}
          zoom={viewport.zoom}
          onLoad={onLoadCallback}
          onMove={onViewportChange}
          mapStyle={styleWithArrows}
          onClick={onMapClick}
          onMouseMove={onMapMove}
        >
          <MapData coordinates={hoverCenter} floating={true} />
        </MapComponent>
      )}
      <div className={styles.legendContainer}>
        {legengLabels &&
          legengLabels.map((legend) => (
            <div key={legend.id} className={styles.legend}>
              <svg width="8" height="9" xmlns="http://www.w3.org/2000/svg" fill={legend.color}>
                <path
                  d="M7.68 8.86L3.88.84.03 8.88l3.83-1.35 3.82 1.33zm-3.8-5.7l1.88 3.97-1.9-.66-1.89.66 1.9-3.97z"
                  fillRule="nonzero"
                />
              </svg>
              {legend.name}{' '}
              {availableShortcuts.includes(legend.id as ActionType) && (
                <span>({shortcuts[legend.id]})</span>
              )}
            </div>
          ))}
      </div>
      <MapControls bounds={mapBounds} />
    </div>
  )
}

export default Map
