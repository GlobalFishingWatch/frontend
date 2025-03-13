import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import DeckGL from '@deck.gl/react'
import cx from 'classnames'

import { BaseMapLayer, BasemapType } from '@globalfishingwatch/deck-layers'
import type { ExtendedLayer, StyleTransformation } from '@globalfishingwatch/layer-composer'
import { getInteractiveLayerIds, Group } from '@globalfishingwatch/layer-composer'

import { getActionShortcuts } from '../../features/projects/projects.selectors'
import { selectRulers } from '../../features/rulers/rulers.selectors'
import { selectColorMode, selectProjectColors } from '../../routes/routes.selectors'
import type { ActionType, Label } from '../../types'

import MapControls from './map-controls/MapControls'
import {
  useDeckGLMap,
  useGeneratorsConnect,
  useHiddenLabelsConnect,
  useMapClick,
  useMapMove,
  useViewport,
} from './map.hooks'
import {
  getLayerComposerLayers,
  getMapboxPaintIcon,
  selectDirectionPointsLayers,
  selectLegendLabels,
} from './map.selectors'

import styles from './Map.module.css'

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

const filterConflictingLayers: StyleTransformation = (style) => {
  return style
}

const defaultTransformations: StyleTransformation[] = [
  sort,
  filterConflictingLayers,
  getInteractiveLayerIds as any,
]

const MapComponent = (): React.ReactElement<any> => {
  const deckRef = useRef<any>(null)
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
  const { hoverCenter } = useMapMove()
  const { onMapClick } = useMapClick()
  const { dispatchHiddenLabels, hiddenLabels } = useHiddenLabelsConnect()

  // Track whether DeckGL has been initialized
  const [initialized, setInitialized] = useState(false)

  // State to store the current cursor type
  const [cursor, setCursor] = useState('default')

  // Track which object is being hovered
  const [hoverInfo, setHoverInfo] = useState<any>(null)

  // Track the viewState internally to avoid Redux roundtrips
  const [viewState, setViewState] = useState({
    longitude: viewport.longitude,
    latitude: viewport.latitude,
    zoom: viewport.zoom,
    pitch: 0,
    bearing: 0,
    transitionDuration: 0,
  })

  useEffect(() => {
    // Only update from Redux when the values are significantly different
    const threshold = 0.0001
    const zoomThreshold = 0.01

    const hasSignificantChange =
      Math.abs(viewport.longitude - viewState.longitude) > threshold ||
      Math.abs(viewport.latitude - viewState.latitude) > threshold ||
      Math.abs(viewport.zoom - viewState.zoom) > zoomThreshold

    if (hasSignificantChange) {
      setViewState({
        ...viewState,
        longitude: viewport.longitude,
        latitude: viewport.latitude,
        zoom: viewport.zoom,
        transitionDuration: 0, // No animation when updating from Redux
      })
    }
  }, [viewport.longitude, viewport.latitude, viewport.zoom])

  // Function to synchronize the view state back to Redux
  const syncViewStateToRedux = useCallback(
    (newViewState: any) => {
      // Only update Redux for significant changes, using a debounce pattern
      const threshold = 0.0001
      const zoomThreshold = 0.01

      const hasSignificantChange =
        Math.abs(newViewState.longitude - viewport.longitude) > threshold ||
        Math.abs(newViewState.latitude - viewport.latitude) > threshold ||
        Math.abs(newViewState.zoom - viewport.zoom) > zoomThreshold

      if (hasSignificantChange) {
        onViewportChange({
          viewState: {
            longitude: newViewState.longitude,
            latitude: newViewState.latitude,
            zoom: newViewState.zoom,
          },
        })
      }
    },
    [viewport, onViewportChange]
  )

  // Use a debounce for syncing to Redux to avoid too many updates
  const debounceSyncRef = useRef<any>(null)

  // Handle view state changes from DeckGL
  const handleViewStateChange = useCallback(
    ({ viewState: newViewState }: any) => {
      // Update local view state immediately
      setViewState(newViewState)

      // Debounce the update to Redux
      if (debounceSyncRef.current) {
        clearTimeout(debounceSyncRef.current)
      }

      debounceSyncRef.current = setTimeout(() => {
        syncViewStateToRedux(newViewState)
        debounceSyncRef.current = null
      }, 300) // 300ms debounce
    },
    [syncViewStateToRedux]
  )

  // Handle click events
  const handleDeckClick = useCallback(
    (info: any, event: any) => {
      if (info.object) {
        // Format the event in the way the original click handler expects
        const feature = {
          properties: {
            timestamp: info.object.timestamp,
          },
        }

        const position = {
          latitude: info.object.position ? info.object.position[1] : info.coordinate[1],
          longitude: info.object.position ? info.object.position[0] : info.coordinate[0],
        }

        onMapClick({
          target: {
            queryRenderedFeatures: () => [
              {
                source: 'vessel-positions',
                properties: feature.properties,
              },
            ],
          },
          lngLat: {
            lat: position.latitude,
            lng: position.longitude,
          },
          point: [info.x, info.y],
        } as any)

        return true
      } else {
        // Handle clicks on empty areas - pass to original click handler
        const position = {
          latitude: info.coordinate[1],
          longitude: info.coordinate[0],
        }

        onMapClick({
          target: {
            queryRenderedFeatures: () => [],
          },
          lngLat: {
            lat: position.latitude,
            lng: position.longitude,
          },
          point: [info.x, info.y],
        } as any)
      }

      return false
    },
    [onMapClick]
  )

  // Handle hover events
  const handleDeckHover = useCallback((info: any) => {
    const isHovering = Boolean(info.object)

    // Update cursor based on whether we're hovering over something interactive
    setCursor(isHovering ? 'pointer' : 'default')

    // Update hover info
    setHoverInfo(isHovering ? info : null)

    return isHovering
  }, [])

  // Track if we actually have trackPoints data to show
  const hasTrackPointsData = useMemo(() => {
    return Boolean(trackArrowsLayer.data?.length)
  }, [trackArrowsLayer.data])

  // Format points data for DeckGL
  const pointsData = useMemo(() => {
    // Check for the most common data structures and try to extract points

    // Structure 1: GeoJSON FeatureCollection directly in trackArrowsLayer.data as an object
    if (
      trackArrowsLayer.data &&
      typeof trackArrowsLayer.data === 'object' &&
      !Array.isArray(trackArrowsLayer.data) &&
      trackArrowsLayer.data.type === 'FeatureCollection' &&
      Array.isArray(trackArrowsLayer.data.features)
    ) {
      const features = trackArrowsLayer.data.features

      const extractedPoints = []
      features.forEach((feature) => {
        if (feature.geometry?.type === 'Point' && Array.isArray(feature.geometry.coordinates)) {
          const coords = feature.geometry.coordinates
          const props = feature.properties || {}

          extractedPoints.push({
            position: coords,
            timestamp: props.timestamp,
            speed: props.speed || 0,
            course: props.course || 0,
            action: props.action || 'unknown',
            color: projectColors[props.action] || '#ff0000',
          })
        }
      })

      if (extractedPoints.length > 0) {
        return extractedPoints
      }
    }

    // Structure 2: FeatureCollection in trackArrowsLayer directly
    if (trackArrowsLayer.type === 'FeatureCollection' && Array.isArray(trackArrowsLayer.features)) {
      const features = trackArrowsLayer.features

      const extractedPoints = []
      features.forEach((feature) => {
        if (feature.geometry?.type === 'Point' && Array.isArray(feature.geometry.coordinates)) {
          const coords = feature.geometry.coordinates
          const props = feature.properties || {}

          extractedPoints.push({
            position: coords,
            timestamp: props.timestamp,
            speed: props.speed || 0,
            course: props.course || 0,
            action: props.action || 'unknown',
            color: projectColors[props.action] || '#ff0000',
          })
        }
      })

      if (extractedPoints.length > 0) {
        return extractedPoints
      }
    }

    // Structure 3: GeoJSON Features array in trackArrowsLayer.data
    if (Array.isArray(trackArrowsLayer.data) && trackArrowsLayer.data.length > 0) {
      // Check if it's an array of GeoJSON features
      if (trackArrowsLayer.data[0].type === 'Feature') {
        const features = trackArrowsLayer.data

        const extractedPoints = []
        features.forEach((feature) => {
          if (feature.geometry?.type === 'Point' && Array.isArray(feature.geometry.coordinates)) {
            const coords = feature.geometry.coordinates
            const props = feature.properties || {}

            extractedPoints.push({
              position: coords,
              timestamp: props.timestamp,
              speed: props.speed || 0,
              course: props.course || 0,
              action: props.action || 'unknown',
              color: projectColors[props.action] || '#ff0000',
            })
          }
        })

        if (extractedPoints.length > 0) {
          return extractedPoints
        }
      }

      // Check if the data has direct position information (embedded in features)
      const extractedPoints = trackArrowsLayer.data
        .map((item) => {
          // Check for several possible coordinate formats
          let position
          if (item.geometry?.coordinates && Array.isArray(item.geometry.coordinates)) {
            position = item.geometry.coordinates
          } else if (item.position && Array.isArray(item.position)) {
            position = item.position
          } else if (item.position?.lon !== undefined && item.position?.lat !== undefined) {
            position = [Number(item.position.lon), Number(item.position.lat)]
          } else if (item.longitude !== undefined && item.latitude !== undefined) {
            position = [Number(item.longitude), Number(item.latitude)]
          } else {
            return null
          }

          // Verify the position is valid
          if (
            (!position[0] && position[0] !== 0) ||
            (!position[1] && position[1] !== 0) ||
            isNaN(position[0]) ||
            isNaN(position[1])
          ) {
            return null
          }

          return {
            position,
            timestamp: item.timestamp || item.properties?.timestamp || Date.now(),
            speed: item.speed || item.properties?.speed || 0,
            course: item.course || item.properties?.course || 0,
            action: item.action || item.properties?.action || 'unknown',
            color: projectColors[item.action || item.properties?.action] || '#ff0000',
          }
        })
        .filter(Boolean)

      if (extractedPoints.length > 0) {
        return extractedPoints
      }
    }

    // Standard track processing as before
    if (!trackArrowsLayer.data || !trackArrowsLayer.data.length) {
      console.warn('[INFO] No track data available for creating points')
      return []
    }

    // Check if each track has trackPoints
    const tracksWithPoints = trackArrowsLayer.data.filter((track) => {
      return track.trackPoints && Array.isArray(track.trackPoints) && track.trackPoints.length > 0
    })

    if (tracksWithPoints.length === 0) {
      return []
    }

    // Create array to store all points
    const points = []

    // Flatten all track points into a single array
    tracksWithPoints.forEach((track) => {
      if (!track.trackPoints) return

      const trackColor = projectColors[track.action] || '#ff0000' // Fallback to red

      track.trackPoints.forEach((point) => {
        // Basic validation for coordinates
        if (!point.longitude || !point.latitude) return

        // Create a properly formatted point for DeckGL
        points.push({
          position: [Number(point.longitude), Number(point.latitude)],
          timestamp: point.timestamp,
          speed: point.speed || 0,
          course: point.course || 0,
          action: track.action,
          color: trackColor,
        })
      })
    })

    return points
  }, [trackArrowsLayer, projectColors])

  // Create layers for visualization
  const { layers: dataLayers } = useDeckGLMap(
    pointsData,
    trackArrowsLayer.highlightedTime,
    onMapClick
  )

  // Create the basemap layer using deck-layers' BaseMapLayer
  const basemapLayer = useMemo(() => {
    return new BaseMapLayer({
      id: 'basemap',
      basemap: BasemapType.Default,
      category: 'environment' as any,
    })
  }, [])

  // Combine all layers for rendering
  const allLayers = useMemo(() => {
    return [basemapLayer, ...dataLayers]
  }, [basemapLayer, dataLayers])

  // Custom tooltip function for deck.gl
  const getTooltip = useCallback((info: any) => {
    if (!info.object) return null
    return `Speed: ${info.object?.speed || 0} knots`
  }, [])

  const handleLegendClick = (legendLabelId: Label['id']) => {
    dispatchHiddenLabels(legendLabelId)
  }

  const [availableShortcuts, shortcuts] = useMemo(
    () => [
      Object.values(actionShortcuts),
      Object.assign({}, ...Object.entries(actionShortcuts).map(([a, b]) => ({ [b]: a }))),
    ],
    [actionShortcuts]
  )

  // Get current bounds
  const getBoundsFromViewState = useCallback((vs) => {
    if (!deckRef.current) return null

    try {
      // const { width, height } = deckRef.current.deck
      const bounds = deckRef.current.deck.getViewports()[0].getBounds()

      return {
        north: bounds[3],
        south: bounds[1],
        west: bounds[0],
        east: bounds[2],
      }
    } catch (e) {
      console.warn('[DEBUG] Error calculating bounds:', e)
      return null
    }
  }, [])

  const [mapBounds, setMapBounds] = useState(null)

  // Update bounds when viewState changes
  useEffect(() => {
    if (initialized && deckRef.current) {
      const bounds = getBoundsFromViewState(viewState)
      setMapBounds(bounds)
    }
  }, [initialized, viewState, getBoundsFromViewState])

  return (
    <div className={styles.container}>
      <DeckGL
        ref={deckRef}
        layers={allLayers}
        viewState={viewState}
        controller={true}
        getCursor={() => cursor}
        onViewStateChange={handleViewStateChange}
        onClick={handleDeckClick}
        onHover={handleDeckHover}
        getTooltip={getTooltip}
        pickingRadius={1}
      ></DeckGL>

      <div className={styles.legendContainer}>
        {legengLabels &&
          legengLabels.map((legend) => (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div
              key={legend.id}
              className={cx(styles.legend, {
                [styles.hidden]: hiddenLabels.includes(legend.id),
              })}
              onClick={() => handleLegendClick(legend.id)}
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
      {mapBounds && <MapControls bounds={mapBounds} />}
    </div>
  )
}

export default MapComponent
