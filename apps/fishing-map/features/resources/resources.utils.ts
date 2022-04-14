import { ThinningConfig } from '@globalfishingwatch/api-types'
import { getTracksChunkSetId } from '@globalfishingwatch/dataviews-client'
import { hasDatasetConfigVesselData } from 'features/datasets/datasets.utils'
import { TimebarGraphs } from 'types'

export const trackDatasetConfigsCallback = (
  thinningConfig: { zoom: number; config: ThinningConfig },
  chunks: { start: string; end: string }[],
  timebarGraph
) => {
  return ([info, track, ...events]) => {
    const query = [...(track.query || [])]
    const fieldsQueryIndex = query.findIndex((q) => q.id === 'fields')
    let trackGraph
    if (timebarGraph !== TimebarGraphs.None) {
      trackGraph = { ...track }
      const fieldsQuery = {
        id: 'fields',
        value: timebarGraph,
      }
      if (fieldsQueryIndex > -1) {
        query[fieldsQueryIndex] = fieldsQuery
        trackGraph.query = query
      } else {
        trackGraph.query = [...query, fieldsQuery]
      }
    }

    // Clean resources when mandatory vesselId is missing
    // needed for vessels with no info datasets (zebraX)
    const vesselData = hasDatasetConfigVesselData(info)

    const thinningQuery = Object.entries(thinningConfig.config).map(([id, value]) => ({
      id,
      value,
    }))
    const trackWithThinning = {
      ...track,
      query: [...(track.query || []), ...thinningQuery],
      metadata: {
        zoom: thinningConfig.zoom,
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
            id: 'startDate',
            value: chunk.start,
          },
          {
            id: 'endDate',
            value: chunk.end,
          },
        ]
        const trackMetadata = { ...trackWithThinning.metadata } || {}

        trackChunk.metadata = {
          ...trackMetadata,
          chunkSetId,
          chunkSetNum: chunks.length,
        }

        return trackChunk
      })
    }

    return [
      ...allTracks,
      ...events,
      ...(vesselData ? [info] : []),
      ...(trackGraph ? [trackGraph] : []),
    ]
  }
}
