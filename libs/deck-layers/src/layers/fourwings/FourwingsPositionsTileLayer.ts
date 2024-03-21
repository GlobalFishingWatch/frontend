import { Color, CompositeLayer, Layer, LayerContext, LayersList, DefaultProps } from '@deck.gl/core'
import { MVTLayer, TileLayerProps } from '@deck.gl/geo-layers'
import { IconLayer, TextLayer } from '@deck.gl/layers'
import { MVTWorkerLoader } from '@loaders.gl/mvt'
import { ckmeans, sample, mean, standardDeviation } from 'simple-statistics'
import { groupBy, orderBy } from 'lodash'
import { Feature, Point } from 'geojson'
import bboxPolygon from '@turf/bbox-polygon'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import { stringify } from 'qs'
import { Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'
import { COLOR_RAMP_DEFAULT_NUM_STEPS } from '@globalfishingwatch/layer-composer'
import { getLayerGroupOffset, LayerGroup } from '../../utils'
import { API_TILES_URL, POSITIONS_ID, POSITIONS_VISUALIZATION_MIN_ZOOM } from './fourwings.config'
import { getRoundedDateFromTS } from './fourwings.utils'
import {
  FourwingsTileLayerColorDomain,
  FourwingsTileLayerColorRange,
  FourwingsTileLayerColorScale,
  _FourwingsPositionsTileLayerProps,
} from './fourwings.types'

export type FourwingsPositionsTileLayerProps = _FourwingsPositionsTileLayerProps &
  Partial<TileLayerProps>

type FourwingsPositionsTileLayerState = {
  colorScale?: FourwingsTileLayerColorScale
  allPositions: Feature<Point>[]
  lastPositions: Feature<Point>[]
  highlightedVesselId?: string
}

const defaultProps: DefaultProps<FourwingsPositionsTileLayerProps> = {
  tilesUrl: API_TILES_URL,
}

const MAX_LABEL_LENGTH = 20
const ICON_MAPPING = {
  vessel: { x: 0, y: 0, width: 22, height: 40, mask: true },
  vesselHighlight: { x: 24, y: 0, width: 22, height: 40, mask: false },
  rect: { x: 6, y: 0, width: 10, height: 30, mask: true },
}

export class FourwingsPositionsTileLayer extends CompositeLayer<
  FourwingsPositionsTileLayerProps & TileLayerProps
> {
  static layerName = 'FourwingsPositionsTileLayer'
  static defaultProps = defaultProps

  initializeState(context: LayerContext) {
    super.initializeState(context)
    this.state = {
      allPositions: [],
      lastPositions: [],
      highlightedVesselId: undefined,
    } as FourwingsPositionsTileLayerState
  }

  getColorRamp(positions: Feature[]) {
    if (positions?.length > 0) {
      const hours = positions.map((d) => d?.properties?.value).filter(Number)
      const dataSampled = hours.length > 1000 ? sample(hours, 1000, Math.random) : hours
      // filter data to 2 standard deviations from mean to remove outliers
      const meanValue = mean(dataSampled)
      const standardDeviationValue = standardDeviation(dataSampled)
      const upperCut = meanValue + standardDeviationValue * 2
      const lowerCut = meanValue - standardDeviationValue * 2
      const dataFiltered = dataSampled.filter((a) => a >= lowerCut && a <= upperCut)
      const stepsNum = Math.min(dataFiltered.length, COLOR_RAMP_DEFAULT_NUM_STEPS)
      // using ckmeans as jenks
      const steps = ckmeans(dataFiltered, stepsNum).map(([clusterFirst]) =>
        parseFloat(clusterFirst.toFixed(3))
      )
      const colorRange = steps.map((s, i) => {
        const opacity = ((i + 1) / COLOR_RAMP_DEFAULT_NUM_STEPS) * 255
        return [255, 0, 255, opacity] as Color
      })
      return { colorDomain: steps, colorRange }
    }
    return { colorDomain: [], colorRange: [] } as FourwingsTileLayerColorScale
  }

  getFillColor(d: Feature): Color {
    const { highlightedVesselId, colorScale } = this.state
    const { colorDomain, colorRange } = colorScale as FourwingsTileLayerColorScale
    const colorIndex = colorDomain.findIndex((domain: any, i: number) => {
      if (colorDomain[i + 1]) {
        return d.properties?.value > domain && d.properties?.value <= colorDomain[i + 1]
      }
      return i
    })
    const color = colorIndex >= 0 ? colorRange[colorIndex] : [0, 0, 0, 0]
    if (highlightedVesselId) {
      if (d.properties?.id === highlightedVesselId) return color as Color
      else return [color[0], color[1], color[2], 0] as Color
    }
    return color as Color
  }

  getHighlightColor(d: Feature): Color {
    const { highlightedVesselId } = this.state
    if (highlightedVesselId) {
      if (d.properties?.id === highlightedVesselId) return [255, 255, 255, 255]
      else return [255, 255, 255, 0]
    }
    return [255, 255, 255, 120]
  }

  getHighlightLabelColor(d: Feature): Color {
    const { highlightedVesselId } = this.state
    if (highlightedVesselId) {
      return [255, 255, 255, 0]
    }
    return [255, 255, 255, 120]
  }

  getLineColor(d: Feature): Color {
    const { highlightedVesselId } = this.state
    return highlightedVesselId && d.properties?.id === highlightedVesselId
      ? [255, 255, 255, 255]
      : [0, 0, 0, 0]
  }

  getRadius(d: Feature): number {
    const { highlightedVesselId } = this.state
    return highlightedVesselId && d.properties?.id === highlightedVesselId ? 5 : 3
  }

  getSize(d: Feature): number {
    const { highlightedVesselId } = this.state
    return highlightedVesselId && d.properties?.id === highlightedVesselId ? 15 : 8
  }

  getVesselLabel = (d: Feature) => {
    const label = d.properties?.name || d.properties?.id
    return label?.length <= MAX_LABEL_LENGTH ? label : `${label.slice(0, MAX_LABEL_LENGTH)}...`
  }

  onViewportLoad = (tiles: Tile2DHeader[]) => {
    const positions = orderBy(
      tiles.flatMap((tile: any) => tile.dataInWGS84),
      'properties.htime'
    ).filter(Boolean)
    const positionsByVessel = groupBy(positions, 'properties.id')
    const allPositions: any[] = []
    const lastPositions: any[] = []
    Object.keys(positionsByVessel)
      .filter((p) => p !== 'undefined')
      .forEach((vesselId) => {
        const vesselPositions = positionsByVessel[vesselId]
        allPositions.push(...vesselPositions.slice(0, -1))
        lastPositions.push(...vesselPositions.slice(-1))
      })

    const colorScale = this.getColorRamp(positions)
    requestAnimationFrame(() => {
      this.setState({
        allPositions,
        lastPositions,
        colorScale,
      })
      if (this.props.onViewportLoad) {
        return this.props.onViewportLoad(tiles)
      }
    })
  }

  updateState() {
    const clickedVesselId = this.props?.clickedFeatures?.flatMap(
      (f) => f.sourceLayer?.id === this.id && f.object?.properties?.id
    )
    const highlightedVesselId = this.props?.hoveredFeatures?.flatMap(
      (f) => f.sourceLayer?.id === this.id && f.object?.properties?.id
    )
    if (highlightedVesselId && highlightedVesselId[0]) {
      this.setState({
        highlightedVesselId: highlightedVesselId[0],
      })
    } else {
      this.setState({
        highlightedVesselId: undefined,
      })
    }
    if (clickedVesselId?.[0] && this.props.onVesselClick) {
      this.props.onVesselClick(clickedVesselId[0])
    }
  }

  renderLayers(): Layer<{}> | LayersList {
    const { minFrame, maxFrame } = this.props
    const { allPositions, lastPositions } = this.state as FourwingsPositionsTileLayerState
    const highlightedVesselId = this.props.highlightedVesselId || this.state.highlightedVesselId
    const IconLayerClass = this.getSubLayerClass('icons', IconLayer)
    const params = {
      datasets: ['public-global-fishing-effort:v20201001'],
      format: 'MVT',
      'date-range': `${getRoundedDateFromTS(minFrame)},${getRoundedDateFromTS(maxFrame)}`,
    }
    return [
      new MVTLayer(this.props as any, {
        id: `${POSITIONS_ID}-tiles`,
        data: `https://gateway.api.dev.globalfishingwatch.org/v3/4wings/tile/position/{z}/{x}/{y}?${stringify(
          params
        )}`,
        minZoom: POSITIONS_VISUALIZATION_MIN_ZOOM,
        maxZoom: POSITIONS_VISUALIZATION_MIN_ZOOM,
        loaders: [MVTWorkerLoader],
        onViewportLoad: this.onViewportLoad,
        getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Point, params),
      }),
      // CIRCLES
      // new ScatterplotLayer(this.props, {
      //   id: 'allPositions',
      //   data: allPositions,
      //   getPosition: (d) => d.geometry.coordinates,
      //   filled: true,
      //   stroked: true,
      //   getFillColor: (d) => this.getFillColor(d),
      //   getRadius: (d) => this.getRadius(d),
      //   getLineColor: (d) => this.getLineColor(d),
      //   radiusUnits: 'pixels',
      //   lineWidthMinPixels: 1,
      //   pickable: true,
      //   getPickingInfo: this.getPickingInfo,
      //   updateTriggers: {
      //     getRadius: [highlightedVesselId],
      //     getLineColor: [highlightedVesselId],
      //   },
      // }),
      // LINES
      new IconLayerClass(this.props, {
        id: 'allPositions',
        data: allPositions,
        iconAtlas: '/vessel-sprite.png',
        iconMapping: ICON_MAPPING,
        getIcon: () => 'rect',
        getPosition: (d: any) => d.geometry.coordinates,
        getColor: (d: any) => this.getFillColor(d),
        getSize: (d: any) => this.getSize(d),
        getAngle: (d: any) => d.properties.bearing,
        pickable: true,
        getPickingInfo: this.getPickingInfo,
        updateTriggers: {
          getColor: [highlightedVesselId],
          getSize: [highlightedVesselId],
        },
      }),
      new IconLayer(this.props as any, {
        id: 'lastPositions',
        data: lastPositions,
        iconAtlas: '/vessel-sprite.png',
        iconMapping: ICON_MAPPING,
        getIcon: () => 'vesselHighlight',
        getPosition: (d) => d.geometry.coordinates,
        getAngle: (d) => d.properties.bearing,
        getColor: (d) => this.getHighlightColor(d),
        getSize: 21,
        updateTriggers: {
          getColor: [highlightedVesselId],
        },
      }),
      new IconLayerClass(this.props, {
        id: 'lastPositionsOver',
        data: lastPositions,
        iconAtlas: '/vessel-sprite.png',
        iconMapping: ICON_MAPPING,
        getIcon: () => 'vessel',
        getSize: 19,
        getPosition: (d: any) => d.geometry.coordinates,
        getAngle: (d: any) => d.properties.bearing,
        getColor: (d: any) => this.getFillColor(d),
        pickable: true,
        getPickingInfo: this.getPickingInfo,
        updateTriggers: {
          getColor: [highlightedVesselId],
        },
      }),
      new TextLayer({
        id: `lastPositionsNames`,
        data: lastPositions,
        getText: (d) => this.getVesselLabel(d),
        getPosition: (d) => d.geometry.coordinates,
        getPixelOffset: [10, 0],
        getColor: (d) => this.getHighlightLabelColor(d),
        getSize: 12,
        getTextAnchor: 'start',
        getAlignmentBaseline: 'center',
        updateTriggers: {
          getColor: [highlightedVesselId],
        },
      }),
    ]
  }

  getPositionsData() {
    return this.state.allPositions as Feature<Point>[]
  }

  getData() {
    return this.getPositionsData()
  }

  getViewportData() {
    // TODO: return only data in viewport
    return this.getPositionsData()
  }

  getColorDomain() {
    return (this.state.colorScale as FourwingsTileLayerColorScale)
      ?.colorDomain as FourwingsTileLayerColorDomain
  }

  getColorRange() {
    return (this.state.colorScale as FourwingsTileLayerColorScale)
      ?.colorRange as FourwingsTileLayerColorRange
  }

  getColorScale() {
    return {
      range: this.getColorRange(),
      domain: this.getColorDomain(),
    }
  }

  getTimeseries() {
    const positions = this.getPositionsData()
    const viewportBounds = this.context.viewport.getBounds()
    const viewportPolygon = bboxPolygon(viewportBounds)
    const positionsInViewport = positions.filter((position) =>
      booleanPointInPolygon(position, viewportPolygon)
    )
    return positionsInViewport
  }
}
