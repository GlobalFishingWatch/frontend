import type { Loader, LoaderWithParser, StrictLoaderOptions } from '@loaders.gl/loader-utils'

import { PATH_BASENAME } from '../loaders.config'
import { VERSION } from '../version'

import { parseTrack } from './lib/parse-tracks'
import type { VesselTrackData } from './lib/types'

/**
 * Worker loader for the Vessel Track DECKGL format
 */

export type VesselTrackLoaderOptions = StrictLoaderOptions & {
  'vessel-tracks'?: {
    workerUrl?: string
  }
}

const defaultOptions: VesselTrackLoaderOptions = {
  'vessel-tracks': {
    workerUrl: `${PATH_BASENAME}workers/vessel-tracks-worker.js`,
  },
}

export const VesselTrackWorkerLoader: Loader<VesselTrackData, any, VesselTrackLoaderOptions> = {
  id: 'vessel-tracks',
  name: 'gfw-vessel-tracks',
  module: 'tracks',
  category: 'geometry',
  version: VERSION,
  extensions: ['pbf'],
  mimeTypes: ['application/x-protobuf', 'application/octet-stream', 'application/protobuf'],
  worker: true,
  options: defaultOptions,
}

/**
 * Loader for the Vessel Track DECKGL format
 */

export const VesselTrackLoader: LoaderWithParser<VesselTrackData, any, VesselTrackLoaderOptions> = {
  ...VesselTrackWorkerLoader,
  parse: async (arrayBuffer) => parseTrack(arrayBuffer),
  parseSync: (arrayBuffer) => parseTrack(arrayBuffer),
  binary: true,
}
