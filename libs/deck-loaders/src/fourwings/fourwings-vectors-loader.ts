import type { Loader, LoaderWithParser } from '@loaders.gl/loader-utils'

import { PATH_BASENAME } from '../loaders.config'
import { VERSION } from '../version'

import { parseFourwingsVectors } from './lib/parse-fourwings-vectors'
import type { FourwingsVectorsLoaderOptions, ParseFourwingsVectorsOptions } from './lib/types'
import { baseFourwingsLoaderOptions } from './fourwings-loader'

/**
 * Worker loader for the 4wings cluster tile format
 */
export const FourwingsVectorsWorkerLoader: Loader = {
  name: 'fourwings vectors',
  id: 'fourwingsVectors',
  module: 'fourwingsVectors',
  version: VERSION,
  extensions: ['pbf'],
  mimeTypes: ['application/x-protobuf', 'application/octet-stream', 'application/protobuf'],
  worker: false,
  category: 'geometry',
  options: {
    fourwingsVectors: {
      ...(baseFourwingsLoaderOptions as ParseFourwingsVectorsOptions),
      workerUrl: `${PATH_BASENAME}/workers/fourwings-vectors-worker.js`,
      temporalAggregation: false,
      unit: 'm/s',
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
