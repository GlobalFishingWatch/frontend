import { Fragment, useCallback, useMemo } from 'react'
import { DeckGL } from '@deck.gl/react/typed'
import { BitmapLayer } from '@deck.gl/layers'
import { TileLayer } from '@deck.gl/geo-layers'
import { MapView } from '@deck.gl/core/typed'
import { useVesselsLayer } from 'layers/vessel/vessels.hooks'
import { useTimerange } from 'features/timebar/timebar.hooks'
import { MapLayer, MapLayerType, useMapLayers } from 'features/map/layers.hooks'
import { useURLViewport, useViewport } from 'features/map/map-viewport.hooks'
import { useFourwingsLayer } from '../../layers/fourwings/fourwings.hooks'

const INITIAL_VIEW_STATE = {
  // longitude: -2,
  // latitude: 40,
  latitude: 44.00079038236199,
  longitude: -8.153310241289587,
  zoom: 9,
}

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
  const [timerange] = useTimerange()
  const [mapLayers, setMapLayers] = useMapLayers()
  const { viewState, onViewportStateChange } = useViewport()

  const setMapLayerProperty = useCallback(
    (id: MapLayerType, property: keyof MapLayer, value) => {
      setMapLayers((layers) =>
        layers.map((l) => {
          if (l.id === id) {
            return { ...l, [property]: value }
          }
          return l
        })
      )
    },
    [setMapLayers]
  )


  const fourwingsLayer = useFourwingsLayer()
  const vesselsLayer = useVesselsLayer()
  const layers = useMemo(() => {
    return [basemap, fourwingsLayer, vesselsLayer]
  }, [fourwingsLayer, vesselsLayer])

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
