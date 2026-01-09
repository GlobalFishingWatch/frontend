import type { Loader, LoaderWithParser } from '@loaders.gl/loader-utils'

import { PATH_BASENAME } from '../loaders.config'
import { VERSION } from '../version'

import { parseFourwingsClusters } from './lib/parse-fourwings-clusters'
import type { FourwingsClustersLoaderOptions, ParseFourwingsClustersOptions } from './lib/types'
import { baseFourwingsLoaderOptions } from './fourwings-loader'

/**
 * Worker loader for the 4wings cluster tile format
 */
export const FourwingsClustersWorkerLoader: Loader = {
  name: 'fourwings cluster tiles',
  id: 'fourwingsClusters',
  module: 'fourwingsClusters',
  version: VERSION,
  extensions: ['pbf'],
  mimeTypes: ['application/x-protobuf', 'application/octet-stream', 'application/protobuf'],
  worker: true,
  category: 'geometry',
  options: {
    fourwingsClusters: {
      ...baseFourwingsLoaderOptions,
      workerUrl: `${PATH_BASENAME}/workers/fourwings-clusters-worker.js`,
      temporalAggregation: false,
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
