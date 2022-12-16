import {
  Color,
  CompositeLayer,
  GetPickingInfoParams,
  Layer,
  LayerContext,
  LayersList,
  PickingInfo,
} from '@deck.gl/core/typed'
import { MVTLayer, TileLayerProps } from '@deck.gl/geo-layers/typed'
import { IconLayer } from '@deck.gl/layers/typed'
import { MVTWorkerLoader } from '@loaders.gl/mvt'
import { ckmeans, sample, mean, standardDeviation } from 'simple-statistics'
import { ACTIVITY_SWITCH_ZOOM_LEVEL, getDateRangeParam } from 'layers/fourwings/fourwings.utils'
import { groupBy, orderBy } from 'lodash'
import { Feature } from 'geojson'
import bboxPolygon from '@turf/bbox-polygon'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import { COLOR_RAMP_DEFAULT_NUM_STEPS } from '@globalfishingwatch/layer-composer'
import { FourwingsColorRamp } from './FourwingsLayer'

export type FourwingsPositionsTileLayerProps<DataT = any> = {
  minFrame: number
  maxFrame: number
  colorDomain: number[]
  colorRange: Color[]
  highlightedVesselId?: string
  onDataLoad?: (data: DataT) => void
  onColorRampUpdate: (colorRamp: FourwingsColorRamp) => void
  onVesselHighlight?: (vesselId: string) => void
  onVesselClick?: (vesselId: string) => void
  onViewportLoad?: (tiles) => void
}

const ICON_MAPPING = {
  vessel: { x: 0, y: 0, width: 22, height: 40, mask: true },
  vesselHighlight: { x: 24, y: 0, width: 22, height: 40, mask: false },
  rect: { x: 6, y: 0, width: 10, height: 30, mask: true },
}

export class FourwingsPositionsTileLayer extends CompositeLayer<
  FourwingsPositionsTileLayerProps & TileLayerProps
> {
  static layerName = 'FourwingsPositionsTileLayer'

  initializeState(context: LayerContext) {
    super.initializeState(context)
    this.state = {
      colorScale: {
        colorRange: [],
        colorDomain: [],
      },
      allPositions: [],
      lastPositions: [],
      highlightedVesselId: undefined,
    }
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
  }

  getFillColor(d: Feature): Color {
    const { highlightedVesselId } = this.state
    const { colorDomain, colorRange } = this.state.colorScale
    const colorIndex = colorDomain.findIndex((domain, i) => {
      if (colorDomain[i + 1]) {
        return d.properties?.value > domain && d.properties?.value <= colorDomain[i + 1]
      }
      return i
    })
    const color = colorIndex >= 0 ? colorRange[colorIndex] : [0, 0, 0, 0]
    if (highlightedVesselId) {
      if (d.properties.vesselId === highlightedVesselId) return color
      else return [color[0], color[1], color[2], 0]
    }
    return color
  }

  getHighlightColor(d: Feature): Color {
    const { highlightedVesselId } = this.state
    if (highlightedVesselId) {
      if (d.properties.vesselId === highlightedVesselId) return [255, 255, 255, 255]
      else return [255, 255, 255, 0]
    }
    return [255, 255, 255, 120]
  }

  getLineColor(d: Feature): Color {
    const { highlightedVesselId } = this.state
    return highlightedVesselId && d.properties.vesselId === highlightedVesselId
      ? [255, 255, 255, 255]
      : [0, 0, 0, 0]
  }

  getRadius(d: Feature): number {
    const { highlightedVesselId } = this.state
    return highlightedVesselId && d.properties.vesselId === highlightedVesselId ? 5 : 3
  }

  getSize(d: Feature): number {
    const { highlightedVesselId } = this.state
    return highlightedVesselId && d.properties.vesselId === highlightedVesselId ? 15 : 8
  }

  getPickingInfo({ info, mode }: GetPickingInfoParams): PickingInfo {
    this.setState({
      highlightedVesselId: info.object?.properties?.vesselId,
    })
    if (this.props.onVesselHighlight) {
      const vesselId = info.object?.properties?.vesselId
      if (vesselId) {
        this.props.onVesselHighlight(vesselId)
        if (mode === 'query') {
          this.props.onVesselClick(vesselId)
        }
      } else if (this.props.highlightedVesselId) {
        this.props.onVesselHighlight(undefined)
      }
    }
    if (mode === 'query') {
      console.log(info.object?.properties)
    }
    if (info.object) {
      const allVesselPositions: Feature[] = this.state.allPositions.filter(
        (p) => p.properties.vesselId === info.object?.properties?.vesselId
      )
      const latestVesselPosition: Feature = this.state.lastPositions.find(
        (p) => p.properties.vesselId === info.object?.properties?.vesselId
      )
      const vesselHours = allVesselPositions.reduce((acc, next) => acc + next.properties.value, 0)
      info.object.value = `${info.object?.properties?.vesselId} \n  ${Math.round(
        vesselHours
      )} hours \n latest position: ${latestVesselPosition.geometry?.coordinates?.map((c) =>
        c.toFixed(4)
      )}`
    }
    return info
  }

  onViewportLoad = (tiles) => {
    const positions = orderBy(
      tiles.flatMap((tile) => tile.dataInWGS84),
      'properties.htime'
    ).filter(Boolean)
    const positionsByVessel = groupBy(positions, 'properties.vesselId')
    const allPositions = []
    const lastPositions = []
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

  renderLayers(): Layer<{}> | LayersList {
    const { minFrame, maxFrame } = this.props
    const { allPositions, lastPositions } = this.state
    const highlightedVesselId = this.props.highlightedVesselId || this.state.highlightedVesselId
    return [
      new MVTLayer(this.props, {
        id: 'position-tiles',
        data: `https://gateway.api.dev.globalfishingwatch.org/v2/4wings/tile/position/{z}/{x}/{y}?datasets[0]=public-global-fishing-effort%3Av20201001&${getDateRangeParam(
          minFrame,
          maxFrame
        )}`,
        minZoom: ACTIVITY_SWITCH_ZOOM_LEVEL,
        maxZoom: ACTIVITY_SWITCH_ZOOM_LEVEL,
        loaders: [MVTWorkerLoader],
        onViewportLoad: this.onViewportLoad,
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
      new IconLayer(this.props, {
        id: 'allPositions',
        data: allPositions,
        iconAtlas: '/vessel-sprite.png',
        iconMapping: ICON_MAPPING,
        getIcon: () => 'rect',
        getPosition: (d) => d.geometry.coordinates,
        getColor: (d) => this.getFillColor(d),
        getSize: (d) => this.getSize(d),
        getAngle: (d) => d.properties.bearing,
        pickable: true,
        getPickingInfo: this.getPickingInfo,
        updateTriggers: {
          getColor: [highlightedVesselId],
          getSize: [highlightedVesselId],
        },
      }),
      new IconLayer(this.props, {
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
      new IconLayer(this.props, {
        id: 'lastPositionsOver',
        data: lastPositions,
        iconAtlas: '/vessel-sprite.png',
        iconMapping: ICON_MAPPING,
        getIcon: () => 'vessel',
        getSize: 19,
        getPosition: (d) => d.geometry.coordinates,
        getAngle: (d) => d.properties.bearing,
        getColor: (d) => this.getFillColor(d),
        pickable: true,
        getPickingInfo: this.getPickingInfo,
        updateTriggers: {
          getColor: [highlightedVesselId],
        },
      }),
    ]
  }

  getPositionsData() {
    return this.state.allPositions
  }

  getData() {
    return this.getPositionsData()
  }

  getColorScale() {
    return this.state.colorScale
  }

  getColorDomain() {
    return this.state.colorScale?.colorDomain
  }

  getColorRange() {
    return this.state.colorScale?.colorRange
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
