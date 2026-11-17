import type { CompositeLayerProps, DefaultProps } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import { PathStyleExtension } from '@deck.gl/extensions'
import { TileLayer } from '@deck.gl/geo-layers'
import { GeoJsonLayer } from '@deck.gl/layers'

import { COLOR_HIGHLIGHT_LINE } from '#config/colors.config'
import { LayerGroup } from '#config/sort.config'
import { fetchWithGFWAPI, GFWMVTLoader } from '#layers/_shared/api'
import {
  getMVTSublayerProps,
  getPMTilesSublayerProps,
  isPMTilesUrl,
} from '#layers/_shared/tiles.utils'
import { PMTilesLayer } from '#layers/pm-tiles/index'
import { getLayerGroupOffset, hexToDeckColor } from '#utils'

import { EEZ_SETTLED_BOUNDARIES } from './context.config'
import type { ContextFeature, ContextLayerConfig } from './context.types'
import { isEEZBoundaryHighlighted } from './context.utils'

export type EEZBoundariesLayerProps = {
  layer: ContextLayerConfig
  /** Ids of the EEZ areas to highlight, matched against each line's MRGID_EEZ list */
  highlightedIds: string[]
  debounceTime?: number
  maxRequests?: number
}

const defaultProps: DefaultProps<EEZBoundariesLayerProps> = {
  highlightedIds: { type: 'array', value: [], compare: true },
}

const HIGHLIGHT_WIDTH = 2

export class EEZBoundariesLayer extends CompositeLayer<
  EEZBoundariesLayerProps & CompositeLayerProps
> {
  static layerName = 'EEZBoundariesLayer'
  static defaultProps = defaultProps

  renderLayers() {
    const { layer, highlightedIds, debounceTime, maxRequests } = this.props
    const isPMTiles = isPMTilesUrl(layer.tilesUrl)
    const TilesLayer = (isPMTiles ? PMTilesLayer : TileLayer) as typeof TileLayer
    const getSublayerProps = isPMTiles ? getPMTilesSublayerProps : getMVTSublayerProps
    const loaderProps = isPMTiles ? {} : { loaders: [GFWMVTLoader], fetch: fetchWithGFWAPI }
    const highlightedIdsSet = new Set(highlightedIds)
    const highlightedIdsHash = highlightedIds.join(',')
    const hasHighlight = highlightedIdsSet.size > 0
    const sublayersHash = layer.sublayers
      .map((s) => `${s.dataviewId}:${s.color}:${s.thickness}`)
      .join(',')

    return new TilesLayer<ContextFeature>(
      this.getSubLayerProps({
        id: 'tiles',
        data: layer.tilesUrl,
        ...loaderProps,
        debounceTime,
        maxRequests,
        maxZoom: 8,
        pickable: false,
        updateTriggers: {
          renderSubLayers: [sublayersHash, highlightedIdsHash],
        },
        renderSubLayers: (props: any) => {
          const tileProps = { ...props, ...getSublayerProps(props) }
          const extensions = [
            ...tileProps.extensions,
            new PathStyleExtension({ dash: true, highPrecisionDash: true }),
          ]
          return layer.sublayers.flatMap((sublayer) => {
            const thickness = sublayer.thickness ?? 1
            const lineProps = {
              filled: false,
              pointType: '',
              lineWidthUnits: 'pixels',
              lineJointRounded: true,
              lineCapRounded: true,
              extensions,
              dashUnits: 'pixels',
              getDashArray: (d: ContextFeature) =>
                EEZ_SETTLED_BOUNDARIES.includes(d.properties?.LINE_TYPE)
                  ? [0, 0]
                  : [4 * thickness, 4 * thickness],
              updateTriggers: { getDashArray: [thickness] },
            }
            const getHighlightWidth = (d: ContextFeature) =>
              isEEZBoundaryHighlighted(d.properties, highlightedIdsSet)
                ? Math.max(thickness, HIGHLIGHT_WIDTH)
                : 0
            return [
              new GeoJsonLayer(tileProps, {
                ...lineProps,
                id: `${props.id}-${sublayer.dataviewId}-boundaries`,
                lineWidthMinPixels: 1,
                getPolygonOffset: (params: { layerIndex: number }) =>
                  getLayerGroupOffset(LayerGroup.OutlinePolygons, params),
                getLineColor: hexToDeckColor(sublayer.color),
                getLineWidth: thickness,
              } as any),
              new GeoJsonLayer(tileProps, {
                ...lineProps,
                id: `${props.id}-${sublayer.dataviewId}-highlight`,
                visible: hasHighlight,
                lineWidthMinPixels: 0,
                getPolygonOffset: (params: { layerIndex: number }) =>
                  getLayerGroupOffset(LayerGroup.OutlinePolygonsHighlighted, params),
                getLineColor: COLOR_HIGHLIGHT_LINE,
                getLineWidth: getHighlightWidth,
                updateTriggers: {
                  ...lineProps.updateTriggers,
                  getLineWidth: [highlightedIdsHash, thickness],
                },
              } as any),
            ]
          })
        },
      })
    )
  }
}
