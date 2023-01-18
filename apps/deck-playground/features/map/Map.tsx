import { Fragment, useMemo } from 'react'
import { DeckGL } from '@deck.gl/react/typed'
import { MapView } from '@deck.gl/core/typed'
import { useVesselsLayer, useVesselsLayerLoaded } from 'layers/vessel/vessels.hooks'
import { useFourwingsLayer, useFourwingsLayerLoaded } from 'layers/fourwings/fourwings.hooks'
import { basemapLayer } from 'layers/basemap/BasemapLayer'
import { useURLViewport, useViewport } from 'features/map/map-viewport.hooks'
import { zIndexSortedArray } from 'utils/layers'

const mapView = new MapView({ repeat: true })

const MapWrapper = (): React.ReactElement => {
  useURLViewport()
  const { viewState, onViewportStateChange } = useViewport()

  const fourwingsLayer = useFourwingsLayer()
  const vesselsLayer = useVesselsLayer()
  const vesselsLoaded = useVesselsLayerLoaded()
  const fourwingsLoaded = useFourwingsLayerLoaded()

  const layers = useMemo(() => {
    return zIndexSortedArray([basemapLayer, fourwingsLayer, vesselsLayer])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fourwingsLayer, vesselsLayer, vesselsLoaded, fourwingsLoaded])

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
    // Vessel event
    if (tooltip?.object?.type) {
      return tooltip.object.type
    }
    return
  }

  return (
    <Fragment>
      <DeckGL
        views={mapView}
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
