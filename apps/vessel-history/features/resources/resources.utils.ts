import type { DataviewDatasetConfigParam, ThinningConfig } from '@globalfishingwatch/api-types'
import { EndpointId } from '@globalfishingwatch/api-types'
import { getTracksChunkSetId } from '@globalfishingwatch/dataviews-client'

import { DEFAULT_PAGINATION_PARAMS } from 'data/config'
import { hasDatasetConfigVesselData } from 'features/datasets/datasets.util'
import { TimebarGraphs } from 'types'

type ThinningConfigParam = { zoom: number; config: ThinningConfig }

export const trackDatasetConfigsCallback = (
  thinningConfig = {} as ThinningConfigParam,
  chunks: { start: string; end: string }[],
  timebarGraph: TimebarGraphs
) => {
  return ([info, track, ...events]) => {
    if (track?.endpoint === EndpointId.Tracks) {
      const query = [...(track.query || [])]
      const fieldsQueryIndex = query.findIndex((q) => q.id === 'fields')
      let trackGraph
      if (timebarGraph !== TimebarGraphs.None) {
        trackGraph = { ...track }
        const fieldsQuery = {
          id: 'fields',
          value: ['timestamp', timebarGraph].join(','),
        }
        if (fieldsQueryIndex > -1) {
          query[fieldsQueryIndex] = fieldsQuery
          trackGraph.query = query
        } else {
          trackGraph.query = [...query, fieldsQuery]
        }
      }

      const thinningQuery = Object.entries(thinningConfig?.config || []).map(([id, value]) => ({
        id,
        value,
      }))
      const trackWithThinning = {
        ...track,
        query: [...(track.query || []), ...thinningQuery],
        metadata: {
          zoom: thinningConfig?.zoom || 12,
        },
      }

      // Generate one infoconfig per chunk (if specified)
      // TODO move this in dataviews-client/get-resources, since merging back tracks together is done by the generic slice anyways
      let allTracks = [trackWithThinning]

      if (chunks) {
        const chunkSetId = getTracksChunkSetId(trackWithThinning)
        allTracks = chunks.map((chunk) => {
          const trackChunk = { ...trackWithThinning }
          const trackQuery = [...(trackWithThinning.query || [])]
          trackChunk.query = [
            ...trackQuery,
            {
              id: 'start-date',
              value: chunk.start,
            },
            {
              id: 'end-date',
              value: chunk.end,
            },
          ]
          const trackMetadata = { ...(trackWithThinning.metadata || {}) }

          trackChunk.metadata = {
            ...trackMetadata,
            chunkSetId,
            chunkSetNum: chunks.length,
          }

          return trackChunk
        })
      }
      const allEvents = events.map((event) => ({
        ...event,
        query: [
          ...(Object.entries(DEFAULT_PAGINATION_PARAMS).map(([id, value]) => ({
            id,
            value,
          })) as DataviewDatasetConfigParam[]),
          ...(event.query || []),
        ],
      }))
      // Clean resources when mandatory vesselId is missing
      // needed for vessels with no info datasets (zebraX)
      const vesselData = hasDatasetConfigVesselData(info)
      return [
        ...allTracks,
        ...allEvents,
        ...(vesselData ? [info] : []),
        ...(trackGraph ? [trackGraph] : []),
      ]
    }
    return [info, track, ...events].filter(Boolean)
  }
}
