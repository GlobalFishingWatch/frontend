import type { Loader, LoaderWithParser, StrictLoaderOptions } from '@loaders.gl/loader-utils'

import { PATH_BASENAME } from '../loaders.config'
import { VERSION } from '../version'

import type { VesselTrackLoaderParams } from './lib/parse-tracks'
import { parseTrack } from './lib/parse-tracks'
import type { VesselTrackData } from './lib/types'

export const VESSEL_TRACKS_LOADER_ID = 'vessel-tracks'

/**
 * Worker loader for the Vessel Track DECKGL format
 */

export type VesselTrackLoaderOptions = StrictLoaderOptions & {
  [VESSEL_TRACKS_LOADER_ID]?: VesselTrackLoaderParams & {
    workerUrl?: string
  }
}

const defaultOptions: VesselTrackLoaderOptions = {
  [VESSEL_TRACKS_LOADER_ID]: {
    workerUrl: `${PATH_BASENAME}workers/vessel-tracks-worker.js`,
  },
}

export const VesselTrackWorkerLoader: Loader<VesselTrackData, any, VesselTrackLoaderOptions> = {
  id: VESSEL_TRACKS_LOADER_ID,
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
  parse: async (arrayBuffer, options?: VesselTrackLoaderOptions) =>
    parseTrack(arrayBuffer, options?.[VESSEL_TRACKS_LOADER_ID]),
  parseSync: (arrayBuffer, options?: VesselTrackLoaderOptions) =>
    parseTrack(arrayBuffer, options?.[VESSEL_TRACKS_LOADER_ID]),
  binary: true,
}
