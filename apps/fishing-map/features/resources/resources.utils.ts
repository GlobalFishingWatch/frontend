import { FeatureCollection } from 'geojson'
import { maxBy, minBy } from 'lodash'
import {
  Dataset,
  DataviewDatasetConfigParam,
  EndpointId,
  ThinningConfig,
} from '@globalfishingwatch/api-types'
import { getTracksChunkSetId, UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { LineColorBarOptions } from '@globalfishingwatch/ui-components'
import { hasDatasetConfigVesselData } from 'features/datasets/datasets.utils'
import { TimebarGraphs } from 'types'
import { DEFAULT_PAGINATION_PARAMS } from 'data/config'

type ThinningConfigParam = { zoom: number; config: ThinningConfig }
export const trackDatasetConfigsCallback = (
  thinningConfig = {} as ThinningConfigParam,
  chunks: { start: string; end: string }[],
  timebarGraph
) => {
  return ([info, track, ...events], dataview: UrlDataviewInstance) => {
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
          value: ['timestamp', timebarGraph].join(','),
        }
        const graphQuery = [...(track.query || []), ...thinningQuery]
        const fieldsQueryIndex = graphQuery.findIndex((q) => q.id === 'fields')
        if (fieldsQueryIndex > -1) {
          graphQuery[fieldsQueryIndex] = fieldsQuery
          trackGraph.query = graphQuery
        } else {
          trackGraph.query = [...graphQuery, fieldsQuery]
        }
        const chunksMinRange = chunks ? minBy(chunks, 'start')?.start : null
        const chunksMaxRange = chunks ? maxBy(chunks, 'end')?.end : null
        if (chunksMinRange && chunksMaxRange) {
          trackGraph.query = [
            ...trackGraph.query,
            {
              id: 'start-date',
              value: chunksMinRange,
            },
            {
              id: 'end-date',
              value: chunksMaxRange,
            },
          ]
        }
      }

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
        const dataset: Dataset = dataview.datasets.find((d) => d.id === trackWithThinning.datasetId)
        // Workaround to avoid showing tracks outside the dataset bounds as the AIS data is changing at the end of 2022
        const chunksWithDatasetBounds = chunks.flatMap((chunk) => {
          if (dataset?.endDate && chunk.start >= dataset?.endDate) {
            return []
          }
          return {
            start:
              dataset?.startDate && chunk.start <= dataset?.startDate
                ? dataset?.startDate
                : chunk.start,
            end: dataset?.endDate && chunk.end >= dataset?.endDate ? dataset?.endDate : chunk.end,
          }
        })
        allTracks = chunksWithDatasetBounds.map((chunk) => {
          const trackChunk = {
            ...trackWithThinning,
            query: [
              ...(trackWithThinning.query || []),
              {
                id: 'start-date',
                value: chunk.start,
              },
              {
                id: 'end-date',
                value: chunk.end,
              },
            ],
            metadata: {
              ...(trackWithThinning.metadata || {}),
              chunkSetId,
              chunkSetNum: chunks.length,
            },
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
          ...event?.query,
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

export const parseUserTrackCallback = (geoJSON: FeatureCollection) => {
  geoJSON.features = geoJSON.features.map((feature, i) => {
    const color = LineColorBarOptions[i % LineColorBarOptions.length].value
    return {
      ...feature,
      properties: {
        ...feature.properties,
        color,
      },
    }
  })
  return geoJSON
}
