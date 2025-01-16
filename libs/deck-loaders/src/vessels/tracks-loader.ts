import type { Loader, LoaderWithParser } from '@loaders.gl/loader-utils'

import packageJson from '../../package.json'
import { PATH_BASENAME } from '../loaders.config'

import { parseTrack } from './lib/parse-tracks'

/**
 * Worker loader for the Vessel Track DECKGL format
 */

export const VesselTrackWorkerLoader: Loader = {
  id: 'vessel-tracks',
  name: 'gfw-vessel-tracks',
  module: 'tracks',
  category: 'geometry',
  version: packageJson?.version,
  extensions: ['pbf'],
  mimeTypes: ['application/x-protobuf', 'application/octet-stream', 'application/protobuf'],
  worker: true,
  options: {
    'vessel-tracks': {
      workerUrl: `${PATH_BASENAME}/workers/vessel-tracks-worker.js`,
    },
  },
}

/**
 * Loader for the Vessel Track DECKGL format
 */
export const VesselTrackLoader: LoaderWithParser = {
  ...VesselTrackWorkerLoader,
  parse: async (arrayBuffer) => parseTrack(arrayBuffer),
  parseSync: parseTrack,
  binary: true,
}
