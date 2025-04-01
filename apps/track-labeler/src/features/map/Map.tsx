import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import type { MapViewProps } from '@deck.gl/core'
import { MapView } from '@deck.gl/core'
import type { DeckGLRef } from '@deck.gl/react'
import DeckGL from '@deck.gl/react'
import cx from 'classnames'
import { throttle } from 'es-toolkit'
import { DateTime } from 'luxon'

import type { MiniglobeBounds } from '@globalfishingwatch/ui-components/miniglobe'

import { getActionShortcuts } from '../../features/projects/projects.selectors'
import { selectRulers } from '../../features/rulers/rulers.selectors'
import type { ActionType, Label, MapCoordinates } from '../../types'

import MapControls from './map-controls/MapControls'
import {
  useHiddenLabelsConnect,
  useMapClick,
  useMapDeckLayers,
  useMapMove,
  useMapSetViewState,
  useMapViewState,
  useSetMapInstance,
} from './map.hooks'
import { selectLegendLabels } from './map.selectors'

import styles from './Map.module.css'

const MAP_VIEW_ID = 'map'
const MAP_VIEW = new MapView({
  id: MAP_VIEW_ID,
  repeat: true,
  controller: true,
  bearing: 0,
  pitch: 0,
  transitionDuration: 0,
} as MapViewProps)

const MapComponent = (): React.ReactElement<any> => {
  const deckRef = useRef<DeckGLRef>(null)
  useSetMapInstance(deckRef)
  const setViewState = useMapSetViewState()
  const viewState = useMapViewState()
  const actionShortcuts = useSelector(getActionShortcuts)
  const rulers = useSelector(selectRulers)
  const legengLabels = useSelector(selectLegendLabels)
  const { hoverCenter } = useMapMove()
  const { onMapClick } = useMapClick()
  const { dispatchHiddenLabels, hiddenLabels } = useHiddenLabelsConnect()

  // State to store the current cursor type
  const [cursor, setCursor] = useState('default')

  // Track which object is being hovered
  const [hoverInfo, setHoverInfo] = useState<any>(null)

  const onViewStateChange = useCallback(
    (params: any) => {
      // add transitionDuration: 0 to avoid unresponsive zoom
      // https://github.com/visgl/deck.gl/issues/7158#issuecomment-1329722960
      setViewState({ ...(params.viewState as MapCoordinates), transitionDuration: 0 })
    },
    [setViewState]
  )

  const handleDeckHover = useCallback((info: any) => {
    const isHovering = Boolean(info.object)
    setCursor(isHovering ? 'pointer' : 'default')
    setHoverInfo(isHovering ? info : null)

    return isHovering
  }, [])

  const layers = useMapDeckLayers()

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

  const [mapBounds, setMapBounds] = useState<MiniglobeBounds | null>(null)
  const setBoundsFromViewState = useCallback(() => {
    if (!deckRef?.current?.deck) {
      setMapBounds(null)
      return
    }

    try {
      const bounds = deckRef?.current?.deck
        ?.getViewports?.()
        .find((v: any) => v.id === MAP_VIEW_ID)
        ?.getBounds()
      if (bounds && bounds?.length) {
        setMapBounds({
          north: bounds[3],
          south: bounds[1],
          west: bounds[0],
          east: bounds[2],
        })
      } else {
        setMapBounds(null)
      }
    } catch (e) {
      console.warn('[DEBUG] Error calculating bounds:', e)
      setMapBounds(null)
    }
  }, [])

  const throttledSetBoundsFromViewState = useMemo(
    () => throttle(setBoundsFromViewState, 100),
    [setBoundsFromViewState]
  )

  // Update bounds when viewState changes
  useEffect(() => {
    throttledSetBoundsFromViewState()
  }, [viewState, throttledSetBoundsFromViewState])

  return (
    <div className={styles.container}>
      <DeckGL
        ref={deckRef}
        views={MAP_VIEW}
        layers={layers}
        viewState={viewState}
        controller={true}
        getCursor={() => cursor}
        onViewStateChange={onViewStateChange}
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
