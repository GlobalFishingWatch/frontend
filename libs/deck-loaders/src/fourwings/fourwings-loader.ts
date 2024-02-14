import type { Loader, LoaderWithParser } from '@loaders.gl/loader-utils'
import packageJson from '../../package.json'
import type { FourwingsLoaderOptions, FourwingsOptions } from './lib/types'
import { parseFourwings } from './lib/parse-fourwings'

/**
 * Worker loader for the 4wings tile format
 */
export const FourwingsWorkerLoader: Loader = {
  name: 'fourwings tiles',
  id: 'fourwings',
  module: 'fourwings',
  version: packageJson?.version,
  // Note: ArcGIS uses '.pbf' extension and 'application/octet-stream'
  extensions: ['pbf'],
  mimeTypes: ['application/x-protobuf', 'application/octet-stream', 'application/protobuf'],
  worker: true,
  category: 'geometry',
  options: {
    fourwings: {} as FourwingsOptions,
  } as FourwingsLoaderOptions,
}

/**
 * Loader for the 4wings tile format
 */
export const FourwingsLoader: LoaderWithParser = {
  ...FourwingsWorkerLoader,
  parse: async (arrayBuffer: ArrayBuffer, options = {} as FourwingsLoaderOptions) =>
    parseFourwings(arrayBuffer, options),
  parseSync: async (arrayBuffer: ArrayBuffer, options = {} as FourwingsLoaderOptions) =>
    parseFourwings(arrayBuffer, options),
  binary: true,
}
