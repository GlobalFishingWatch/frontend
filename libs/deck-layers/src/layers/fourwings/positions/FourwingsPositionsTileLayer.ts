import {
  Color,
  CompositeLayer,
  Layer,
  LayerContext,
  LayersList,
  DefaultProps,
  UpdateParameters,
  PickingInfo,
} from '@deck.gl/core'
import { MVTLayer, MVTLayerProps } from '@deck.gl/geo-layers'
import { IconLayer, TextLayer } from '@deck.gl/layers'
import { MVTWorkerLoader } from '@loaders.gl/mvt'
import { ckmeans, sample, mean, standardDeviation } from 'simple-statistics'
import { groupBy, orderBy } from 'lodash'
import { stringify } from 'qs'
import { Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { COLOR_RAMP_DEFAULT_NUM_STEPS } from '@globalfishingwatch/layer-composer'
import { FourwingsPositionFeature } from '@globalfishingwatch/deck-loaders'
import {
  BLEND_BACKGROUND,
  getColorRamp,
  getLayerGroupOffset,
  hexToDeckColor,
  LayerGroup,
  rgbaStringToComponents,
} from '../../../utils'
import {
  PATH_BASENAME,
  POSITIONS_API_TILES_URL,
  POSITIONS_VISUALIZATION_MIN_ZOOM,
} from '../fourwings.config'
import { getRoundedDateFromTS } from '../heatmap/fourwings-heatmap.utils'
import { FourwingsTileLayerColorScale } from '../fourwings.types'
import { cleanVesselShipname, filteredPositionsByViewport } from './fourwings-positions.utils'
import {
  FourwingsPositionsPickingInfo,
  FourwingsPositionsPickingObject,
  FourwingsPositionsTileLayerProps,
} from './fourwings-positions.types'

type FourwingsPositionsTileLayerState = {
  positions: FourwingsPositionFeature[]
  lastPositions: FourwingsPositionFeature[]
  colorScale?: FourwingsTileLayerColorScale
}

const defaultProps: DefaultProps<FourwingsPositionsTileLayerProps> = {
  tilesUrl: POSITIONS_API_TILES_URL,
}

const MAX_LABEL_LENGTH = 20
const ICON_MAPPING = {
  vessel: { x: 0, y: 0, width: 22, height: 40, mask: true },
  vesselHighlight: { x: 24, y: 0, width: 22, height: 40, mask: false },
  rect: { x: 6, y: 0, width: 10, height: 30, mask: true },
}

// TODO:deck migrate this to an abstract layer to ensure methods like .getViewportData are implemented
export class FourwingsPositionsTileLayer extends CompositeLayer<
  FourwingsPositionsTileLayerProps & MVTLayerProps
> {
  static layerName = 'FourwingsPositionsTileLayer'
  static defaultProps = defaultProps
  state!: FourwingsPositionsTileLayerState
  highlightedVesselIds: string[] = []

  initializeState(context: LayerContext) {
    super.initializeState(context)
    this.state = {
      positions: [],
      lastPositions: [],
    }
  }

  getPickingInfo = ({
    info,
  }: {
    info: PickingInfo<FourwingsPositionFeature>
  }): FourwingsPositionsPickingInfo => {
    const object: FourwingsPositionsPickingObject = {
      ...(info.object || ({} as FourwingsPositionFeature)),
      id: info.object!?.id!?.toString(),
      layerId: this.root.id,
      title: this.props.id, // TODO:deck get the proper title
      category: this.props.category,
      startTime: this.props.startTime,
      endTime: this.props.endTime,
      sublayers: [], // TODO:deck
    }
    return { ...info, object }
  }

  getColorRamp(positions: FourwingsPositionFeature[]) {
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
      const colorRange = getColorRamp({ rampId: this.props.sublayers?.[0]?.colorRamp as any }).map(
        (c) => rgbaStringToComponents(c)
      )
      return { colorDomain: steps, colorRange }
    }
    return { colorDomain: [], colorRange: [] } as FourwingsTileLayerColorScale
  }

  _getFillColor = (d: FourwingsPositionFeature): Color => {
    const { colorScale } = this.state
    const { colorDomain, colorRange } = colorScale as FourwingsTileLayerColorScale
    const colorIndex =
      colorDomain.length === 1
        ? colorRange.length - 1
        : colorDomain.findIndex((domain: any, i: number) => {
            if (colorDomain[i + 1]) {
              return (
                d.properties?.value > domain &&
                d.properties?.value <= (colorDomain[i + 1] as number)
              )
            }
            return i
          })

    const color = colorIndex >= 0 ? colorRange[colorIndex] : [0, 0, 0, 0]
    return color as Color
  }

  getIsHighlightedVessel(d: FourwingsPositionFeature) {
    return this.highlightedVesselIds.includes(d?.properties?.id)
  }

  _getHighlightColor = (d: FourwingsPositionFeature): Color => {
    if (this.highlightedVesselIds?.length) {
      if (this.getIsHighlightedVessel(d)) {
        return [255, 255, 255, 255]
      } else return [255, 255, 255, 0]
    }
    return [255, 255, 255, 0]
  }

  _getLineColor = (d: FourwingsPositionFeature): Color => {
    return this.getIsHighlightedVessel(d) ? [255, 255, 255, 255] : [0, 0, 0, 0]
  }

  _getRadius = (d: FourwingsPositionFeature): number => {
    return this.getIsHighlightedVessel(d) ? 5 : 3
  }

  _getSize = (d: FourwingsPositionFeature): number => {
    return this.getIsHighlightedVessel(d) ? 22 : 15
  }

  _getLabelColor = (d: FourwingsPositionFeature): Color => {
    if (this.getIsHighlightedVessel(d)) {
      return [255, 255, 255, 255]
    }
    return [255, 255, 255, 120]
  }

  _getVesselLabel = (d: FourwingsPositionFeature): string => {
    const label = cleanVesselShipname(d.properties?.shipname) || d.properties?.id
    return label?.length <= MAX_LABEL_LENGTH ? label : `${label.slice(0, MAX_LABEL_LENGTH)}...`
  }

  getLatestVesselPositions = (positions: FourwingsPositionFeature[]) => {
    const positionsByVessel = groupBy(positions, 'properties.id')
    const lastPositions: FourwingsPositionFeature[] = []
    Object.keys(positionsByVessel)
      .filter((p) => p !== 'undefined')
      .forEach((vesselId) => {
        const vesselPositions = positionsByVessel[vesselId]
        lastPositions.push(...vesselPositions.slice(-1))
      })
    return lastPositions
  }

  onViewportLoad = (tiles: Tile2DHeader[]) => {
    const positions = orderBy(
      tiles.flatMap((tile: any) => tile.dataInWGS84 as FourwingsPositionFeature[]),
      'properties.htime'
    ).filter(Boolean)

    const positionsInViewport = filteredPositionsByViewport(positions, this.context.viewport)
    const lastPositions = this.getLatestVesselPositions(positionsInViewport)
    const colorScale = this.getColorRamp(positions)

    requestAnimationFrame(() => {
      this.setState({
        positions,
        lastPositions,
        colorScale,
      })
    })
    if (this.props.onViewportLoad) {
      return this.props.onViewportLoad(tiles)
    }
  }

  updateState({ props, oldProps, changeFlags }: UpdateParameters<this>) {
    if (changeFlags.viewportChanged) {
      const positionsInViewport = filteredPositionsByViewport(
        this.state.positions,
        this.context.viewport
      )
      const lastPositions = this.getLatestVesselPositions(positionsInViewport)
      this.setState({ lastPositions })
    }
    if (
      props.sublayers.map(({ colorRamp }) => colorRamp).join(',') !==
      oldProps.sublayers.map(({ colorRamp }) => colorRamp).join(',')
    ) {
      // TODO:deck split this in a separate method to avoid calculate the steps again
      // as we only need to re-calculate the colors here
      this.setState({ colorScale: this.getColorRamp(this.state.positions) })
    }
    this.highlightedVesselIds =
      props.highlightedFeatures?.flatMap((f) => f?.properties?.id || []) || []
  }

  renderLayers(): Layer<{}> | LayersList {
    // TODO:deck fuerte remove the hardcoded id and use sublayers
    const { startTime, endTime, sublayers, highlightedFeatures } = this.props
    const { positions, lastPositions } = this.state as FourwingsPositionsTileLayerState
    const IconLayerClass = this.getSubLayerClass('icons', IconLayer)
    const params = {
      // datasets: sublayers.flatMap((sublayer) => sublayer.datasets),
      datasets: ['public-global-fishing-effort:v3.0'],
      format: 'MVT',
      properties: [['speed', 'bearing', 'shipname'].join(',')],
      // TODO:deck make chunks here to filter in the frontend instead of requesting on every change
      'date-range': `${getRoundedDateFromTS(startTime)},${getRoundedDateFromTS(endTime)}`,
    }

    const baseUrl = GFWAPI.generateUrl(this.props.tilesUrl as string, { absolute: true })
    return [
      new MVTLayer(this.props, {
        id: `tiles`,
        data: `${baseUrl}?${stringify(params)}`,
        minZoom: POSITIONS_VISUALIZATION_MIN_ZOOM,
        maxZoom: POSITIONS_VISUALIZATION_MIN_ZOOM,
        loaders: [MVTWorkerLoader],
        onViewportLoad: this.onViewportLoad,
        getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Point, params),
        renderSubLayers: () => null,
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
        data: positions,
        iconAtlas: `${PATH_BASENAME}/vessel-sprite.png`,
        iconMapping: ICON_MAPPING,
        getIcon: () => 'vessel',
        getPosition: (d: any) => d.geometry.coordinates,
        getColor: this._getFillColor,
        getSize: this._getSize,
        getAngle: (d: any) => d.properties.bearing - 90,
        pickable: true,
        getPickingInfo: this.getPickingInfo,
        updateTriggers: {
          getColor: [sublayers],
          getSize: [highlightedFeatures],
        },
      }),
      new IconLayerClass(this.props, {
        id: 'allPositionsHighlight',
        data: positions,
        iconAtlas: `${PATH_BASENAME}/vessel-sprite.png`,
        iconMapping: ICON_MAPPING,
        getIcon: () => 'vesselHighlight',
        getPosition: (d: any) => d.geometry.coordinates,
        getColor: this._getHighlightColor,
        getSize: this._getSize,
        getAngle: (d: any) => d.properties.bearing - 90,
        pickable: true,
        getPickingInfo: this.getPickingInfo,
        updateTriggers: {
          getColor: [highlightedFeatures],
          getSize: [highlightedFeatures],
        },
      }),
      new TextLayer({
        id: `lastPositionsNames`,
        data: lastPositions,
        getText: this._getVesselLabel,
        getPosition: (d) => d.geometry.coordinates,
        getPixelOffset: [15, 0],
        getColor: this._getLabelColor,
        getSize: 13,
        outlineColor: hexToDeckColor(BLEND_BACKGROUND),
        fontFamily: 'Roboto',
        outlineWidth: 200,
        fontSettings: { sdf: true, smoothing: 0.2 },
        sizeUnits: 'pixels',
        getTextAnchor: 'start',
        getAlignmentBaseline: 'center',
        pickable: true,
        getPickingInfo: this.getPickingInfo,
        updateTriggers: {
          getColor: [highlightedFeatures],
        },
      }),
    ]
  }

  getViewportData = () => {
    return filteredPositionsByViewport(this.state.positions, this.context.viewport)
  }

  getData() {
    return this.state.positions
  }

  getColorDomain() {
    return this.state.colorScale?.colorDomain
  }

  getColorRange() {
    return this.state.colorScale?.colorRange
  }

  getColorScale() {
    return this.state.colorScale
  }

  getTimeseries() {
    return this.getViewportData()
  }
}
