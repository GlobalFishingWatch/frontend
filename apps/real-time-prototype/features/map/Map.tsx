import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DeckGL, DeckGLRef } from '@deck.gl/react/typed'
import { MapView, PickingInfo } from '@deck.gl/core/typed'
import { useBasemapLayer } from 'layers/basemap/basemap.hooks'
import { useAtom } from 'jotai'
import { useContextsLayer } from 'layers/context/context.hooks'
import { useLatestPositionsLayer } from 'layers/latest-positions/latest-positions.hooks'
import { useTracksLayer } from 'layers/tracks/tracks.hooks'
import { redirectToLogin, useGFWLogin } from '@globalfishingwatch/react-hooks'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { useURLViewport, useViewport } from 'features/map/map-viewport.hooks'
import { hoveredFeaturesAtom, clickedFeaturesAtom } from 'features/map/map-picking.hooks'
import { zIndexSortedArray } from 'utils/layers'
import { API_BASE } from 'data/config'
import styles from './map.module.css'

const mapView = new MapView({ repeat: true })

export type GFWLayerProps = {
  token: string
  lastUpdate: string
}

const MapWrapper = ({ lastUpdate }): React.ReactElement => {
  useURLViewport()
  const { viewState, onViewportStateChange } = useViewport()
  const deckRef = useRef<DeckGLRef>(null)
  const basemapLayer = useBasemapLayer()
  const contextLayer = useContextsLayer()
  const tracksLayer = useTracksLayer({ token: GFWAPI.getToken(), lastUpdate })
  const latestPositionsLayer = useLatestPositionsLayer({ token: GFWAPI.getToken(), lastUpdate })
  const [hoveredFeatures, setHoveredFeatures] = useAtom(hoveredFeaturesAtom)
  const [clickedFeatures, setClickedFeatures] = useAtom(clickedFeaturesAtom)

  const layers = [contextLayer, basemapLayer, latestPositionsLayer, tracksLayer]

  const onClick = useCallback(
    (info: PickingInfo) => {
      const features = deckRef?.current?.pickMultipleObjects({
        x: info.x,
        y: info.y,
      })
      if (!clickedFeatures.length && !features.length) return
      setClickedFeatures(features)
    },
    [setClickedFeatures, clickedFeatures]
  )

  const onHover = useCallback(
    (info: PickingInfo) => {
      const features = deckRef?.current?.pickMultipleObjects({
        x: info.x,
        y: info.y,
      })
      if (!hoveredFeatures.length && !features.length) return
      setHoveredFeatures(features)
    },
    [setHoveredFeatures, hoveredFeatures]
  )

  const InfoTooltip = ({ features }) => {
    const vessels = features
      .filter((f) => f.object?.properties?.mmsi)
      .sort((a, b) => b.object?.properties?.timestamp - a.object?.properties?.timestamp)
    const count = features[0]?.object?.properties?.count
    if (vessels.length > 0 || count) {
      return (
        <div
          style={{
            font: 'var(--font-S)',
            position: 'absolute',
            zIndex: 1,
            pointerEvents: 'none',
            left: features[0].x + 20,
            top: features[0].y,
            backgroundColor: '#ffffff',
            padding: '1rem',
          }}
        >
          {vessels && vessels.length > 3 && <div className={styles.vesselRow}>Latest vessels</div>}
          {vessels &&
            vessels.slice(0, 3).map((f) => (
              <div key={f.object?.properties?.mmsi} className={styles.vesselRow}>
                <div>
                  <label>MMSI</label>
                  {f.object.properties.mmsi}
                </div>
                <div>
                  <label>TIME</label>
                  {new Date(f.object.properties.timestamp * 1000).toLocaleString()}
                </div>
                <div>
                  <label>SPEED</label>
                  {parseInt(f.object.properties.value)} knots
                </div>
              </div>
            ))}
          {vessels && vessels.length > 3 && (
            <div className={styles.vesselRow}>... + {vessels.length - 3} more</div>
          )}
          {count && `${count / 100} vessels`}
        </div>
      )
    }
  }

  return (
    <Fragment>
      <DeckGL
        ref={deckRef}
        views={mapView}
        layers={layers}
        // This avoids performing the default picking
        // since we are handling it through pickMultipleObjects
        // discussion for reference https://github.com/visgl/deck.gl/discussions/5793
        layerFilter={({ renderPass }) => renderPass !== 'picking:hover'}
        controller={true}
        viewState={viewState}
        onClick={onClick}
        onHover={onHover}
        onViewStateChange={onViewportStateChange}
        // this experimental prop reduces memory usage
        _typedArrayManagerProps={{ overAlloc: 1, poolSize: 0 }}
      />
      {hoveredFeatures && hoveredFeatures.length > 0 && <InfoTooltip features={hoveredFeatures} />}
    </Fragment>
  )
}

export default MapWrapper
