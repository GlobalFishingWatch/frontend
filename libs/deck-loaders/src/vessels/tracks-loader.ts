import type { Loader, LoaderOptions, LoaderWithParser } from '@loaders.gl/loader-utils'

import packageJson from '../../package.json'
import { PATH_BASENAME } from '../loaders.config'

import type { VesselTrackLoaderParams } from './lib/parse-tracks'
import { parseTrack } from './lib/parse-tracks'
import type { VesselTrackData } from './lib/types'

/**
 * Worker loader for the Vessel Track DECKGL format
 */

export type VesselTrackLoaderOptions = LoaderOptions & {
  'vessel-tracks'?: VesselTrackLoaderParams & {
    workerUrl?: string
  }
}

const defaultOptions: VesselTrackLoaderOptions = {
  'vessel-tracks': {
    workerUrl: `${PATH_BASENAME}/workers/vessel-tracks-worker.js`,
  },
}

export const VesselTrackWorkerLoader: Loader<VesselTrackData, any, VesselTrackLoaderOptions> = {
  id: 'vessel-tracks',
  name: 'gfw-vessel-tracks',
  module: 'tracks',
  category: 'geometry',
  version: packageJson?.version,
  extensions: ['pbf'],
  mimeTypes: ['application/x-protobuf', 'application/octet-stream', 'application/protobuf'],
  worker: true,
  options: defaultOptions,
}

/**
 * Loader for the Vessel Track DECKGL format
 */

export const VesselTrackLoader: LoaderWithParser = {
  ...VesselTrackWorkerLoader,
  parse: async (arrayBuffer, options?: VesselTrackLoaderOptions) =>
    parseTrack(arrayBuffer, options?.['vessel-tracks']),
  parseSync: (arrayBuffer, options?: VesselTrackLoaderOptions) =>
    parseTrack(arrayBuffer, options?.['vessel-tracks']),
  binary: true,
}
