import type { Loader, LoaderWithParser } from '@loaders.gl/loader-utils'
import packageJson from '../../package.json'
import { parseTrack } from './lib/parse-tracks'
import { VesselTrackLoaderOptions } from './lib/types'

/**
 * Worker loader for the Vessel Track tile format
 */
export const VesselTrackWorkerLoader: Loader<any, never, VesselTrackLoaderOptions> = {
  id: 'vessel-tracks',
  name: 'gfw-vessel-tracks',
  module: 'tracks',
  category: 'geometry',
  version: packageJson?.version,
  extensions: ['parquet'],
  mimeTypes: ['application/x-parquet'],
  worker: true,
  options: {
    tracks: {
      format: 'PARQUET' as const,
    },
  },
}

/**
 * Loader for the Vessel Track tile format
 */
export const VesselTrackLoader: LoaderWithParser = {
  ...VesselTrackWorkerLoader,
  parse: async (arrayBuffer, options?: VesselTrackLoaderOptions) => parseTrack(arrayBuffer),
  parseSync: parseTrack,
  binary: true,
}
