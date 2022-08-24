import { Fragment, useEffect, useCallback, useMemo } from 'react'
import { DeckGL } from '@deck.gl/react'
import { BitmapLayer } from '@deck.gl/layers'
import { TileLayer } from '@deck.gl/geo-layers'
import { useHighlightTimerange, useTimerange } from 'features/timebar/timebar.hooks'
import { VESSEL_IDS } from 'data/vessels'
import { MapLayerType, useMapLayers } from 'features/map/layers.hooks'
import { VesselLayer } from '../../layers/vessel/VesselLayer'

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

  const setMapLayerInstances = useCallback(
    (id: MapLayerType, instances) => {
      setMapLayers((layers) =>
        layers.map((l) => {
          if (l.id === id) {
            return { ...l, instances }
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
      const vesselLayers = VESSEL_IDS.map(
        (id) =>
          new VesselLayer({
            id,
            startTime,
            endTime,
            highlightStartTime,
            highlightEndTime,
          })
      )
      setMapLayerInstances('vessel', vesselLayers)
    } else {
      setMapLayerInstances('vessel', [])
    }
  }, [
    vesselLayerVisible,
    setMapLayerInstances,
    startTime,
    endTime,
    highlightStartTime,
    highlightEndTime,
  ])

  const layers = useMemo(() => {
    return [basemap, ...mapLayers.flatMap((l) => l.instances)]
  }, [mapLayers])

  return (
    <Fragment>
      <DeckGL
        controller={true}
        initialViewState={INITIAL_VIEW_STATE}
        layers={layers}
        getTooltip={({ object }) => object && `value: ${object.colorValue}`}
      />
    </Fragment>
  )
}

export default MapWrapper
