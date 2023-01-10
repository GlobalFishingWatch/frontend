import { Fragment, useCallback, useMemo } from 'react'
import { DeckGL } from '@deck.gl/react/typed'
import { BitmapLayer } from '@deck.gl/layers'
import { TileLayer } from '@deck.gl/geo-layers'
import { MapView } from '@deck.gl/core/typed'
import { useVesselsLayer } from 'layers/vessel/vessels.hooks'
import { VesselEventsLayer } from 'layers/vessel/VesselEventsLayer'
import { VesselTrackLayer } from 'layers/vessel/VesselTrackLayer'
import { VesselsLayer } from 'layers/vessel/VesselsLayer'
import { useFourwingsLayer } from 'layers/fourwings/fourwings.hooks'
import { useURLViewport, useViewport } from 'features/map/map-viewport.hooks'
import { layersZIndexSort } from 'utils/layers'


const basemap = new TileLayer({
  id: 'basemap',
  data: 'https://gateway.api.dev.globalfishingwatch.org/v2/tileset/sat/tile?x={x}&y={y}&z={z}',
  minZoom: 0,
  maxZoom: 12,
  // tileSize: 256,
  renderSubLayers: (props) => {
    const {
      bbox: { west, south, east, north },
    } = props.tile
    return new BitmapLayer(props, {
      data: null,
      image: props.data,
      tintColor: [21, 93, 206],
      bounds: [west, south, east, north],
    })
  },
})

const mapView = new MapView({ repeat: true })

const MapWrapper = (): React.ReactElement => {
  useURLViewport()
  const { viewState, onViewportStateChange } = useViewport()

  const fourwingsLayer = useFourwingsLayer()
  const VesselsLayerInstance: VesselsLayer = useVesselsLayer()
  
  const layers = useMemo(() => {
    const vesselsLayers: (VesselEventsLayer | VesselTrackLayer)[] = VesselsLayerInstance?.getLayers() || []
    return layersZIndexSort([basemap, fourwingsLayer, ...vesselsLayers])
  }, [fourwingsLayer, VesselsLayerInstance])

  const getTooltip = (tooltip) => {
    // Heatmap
    if (tooltip.object?.value) {
      return tooltip.object.value.toString()
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
