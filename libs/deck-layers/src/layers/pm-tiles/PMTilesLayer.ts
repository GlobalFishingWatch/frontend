import type { UpdateParameters } from '@deck.gl/core'
import { TileLayer } from '@deck.gl/geo-layers'
import { createDataSource } from '@loaders.gl/core'
import type { TileSource } from '@loaders.gl/loader-utils'
import { PMTilesSource } from '@loaders.gl/pmtiles'

import type { PMTileLayerProps } from './pm-tiles.types'

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
}
