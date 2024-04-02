import type { Loader, LoaderWithParser } from '@loaders.gl/loader-utils'
import packageJson from '../../package.json'
import type { FourwingsLoaderOptions, ParseFourwingsOptions } from './lib/types'
import { parseFourwings } from './lib/parse-fourwings'

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
    fourwings: {} as ParseFourwingsOptions,
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
