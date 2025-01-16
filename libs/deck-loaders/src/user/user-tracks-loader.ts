import type { Loader, LoaderOptions, LoaderWithParser } from '@loaders.gl/loader-utils'

import packageJson from '../../package.json'
import { PATH_BASENAME } from '../loaders.config'

import type { ParseUserTrackParams} from './lib/parse-user-tracks';
import { parseUserTrack } from './lib/parse-user-tracks'
import type { UserTrackData } from './lib/types'

/**
 * Worker loader for the User Track data
 */
export type UserTracksLoaderOptions = LoaderOptions & {
  userTracks?: ParseUserTrackParams & { workerUrl?: string }
}

export const UserTrackWorkerLoader: Loader<UserTrackData, any, UserTracksLoaderOptions> = {
  id: 'userTracks',
  name: 'gfw-user-tracks',
  module: 'tracks',
  category: 'geometry',
  version: packageJson?.version,
  extensions: ['*'],
  mimeTypes: ['application/json'],
  worker: true,
  options: {
    userTracks: {
      filters: {},
      workerUrl: `${PATH_BASENAME}/workers/user-tracks-worker.js`,
    },
  },
}

/**
 * Loader for the User Track data
 */
export const UserTrackLoader: LoaderWithParser<UserTrackData, any, UserTracksLoaderOptions> = {
  ...UserTrackWorkerLoader,
  parse: async (arrayBuffer, options) => parseUserTrack(arrayBuffer, options?.userTracks),
  parseSync: (arrayBuffer, options) => parseUserTrack(arrayBuffer, options?.userTracks),
  binary: true,
}
