import type { Loader, LoaderWithParser } from '@loaders.gl/loader-utils'
import packageJson from '../../package.json'
import { PATH_BASENAME } from '../loaders.config'
import type { FourwingsLoaderOptions, ParseFourwingsClustersOptions } from './lib/types'
import { parseFourwingsClusters } from './lib/parse-fourwings-clusters'

/**
 * Worker loader for the 4wings cluster tile format
 */
export const FourwingsClustersWorkerLoader: Loader = {
  name: 'fourwings cluster tiles',
  id: 'fourwings clusters',
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
  } as FourwingsLoaderOptions,
}

/**
 * Loader for the 4wings tile format
 */
export const FourwingsClustersLoader: LoaderWithParser = {
  ...FourwingsClustersWorkerLoader,
  parse: async (data, options?: FourwingsLoaderOptions) => parseFourwingsClusters(data, options),
  parseSync: (data, options?: FourwingsLoaderOptions) => parseFourwingsClusters(data, options),
  binary: true,
}
