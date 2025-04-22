import type { PickingInfo, UpdateParameters } from '@deck.gl/core'
import { TileLayer } from '@deck.gl/geo-layers'
import type { Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'
import { GeoJsonLayer } from '@deck.gl/layers'
import { createDataSource } from '@loaders.gl/core'
import type { TileSource } from '@loaders.gl/loader-utils'
import { PMTilesSource } from '@loaders.gl/pmtiles'
import type { GeoJsonProperties } from 'geojson'

import { getFeatureInFilter, getLayerGroupOffset, hexToDeckColor, LayerGroup } from '../../utils'
import type { ContextFeature } from '../context'
import { getContextId, getContextValue } from '../context/context.utils'

import type { PMTileLayerProps, PMTilePickingInfo, PMTilePickingObject } from './pm-tiles.types'

type PMTilesLayerState = TileLayer['state'] & {
  tileSource: TileSource | null
}

export class PMTilesLayer extends TileLayer<PMTileLayerProps, PMTilesLayerState> {
  static layerName = 'PMTilesLayer'
  state!: PMTilesLayerState

  initializeState() {
    super.initializeState()
    this.state = {
      tileSource: this.props.data ? this.createTileSource(this.props.data as string) : null,
    } as PMTilesLayerState
  }

  getPickingInfo = ({
    info,
  }: {
    info: PickingInfo<ContextFeature, { tile?: Tile2DHeader }>
  }): PMTilePickingInfo => {
    if (!info.object) return { ...info, object: undefined }
    const { idProperty, valueProperties } = this.props
    const object = {
      title: this.props.id,
      color: this.props.color,
      layerId: this.props.id,
      // datasetId: this.props.layers[0].datasetId,
      category: this.props.category,
      id: getContextId(info.object as ContextFeature, idProperty),
      value: getContextValue(info.object as ContextFeature, valueProperties),
    } as PMTilePickingObject
    return {
      ...info,
      object,
      // object: getFeatureInFilter(object, this.props.layers[0].filters) ? object : undefined,
    }
  }

  updateState({ props, changeFlags }: UpdateParameters<this>) {
    super.updateState({ props, changeFlags } as any)

    if (changeFlags.dataChanged) {
      if (this.props.data) {
        const tileSource = this.createTileSource(this.props.data as string)
        this.setState({
          tileSource,
        })
      }
    }
  }

  createTileSource(url: string): TileSource {
    const dataSource = createDataSource(url, [PMTilesSource], {
      type: 'pmtiles',
    })
    return dataSource as unknown as TileSource
  }

  getTileData(tile: any): Promise<any> {
    const { tileSource } = this.state
    if (!tileSource) {
      return Promise.resolve(null)
    }
    return tileSource.getTileData(tile)
  }

  renderSubLayers = (props: any) => {
    return [
      new GeoJsonLayer<GeoJsonProperties, { data: any }>(props, {
        id: `${props.id}-lines`,
        lineWidthUnits: 'pixels',
        lineWidthMinPixels: 0,
        filled: false,
        getPolygonOffset: (params) => getLayerGroupOffset(LayerGroup.OutlinePolygons, params),
        getLineWidth: 10,
        getLineColor: hexToDeckColor(props.color),
        // updateTriggers: {
        //   getLineWidth: [layer.filters, thickness],
        // },
      }),
    ]

    // return [
    //   new GeoJsonLayer<GeoJsonProperties, { data: any }>(mvtSublayerProps, {
    //     id: `${props.id}-highlight-fills`,
    //     stroked: false,
    //     pickable,
    //     getPolygonOffset: (params) =>
    //       getLayerGroupOffset(LayerGroup.OutlinePolygonsBackground, params),
    //     getFillColor: (d) => this.getFillColor(d as ContextFeature, layer.filters),
    //     updateTriggers: {
    //       getFillColor: [highlightedFeatures],
    //     },
    //   }),
    //   ...(layer.id !== ContextLayerId.EEZ && layer.id !== ContextLayerId.EEZBoundaries
    //     ? [
    //         new GeoJsonLayer<GeoJsonProperties, { data: any }>(mvtSublayerProps, {
    //           id: `${props.id}-lines`,
    //           lineWidthUnits: 'pixels',
    //           lineWidthMinPixels: 0,
    //           filled: false,
    //           getPolygonOffset: (params) => getLayerGroupOffset(LayerGroup.OutlinePolygons, params),
    //           getLineWidth: (d) => this.getLineWidth(d as ContextFeature, layer.filters),
    //           getLineColor: hexToDeckColor(color),
    //           updateTriggers: {
    //             getLineWidth: [layer.filters, thickness],
    //           },
    //         }),
    //       ]
    //     : []),
    //   new GeoJsonLayer<GeoJsonProperties, { data: any }>(mvtSublayerProps, {
    //     id: `${props.id}-highlight-lines-bg`,
    //     lineWidthMinPixels: 0,
    //     lineWidthUnits: 'pixels',
    //     filled: false,
    //     lineJointRounded: true,
    //     lineCapRounded: true,
    //     visible: highlightedFeatures && highlightedFeatures?.length > 0,
    //     getPolygonOffset: (params) =>
    //       getLayerGroupOffset(LayerGroup.OutlinePolygonsHighlighted, params),
    //     getLineWidth: (d) => this.getHighlightLineWidth(d as ContextFeature, layer.filters, 4),
    //     getLineColor: DEFAULT_BACKGROUND_COLOR,
    //     updateTriggers: {
    //       getLineWidth: [highlightedFeatures],
    //     },
    //   }),
    //   new GeoJsonLayer<GeoJsonProperties, { data: any }>(mvtSublayerProps, {
    //     id: `${props.id}-highlight-lines-fg`,
    //     lineWidthMinPixels: 0,
    //     lineWidthUnits: 'pixels',
    //     filled: false,
    //     lineJointRounded: true,
    //     lineCapRounded: true,
    //     visible: highlightedFeatures && highlightedFeatures?.length > 0,
    //     getPolygonOffset: (params) =>
    //       getLayerGroupOffset(LayerGroup.OutlinePolygonsHighlighted, params),
    //     getLineWidth: (d) => this.getHighlightLineWidth(d as ContextFeature, layer.filters, 2),
    //     getLineColor: COLOR_HIGHLIGHT_LINE,
    //     updateTriggers: {
    //       getLineWidth: [highlightedFeatures],
    //     },
    //   }),
    // ]
  }
}
