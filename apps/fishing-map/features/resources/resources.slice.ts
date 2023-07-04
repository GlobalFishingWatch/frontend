import { createSelector } from '@reduxjs/toolkit'
import { DateTime, Duration } from 'luxon'
import { range } from 'lodash'
import {
  ResourcesState as CommonResourcesState,
  resourcesSlice,
} from '@globalfishingwatch/dataviews-client'
import { ThinningConfig } from '@globalfishingwatch/api-types'
import { DEFAULT_WORKSPACE, THINNING_LEVEL_BY_ZOOM, THINNING_LEVEL_ZOOMS } from 'data/config'
import { selectDebugOptions } from 'features/debug/debug.slice'
import { isGuestUser } from 'features/user/user.slice'
import {
  selectUrlEndQuery,
  selectUrlMapZoomQuery,
  selectUrlStartQuery,
} from 'routes/routes.selectors'
import { getUTCDateTime } from 'utils/dates'

export {
  fetchResourceThunk,
  selectResourceByUrl,
  selectResources,
} from '@globalfishingwatch/dataviews-client'

// DO NOT MOVE TO RESOURCES.SELECTORS, IT CREATES A CIRCULAR DEPENDENCY
export const selectTrackThinningConfig = createSelector(
  [(state) => isGuestUser(state), selectDebugOptions, selectUrlMapZoomQuery],
  (guestUser, { thinning }, currentZoom) => {
    if (!thinning) return null
    let config = {} as ThinningConfig
    let selectedZoom = 0 as number
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

    // Returning always one single chunk with whole year trying to get advance of cache
    return [
      {
        start: startDT.startOf('year').toISO(),
        end: endDT.endOf('year').toISO(),
      },
    ]

    const bufferedStart = startDT.minus({ month: 1 })
    const bufferedEnd = endDT.plus({ month: 1 })

    const chunks = [] as { start: string; end: string }[]
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
