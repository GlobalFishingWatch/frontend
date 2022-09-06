import { Fragment, useEffect, useCallback, useMemo, useState } from 'react'
import { DeckGL } from '@deck.gl/react/typed'
import { BitmapLayer } from '@deck.gl/layers'
import { TileLayer } from '@deck.gl/geo-layers'
import { FourwingsLayer, FourwingsLayerMode } from 'layers/fourwings/FourwingsLayer'
import { aggregateCell } from 'layers/fourwings/FourwingsTileLayer'
import { VALUE_MULTIPLIER } from 'loaders/constants'
import { values } from 'lodash'
import { getFourwingsMode } from 'layers/fourwings/fourwings.utils'
import { useHighlightTimerange, useTimerange } from 'features/timebar/timebar.hooks'
import { VESSEL_IDS } from 'data/vessels'
import { MapLayer, MapLayerType, useMapLayers } from 'features/map/layers.hooks'
import { useViewport } from 'features/map/map-viewport.hooks'
import { VesselsLayer } from '../../layers/vessel/VesselsLayer'

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
  const { viewState, onViewportStateChange } = useViewport()
  const activityMode: FourwingsLayerMode = getFourwingsMode(viewState.zoom)

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
      const fourwingsLayer = new FourwingsLayer({
        minFrame: startTime,
        maxFrame: endTime,
        onViewportLoad: onViewportLoad,
        mode: activityMode,
      })
      setMapLayerProperty('fourwings', 'instance', fourwingsLayer)
    } else {
      setMapLayerProperty('fourwings', 'instance', null)
    }
  }, [activityMode, fourwingsLayerVisible, setMapLayerProperty, onViewportLoad, startTime, endTime])

  const layers = useMemo(() => {
    return [basemap, ...mapLayers.flatMap((l) => l.instance)]
  }, [mapLayers])

  const getTooltip = (tooltip) => {
    if (tooltip.object?.value) {
      return tooltip.object.value.toString()
    }
    return
  }

  return (
    <Fragment>
      <DeckGL
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
