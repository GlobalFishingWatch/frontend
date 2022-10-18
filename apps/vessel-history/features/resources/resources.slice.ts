import { createSelector } from '@reduxjs/toolkit'
import { DateTime, Duration } from 'luxon'
import { range } from 'lodash'
import { EventTypes, Resource, ThinningConfig } from '@globalfishingwatch/api-types'
import {
  ResourcesState as CommonResourcesState,
  resourcesSlice,
  selectResources as originalSelectResource,
} from '@globalfishingwatch/dataviews-client'
import {
  selectUrlEndQuery,
  selectUrlMapZoomQuery,
  selectUrlStartQuery,
} from 'routes/routes.selectors'
import { DEFAULT_WORKSPACE, THINNING_LEVEL_BY_ZOOM, THINNING_LEVEL_ZOOMS } from 'data/config'
import { isGuestUser } from 'features/user/user.slice'
import { getUTCDateTime } from 'utils/dates'

export {
  fetchResourceThunk,
  selectResourceByUrl,
  selectResourcesLoading,
} from '@globalfishingwatch/dataviews-client'

export const selectResources = createSelector([originalSelectResource], (resources) => {
  return Object.keys(resources)
    .map((url) => {
      const resource = resources[url]
      // We remove gaps where there is non intentional disabling
      const excludeNonIntentionalDisablingGaps = (event) =>
        event.type !== EventTypes.Gap || event.gap.intentionalDisabling === true

      const portExitEvents =
        Array.isArray(resource.data) &&
        (resource.data as any[])
          .filter((event) => event.type === EventTypes.Port)
          .map((event) => ({
            ...event,
            timestamp: event.end as number,
            // Important: To display port exits in map it's necessary
            // to override start timestamp because that's used to
            //  filter events when highlightTime is set
            start: event.end as number,
            id: `${event.id}-exit`,
          }))
      /*
      TODO: I don't know if we will keep this
      const gapsEnds =
        Array.isArray(resource.data) &&
        (resource.data as any[])
          .filter((event) => event.type === EventTypes.Gap && event.gap.intentionalDisabling === true)
          .map((event) => ({
            ...event,
            timestamp: event.end as number,
            // Important: To display gap end in map it's necessary
            // to override start timestamp because that's used to
            //  filter events when highlightTime is set
            start: event.end as number,
            id: `${event.id}-end`,
          }))
          */
      return [
        url,
        {
          ...resource,
          data: Array.isArray(resource.data)
            ? (resource.data as any[])
                ?.filter(excludeNonIntentionalDisablingGaps)
                .concat(portExitEvents) //.concat(gapsEnds)
            : resource.data,
        } as Resource,
      ]
    })
    .reduce(
      (prev, [url, resource]) => ({ ...prev, [url as string]: resource }),
      {}
    ) as CommonResourcesState
})

// DO NOT MOVE TO RESOURCES.SELECTORS, IT CREATES A CIRCULAR DEPENDENCY
export const selectTrackThinningConfig = createSelector(
  [(state) => isGuestUser(state), selectUrlMapZoomQuery],
  (guestUser, currentZoom) => {
    let config: ThinningConfig
    let selectedZoom: number
    for (let i = 0; i < THINNING_LEVEL_ZOOMS.length; i++) {
      const zoom = THINNING_LEVEL_ZOOMS[i]
      if (currentZoom < zoom) break
      config = THINNING_LEVEL_BY_ZOOM[zoom][guestUser ? 'guest' : 'user']
      selectedZoom = zoom
    }

    return { config, zoom: selectedZoom }
  }
)

const AVAILABLE_START_YEAR = new Date(DEFAULT_WORKSPACE.availableStart).getFullYear()
const AVAILABLE_END_YEAR = new Date(DEFAULT_WORKSPACE.availableEnd).getFullYear()
const YEARS = range(AVAILABLE_START_YEAR, AVAILABLE_END_YEAR + 1)

export const selectTrackChunksConfig = createSelector(
  [selectUrlStartQuery, selectUrlEndQuery],
  (start, end) => {
    if (!start || !end) return null
    const startDT = getUTCDateTime(start)
    const endDT = getUTCDateTime(end)

    const delta = Duration.fromMillis(+endDT - +startDT)

    if (delta.as('years') > 2) return null

    const bufferedStart = startDT.minus({ month: 1 })
    const bufferedEnd = endDT.plus({ month: 1 })

    const chunks = []

    YEARS.forEach((year) => {
      const yearStart = DateTime.fromObject({ year }, { zone: 'utc' })
      const yearEnd = DateTime.fromObject({ year: year + 1 }, { zone: 'utc' })

      if (+bufferedEnd > +yearStart && +bufferedStart < +yearEnd) {
        chunks.push({
          start: yearStart.toISO(),
          end: yearEnd.toISO(),
        })
      }
    })

    return chunks
  }
)
export type ResourcesState = CommonResourcesState
export default resourcesSlice.reducer
