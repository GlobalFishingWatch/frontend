import type { Loader, LoaderWithParser } from '@loaders.gl/loader-utils'

import packageJson from '../../package.json'
import { PATH_BASENAME } from '../loaders.config'

import { parseCurrents } from './lib/parse-currents'
import type { CurrentsLoaderOptions } from './lib/types'

/**
 * Worker loader for the 4wings currents format
 */
export const CurrentsWorkerLoader: Loader = {
  name: 'currents tiles',
  id: 'currents',
  module: 'currents',
  version: packageJson?.version,
  extensions: ['*'],
  mimeTypes: ['*'],
  worker: true,
  category: 'geometry',
  options: {
    currents: {
      workerUrl: `${PATH_BASENAME}/workers/currents-worker.js`,
    } as any,
  } as CurrentsLoaderOptions,
}

/**
 * Loader for the 4wings currents data
 */
export const CurrentsLoader: LoaderWithParser = {
  ...CurrentsWorkerLoader,
  parse: async (data, options?: CurrentsLoaderOptions) => parseCurrents(data, options),
  parseSync: parseCurrents,
  binary: true,
}
