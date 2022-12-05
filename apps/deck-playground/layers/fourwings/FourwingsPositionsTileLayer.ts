import { Color, CompositeLayer, Layer, LayerContext, LayersList } from '@deck.gl/core/typed'
import { MVTLayer, TileLayerProps } from '@deck.gl/geo-layers/typed'
import { IconLayer, ScatterplotLayer } from '@deck.gl/layers/typed'
import { MVTLoader } from '@loaders.gl/mvt'
import { ckmeans, sample, mean, standardDeviation } from 'simple-statistics'
import { ACTIVITY_SWITCH_ZOOM_LEVEL, getDateRangeParam } from 'layers/fourwings/fourwings.utils'
import { groupBy, orderBy } from 'lodash'
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
}

const ICON_MAPPING = {
  vessel: { x: 0, y: 0, width: 22, height: 40, mask: true },
  vesselHighlight: { x: 24, y: 0, width: 22, height: 40, mask: false },
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
      highlightVessels: [],
    }
  }

  getColorRamp(positions) {
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

  getFillColor(d) {
    const { highlightedVesselId } = this.props
    const { colorDomain, colorRange } = this.state.colorScale
    const colorIndex = colorDomain.findIndex((domain, i) => {
      if (colorDomain[i + 1]) {
        return d.properties?.value > domain && d.properties?.value <= colorDomain[i + 1]
      }
      return i
    })
    const color = colorIndex >= 0 ? colorRange[colorIndex] : [0, 0, 0, 0]
    if (!highlightedVesselId) {
      return color
    } else if (d.properties.vesselId !== highlightedVesselId) {
      return [color[0], color[1], color[2], 0]
    }
    return color
  }

  getPickingInfo({ info, mode }) {
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
    return info
  }

  onViewportLoad = (tiles) => {
    const allPositions = orderBy(
      tiles.flatMap((tile) => tile.dataInWGS84),
      'properties.htime'
    ).filter(Boolean)
    const positionsByVessel = groupBy(allPositions, 'properties.vesselId')
    const lastPositions = []
    Object.keys(positionsByVessel)
      .filter((p) => p !== 'undefined')
      .forEach((vesselId) => {
        const vesselPositions = positionsByVessel[vesselId]
        lastPositions.push(...vesselPositions.slice(-1))
      })
    const colorScale = this.getColorRamp(allPositions)
    this.setState({
      allPositions,
      lastPositions,
      colorScale,
    })
  }

  renderLayers(): Layer<{}> | LayersList {
    const { allPositions, lastPositions, colorScale } = this.state
    return [
      new MVTLayer(this.props, {
        id: 'position-tiles',
        data: `https://gateway.api.dev.globalfishingwatch.org/v2/4wings/tile/position/{z}/{x}/{y}?datasets[0]=public-global-fishing-effort%3Av20201001&${getDateRangeParam(
          this.props.minFrame,
          this.props.maxFrame
        )}`,
        minZoom: ACTIVITY_SWITCH_ZOOM_LEVEL,
        maxZoom: ACTIVITY_SWITCH_ZOOM_LEVEL,
        loaders: [MVTLoader],
        onViewportLoad: this.onViewportLoad,
      }),
      new ScatterplotLayer(this.props, {
        id: 'allPositions',
        data: allPositions,
        getPosition: (d) => d.geometry.coordinates,
        filled: true,
        stroked: true,
        getFillColor: (d) => this.getFillColor(d),
        getLineColor: [0, 0, 0, 25],
        radiusMinPixels: 3,
        lineWidthMinPixels: 1,
        updateTriggers: {
          getFillColor: [colorScale.colorDomain, allPositions],
        },
        pickable: true,
        getPickingInfo: this.getPickingInfo,
      }),
      new IconLayer(this.props, {
        id: 'lastPositions',
        data: lastPositions,
        iconAtlas: '/vessel-sprite.png',
        iconMapping: ICON_MAPPING,
        getIcon: () => 'vessel',
        sizeScale: 1,
        getPosition: (d) => d.geometry.coordinates,
        getAngle: (d) => d.properties.bearing,
        getColor: [255, 255, 255, 255],
        getSize: 21,
        updateTriggers: {
          getFillColor: [colorScale.colorDomain.join('-'), lastPositions],
        },
      }),
      new IconLayer(this.props, {
        id: 'lastPositionsOver',
        data: lastPositions,
        iconAtlas: '/vessel-sprite.png',
        iconMapping: ICON_MAPPING,
        getIcon: () => 'vessel',
        sizeScale: 1,
        getPosition: (d) => d.geometry.coordinates,
        getAngle: (d) => d.properties.bearing,
        getColor: (d) => this.getFillColor(d),
        getSize: 19,
        updateTriggers: {
          getColor: [colorScale.colorDomain, lastPositions],
        },
        pickable: true,
        getPickingInfo: this.getPickingInfo,
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
    return this.state.colorScale.colorDomain
  }

  getColorRange() {
    return this.state.colorScale.colorRange
  }

  getTimeseries() {
    return []
  }
}
