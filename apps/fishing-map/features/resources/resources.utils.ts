import {
  DataviewDatasetConfig,
  DataviewDatasetConfigParam,
  EndpointId,
  ThinningConfig,
  TrackField,
} from '@globalfishingwatch/api-types'
import { GetDatasetConfigCallback, UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { hasDatasetConfigVesselData } from 'features/datasets/datasets.utils'
import { TimebarGraphs } from 'types'
import { DEFAULT_PAGINATION_PARAMS } from 'data/config'
import { CACHE_FALSE_PARAM } from 'features/vessel/vessel.config'

export type ThinningConfigParam = { config: ThinningConfig }

export const infoDatasetConfigsCallback = (guestUser: boolean): GetDatasetConfigCallback => {
  return ([info]: DataviewDatasetConfig[]): DataviewDatasetConfig[] => {
    const vesselData = hasDatasetConfigVesselData(info)
    // Clean resources when mandatory vesselId is missing
    // needed for vessels with no info datasets (zebraX)
    if (!vesselData) {
      return []
    }
    if (guestUser) {
      return [{ ...info, query: [...(info.query || []), CACHE_FALSE_PARAM] }]
    }
    return [info]
  }
}

export const eventsDatasetConfigsCallback: GetDatasetConfigCallback = (events) => {
  const allEvents = events.map((event) => {
    const hasPaginationAdded = Object.keys(DEFAULT_PAGINATION_PARAMS).every((id) =>
      event.query?.map((q) => q.id).includes(id)
    )
    if (hasPaginationAdded) {
      // Pagination already included, not needed to add it
      return event
    }
    return {
      ...event,
      query: [
        ...(Object.entries(DEFAULT_PAGINATION_PARAMS).map(([id, value]) => ({
          id,
          value,
        })) as DataviewDatasetConfigParam[]),
        ...(event?.query || []),
      ],
    }
  })
  return allEvents.filter(Boolean)
}

export const trackDatasetConfigsCallback = (thinningConfig: ThinningConfigParam | null) => {
  return ([track]: DataviewDatasetConfig[], dataview?: UrlDataviewInstance) => {
    if (track?.endpoint === EndpointId.Tracks) {
      const thinningQuery = Object.entries(thinningConfig?.config || []).map(([id, value]) => ({
        id,
        value,
      }))

      let trackQuery = [...(track.query?.map((query) => ({ ...query })) || []), ...thinningQuery]
      const trackWithThinning = { ...track, query: trackQuery }

      return [trackWithThinning]
    }
    return [track].filter(Boolean)
  }
}
