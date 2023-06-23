import { Fragment, useCallback, useMemo, useRef } from 'react'
import { DeckGL, DeckGLRef } from '@deck.gl/react/typed'
import { MapView, PickingInfo } from '@deck.gl/core/typed'
import { useBasemapLayer } from 'layers/basemap/basemap.hooks'
import { useAtom } from 'jotai'
import { useContextsLayer } from 'layers/context/context.hooks'
import { useLatestPositionsLayer } from 'layers/latest-positions/latest-positions.hooks'
import { useTracksLayer } from 'layers/tracks/tracks.hooks'
import { useURLViewport, useViewport } from 'features/map/map-viewport.hooks'
import { hoveredFeaturesAtom, clickedFeaturesAtom } from 'features/map/map-picking.hooks'
import { zIndexSortedArray } from 'utils/layers'
import styles from './map.module.css'

const mapView = new MapView({ repeat: true })

const MapWrapper = (): React.ReactElement => {
  useURLViewport()
  const { viewState, onViewportStateChange } = useViewport()
  const deckRef = useRef<DeckGLRef>(null)
  const basemapLayer = useBasemapLayer()
  const contextLayer = useContextsLayer()
  const tracksLayer = useTracksLayer()
  const latestPositionsLayer = useLatestPositionsLayer()
  const [hoveredFeatures, setHoveredFeatures] = useAtom(hoveredFeaturesAtom)
  const [clickedFeatures, setClickedFeatures] = useAtom(clickedFeaturesAtom)

  const layers = useMemo(
    () => zIndexSortedArray([basemapLayer, tracksLayer, latestPositionsLayer, contextLayer]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [contextLayer, basemapLayer]
  )

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
      .filter((f) => f.object?.mmsi)
      .sort((a, b) => b.object?.timestamp - a.object?.timestamp)
    if (vessels.length > 0) {
      return (
        <div
          style={{
            font: 'var(--font-S)',
            position: 'absolute',
            color: '#ededed',
            zIndex: 1,
            pointerEvents: 'none',
            left: features[0].x + 20,
            top: features[0].y,
            backgroundColor: '#082B37',
            padding: '5px',
          }}
        >
          {vessels.length > 3 && <div className={styles.vesselRow}>Latest vessels</div>}
          {vessels.slice(0, 3).map((f) => (
            <div key={f.object.mmsi} className={styles.vesselRow}>
              <div>MMSI: {f.object.mmsi}</div>
              <div>TIME: {new Date(f.object.timestamp * 1000).toLocaleString()}</div>
              <div>SPEED: {parseInt(f.object.speed)} knots</div>
            </div>
          ))}
          {vessels.length > 3 && <div className={styles.vesselRow}>...</div>}
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
