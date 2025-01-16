import type { Loader, LoaderWithParser } from '@loaders.gl/loader-utils'

import packageJson from '../../package.json'
import { PATH_BASENAME } from '../loaders.config'

import { parseEvents } from './lib/parse-events'

/**
 * Worker loader for the the vessel events responses
 */
export const VesselEventsWorkerLoader: Loader = {
  id: 'vessel-events',
  name: 'gfw-vessel-events',
  module: 'events',
  version: packageJson.version,
  extensions: ['json'],
  mimeTypes: ['application/json'],
  worker: true,
  options: {
    'vessel-events': {
      workerUrl: `${PATH_BASENAME}/workers/vessel-events-worker.js`,
    },
  },
}

/**
 * Loader for the vessel events responses
 */
export const VesselEventsLoader: LoaderWithParser = {
  ...VesselEventsWorkerLoader,
  parse: async (arrayBuffer) => parseEvents(arrayBuffer),
  parseSync: parseEvents,
  binary: true,
}
