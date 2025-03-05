import type { Loader, LoaderWithParser } from '@loaders.gl/loader-utils'

import packageJson from '../../package.json'
import { PATH_BASENAME } from '../loaders.config'

import { parseFourwings } from './lib/parse-fourwings'
import type { FourwingsLoaderOptions, ParseFourwingsOptions } from './lib/types'

/**
 * Worker loader for the 4wings tile format
 */
export const FourwingsWorkerLoader: Loader = {
  name: 'fourwings tiles',
  id: 'fourwings',
  module: 'fourwings',
  version: packageJson?.version,
  extensions: ['pbf'],
  mimeTypes: ['application/x-protobuf', 'application/octet-stream', 'application/protobuf'],
  worker: true,
  category: 'geometry',
  options: {
    fourwings: {
      workerUrl: `${PATH_BASENAME}/workers/fourwings-worker.js`,
      sublayers: 1,
      cols: 113,
      rows: 53,
      scale: 1,
      offset: 0,
      noDataValue: 0,
      bufferedStartDate: 0,
      initialTimeRange: undefined,
      tile: undefined,
      interval: 'DAY',
      aggregationOperation: 'sum',
      buffersLength: [],
    } as ParseFourwingsOptions,
  } as FourwingsLoaderOptions,
}

/**
 * Loader for the 4wings tile format
 */
export const FourwingsLoader: LoaderWithParser = {
  ...FourwingsWorkerLoader,
  parse: async (data, options?: FourwingsLoaderOptions) => parseFourwings(data, options),
  parseSync: parseFourwings,
  binary: true,
}
