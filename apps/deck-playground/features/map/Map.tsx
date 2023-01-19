import { Fragment, useMemo, useRef } from 'react'
import { DeckGL } from '@deck.gl/react/typed'
import { MapView, DeckProps } from '@deck.gl/core/typed'
import {
  useVesselsLayer,
  useVesselsLayerLoaded,
  useVesselsLayerRenderReady,
} from 'layers/vessel/vessels.hooks'
import { useContextsLayer } from 'layers/context/context.hooks'
import { useFourwingsLayer, useFourwingsLayerLoaded } from 'layers/fourwings/fourwings.hooks'
import { basemapLayer } from 'layers/basemap/BasemapLayer'
import { useURLViewport, useViewport } from 'features/map/map-viewport.hooks'
import { zIndexSortedArray } from 'utils/layers'

const mapView = new MapView({ repeat: true })

const MapWrapper = (): React.ReactElement => {
  useURLViewport()
  const { viewState, onViewportStateChange } = useViewport()
  const deckRef = useRef<DeckProps>(null)

  const fourwingsLayer = useFourwingsLayer()
  const vesselsLayer = useVesselsLayer()
  const vesselsLoaded = useVesselsLayerLoaded()
  const fourwingsLoaded = useFourwingsLayerLoaded()
  const vesselsRenderReady = useVesselsLayerRenderReady()
  const contextLayer = useContextsLayer()

  const layers = useMemo(() => {
    return zIndexSortedArray([basemapLayer, contextLayer, fourwingsLayer, vesselsLayer])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fourwingsLayer, vesselsRenderReady, contextLayer, fourwingsLoaded])

  const getTooltip = (tooltip) => {
    // console.log('🚀 ~ file: Map.tsx:70 ~ getTooltip ~ tooltip', tooltip)
    // Heatmap
    if (tooltip.object?.value) {
      if (Array.isArray(tooltip.object?.value)) {
        const sublayers = tooltip.object.value?.flatMap(({ id, value }) =>
          value ? `${id}: ${value}` : []
        )
        return sublayers.length ? sublayers.join('\n') : undefined
      }
      return tooltip.object?.value
    }
    // Vessel position
    if (tooltip.object?.properties?.vesselId) {
      return tooltip.object?.properties?.vesselId.toString()
    }
    // Context layer
    // if (tooltip.object?.properties?.value) {
    //   return tooltip.object?.properties?.value.toString()
    // }
    // Vessel event
    if (tooltip?.object?.type) {
      return tooltip.object.type
    }
    return
  }
  // const getPickingInfo = (info) => {
  //   console.log('🚀 ~ file: Map.tsx:91 ~ getPickingInfo ~ info', info)

  //   return info
  // }
  // const onClick = useCallback((event) => {
  //   console.log('🚀 ~ file: Map.tsx:92 ~ onClick ~ event', event)
  //   const pickInfo = deckRef?.current?.pickMultipleObjects({
  //     x: event.x,
  //     y: event.y,
  //     depth: 100,
  //   })
  //   console.log('🚀 ~ file: Map.tsx:97 ~ onClick ~ pickInfo', pickInfo)
  // }, [])

  return (
    <Fragment>
      <DeckGL
        // ref={deckRef}
        views={mapView}
        // onClick={onClick}
        controller={true}
        viewState={viewState}
        layers={layers}
        getTooltip={getTooltip}
        onViewStateChange={onViewportStateChange}
        // getPickingInfo={getPickingInfo}
        // onHover={(info) => console.log(info)}
      />
    </Fragment>
  )
}

export default MapWrapper
