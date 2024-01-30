import {
  DataviewDatasetConfig,
  DataviewDatasetConfigParam,
  EndpointId,
  ThinningConfig,
} from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { hasDatasetConfigVesselData } from 'features/datasets/datasets.utils'
import { TimebarGraphs } from 'types'
import { DEFAULT_PAGINATION_PARAMS } from 'data/config'

// <<<<<<< HEAD
type ThinningConfigParam = { config: ThinningConfig }
export const trackDatasetConfigsCallback = (
  thinningConfig: ThinningConfigParam | null,
  timebarGraph: any
) => {
  return ([info, track, ...events]: DataviewDatasetConfig[], dataview: UrlDataviewInstance) => {
    if (track?.endpoint === EndpointId.Tracks) {
      const thinningQuery = Object.entries(thinningConfig?.config || []).map(([id, value]) => ({
        id,
        value,
      }))

      let trackGraph
      if (timebarGraph !== TimebarGraphs.None) {
        trackGraph = { ...track }
        const fieldsQuery = {
          id: 'fields',
          // The api now requieres all params in upperCase
          value: ['TIMESTAMP', timebarGraph.toUpperCase()],
        }
        const graphQuery = [...(track.query || []), ...thinningQuery]
        const fieldsQueryIndex = graphQuery.findIndex((q) => q.id === 'fields')
        if (fieldsQueryIndex > -1) {
          graphQuery[fieldsQueryIndex] = fieldsQuery
          trackGraph.query = graphQuery
        } else {
          trackGraph.query = [...graphQuery, fieldsQuery]
        }
      }

      const trackWithThinning = {
        ...track,
        query: [...(track.query || []), ...thinningQuery],
      }

      const allEvents = events.map((event) => ({
        ...event,
        query: [
          ...(Object.entries(DEFAULT_PAGINATION_PARAMS).map(([id, value]) => ({
            id,
            value,
          })) as DataviewDatasetConfigParam[]),
          ...(event?.query || []),
        ],
      }))
      // Clean resources when mandatory vesselId is missing
      // needed for vessels with no info datasets (zebraX)
      const vesselData = hasDatasetConfigVesselData(info)

      return [
        trackWithThinning,
        ...allEvents,
        ...(vesselData ? [info] : []),
        ...(trackGraph ? [trackGraph] : []),
      ]
      // =======
      //       // Generate one infoconfig per chunk (if specified)
      //       // TODO move this in dataviews-client/get-resources, since merging back tracks together is done by the generic slice anyways
      //       let allTracks = [trackWithThinning]

      //       if (chunks) {
      //         const chunkSetId = getTracksChunkSetId(trackWithThinning)
      //         const dataset = dataview?.datasets?.find(
      //           (d) => d.id === trackWithThinning.datasetId
      //         ) as Dataset
      //         // Workaround to avoid showing tracks outside the dataset bounds as the AIS data is changing at the end of 2022
      //         const chunksWithDatasetBounds = chunks.flatMap((chunk) => {
      //           if (dataset?.endDate && chunk.start >= dataset?.endDate) {
      //             return []
      //           }
      //           return {
      //             start:
      //               dataset?.startDate && chunk.start <= dataset?.startDate
      //                 ? dataset?.startDate
      //                 : chunk.start,
      //             end: dataset?.endDate && chunk.end >= dataset?.endDate ? dataset?.endDate : chunk.end,
      //           }
      //         })
      //         allTracks = chunksWithDatasetBounds.map((chunk) => {
      //           const trackChunk = {
      //             ...trackWithThinning,
      //             query: [
      //               ...(trackWithThinning.query || []),
      //               {
      //                 id: 'start-date',
      //                 value: chunk.start,
      //               },
      //               {
      //                 id: 'end-date',
      //                 value: chunk.end,
      //               },
      //             ],
      //             metadata: {
      //               ...(trackWithThinning.metadata || {}),
      //               chunkSetId,
      //               chunkSetNum: chunks.length,
      //             },
      //           }

      //           return trackChunk
      //         })
      //       }
      //       return [...allTracks, ...(trackGraph ? [trackGraph] : [])]
      // >>>>>>> develop
    }
    return [track].filter(Boolean)
  }
}
