import { CompositeLayer, DefaultProps, Layer, LayerProps } from '@deck.gl/core'
import { PathLayer, PathLayerProps } from '@deck.gl/layers'
import { parse } from '@loaders.gl/core'
import { UserTrackLoader } from '@globalfishingwatch/deck-loaders'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { DEFAULT_HIGHLIGHT_COLOR_VEC } from '../vessel/vessel.config'
import { hexToDeckColor } from '../../utils'
import { UserTrackLayerProps } from './user.types'

type _UserTrackLayerProps<DataT = any> = UserTrackLayerProps & PathLayerProps<DataT>
const defaultProps: DefaultProps<_UserTrackLayerProps> = {
  _pathType: 'open',
  idProperty: 'gfw_id',
  valueProperties: [],
  loaders: [UserTrackLoader],
  endTime: { type: 'number', value: 0, min: 0 },
  startTime: { type: 'number', value: 0, min: 0 },
  highlightStartTime: { type: 'number', value: 0, min: 0 },
  highlightEndTime: { type: 'number', value: 0, min: 0 },
  getPath: { type: 'accessor', value: (d) => d },
  getTimestamp: { type: 'accessor', value: (d) => d },
}

export class UserTracksPathLayer<DataT = any, ExtraProps = {}> extends PathLayer<
  DataT,
  _UserTrackLayerProps<DataT> & ExtraProps
> {
  static layerName = 'UserTracksLayer'
  static defaultProps = defaultProps

  getShaders() {
    const shaders = super.getShaders()
    shaders.inject = {
      'vs:#decl': `
        uniform float highlightStartTime;
        uniform float highlightEndTime;
        in float instanceTimestamps;
        out float vTime;
      `,
      // Timestamp of the vertex
      'vs:#main-end': `
        vTime = instanceTimestamps;
        if(vTime > highlightStartTime && vTime < highlightEndTime) {
          gl_Position.z = 1.0;
        }
      `,
      'fs:#decl': `
        uniform float startTime;
        uniform float endTime;
        uniform float highlightStartTime;
        uniform float highlightEndTime;
        in float vTime;
      `,
      // Drop the segments outside of the time window
      'fs:#main-start': `
        if(vTime < startTime || vTime > endTime) {
          discard;
        }
      `,
      'fs:DECKGL_FILTER_COLOR': `
        if (vTime > highlightStartTime && vTime < highlightEndTime) {
          // color = vHighlightColor;
          color = vec4(${DEFAULT_HIGHLIGHT_COLOR_VEC.join(',')});
        }
      `,
    }
    return shaders
  }

  initializeState() {
    super.initializeState()
    const attributeManager = this.getAttributeManager()
    if (attributeManager) {
      attributeManager.addInstanced({
        timestamps: {
          size: 1,
          accessor: 'getTimestamp',
          shaderAttributes: {
            instanceTimestamps: {},
          },
        },
      })
    }
  }

  draw(params: any) {
    const {
      startTime,
      endTime,
      highlightStartTime = 0,
      highlightEndTime = 0,
      highlightColor,
    } = this.props

    params.uniforms = {
      ...params.uniforms,
      startTime,
      endTime,
      highlightStartTime,
      highlightEndTime,
      highlightColor,
    }
    super.draw(params)
  }
}

export class UserTracksLayer extends CompositeLayer<LayerProps & UserTrackLayerProps> {
  static layerName = 'UserTracksLayer'
  static defaultProps = defaultProps

  // _getFilterExtensionProps() {
  //   const { filters } = this.props

  //   if (!filters || !Object.keys(filters).length) {
  //     return {
  //       getFilterValue: (d) => d,
  //       getFilterCategory: (d) => d,
  //     }
  //   }
  //   const filtersByType = Object.entries(filters).reduce(
  //     (acc, [key, value]) => {
  //       if (!value) {
  //         return acc
  //       }
  //       if (Array.isArray(value) && value.length === 2 && value.every((v) => v && isNumeric(v))) {
  //         acc.numeric[key] = value.map((v) => parseFloat(v))
  //       } else {
  //         acc.category[key] = value
  //       }
  //       return acc
  //     },
  //     { numeric: {} as TrackPointProperties, category: {} as TrackPointProperties }
  //   )
  //   const numericFiltersLength = Object.keys(filtersByType.numeric).length
  //   const hasNumericFilters = numericFiltersLength > 0
  //   const numericFilterRanges = hasNumericFilters ? Object.values(filtersByType?.numeric) : []
  //   const categoryFiltersLength = Object.keys(filtersByType.category).length
  //   const hasCategoryFilters = categoryFiltersLength > 0
  //   const categoryFilterRanges = hasCategoryFilters ? Object.values(filtersByType?.category) : []
  //   return {
  //     getFilterValue: (d) =>
  //       Object.keys(filtersByType.numeric).map((key: any) => d?.properties[key]),
  //     filterRange: numericFiltersLength === 1 ? numericFilterRanges[0] : numericFilterRanges,
  //     getFilterCategory: (d) =>
  //       Object.keys(filtersByType.category).map((key: any) => d?.properties[key]),
  //     filterCategories:
  //       categoryFiltersLength === 1 ? categoryFilterRanges[0] : categoryFilterRanges,
  //     extensions: [
  //       new DataFilterExtension({
  //         filterSize: hasNumericFilters
  //           ? (Object.keys(filtersByType.numeric || {}).length as any)
  //           : 0,
  //         categorySize: hasCategoryFilters
  //           ? (Object.keys(filtersByType.category || {}).length as any)
  //           : 0,
  //       }),
  //     ],
  //   }
  // }

  _fetch = async (
    url: string,
    {
      signal,
      loadOptions,
    }: {
      layer: Layer
      signal?: AbortSignal
      loaders: any[]
      loadOptions?: any
    }
  ) => {
    const { filters } = this.props
    const urlObject = new URL(url)
    urlObject.searchParams.delete('filters')
    const response = await GFWAPI.fetch<any>(urlObject.toString(), {
      signal,
      method: 'GET',
      responseType: 'arrayBuffer',
    })

    const userTracksLoadOptions = {
      ...loadOptions,
      userTracks: {
        filters,
      },
    }
    return await parse(response, UserTrackLoader, userTracksLoadOptions)
  }

  renderLayers() {
    const { layers, startTimeProperty, color, filters } = this.props

    // const filterExtension = this._getFilterExtensionProps()
    return layers.map((layer) => {
      const tilesUrl = new URL(layer.tilesUrl)
      tilesUrl.searchParams.set('filters', Object.values(filters || {}).join(','))
      return new UserTracksPathLayer<any>({
        ...(this.props as any),
        id: layer.id,
        data: tilesUrl.toString(),
        loaders: [UserTrackLoader],
        _pathType: 'open',
        fetch: this._fetch,
        widthUnits: 'pixels',
        widthScale: 1,
        wrapLongitude: true,
        jointRounded: true,
        capRounded: true,
        widthMinPixels: 1,
        width: 1,
        // getPath: (d: any) => d.coordinates,
        getColor: hexToDeckColor(color),
        loadOptions: {
          userTracks: {
            timestampProperty: startTimeProperty,
            filters,
          },
        },
      })
    })
  }
}
