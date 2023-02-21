import { Fragment, useCallback, useMemo, useRef } from 'react'
import { DeckGL, DeckGLRef } from '@deck.gl/react/typed'
import { MapView, PickingInfo } from '@deck.gl/core/typed'
import { useVesselsLayer } from 'layers/vessel/vessels.hooks'
import { useContextsLayer } from 'layers/context/context.hooks'
import { useBasemapLayer } from 'layers/basemap/basemap.hooks'
import { useFourwingsLayer, useFourwingsLayerLoaded } from 'layers/fourwings/fourwings.hooks'
import { useAtom } from 'jotai'
import { useURLViewport, useViewport } from 'features/map/map-viewport.hooks'
import { hoveredFeaturesAtom, clickedFeaturesAtom } from 'features/map/map-picking.hooks'
import { zIndexSortedArray } from 'utils/layers'

const mapView = new MapView({ repeat: true })

const MapWrapper = (): React.ReactElement => {
  useURLViewport()
  const { viewState, onViewportStateChange } = useViewport()
  const deckRef = useRef<DeckGLRef>(null)
  const fourwingsLayer = useFourwingsLayer()
  const basemapLayer = useBasemapLayer()
  const vesselsLayer = useVesselsLayer()
  const contextLayer = useContextsLayer()
  const fourwingsLoaded = useFourwingsLayerLoaded()
  const [hoveredFeatures, setHoveredFeatures] = useAtom(hoveredFeaturesAtom)
  const [clickedFeatures, setClickedFeatures] = useAtom(clickedFeaturesAtom)

  const layers = useMemo(
    () => zIndexSortedArray([basemapLayer, contextLayer, fourwingsLayer, vesselsLayer]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fourwingsLayer, contextLayer, vesselsLayer, fourwingsLoaded, basemapLayer]
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

  const InfoTooltip = ({ features }) => (
    <div
      style={{
        position: 'absolute',
        color: '#ededed',
        zIndex: 1,
        pointerEvents: 'none',
        left: features[0].x + 20,
        top: features[0].y,
        backgroundColor: '#082B37',
        border: features.length ? '1px solid #ededed' : 'none',
        padding: features.length ? '3px' : '0px',
      }}
    >
      {features.map((f) =>
        f.object?.properties?.gfw_id ? (
          <p key={f.object?.properties?.gfw_id}>{f.object?.properties?.value}</p>
        ) : f.object?.properties?.vesselId ? (
          <p key={f.object?.properties?.vesselId}>{f.object?.properties?.vesselId}</p>
        ) : f.object?.value instanceof Array ? (
          <div key={f.object?.value}>
            {f.object?.value.map((v) => (
              <p key={v.id}>{v.value}</p>
            ))}
          </div>
        ) : null
      )}
    </div>
  )

  const AnalisisTooltip = ({ features }) => (
    <div
      style={{
        position: 'absolute',
        zIndex: 1,
        pointerEvents: 'none',
        left: features[0].x,
        top: features[0].y,
        backgroundColor: 'white',
      }}
    >
      {features.map((f) => (
        <p key={f.object?.properties?.value}>{f.object?.properties?.value}</p>
      ))}
    </div>
  )

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
      {clickedFeatures && clickedFeatures.length > 0 && (
        <AnalisisTooltip features={clickedFeatures} />
      )}
    </Fragment>
  )
}

export default MapWrapper
