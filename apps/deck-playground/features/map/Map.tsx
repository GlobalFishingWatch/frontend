import { Fragment, useCallback, useMemo, useRef } from 'react'
import { DeckGL, DeckGLRef } from '@deck.gl/react/typed'
import { MapView, PickingInfo } from '@deck.gl/core/typed'
import { useVesselsLayer } from 'layers/vessel/vessels.hooks'
import { useContextsLayer } from 'layers/context/context.hooks'
import { useBasemapLayer } from 'layers/basemap/basemap.hooks'
import { useFourwingsLayer, useFourwingsLayerLoaded } from 'layers/fourwings/fourwings.hooks'
import { useSetAtom } from 'jotai'
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
  const sethoveredFeaturesAtom = useSetAtom(hoveredFeaturesAtom)
  const setClickedFeaturesAtom = useSetAtom(clickedFeaturesAtom)

  const layers = useMemo(
    () => zIndexSortedArray([basemapLayer, contextLayer, fourwingsLayer, vesselsLayer]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fourwingsLayer, contextLayer, vesselsLayer, fourwingsLoaded, basemapLayer]
  )

  // const getTooltip = (tooltip) => {
  //   // Heatmap
  //   if (tooltip.object?.value) {
  //     if (Array.isArray(tooltip.object?.value)) {
  //       const sublayers = tooltip.object.value?.flatMap(({ id, value }) =>
  //         value ? `${id}: ${value}` : []
  //       )
  //       return sublayers.length ? sublayers.join('\n') : undefined
  //     }
  //     return tooltip.object?.value
  //   }
  //   // Vessel position
  //   if (tooltip.object?.properties?.vesselId) {
  //     return tooltip.object?.properties?.vesselId.toString()
  //   }
  //   // Context layer
  //   // if (tooltip.object?.properties?.value) {
  //   //   return tooltip.object?.properties?.value.toString()
  //   // }
  //   // Vessel event
  //   if (tooltip?.object?.type) {
  //     return tooltip.object.type
  //   }
  //   return
  // }

  const onClick = useCallback(
    (info: PickingInfo) => {
      const pickInfo = deckRef?.current?.pickMultipleObjects({
        x: info.x,
        y: info.y,
      })
      setClickedFeaturesAtom(pickInfo)
    },
    [setClickedFeaturesAtom]
  )

  const onHover = useCallback(
    (info: PickingInfo) => {
      const pickInfo = deckRef?.current?.pickMultipleObjects({
        x: info.x,
        y: info.y,
      })
      sethoveredFeaturesAtom(pickInfo)
    },
    [sethoveredFeaturesAtom]
  )

  return (
    <Fragment>
      <DeckGL
        ref={deckRef}
        views={mapView}
        layers={layers}
        controller={true}
        viewState={viewState}
        onHover={onHover}
        onClick={onClick}
        onViewStateChange={onViewportStateChange}
      />
    </Fragment>
  )
}

export default MapWrapper
