import type { UpdateParameters } from '@deck.gl/core'
import { TileLayer } from '@deck.gl/geo-layers'
import { MVTLoader } from '@loaders.gl/mvt'
import type { RangeResponse, Source } from 'pmtiles'
import { FetchSource, PMTiles, TileType } from 'pmtiles'

import type { PMTileLayerProps } from './pm-tiles.types'

const IMAGE_MIME_TYPES: Partial<Record<TileType, string>> = {
  [TileType.Png]: 'image/png',
  [TileType.Jpeg]: 'image/jpeg',
  [TileType.Webp]: 'image/webp',
  [TileType.Avif]: 'image/avif',
}

class HeadCachedSource implements Source {
  private source: FetchSource
  private head?: Promise<RangeResponse>

  constructor(url: string) {
    this.source = new FetchSource(url)
  }

  getKey() {
    return this.source.getKey()
  }

  async getBytes(offset: number, length: number, signal?: AbortSignal, etag?: string) {
    // offset 0 is only read on (re)opening the archive, e.g. after an etag mismatch: refetch
    if (offset === 0) {
      this.head = this.source.getBytes(offset, length, signal, etag)
      return this.head
    }
    const head = await this.head?.catch(() => undefined)
    if (head && offset + length <= head.data.byteLength) {
      return { ...head, data: head.data.slice(offset, offset + length) }
    }
    return this.source.getBytes(offset, length, signal, etag)
  }
}

type PMTilesLayerState = TileLayer['state'] & {
  pmtiles: PMTiles | null
}

export class PMTilesLayer<DataT = any> extends TileLayer<DataT, PMTileLayerProps> {
  static layerName = 'PMTilesLayer'
  declare state: PMTilesLayerState

  // No pmtiles here: deck.gl's first updateState has dataChanged set and creates it.
  // Creating one here too made a second PMTiles instance, doubling header + metadata fetches.
  initializeState() {
    super.initializeState()
    this.setState({ pmtiles: null })
  }

  updateState({ props, changeFlags }: UpdateParameters<this>) {
    super.updateState({ props, changeFlags } as any)

    if (changeFlags.dataChanged && this.props.data) {
      this.setState({ pmtiles: new PMTiles(new HeadCachedSource(this.props.data as string)) })
    }
  }

  async getTileData(tile: any): Promise<any> {
    const { pmtiles } = this.state
    if (!pmtiles) {
      return null
    }
    const { x, y, z } = tile.index
    const [header, response] = await Promise.all([
      pmtiles.getHeader(),
      pmtiles.getZxy(z, x, y, tile.signal),
    ])
    if (!response?.data) {
      return null
    }
    if (header.tileType === TileType.Mvt) {
      return MVTLoader.parse(response.data, {
        mvt: { shape: 'geojson-table', coordinates: 'wgs84', tileIndex: { x, y, z } },
      })
    }
    const type = IMAGE_MIME_TYPES[header.tileType]
    return createImageBitmap(new Blob([response.data], type ? { type } : undefined))
  }
}
