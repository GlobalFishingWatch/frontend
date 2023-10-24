import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DeckGL, DeckGLRef } from '@deck.gl/react/typed'
import { MapView, PickingInfo } from '@deck.gl/core/typed'
import { useVesselsLayer } from 'layers/vessel/vessels.hooks'
import { useContextsLayer } from 'layers/context/context.hooks'
import { useBasemapLayer } from 'layers/basemap/basemap.hooks'
import { useCustomReferenceLayer } from 'layers/custom-reference/custom-reference.hooks'
import {
  dateToMs,
  useFourwingsLayer,
  useFourwingsLayerLoaded,
} from 'layers/fourwings/fourwings.hooks'
import { useAtom } from 'jotai'
import { ParquetVesselLayer } from 'layers/vessel/VesselParquet'
import { PathLayer } from '@deck.gl/layers/typed'
import { parquetLoader } from 'loaders/vessels/parquetLoader'
import { Segment } from '@globalfishingwatch/api-types'
import { useURLViewport, useViewport } from 'features/map/map-viewport.hooks'
import { hoveredFeaturesAtom, clickedFeaturesAtom } from 'features/map/map-picking.hooks'
import { zIndexSortedArray } from 'utils/layers'
import { useTimerange } from 'features/timebar/timebar.hooks'
import { useHighlightTimerange } from 'features/timebar/timebar.hooks'

const mapView = new MapView({ repeat: true })

const MapWrapper = () => {
  useURLViewport()
  const [vesselLoaded, setVesselLoaded] = useState(false)
  const { viewState, onViewportStateChange } = useViewport()
  const deckRef = useRef<DeckGLRef>(null)
  const fourwingsLayer = useFourwingsLayer()
  const basemapLayer = useBasemapLayer()
  const vesselsLayer = useVesselsLayer()
  const contextLayer = useContextsLayer()
  const fourwingsLoaded = useFourwingsLayerLoaded()
  const editableLayer = useCustomReferenceLayer()
  const [hoveredFeatures, setHoveredFeatures] = useAtom(hoveredFeaturesAtom)
  const [clickedFeatures, setClickedFeatures] = useAtom(clickedFeaturesAtom)

  const [timerange] = useTimerange()
  const startTime = dateToMs(timerange.start) / 1000
  const endTime = dateToMs(timerange.end) / 1000

  const [highlightTimerange] = useHighlightTimerange()
  const highlightStartTime = highlightTimerange?.start && dateToMs(highlightTimerange.start) / 1000
  const highlightEndTime = highlightTimerange?.end && dateToMs(highlightTimerange?.end) / 1000

  // const layers = useMemo(
  //   () =>
  //     zIndexSortedArray([basemapLayer, contextLayer, fourwingsLayer, vesselsLayer, editableLayer]),
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [fourwingsLayer, contextLayer, vesselsLayer, fourwingsLoaded, basemapLayer, editableLayer]
  // )

  const layers = useMemo(
    () => [
      basemapLayer,
      new ParquetVesselLayer<Segment[]>({
        id: `track-parquet-parquet`,
        data: 'http://localhost:8000/track.parquet',
        loaders: [parquetLoader],
        widthUnits: 'pixels',
        onDataLoad: (data) => {
          setVesselLoaded(true)
        },
        startTime: startTime,
        endTime: endTime,
        widthScale: 1,
        wrapLongitude: true,
        jointRounded: true,
        capRounded: true,
        highlightStartTime: highlightStartTime || 0,
        highlightEndTime: highlightEndTime || 0,
        highlightColor: [0.0, 1.0, 0.0, 0.4], // to be used as a vec4 in the shader
        // onDataLoad: this.onDataLoad,
        // getTimestamp: (d) => {
        //   console.log(d)
        //   return d
        // },
        _pathType: 'open',
        // getFilterValue: (d: any) => {
        //   debugger
        //   return d.timestamp as any
        // },
        // filterRange: [startTime, endTime],
        // extensions: [new DataFilterExtension({ filterSize: 1 }) as any],
        // getPath: (d) => {
        //   return [d.lon, d.lat]
        // },
        getColor: [255, 255, 255, 10],
        // return d.waypoints.map((p) => {
        //   if (
        //     p.timestamp >= this.props.highlightStartTime &&
        //     p.timestamp <= this.props.highlightEndTime
        //   ) {
        //     return [255, 0, 0, 100]
        //   }
        //   return [255, 255, 255, 100]
        // })
        // },
        getWidth: 1,
        // updateTriggers: {
        //   getColor: [startTime, endTime],
        // },
        // startTime: this.props.startTime,
        // endTime: this.props.endTime,
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [basemapLayer, startTime, endTime, highlightStartTime, highlightEndTime]
  )

  useEffect(() => {
    if (vesselLoaded) {
      // const vesselLayer = layers[1] as ParquetVesselLayer<Segment[], {}>
      // const segments = vesselLayer.getSegments()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vesselLoaded])

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
    <div>
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
        getCursor={editableLayer && editableLayer.getCursor.bind(editableLayer)}
        // this experimental prop reduces memory usage
        _typedArrayManagerProps={{ overAlloc: 1, poolSize: 0 }}
      />
      {hoveredFeatures && hoveredFeatures.length > 0 && <InfoTooltip features={hoveredFeatures} />}
      {clickedFeatures && clickedFeatures.length > 0 && (
        <AnalisisTooltip features={clickedFeatures} />
      )}
    </div>
  )
}

export default MapWrapper
