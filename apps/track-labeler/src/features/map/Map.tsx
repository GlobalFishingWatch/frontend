import React, { useCallback, useMemo, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import MapComponent from 'react-map-gl/maplibre'
import type { MapRef } from 'react-map-gl/maplibre'
import { useLayerComposer } from '@globalfishingwatch/layer-composer'
import * as Generators from '@globalfishingwatch/layer-composer'
import {
  ExtendedLayer,
  getInteractiveLayerIds,
  Group,
  StyleTransformation,
} from '@globalfishingwatch/layer-composer'
import { selectRulers } from '../../features/rulers/rulers.selectors'
import { ActionType, Label } from '../../types'
import { selectColorMode, selectProjectColors } from '../../routes/routes.selectors'
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
  useHiddenLabelsConnect,
} from './map.hooks'
import 'maplibre-gl/dist/maplibre-gl.css'
import styles from './Map.module.css'
import MapControls from './map-controls/MapControls'
import MapData from './map-data/map-data'
import { useMapboxRef, useMapboxRefCallback } from './map.context'

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
  const actionShortcuts = useSelector(getActionShortcuts)
  const rulers = useSelector(selectRulers)
  const ruleColors = useSelector(getMapboxPaintIcon)
  const colorMode = useSelector(selectColorMode)
  const trackArrowsLayer = useSelector(selectDirectionPointsLayers)
  const legengLabels = useSelector(selectLegendLabels)
  const { onMapMove, hoverCenter } = useMapMove()
  const { onMapClick } = useMapClick()
  const { dispatchHiddenLabels, hiddenLabels } = useHiddenLabelsConnect()
  const handleLegendClick = (legendLabelName: Label['name']) => {
    dispatchHiddenLabels(legendLabelName)
  }
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

    const vesselPositionsConfig: Generators.VesselPositionsGeneratorConfig = {
      type: Generators.GeneratorType.VesselPositions,
      id: 'vessel-positions',
      data: trackArrowsLayer.data,
      colorMode,
      ruleColors,
      projectColors,
      highlightedTime: trackArrowsLayer.highlightedTime,
    }

    return [...generatorConfigs, rulersConfig, vesselPositionsConfig]
  }, [generatorConfigs, rulers, trackArrowsLayer, colorMode, ruleColors, projectColors])

  const { style } = useLayerComposer(
    generatorConfigsWithRulers,
    globalConfig,
    defaultTransformations
  )

  const styleWithArrows = useMemo(() => {
    const newStyle: any = {
      ...style,
      layers: style?.layers ?? [],
      sprite:
        'https://raw.githubusercontent.com/GlobalFishingWatch/map-gl-sprites/master/out/sprites-labeler',
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
    }

    return newStyle
  }, [style])

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
            <div
              key={legend.id}
              className={cx(styles.legend, {
                [styles.hidden]: hiddenLabels.includes(legend.name),
              })}
              onClick={() => handleLegendClick(legend.name)}
            >
              <svg
                width="8"
                height="9"
                xmlns="http://www.w3.org/2000/svg"
                fill={legend.color}
                stroke={legend.color}
              >
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
