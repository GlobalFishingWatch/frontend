import { parse } from '@loaders.gl/core'
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
import { sample, mean, standardDeviation } from 'simple-statistics'
import { groupBy, orderBy } from 'es-toolkit'
import { stringify } from 'qs'
import { GeoBoundingBox, Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'
import { GFWAPI, ParsedAPIError } from '@globalfishingwatch/api-client'
import { CONFIG_BY_INTERVAL, FourwingsPositionFeature } from '@globalfishingwatch/deck-loaders'
import { transformTileCoordsToWGS84 } from '../../../utils/coordinates'
import {
  BLEND_BACKGROUND,
  COLOR_HIGHLIGHT_LINE,
  COLOR_TRANSPARENT,
  getColorRamp,
  getLayerGroupOffset,
  getSteps,
  GFWMVTLoader,
  hexToDeckColor,
  LayerGroup,
  VESSEL_SPRITE_ICON_MAPPING,
} from '../../../utils'
import {
  MATCHED_POSITIONS_FILTER,
  MAX_POSITIONS_PER_TILE_SUPPORTED,
  POSITIONS_API_TILES_URL,
  POSITIONS_VISUALIZATION_MAX_ZOOM,
  SUPPORTED_POSITION_PROPERTIES,
} from '../fourwings.config'
import { getISODateFromTS } from '../heatmap/fourwings-heatmap.utils'
import { FourwingsColorObject, FourwingsTileLayerColorScale } from '../fourwings.types'
import type { FourwingsLayer } from '../FourwingsLayer'
import { PATH_BASENAME } from '../../layers.config'
import {
  cleanVesselShipname,
  filteredPositionsByViewport,
  getIsPositionMatched,
} from './fourwings-positions.utils'
import {
  FourwingsPositionsPickingInfo,
  FourwingsPositionsPickingObject,
  FourwingsPositionsTileLayerProps,
} from './fourwings-positions.types'

type FourwingsPositionsTileLayerState = {
  fontLoaded: boolean
  viewportDirty: boolean
  viewportLoaded: boolean
  lastViewport: string
  positions: FourwingsPositionFeature[]
  lastPositions: FourwingsPositionFeature[]
  colorScale?: FourwingsTileLayerColorScale
  highlightedVesselIds: Set<string>
  highlightedFeatureIds: Set<string>
}

const defaultProps: DefaultProps<FourwingsPositionsTileLayerProps> = {
  tilesUrl: POSITIONS_API_TILES_URL,
}

const MAX_LABEL_LENGTH = 20

export class FourwingsPositionsTileLayer extends CompositeLayer<
  FourwingsPositionsTileLayerProps & MVTLayerProps
> {
  static layerName = 'FourwingsPositionsTileLayer'
  static defaultProps = defaultProps
  state!: FourwingsPositionsTileLayerState
  viewportDirtyTimeout!: NodeJS.Timeout
  hideUnmatchedPositions = false

  get isLoaded(): boolean {
    return (
      super.isLoaded &&
      this.state.fontLoaded &&
      !this.state.viewportDirty &&
      this.state.viewportLoaded
    )
  }

  initializeState(context: LayerContext) {
    super.initializeState(context)
    let fontLoaded = true
    if (typeof document !== 'undefined') {
      fontLoaded = false
      const font = new FontFace(
        'Roboto Deck',
        "url('https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2')"
      )
      font
        .load()
        .then(() => {
          ;(document.fonts as any).add(font)
        })
        .finally(() => {
          this.setState({ fontLoaded: true })
        })
    }
    this.state = {
      fontLoaded,
      viewportDirty: false,
      viewportLoaded: false,
      lastViewport: '',
      positions: [],
      lastPositions: [],
      highlightedFeatureIds: new Set<string>(),
      highlightedVesselIds: new Set<string>(),
    }
  }

  updateViewportDirty() {
    if (!this.state.viewportDirty) {
      this.setState({ viewportDirty: true })
    }
    if (this.viewportDirtyTimeout) {
      clearTimeout(this.viewportDirtyTimeout)
    }
    this.viewportDirtyTimeout = setTimeout(() => {
      this.setState({ viewportDirty: false })
    }, 500)
  }

  updateState({ props, oldProps, context }: UpdateParameters<this>) {
    const viewportHash = [
      (context.viewport as any)?.longitude?.toFixed(1),
      (context.viewport as any)?.latitude?.toFixed(1),
      context.viewport?.zoom?.toFixed(1),
    ].join(',')
    if (viewportHash !== this.state.lastViewport) {
      this.updateViewportDirty()
      this.setState({ lastViewport: viewportHash })
      const positionsInViewport = filteredPositionsByViewport(
        this.state.positions,
        this.context.viewport
      )
      const lastPositions = this._getLatestVesselPositions(positionsInViewport)
      this.setState({ lastPositions })
    }
    if (
      props.sublayers?.map(({ colorRamp }) => colorRamp).join(',') !==
      oldProps.sublayers?.map(({ colorRamp }) => colorRamp).join(',')
    ) {
      // TODO:deck split this in a separate method to avoid calculate the steps again
      // as we only need to re-calculate the colors here
      this.setState({ colorScale: this._getColorRamp(this.state.positions) })
    }
    const highlightedFeatureIds = new Set<string>()
    if (props.highlightedFeatures?.length) {
      for (const feature of props.highlightedFeatures) {
        highlightedFeatureIds.add(feature?.properties?.id)
      }
    }
    this.setState({ highlightedFeatureIds })
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
      title: info.object?.properties?.shipname,
      category: this.props.category,
      startTime: this.props.startTime,
      endTime: this.props.endTime,
      sublayers:
        info.object?.properties.layer !== undefined
          ? [this.props.sublayers[info.object.properties.layer]]
          : [],
      visualizationMode: 'positions',
    }
    return { ...info, object }
  }

  _getColorRamp(positions: FourwingsPositionFeature[]) {
    if (positions?.length > 0) {
      const hours = positions.map((d) => d?.properties?.value).filter(Number)
      const dataSampled = hours.length > 1000 ? sample(hours, 1000, Math.random) : hours
      // filter data to 2 standard deviations from mean to remove outliers
      const meanValue = mean(dataSampled)
      const standardDeviationValue = standardDeviation(dataSampled)
      const upperCut = meanValue + standardDeviationValue * 2
      const lowerCut = meanValue - standardDeviationValue * 2
      const dataFiltered = dataSampled.filter((a) => a >= lowerCut && a <= upperCut)
      const steps = getSteps(dataFiltered).map((value) => parseFloat(value.toFixed(3)))
      const colorRange = this.props.sublayers?.map((sublayer) =>
        getColorRamp({ rampId: sublayer.colorRamp as any })
      )
      return { colorDomain: steps, colorRange }
    }
    return { colorDomain: [], colorRange: [] } as FourwingsTileLayerColorScale
  }

  _getFillColor = (d: FourwingsPositionFeature): Color => {
    const { colorScale } = this.state
    const { colorDomain, colorRange } = colorScale as FourwingsTileLayerColorScale
    const { highlightStartTime, highlightEndTime } = this.props
    const date = CONFIG_BY_INTERVAL['HOUR'].getTime(d.properties.htime)
    if (
      highlightStartTime &&
      highlightEndTime &&
      date >= highlightStartTime &&
      date < highlightEndTime
    ) {
      return COLOR_HIGHLIGHT_LINE
    }
    const sublayerColorRange = colorRange[d.properties.layer] as FourwingsColorObject[]
    const colorIndex =
      colorDomain.length === 1
        ? sublayerColorRange.length - 1
        : colorDomain.findIndex((domain: any, i: number) => {
            if (colorDomain[i + 1]) {
              return (
                d.properties?.value > domain &&
                d.properties?.value <= (colorDomain[i + 1] as number)
              )
            }
            return i
          })

    const color = sublayerColorRange[colorIndex]
    return color ? ([color.r, color.g, color.b, color.a * 255] as Color) : COLOR_TRANSPARENT
  }

  _hasHighlightedVessels() {
    return this.state.highlightedVesselIds.size > 0 || this.state.highlightedFeatureIds.size > 0
  }

  _getIsHighlightedVessel(d: FourwingsPositionFeature) {
    return (
      this.state.highlightedVesselIds.has(d.properties?.id) ||
      this.state.highlightedFeatureIds.has(d.properties?.id)
    )
  }

  _getHighlightColor = (d: FourwingsPositionFeature): Color => {
    return [255, 255, 255, this._getIsHighlightedVessel(d) ? 255 : 0]
  }

  _getIconSize = (d: FourwingsPositionFeature): number => {
    if (getIsPositionMatched(d)) {
      return this._getIsHighlightedVessel(d) ? 22 : 15
    } else {
      if (this.hideUnmatchedPositions) {
        return 0
      }
      return this._getIsHighlightedVessel(d) ? 13 : 10
    }
  }

  _getLabelColor = (d: FourwingsPositionFeature): Color => {
    return [255, 255, 255, this._getIsHighlightedVessel(d) ? 255 : 120]
  }

  _getVesselLabel = (d: FourwingsPositionFeature): string => {
    const label = cleanVesselShipname(d.properties?.shipname)
    return label?.length <= MAX_LABEL_LENGTH ? label : `${label.slice(0, MAX_LABEL_LENGTH)}...`
  }

  _getLatestVesselPositions = (positions: FourwingsPositionFeature[]) => {
    const positionsByVessel = groupBy(positions, (p) => p.properties.id)
    const lastPositions: FourwingsPositionFeature[] = []
    Object.keys(positionsByVessel)
      .filter((p) => p !== 'undefined')
      .forEach((vesselId) => {
        const vesselPositions = positionsByVessel[vesselId]
        lastPositions.push(...vesselPositions.slice(-1))
      })
    return lastPositions
  }

  _onViewportLoad = (tiles: Tile2DHeader[]) => {
    const data = tiles.flatMap((tile) => {
      return tile.content
        ? tile.content.map((feature: any) =>
            transformTileCoordsToWGS84(feature, tile.bbox as GeoBoundingBox, this.context.viewport)
          )
        : []
    })
    const positions = orderBy(data, ['properties.htime'], ['asc']).filter(Boolean)

    const positionsInViewport = filteredPositionsByViewport(positions, this.context.viewport)
    const lastPositions = this._getLatestVesselPositions(positionsInViewport)
    const colorScale = this._getColorRamp(positions)

    requestAnimationFrame(() => {
      this.setState({
        viewportLoaded: true,
        positions,
        lastPositions,
        colorScale,
      } as FourwingsPositionsTileLayerState)
    })
    if (this.props.onViewportLoad) {
      return this.props.onViewportLoad(tiles)
    }
  }

  _fetch = async (
    url: string,
    {
      signal,
      layer,
      loadOptions,
    }: {
      layer: Layer
      signal?: AbortSignal
      loadOptions?: any
    }
  ) => {
    this.setState({ viewportLoaded: false })
    try {
      const response = await GFWAPI.fetch<any>(url, {
        signal,
        method: 'GET',
        responseType: 'arrayBuffer',
      })
      return await parse(response, GFWMVTLoader, loadOptions)
    } catch (error: any) {
      if ((error as ParsedAPIError).status === 404) {
        return null
      } else if (
        (error as ParsedAPIError).status === 422 &&
        (error as ParsedAPIError).message?.includes('Maximum points exceeded by tile') &&
        this.props.onPositionsMaxPointsError
      ) {
        const totalNumber = parseInt(error.message.match(/Total (\d+)/)?.[1])
        this.props.onPositionsMaxPointsError(layer.root as FourwingsLayer, totalNumber)
      }
      throw error
    }
  }

  _getPositionProperties() {
    return this.props.sublayers.map((s) => {
      return s.positionProperties?.filter((p) => SUPPORTED_POSITION_PROPERTIES.includes(p))
    })
  }

  _getDataUrl() {
    const { startTime, endTime, sublayers, extentStart, extentEnd } = this.props
    const supportedPositionProperties = this._getPositionProperties()
    const start = extentStart && extentStart > startTime ? extentStart : startTime
    const end = extentEnd && extentEnd < endTime ? extentEnd : endTime

    const params = {
      datasets: sublayers.map((sublayer) => sublayer.datasets.join(',')),
      filters: sublayers.map((sublayer) => sublayer.filter),
      format: 'MVT',
      'max-points': MAX_POSITIONS_PER_TILE_SUPPORTED,
      ...(supportedPositionProperties?.length && {
        properties: supportedPositionProperties.map((sublayerProperties) =>
          sublayerProperties?.join(',')
        ),
      }),
      // TODO:deck make chunks here to filter in the frontend instead of requesting on every change
      'date-range': `${getISODateFromTS(start < end ? start : end)},${getISODateFromTS(end)}`,
    }

    const baseUrl = GFWAPI.generateUrl(this.props.tilesUrl as string, { absolute: true })
    return `${baseUrl}?${stringify(params)}`
  }

  renderLayers(): Layer<{}> | LayersList | null {
    if (this.state.fontLoaded) {
      const { sublayers } = this.props
      const { positions, lastPositions, highlightedFeatureIds, highlightedVesselIds } = this.state
      const IconLayerClass = this.getSubLayerClass('icons', IconLayer)
      this.hideUnmatchedPositions = sublayers.some((sublayer) =>
        sublayer.filter?.includes(MATCHED_POSITIONS_FILTER)
      )

      return [
        new MVTLayer(this.props, {
          id: `${this.props.id}-tiles`,
          data: this._getDataUrl(),
          maxZoom: POSITIONS_VISUALIZATION_MAX_ZOOM,
          binary: false,
          loaders: [GFWMVTLoader],
          fetch: this._fetch,
          onViewportLoad: this._onViewportLoad,
          renderSubLayers: () => null,
        }),
        new IconLayerClass(this.props, {
          id: `${this.props.id}-allPositions`,
          data: positions,
          iconAtlas: `${PATH_BASENAME}/vessel-sprite.png`,
          iconMapping: VESSEL_SPRITE_ICON_MAPPING,
          getIcon: (d: any) => (getIsPositionMatched(d) ? 'vessel' : 'circle'),
          getPosition: (d: any) => d.geometry.coordinates,
          getColor: this._getFillColor,
          getSize: this._getIconSize,
          getAngle: (d: any) => (d.properties.bearing ? 360 - d.properties.bearing : 0),
          getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Point, params),
          pickable: true,
          getPickingInfo: this.getPickingInfo,
          updateTriggers: {
            getColor: [sublayers],
            getSize: [highlightedFeatureIds, highlightedVesselIds],
          },
        }),
        new IconLayerClass(this.props, {
          id: `${this.props.id}-allPositionsHighlight`,
          data: positions,
          iconAtlas: `${PATH_BASENAME}/vessel-sprite.png`,
          iconMapping: VESSEL_SPRITE_ICON_MAPPING,
          getIcon: (d: any) => (getIsPositionMatched(d) ? 'vesselHighlight' : 'circle'),
          getPosition: (d: any) => d.geometry.coordinates,
          getColor: this._getHighlightColor,
          getSize: this._getIconSize,
          getAngle: (d: any) => (d.properties.bearing ? 360 - d.properties.bearing : 0),
          getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Point, params),
          getPickingInfo: this.getPickingInfo,
          updateTriggers: {
            getColor: [highlightedFeatureIds, highlightedVesselIds],
            getSize: [highlightedFeatureIds, highlightedVesselIds],
          },
        }),
        ...(lastPositions?.length < 100
          ? [
              new TextLayer({
                id: `${this.props.id}-lastPositionsNames`,
                data: lastPositions,
                getText: this._getVesselLabel,
                getPosition: (d) => d.geometry.coordinates,
                getPixelOffset: [15, 0],
                getColor: this._getLabelColor,
                getSize: 14,
                outlineColor: hexToDeckColor(BLEND_BACKGROUND),
                getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Label, params),
                fontFamily: 'Roboto Deck',
                characterSet:
                  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789áàâãåäçèéêëìíîïñòóôöõøùúûüýÿÁÀÂÃÅÄÇÈÉÊËÌÍÎÏÑÒÓÔÖÕØÙÚÛÜÝŸÑæÆ -./|',
                outlineWidth: 200,
                fontSettings: { sdf: true, smoothing: 0.2 },
                sizeUnits: 'pixels',
                getTextAnchor: 'start',
                getAlignmentBaseline: 'center',
                pickable: true,
                getPickingInfo: this.getPickingInfo,
                updateTriggers: {
                  getColor: [highlightedFeatureIds, highlightedVesselIds],
                },
              }),
            ]
          : []),
      ]
    }
    return null
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
    return {
      colorDomain: this.state.colorScale?.colorDomain,
      colorRange: this.state.colorScale?.colorRange.map(
        (sublayer) => sublayer as FourwingsColorObject[]
      ),
    }
  }

  getFourwingsLayers() {
    return this.props.sublayers
  }

  getTimeseries() {
    return this.getViewportData()
  }

  setHighlightedVessel(vessels: string | string[] | undefined) {
    if (vessels) {
      const highlightedVesselIds = new Set<string>(Array.isArray(vessels) ? vessels : [vessels])
      this.setState({ highlightedVesselIds })
    } else {
      this.setState({ highlightedVesselIds: new Set<string>() })
    }
  }
}
