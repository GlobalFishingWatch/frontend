import type { Loader, LoaderWithParser } from '@loaders.gl/loader-utils'

import packageJson from '../../package.json'
import { PATH_BASENAME } from '../loaders.config'

import { parseFourwingsClusters } from './lib/parse-fourwings-clusters'
import type { FourwingsClustersLoaderOptions, ParseFourwingsClustersOptions } from './lib/types'

/**
 * Worker loader for the 4wings cluster tile format
 */
export const FourwingsClustersWorkerLoader: Loader = {
  name: 'fourwings cluster tiles',
  id: 'fourwingsClusters',
  module: 'fourwingsClusters',
  version: packageJson?.version,
  extensions: ['pbf'],
  mimeTypes: ['application/x-protobuf', 'application/octet-stream', 'application/protobuf'],
  worker: false,
  category: 'geometry',
  options: {
    fourwingsClusters: {
      workerUrl: `${PATH_BASENAME}/workers/fourwings-clusters-worker.js`,
      cols: 113,
      rows: 53,
      scale: 1,
      offset: 0,
      noDataValue: 0,
      tile: undefined,
    } as ParseFourwingsClustersOptions,
  } as FourwingsClustersLoaderOptions,
}

/**
 * Loader for the 4wings tile format
 */
export const FourwingsClustersLoader: LoaderWithParser = {
  ...FourwingsClustersWorkerLoader,
  parse: async (data, options?: FourwingsClustersLoaderOptions) =>
    parseFourwingsClusters(data, options),
  parseSync: (data, options?: FourwingsClustersLoaderOptions) =>
    parseFourwingsClusters(data, options),
  binary: true,
}
