import type { Loader, LoaderWithParser } from '@loaders.gl/loader-utils'

import packageJson from '../../package.json'
import { PATH_BASENAME } from '../loaders.config'

import { NO_DATA_VALUE } from './lib/parse-fourwings'
import { parseFourwingsVectors } from './lib/parse-fourwings-vectors'
import type { FourwingsVectorsLoaderOptions, ParseFourwingsVectorsOptions } from './lib/types'

/**
 * Worker loader for the 4wings cluster tile format
 */
export const FourwingsVectorsWorkerLoader: Loader = {
  name: 'fourwings vectors',
  id: 'fourwingsVectors',
  module: 'fourwingsVectors',
  version: packageJson?.version,
  extensions: ['pbf'],
  mimeTypes: ['application/x-protobuf', 'application/octet-stream', 'application/protobuf'],
  worker: true,
  category: 'geometry',
  options: {
    fourwingsVectors: {
      workerUrl: `${PATH_BASENAME}/workers/fourwings-vectors-worker.js`,
      cols: [113],
      rows: [53],
      scale: [1],
      offset: [0],
      interval: 'HOUR',
      noDataValue: [NO_DATA_VALUE],
      tile: undefined,
      temporalAggregation: false,
      bufferedStartDate: 0,
      buffersLength: [],
    } as ParseFourwingsVectorsOptions,
  } as FourwingsVectorsLoaderOptions,
}

/**
 * Loader for the 4wings vectors format
 */
export const FourwingsVectorsLoader: LoaderWithParser = {
  ...FourwingsVectorsWorkerLoader,
  parse: async (data, options?: FourwingsVectorsLoaderOptions) =>
    parseFourwingsVectors(data, options),
  parseSync: (data, options?: FourwingsVectorsLoaderOptions) =>
    parseFourwingsVectors(data, options),
  binary: true,
}
