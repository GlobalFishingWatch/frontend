import { FeatureCollection } from 'geojson'
import {
  DataviewDatasetConfigParam,
  EndpointId,
  ThinningConfig,
} from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { LineColorBarOptions } from '@globalfishingwatch/ui-components'
import { hasDatasetConfigVesselData } from 'features/datasets/datasets.utils'
import { TimebarGraphs } from 'types'
import { DEFAULT_PAGINATION_PARAMS } from 'data/config'

type ThinningConfigParam = { config: ThinningConfig }
export const trackDatasetConfigsCallback = (
  thinningConfig: ThinningConfigParam | null,
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
          ...event?.query,
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
