import type { Loader, LoaderWithParser } from '@loaders.gl/loader-utils'

import packageJson from '../../package.json'
import { PATH_BASENAME } from '../loaders.config'

import { NO_DATA_VALUE, OFFSET_VALUE, parseFourwings, SCALE_VALUE } from './lib/parse-fourwings'
import type { FourwingsLoaderOptions, ParseFourwingsOptions } from './lib/types'

export const baseFourwingsLoaderOptions: FourwingsLoaderOptions = {
  sublayers: 1,
  cols: [113],
  rows: [53],
  scale: [SCALE_VALUE],
  offset: [OFFSET_VALUE],
  noDataValue: [NO_DATA_VALUE],
  bufferedStartDate: 0,
  interval: 'DAY',
  aggregationOperation: 'sum',
  buffersLength: [],
  initialTimeRange: undefined,
  tile: undefined,
}

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
      ...baseFourwingsLoaderOptions,
      workerUrl: `${PATH_BASENAME}/workers/fourwings-worker.js`,
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
