import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DeckGL, DeckGLRef } from '@deck.gl/react/typed'
import { MapView, PickingInfo } from '@deck.gl/core/typed'
import { useVesselsLayer } from 'layers/vessel/vessels.hooks'
import { useContextsLayer } from 'layers/context/context.hooks'
import { useFourwingsLayer, useFourwingsLayerLoaded } from 'layers/fourwings/fourwings.hooks'
import { basemapLayer } from 'layers/basemap/BasemapLayer'
import { useURLViewport, useViewport } from 'features/map/map-viewport.hooks'
import { useAddMapHoveredFeatures, useMapHoveredFeatures } from 'features/map/map-picking.hooks'
import { zIndexSortedArray } from 'utils/layers'

const mapView = new MapView({ repeat: true })

const MapWrapper = (): React.ReactElement => {
  useURLViewport()
  const { viewState, onViewportStateChange } = useViewport()
  const deckRef = useRef<DeckGLRef>(null)
  const fourwingsLayer = useFourwingsLayer()
  const vesselsLayer = useVesselsLayer()
  const fourwingsLoaded = useFourwingsLayerLoaded()
  // const vesselsRenderReady = useVesselsLayerRenderReady()
  const contextLayer = useContextsLayer()
  const setMapHoveredFeatures = useAddMapHoveredFeatures()
  const mapHoveredFeatures = useMapHoveredFeatures()
  const [clickedFeatures, setClickedFeatures] = useState<PickingInfo[]>([])
  // const [hoveredFeatures, setHoveredFeatures] = useState<PickingInfo[]>([])

  const layers = useMemo(() => {
    return zIndexSortedArray([basemapLayer, contextLayer, fourwingsLayer, vesselsLayer])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fourwingsLayer, contextLayer, fourwingsLoaded])

  const getTooltip = (tooltip) => {
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
  const onClick = useCallback((info: PickingInfo) => {
    const pickInfo = deckRef?.current?.pickMultipleObjects({
      x: info.x,
      y: info.y,
    })
    setClickedFeatures(pickInfo)
  }, [])

  useEffect(() => {
    console.log('CLICKED FEATURES', clickedFeatures)
    // setMapHoveredFeatures(clickedFeatures)
  }, [clickedFeatures, setMapHoveredFeatures])

  // const onHover = useCallback((info: PickingInfo) => {
  //   const pickInfo = deckRef?.current?.pickMultipleObjects({
  //     x: info.x,
  //     y: info.y,
  //   })
  // }, [])

  // console.log('SELECTED FEATURES', mapHoveredFeatures)

  return (
    <Fragment>
      <DeckGL
        // ref={deckRef}
        views={mapView}
        // onHover={onHover}
        onClick={onClick}
        controller={true}
        viewState={viewState}
        layers={layers}
        getTooltip={getTooltip}
        onViewStateChange={onViewportStateChange}
      />
    </Fragment>
  )
}

export default MapWrapper
