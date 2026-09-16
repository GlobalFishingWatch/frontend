import type {
  Color,
  DefaultProps,
  Layer,
  LayerContext,
  LayersList,
  PickingInfo,
  UpdateParameters,
} from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import type {
  _Tile2DHeader as Tile2DHeader,
  GeoBoundingBox,
  MVTLayerProps,
} from '@deck.gl/geo-layers'
import { MVTLayer } from '@deck.gl/geo-layers'
import { PathLayer } from '@deck.gl/layers'
import { parse } from '@loaders.gl/core'
import { DateTime } from 'luxon'
import { stringify } from 'qs'
import { mean, sample, standardDeviation } from 'simple-statistics'

import type { ParsedAPIError } from '@globalfishingwatch/api-client'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { getVesselIdentifierType } from '@globalfishingwatch/data-transforms'
import type { FourwingsPositionFeature } from '@globalfishingwatch/deck-loaders'

import { BLEND_BACKGROUND } from '#config/colorRamps.config'
import { COLOR_TRANSPARENT } from '#config/colors.config'
import { PATH_BASENAME } from '#config/layers.config'
import { LayerGroup } from '#config/sort.config'
import { GFWMVTLoader } from '#layers/_shared/api'
import { transformTileCoordsToWGS84 } from '#layers/_shared/tiles.utils'
import {
  MAX_POSITIONS_PER_TILE_SUPPORTED,
  POSITIONS_API_TILES_URL,
  POSITIONS_CIRCLE_SIZE,
  POSITIONS_DIMMED_OPACITY,
  POSITIONS_HIGHLIGHT_CIRCLE_OFFSET,
  POSITIONS_HIGHLIGHT_ICON_OFFSET,
  POSITIONS_HIGHLIGHT_OPACITY,
  POSITIONS_ICON_SIZE,
  POSITIONS_TRACK_HIGHLIGHT_OPACITY,
  POSITIONS_TRACK_OPACITY,
  POSITIONS_TRAIL_CIRCLE_SIZE,
  POSITIONS_TRAIL_ICON_SIZE,
  POSITIONS_VISUALIZATION_MAX_ZOOM,
  SUPPORTED_POSITION_PROPERTIES,
} from '#layers/fourwings/fourwings.config'
import { getSteps } from '#layers/fourwings/fourwings.stats'
import type {
  FourwingsColorObject,
  FourwingsTileLayerColorScale,
} from '#layers/fourwings/fourwings.types'
import type { FourwingsLayer } from '#layers/fourwings/FourwingsLayer'
import { getTimeResolved } from '#layers/fourwings/heatmap/fourwings-heatmap.utils'
import { LabelLayer } from '#layers/labels/LabelLayer'
import { getColorRamp, getLayerGroupOffset, VESSEL_SPRITE_ICON_MAPPING } from '#utils'
import { hexToDeckColor } from '#utils/colors'

import type {
  FourwingsPositionsPickingInfo,
  FourwingsPositionsPickingObject,
  FourwingsPositionsTileLayerProps,
} from './fourwings-positions.types'
import type { FourwingsPositionsVesselTrack } from './fourwings-positions.utils'
import {
  cleanVesselShipname,
  filteredPositionsByViewport,
  getIsActivityPositionMatched,
  getIsDetectionsPositionMatched,
  getIsFeatureInFilterIds,
  getIsIdInFilterIds,
  getPositionBearing,
  getVesselTracks,
} from './fourwings-positions.utils'
import { FourwingsPositionsIconLayer } from './FourwingsPositionsIconLayer'

type FourwingsPositionsTileLayerState = {
  error: string
  viewportDirty: boolean
  viewportLoaded: boolean
  lastViewport: string
  positions: FourwingsPositionFeature[]
  lastPositions: FourwingsPositionFeature[]
  lastPositionsData: FourwingsPositionFeature[]
  vesselTracks: FourwingsPositionsVesselTrack[]
  lastPositionFeatures: Set<FourwingsPositionFeature>
  colorScale?: FourwingsTileLayerColorScale
  highlightedVesselIds: Set<string>
  highlightedFeatureIds: Set<string>
}

const defaultProps: DefaultProps<FourwingsPositionsTileLayerProps> = {
  tilesUrl: POSITIONS_API_TILES_URL,
}

const MAX_LABEL_LENGTH = 20

/** Same tiles, in the same order, still holding the same parsed content objects */
function hasSameTileContents(tiles: Tile2DHeader[], contents: unknown[]): boolean {
  return tiles.length === contents.length && tiles.every((tile, i) => tile.content === contents[i])
}

export class FourwingsPositionsTileLayer extends CompositeLayer<
  FourwingsPositionsTileLayerProps & MVTLayerProps
> {
  static layerName = 'FourwingsPositionsTileLayer'
  static defaultProps = defaultProps
  declare state: FourwingsPositionsTileLayerState
  viewportDirtyTimeout!: NodeJS.Timeout
  /**
   * Avoid unnecessary state updates when the tileset frame did not change.
   */
  lastTileContents: unknown[] = []

  get cacheHash(): string {
    if (!this.state) {
      return ''
    }
    return `${this.state?.viewportDirty}|${this.viewportLoaded}`
  }

  get positions() {
    const filterIds = this.props.sublayers.flatMap((sublayer) => sublayer.filterIds || [])
    return filterIds.length
      ? this.state.positions.filter((p: FourwingsPositionFeature) =>
          filterIds.includes(p.properties.id as string)
        )
      : this.state.positions
  }

  get debounceTime(): number {
    return this.props.debounceTime || 0
  }

  get viewportLoaded(): boolean {
    return this.state?.viewportLoaded ?? false
  }

  get dimOpacity(): number {
    return this._hasHighlightedVessels() ? POSITIONS_DIMMED_OPACITY : 1
  }

  get timestampBase(): number {
    return Math.floor((this.props.startTime ?? 0) / 1000)
  }

  /** Highlighted time range in rebased seconds. Both 0 when unset, which disables it in the shader */
  get highlightTimeRange(): { highlightTimeStart: number; highlightTimeEnd: number } {
    const { highlightStartTime, highlightEndTime } = this.props
    if (!highlightStartTime || !highlightEndTime) {
      return { highlightTimeStart: 0, highlightTimeEnd: 0 }
    }
    const base = this.timestampBase
    return {
      highlightTimeStart: highlightStartTime / 1000 - base,
      highlightTimeEnd: highlightEndTime / 1000 - base,
    }
  }

  getError(): string {
    return this.state?.error
  }

  _onLayerError = (error: Error) => {
    console.warn(error.message)
    this.setState({ error: error.message })
    return true
  }

  initializeState(context: LayerContext) {
    super.initializeState(context)
    this.state = {
      error: '',
      viewportDirty: false,
      viewportLoaded: false,
      lastViewport: '',
      positions: [],
      lastPositions: [],
      lastPositionsData: [],
      vesselTracks: [],
      lastPositionFeatures: new Set<FourwingsPositionFeature>(),
      highlightedFeatureIds: new Set<string>(),
      highlightedVesselIds: new Set<string>(),
    }
  }

  getIsPositionMatched = (f: FourwingsPositionFeature) => {
    return this.props.category === 'activity'
      ? getIsActivityPositionMatched(f)
      : getIsDetectionsPositionMatched(f)
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
      this.setState({ lastPositions: this._getLastPositionsInViewport() })
    }
    if (
      props.sublayers?.map(({ colorRamp }) => colorRamp).join(',') !==
      oldProps.sublayers?.map(({ colorRamp }) => colorRamp).join(',')
    ) {
      if (this.state.colorScale?.colorDomain?.length) {
        const colorRange = this.props.sublayers?.map((sublayer) =>
          getColorRamp({ rampId: sublayer.colorRamp as any })
        )
        this.setState({ colorScale: { ...this.state.colorScale, colorRange } })
      } else {
        // this.positions rescans every position, so only pay for it on the branch that needs it
        this.setState({ colorScale: this._getColorRamp(this.positions) })
      }
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
      id: (info.object?.id || info.object?.properties?.id)?.toString() || '',
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

  getLayerInstance() {
    const layer = this.getSubLayers()[0] as MVTLayer
    return layer
  }

  _getColorRamp(positions: FourwingsPositionFeature[]) {
    if (positions?.length > 0) {
      const hours: number[] = []
      for (const position of positions) {
        const value = position?.properties?.value
        if (value) {
          hours.push(value)
        }
      }
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

    if (!getIsFeatureInFilterIds(d, this.props.sublayers[d.properties.layer]?.filterIds)) {
      return COLOR_TRANSPARENT
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

  _getIsHighlighted = (d: FourwingsPositionFeature): number => {
    return this._getIsHighlightedVessel(d) ? 1 : 0
  }

  _getStime = (d: FourwingsPositionFeature): number => {
    return d.properties.stime - this.timestampBase
  }
  _getIsHighlightedVessel(d: FourwingsPositionFeature) {
    if (!getIsFeatureInFilterIds(d, this.props.sublayers[d.properties.layer]?.filterIds)) {
      return false
    }
    return (
      this.state.highlightedVesselIds.has(d.properties?.id) ||
      this.state.highlightedFeatureIds.has(d.properties?.id)
    )
  }

  _getHighlightColor = (d: FourwingsPositionFeature): Color => {
    if (!getIsFeatureInFilterIds(d, this.props.sublayers[d.properties.layer]?.filterIds)) {
      return COLOR_TRANSPARENT
    }
    // constant on purpose: the layer is passed dimOpacity 0, so the shader keeps this alpha only
    // for the highlighted vessel or the highlighted time range and zeroes everything else
    return [255, 255, 255, POSITIONS_HIGHLIGHT_OPACITY * 255]
  }

  _isTrailPosition = (d: FourwingsPositionFeature) => {
    return this.showVesselTracks && !!d.properties.id && !this.state.lastPositionFeatures.has(d)
  }

  _getIconSize = (d: FourwingsPositionFeature): number => {
    if (!getIsFeatureInFilterIds(d, this.props.sublayers[d.properties.layer]?.filterIds)) {
      return 0
    }
    const canShowVesselIcon = this._canShowVesselIcon(d)
    if (this._isTrailPosition(d)) {
      return canShowVesselIcon ? POSITIONS_TRAIL_ICON_SIZE : POSITIONS_TRAIL_CIRCLE_SIZE
    }
    return canShowVesselIcon ? POSITIONS_ICON_SIZE : POSITIONS_CIRCLE_SIZE
  }

  _getHighlightedIconSize = (d: FourwingsPositionFeature): number => {
    if (this._isTrailPosition(d)) {
      return 0
    }
    const size = this._getIconSize(d)
    if (!size) {
      return 0
    }
    return (
      size +
      (this._canShowVesselIcon(d)
        ? POSITIONS_HIGHLIGHT_ICON_OFFSET
        : POSITIONS_HIGHLIGHT_CIRCLE_OFFSET)
    )
  }

  _canShowVesselIcon = (d: FourwingsPositionFeature) => {
    return this.getIsPositionMatched(d) || getPositionBearing(d) !== undefined
  }

  _getLabelColor = (d: FourwingsPositionFeature): Color => {
    if (!getIsFeatureInFilterIds(d, this.props.sublayers[d.properties.layer]?.filterIds)) {
      return COLOR_TRANSPARENT
    }

    return [255, 255, 255, this._getIsHighlightedVessel(d) ? 255 : 120]
  }

  _getVesselLabel = (d: FourwingsPositionFeature): string => {
    if (!getIsFeatureInFilterIds(d, this.props.sublayers[d.properties.layer]?.filterIds)) {
      return ''
    }
    if (this._hasHighlightedVessels() && !this._getIsHighlightedVessel(d)) {
      return ''
    }

    const { shipname, id } = d.properties || {}
    const label =
      shipname && shipname !== 'null'
        ? cleanVesselShipname(shipname)
        : getVesselIdentifierType(id) === 'ssvid'
          ? id
          : ''
    return label.length <= MAX_LABEL_LENGTH ? label : `${label.slice(0, MAX_LABEL_LENGTH)}...`
  }

  get showVesselTracks(): boolean {
    return this.props.category === 'activity'
  }

  _getLastPositionsInViewport = (
    lastPositionFeatures = this.state.lastPositionFeatures
  ): FourwingsPositionFeature[] => {
    return filteredPositionsByViewport(lastPositionFeatures, this.context.viewport)
  }

  _getIsHighlightedTrack = (d: FourwingsPositionsVesselTrack) => {
    return this.state.highlightedVesselIds.has(d.id) || this.state.highlightedFeatureIds.has(d.id)
  }

  _getTrackColor = (d: FourwingsPositionsVesselTrack): Color => {
    const sublayer = this.props.sublayers[d.layer]
    if (!getIsIdInFilterIds(d.id, sublayer?.filterIds)) {
      return COLOR_TRANSPARENT
    }
    const isHighlighted = this._getIsHighlightedTrack(d)
    const opacity = isHighlighted ? POSITIONS_TRACK_HIGHLIGHT_OPACITY : POSITIONS_TRACK_OPACITY
    return hexToDeckColor(
      sublayer?.color as string,
      isHighlighted ? opacity : opacity * this.dimOpacity
    )
  }

  _onViewportLoad = (tiles: Tile2DHeader[]) => {
    if (hasSameTileContents(tiles, this.lastTileContents)) {
      if (!this.state.viewportLoaded) {
        this.setState({ viewportLoaded: true })
      }
      return this.props.onViewportLoad?.(tiles)
    }

    this.lastTileContents = tiles.map((tile) => tile.content)

    const data = tiles.flatMap((tile) => {
      return tile.content
        ? tile.content.map((feature: any) =>
            transformTileCoordsToWGS84(feature, tile.bbox as GeoBoundingBox, this.context.viewport)
          )
        : []
    })
    // sorted in place with a numeric comparator: getVesselTracks relies on this order instead of
    // re-sorting every vessel group, and the icons draw newest last
    const positions: FourwingsPositionFeature[] = data.filter(Boolean)
    positions.sort((a, b) => a.properties.stime - b.properties.stime)

    const { tracks, lastPositions: lastPositionFeatures } = getVesselTracks(positions, {
      includeTracks: this.showVesselTracks,
    })
    const lastPositions = this._getLastPositionsInViewport(lastPositionFeatures)
    const colorScale = this._getColorRamp(positions)

    requestAnimationFrame(() => {
      this.setState({
        viewportLoaded: true,
        positions,
        lastPositions,
        lastPositionFeatures,
        // materialized once: spreading the set inside renderLayers gave the icon layers a new data
        // identity on every render, re-tesselating all three of them on each hover
        lastPositionsData: this.showVesselTracks ? [...lastPositionFeatures] : [],
        vesselTracks: tracks,
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
      return s.positionProperties?.filter((p) => {
        return SUPPORTED_POSITION_PROPERTIES.includes(p)
      })
    })
  }

  _getDataUrl() {
    const {
      startTime,
      endTime,
      sublayers,
      extentStart,
      extentEnd,
      intervalCacheMode = 'DATE',
      maxPositionsPerTile = MAX_POSITIONS_PER_TILE_SUPPORTED,
    } = this.props
    const supportedPositionProperties = this._getPositionProperties()

    const vesselGroups = sublayers.flatMap((sublayer) => {
      if (!sublayer.vesselGroups) {
        return []
      }
      return Array.isArray(sublayer.vesselGroups) ? sublayer.vesselGroups[0] : sublayer.vesselGroups
    })
    const start = extentStart && extentStart > startTime ? extentStart : startTime
    const end =
      extentEnd && extentEnd < endTime
        ? DateTime.fromMillis(extentEnd).plus({ day: 1 }).toMillis()
        : endTime
    const startIso = getTimeResolved(start < end ? start : end, intervalCacheMode, 'hour')
    const endIso = getTimeResolved(end, intervalCacheMode, 'hour')
    const params = {
      datasets: sublayers.map((sublayer) => sublayer.datasets.join(',')),
      filters: sublayers.map((sublayer) => sublayer.filter),
      format: 'MVT',
      ...(vesselGroups?.length && { 'vessel-groups': vesselGroups }),
      'max-points': maxPositionsPerTile,
      ...(supportedPositionProperties?.length && {
        properties: supportedPositionProperties.map((sublayerProperties) =>
          sublayerProperties?.join(',')
        ),
      }),
      'date-range': `${startIso},${endIso}`,
    }

    const baseUrl = GFWAPI.generateUrl(this.props.tilesUrl as string, { absolute: true })
    return `${baseUrl}?${stringify(params)}`
  }

  renderLayers(): Layer<Record<string, unknown>> | LayersList | null {
    const { sublayers } = this.props
    const {
      positions,
      lastPositions,
      lastPositionsData,
      lastPositionFeatures,
      vesselTracks,
      highlightedFeatureIds,
      highlightedVesselIds,
    } = this.state
    const IconLayerClass = this.getSubLayerClass('icons', FourwingsPositionsIconLayer)
    const getIconAngle = (d: FourwingsPositionFeature) => {
      const bearing = getPositionBearing(d)
      return bearing ? 360 - bearing : 0
    }
    return [
      new MVTLayer(this.props, {
        id: `${this.props.id}-tiles`,
        data: this._getDataUrl(),
        maxZoom: POSITIONS_VISUALIZATION_MAX_ZOOM,
        binary: false,
        loaders: [GFWMVTLoader],
        fetch: this._fetch,
        onTileError: this._onLayerError,
        onViewportLoad: this._onViewportLoad,
        renderSubLayers: () => null,
      }),
      ...(vesselTracks.length
        ? [
            new PathLayer<FourwingsPositionsVesselTrack>(
              this.props,
              this.getSubLayerProps({
                id: 'tracks',
                data: vesselTracks,
                getPath: (d: FourwingsPositionsVesselTrack) => d.path,
                // paths are flat [lon, lat, …] arrays, which also skips deck's re-flattening pass
                positionFormat: 'XY',
                getColor: this._getTrackColor,
                getWidth: 1,
                widthUnits: 'pixels',
                widthMinPixels: 1,
                capRounded: true,
                jointRounded: true,
                wrapLongitude: true,
                pickable: false,
                _pathType: 'open',
                getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Track, params),
                updateTriggers: {
                  getColor: [sublayers, highlightedFeatureIds, highlightedVesselIds],
                },
              })
            ),
          ]
        : []),
      new IconLayerClass(this.props, {
        id: `${this.props.id}-allPositions`,
        data: positions,
        iconAtlas: `${PATH_BASENAME}vessel-sprite.png`,
        iconMapping: VESSEL_SPRITE_ICON_MAPPING,
        getIcon: (d: any) => (this._canShowVesselIcon(d) ? 'vessel' : 'circle'),
        getPosition: (d: any) => d.geometry.coordinates,
        getColor: this._getFillColor,
        getHighlighted: this._getIsHighlighted,
        dimOpacity: this.dimOpacity,
        getSize: this._getIconSize,
        getAngle: getIconAngle,
        getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Point, params),
        pickable: true,
        getPickingInfo: this.getPickingInfo,
        updateTriggers: {
          getColor: [sublayers],
          getSize: [sublayers, lastPositionFeatures],
          getHighlighted: [highlightedFeatureIds, highlightedVesselIds],
        },
      }),
      ...(lastPositionsData.length
        ? [
            new IconLayerClass(this.props, {
              id: `${this.props.id}-lastPositionsBackground`,
              data: lastPositionsData,
              iconAtlas: `${PATH_BASENAME}vessel-sprite.png`,
              iconMapping: VESSEL_SPRITE_ICON_MAPPING,
              getIcon: (d: any) => (this._canShowVesselIcon(d) ? 'vessel' : 'circle'),
              getPosition: (d: any) => d.geometry.coordinates,
              getColor: (d: any) =>
                getIsFeatureInFilterIds(d, sublayers[d.properties.layer]?.filterIds)
                  ? hexToDeckColor(BLEND_BACKGROUND)
                  : COLOR_TRANSPARENT,
              getHighlighted: this._getIsHighlighted,
              dimOpacity: this.dimOpacity,
              getSize: this._getIconSize,
              getAngle: getIconAngle,
              getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Point, params),
              updateTriggers: {
                getColor: [sublayers],
                getSize: [sublayers, lastPositionFeatures],
                getHighlighted: [highlightedFeatureIds, highlightedVesselIds],
              },
            }),
            new IconLayerClass(this.props, {
              id: `${this.props.id}-lastPositionsFill`,
              data: lastPositionsData,
              iconAtlas: `${PATH_BASENAME}vessel-sprite.png`,
              iconMapping: VESSEL_SPRITE_ICON_MAPPING,
              getIcon: (d: any) => (this._canShowVesselIcon(d) ? 'vessel' : 'circle'),
              getPosition: (d: any) => d.geometry.coordinates,
              getColor: this._getFillColor,
              getHighlighted: this._getIsHighlighted,
              dimOpacity: this.dimOpacity,
              getSize: this._getIconSize,
              getAngle: getIconAngle,
              getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Point, params),
              updateTriggers: {
                getColor: [sublayers],
                getSize: [sublayers, lastPositionFeatures],
                getHighlighted: [highlightedFeatureIds, highlightedVesselIds],
              },
            }),
            new IconLayerClass(this.props, {
              id: `${this.props.id}-lastPositionsBorder`,
              data: lastPositionsData,
              iconAtlas: `${PATH_BASENAME}vessel-sprite.png`,
              iconMapping: VESSEL_SPRITE_ICON_MAPPING,
              getIcon: (d: any) => (this._canShowVesselIcon(d) ? 'vesselHighlight' : 'circle'),
              getPosition: (d: any) => d.geometry.coordinates,
              getColor: (d: any) =>
                getIsFeatureInFilterIds(d, sublayers[d.properties.layer]?.filterIds)
                  ? [255, 255, 255, 255]
                  : COLOR_TRANSPARENT,
              getHighlighted: this._getIsHighlighted,
              dimOpacity: this.dimOpacity,
              getSize: this._getIconSize,
              getAngle: getIconAngle,
              getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Point, params),
              updateTriggers: {
                getColor: [sublayers],
                getSize: [sublayers, lastPositionFeatures],
                getHighlighted: [highlightedFeatureIds, highlightedVesselIds],
              },
            }),
          ]
        : []),
      new IconLayerClass(this.props, {
        id: `${this.props.id}-allPositionsHighlight`,
        data: positions,
        iconAtlas: `${PATH_BASENAME}vessel-sprite.png`,
        iconMapping: VESSEL_SPRITE_ICON_MAPPING,
        getIcon: (d: any) => (this._canShowVesselIcon(d) ? 'vesselHighlight' : 'circle'),
        getPosition: (d: any) => d.geometry.coordinates,
        getColor: this._getHighlightColor,
        // dimOpacity 0 turns the shared shader into "show only what is highlighted"
        dimOpacity: 0,
        getHighlighted: this._getIsHighlighted,
        getStime: this._getStime,
        ...this.highlightTimeRange,
        getSize: this._getHighlightedIconSize,
        getAngle: getIconAngle,
        getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Point, params),
        updateTriggers: {
          getColor: [sublayers],
          getHighlighted: [highlightedFeatureIds, highlightedVesselIds],
          getStime: [this.timestampBase],
          getSize: [sublayers, lastPositionFeatures],
        },
      }),
      ...(lastPositions?.length < 100
        ? [
            new LabelLayer<FourwingsPositionFeature>({
              id: `${this.props.id}-lastPositionsNames`,
              data: lastPositions,
              getText: this._getVesselLabel,
              getPosition: (d) => d.geometry.coordinates as [number, number, number],
              getColor: this._getLabelColor,
              // LabelLayer defaults to a 50ms getPosition transition, which TextLayer forwards down
              // to the per-character instances. `lastPositions` has no stable index -> vessel
              // mapping between loads, so character n animates from one vessel's glyph to another's
              // while the text swaps instantly: labels smear across the map on every tile load.
              transitions: {},
              pickable: true,
              getPickingInfo: this.getPickingInfo,
              updateTriggers: {
                getColor: [highlightedFeatureIds, highlightedVesselIds],
                getText: [sublayers, highlightedFeatureIds, highlightedVesselIds],
              },
            }),
          ]
        : []),
    ]
  }

  getViewportData = () => {
    return filteredPositionsByViewport(this.positions, this.context.viewport)
  }

  getData() {
    return this.positions
  }

  getColorDomain() {
    return this.state?.colorScale?.colorDomain
  }

  getColorRange() {
    return this.state?.colorScale?.colorRange
  }

  getColorScale() {
    return {
      colorDomain: this.state?.colorScale?.colorDomain,
      colorRange: this.state?.colorScale?.colorRange?.map(
        (sublayer) => sublayer as FourwingsColorObject[]
      ),
    }
  }

  getFourwingsLayers() {
    return this.props.sublayers
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
