import { Fragment, useEffect, useCallback, useMemo } from 'react'
import { DeckGL } from '@deck.gl/react'
import { BitmapLayer } from '@deck.gl/layers'
import { TileLayer } from '@deck.gl/geo-layers'
import { useHighlightTimerange, useTimerange } from 'features/timebar/timebar.hooks'
import { VESSEL_IDS } from 'data/vessels'
import { MapLayerType, useMapLayers } from 'features/map/layers.hooks'
import { trackLoader } from '../../loaders/trackLoader'
import VesselLayer from '../../layers/vessel/VesselTrackLayer'

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
  const start = dateToMs(timerange.start)
  const end = dateToMs(timerange.end)
  const highlightStart = dateToMs(highlightTimerange?.start)
  const highlightEnd = dateToMs(highlightTimerange?.end)

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
            id: `vessel-layer-${id}`,
            vesselId: id,
            data: `https://gateway.api.dev.globalfishingwatch.org/v2/vessels/${id}/tracks?binary=true&fields=lonlat%2Ctimestamp&format=valueArray&distance-fishing=50&bearing-val-fishing=1&change-speed-fishing=10&min-accuracy-fishing=2&distance-transit=100&bearing-val-transit=1&change-speed-transit=10&min-accuracy-transit=10&datasets=public-global-fishing-tracks%3Av20201001`,
            loaders: [trackLoader() as any],
            getPath: (d) => {
              // console.log('coordinates', d.waypoints.map(p => p.coordinates));
              return d.waypoints.map((p) => p.coordinates)
            },
            getTimestamps: (d) => {
              // console.log('timestamps', d.waypoints.map(p => p.timestamp - 1465864039000));
              // deduct start timestamp from each data point to avoid overflow
              return d.waypoints.map((p) => p.timestamp)
            },
            widthUnits: 'pixels',
            widthScale: 1,
            wrapLongitude: true,
            jointRounded: true,
            capRounded: true,
            // pickable: true,
            getColor: (d) => {
              return d.waypoints.map((p) => {
                if (p.timestamp >= highlightStart && p.timestamp <= highlightEnd) {
                  return [255, 0, 0, 100]
                }
                return [255, 255, 255, 30]
              })
            },
            // getWidth: (d) => {
            //   return d.waypoints.map((p) =>
            //     p.timestamp >= minHighlightedFrame &&
            //     p.timestamp <= maxHighlightedFrame
            //       ? 2
            //       : 1
            //   );
            // },
            width: 1,
            updateTriggers: {
              getColor: [highlightStart, highlightEnd],
              // getWidth: [minHighlightedFrame, maxHighlightedFrame],
            },
            startTime: start,
            endTime: end,
          })
      )
      setMapLayerInstances('vessel', vesselLayers)
    } else {
      setMapLayerInstances('vessel', [])
    }
  }, [start, end, highlightStart, highlightEnd, vesselLayerVisible, setMapLayerInstances])

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
