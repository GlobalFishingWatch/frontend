import { Fragment, useEffect, useCallback, useMemo } from 'react'
import { DeckGL } from '@deck.gl/react/typed'
import { BitmapLayer } from '@deck.gl/layers'
import { TileLayer } from '@deck.gl/geo-layers'
import { FourwingsLayer } from 'layers/fourwings/FourwingsLayer'
import { aggregateCell } from 'layers/fourwings/FourwingsTileLayer'
import { VALUE_MULTIPLIER } from 'loaders/constants'
import { values } from 'lodash'
import { FourwingsGPULayer } from 'layers/fourwings-gpu/FourwingsGPULayer'
import { useHighlightTimerange, useTimerange } from 'features/timebar/timebar.hooks'
import { VESSEL_IDS } from 'data/vessels'
import { MapLayer, MapLayerType, useMapLayers } from 'features/map/layers.hooks'
import { VesselsLayer } from '../../layers/vessel/VesselsLayer'
// import GPUGridLayer from 'layers/fourwings-gpu/gpu-grid-layer'

const INITIAL_VIEW_STATE = {
  longitude: -2,
  latitude: 40,
  zoom: 5,
}

const basemap = new TileLayer({
  id: 'basemap',
  data: 'https://gateway.api.dev.globalfishingwatch.org/v2/tileset/sat/tile?x={x}&y={y}&z={z}',
  minZoom: 0,
  maxZoom: 12,
  tileSize: 256,
  renderSubLayers: (props) => {
    const {
      bbox: { west, south, east, north },
    } = props.tile
    return new BitmapLayer(props, {
      data: null,
      image: props.data,
      bounds: [west, south, east, north],
    })
  },
})

const dateToMs = (date: string) => {
  return new Date(date).getTime()
}

const MapWrapper = (): React.ReactElement => {
  const [timerange] = useTimerange()
  const [mapLayers, setMapLayers] = useMapLayers()
  const [highlightTimerange] = useHighlightTimerange()
  const startTime = dateToMs(timerange.start)
  const endTime = dateToMs(timerange.end)
  const highlightStartTime = dateToMs(highlightTimerange?.start)
  const highlightEndTime = dateToMs(highlightTimerange?.end)

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

  const vesselLayerVisible = mapLayers.find((l) => l.id === 'vessel')?.visible
  useEffect(() => {
    if (vesselLayerVisible) {
      const vesselsLayer = new VesselsLayer({
        ids: VESSEL_IDS,
        startTime,
        endTime,
        highlightStartTime,
        highlightEndTime,
      })
      setMapLayerProperty('vessel', 'instance', vesselsLayer)
    } else {
      setMapLayerProperty('vessel', 'instance', null)
    }
  }, [
    vesselLayerVisible,
    setMapLayerProperty,
    startTime,
    endTime,
    highlightStartTime,
    highlightEndTime,
  ])

  const onViewportLoad = useCallback(() => {
    setMapLayerProperty('fourwings', 'loaded', true)
  }, [setMapLayerProperty])

  const fourwingsLayerVisible = mapLayers.find((l) => l.id === 'fourwings')?.visible
  useEffect(() => {
    if (fourwingsLayerVisible) {
      const fourwingsLayer = new FourwingsGPULayer({
        minFrame: startTime,
        maxFrame: endTime,
        onViewportLoad: onViewportLoad,
      })
      setMapLayerProperty('fourwings', 'instance', fourwingsLayer)
    } else {
      setMapLayerProperty('fourwings', 'instance', null)
    }
  }, [fourwingsLayerVisible, setMapLayerProperty, onViewportLoad, startTime, endTime])

  const layers = useMemo(() => {
    // return [
    //   new GPUGridLayer({
    //     id: 'GPUGridLayer',
    //     data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-bike-parking.json',

    //     /* props from GPUGridLayer class */

    //     cellSize: 200,
    //     // colorAggregation: 'SUM',
    //     // colorDomain: null,
    //     // colorRange: [[255, 255, 178], [254, 217, 118], [254, 178, 76], [253, 141, 60], [240, 59, 32], [189, 0, 38]],
    //     // coverage: 1,
    //     // elevationAggregation: 'SUM',
    //     // elevationDomain: null,
    //     // elevationRange: [0, 1000],
    //     // elevationScale: 4,
    //     // extruded: false,
    //     // getColorWeight: 1,
    //     // getElevationWeight: 1,
    //     getPosition: (d) => d.COORDINATES,
    //     // material: true,

    //     /* props inherited from Layer class */

    //     // autoHighlight: false,
    //     // coordinateOrigin: [0, 0, 0],
    //     // coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
    //     // highlightColor: [0, 0, 128, 128],
    //     // modelMatrix: null,
    //     // opacity: 1,
    //     pickable: true,
    //     // visible: true,
    //     // wrapLongitude: false,
    //   }),
    // ]
    return [basemap, ...mapLayers.flatMap((l) => l.instance)]
  }, [mapLayers])

  const getTooltip = (tooltip) => {
    if (tooltip.object?.colorValue) {
      return tooltip.object.colorValue.toString()
    }
    return
  }

  return (
    <Fragment>
      <DeckGL
        controller={true}
        initialViewState={INITIAL_VIEW_STATE}
        layers={layers}
        getTooltip={getTooltip}
        // onViewStateChange={(v) => console.log(v.viewState.zoom)}
      />
    </Fragment>
  )
}

export default MapWrapper
