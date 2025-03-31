import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import type { DeckGLRef } from '@deck.gl/react'
import DeckGL from '@deck.gl/react'
import cx from 'classnames'
import { DateTime } from 'luxon'

import type { TrackLabelerPoint } from '@globalfishingwatch/deck-layers'
import type { MiniglobeBounds } from '@globalfishingwatch/ui-components/miniglobe'

import { getActionShortcuts } from '../../features/projects/projects.selectors'
import { selectRulers } from '../../features/rulers/rulers.selectors'
import { selectColorMode, selectProjectColors } from '../../routes/routes.selectors'
import type { ActionType, Label } from '../../types'

import MapControls from './map-controls/MapControls'
import {
  useDeckLayers,
  useHiddenLabelsConnect,
  useMapClick,
  useMapLayers,
  useMapMove,
  useSetMapInstance,
  useViewport,
} from './map.hooks'
import {
  getMapboxPaintIcon,
  selectDirectionPointsLayers,
  selectLegendLabels,
} from './map.selectors'

import styles from './Map.module.css'

const MapComponent = (): React.ReactElement<any> => {
  const deckRef = useRef<DeckGLRef>(null)
  useSetMapInstance(deckRef)
  const { viewport, onViewportChange } = useViewport()
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
    repeat: true,
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
        repeat: true,
        longitude: viewport.longitude,
        latitude: viewport.latitude,
        zoom: viewport.zoom,
        transitionDuration: 0, // No animation when updating from Redux
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Handle hover events
  const handleDeckHover = useCallback((info: any) => {
    const isHovering = Boolean(info.object)

    // Update cursor based on whether we're hovering over something interactive
    setCursor(isHovering ? 'pointer' : 'default')

    // Update hover info
    setHoverInfo(isHovering ? info : null)

    return isHovering
  }, [])

  // Format points data for DeckGL
  const pointsData = useMemo(() => {
    if (
      trackArrowsLayer.data &&
      typeof trackArrowsLayer.data === 'object' &&
      !Array.isArray(trackArrowsLayer.data) &&
      trackArrowsLayer.data.type === 'FeatureCollection' &&
      Array.isArray(trackArrowsLayer.data.features)
    ) {
      const features = trackArrowsLayer.data.features

      const extractedPoints: TrackLabelerPoint[] = []
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
    return []
  }, [trackArrowsLayer, projectColors])

  const visibleLabels = useMemo(() => {
    return legengLabels.flatMap((label) => (!hiddenLabels.includes(label.id) ? label.id : []))
  }, [legengLabels, hiddenLabels])
  // Create layers for visualization
  const { layers: dataLayers } = useDeckLayers({
    pointsData,
    highlightedTime: trackArrowsLayer.highlightedTime,
    visibleLabels,
  })

  const layers = useMapLayers()
  const allLayers = useMemo(() => {
    return [...layers, ...dataLayers]
  }, [layers, dataLayers])

  // Custom tooltip function for deck.gl
  const getTooltip = useCallback((info: any) => {
    if (!info.object) return null
    if (info.layer.id === 'track-points') {
      const mandatoryProps = ['timestamp', 'position', 'color', 'action']
      const projectProps = Object.keys(info.object).filter((key) => !mandatoryProps.includes(key))
      return {
        html: `
          <div>Date: ${DateTime.fromMillis(info.object.timestamp).toFormat('ff')}</div>
          ${projectProps
            .map(
              (prop) =>
                `<div key={prop}>
              ${prop}: ${info.object[prop]}
            </div>`
            )
            .join('')}`,
      }
    }
    return null
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
  const getBoundsFromViewState = useCallback(() => {
    if (!deckRef?.current?.deck) return null

    try {
      // const { width, height } = deckRef.current.deck
      const bounds = deckRef?.current?.deck?.getViewports()[0].getBounds()

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

  const [mapBounds, setMapBounds] = useState<MiniglobeBounds | null>(null)

  // Update bounds when viewState changes
  useEffect(() => {
    if (deckRef.current) {
      const bounds = getBoundsFromViewState()
      setMapBounds(bounds)
    }
  }, [viewState, getBoundsFromViewState])

  return (
    <div className={styles.container}>
      <DeckGL
        ref={deckRef}
        layers={allLayers}
        viewState={viewState}
        controller={true}
        getCursor={() => cursor}
        onViewStateChange={handleViewStateChange}
        onClick={onMapClick}
        onHover={handleDeckHover}
        getTooltip={getTooltip}
        pickingRadius={1}
      />

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
      <MapControls bounds={mapBounds} />
    </div>
  )
}

export default MapComponent
