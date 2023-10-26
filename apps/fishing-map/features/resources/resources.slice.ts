import { createSelector } from '@reduxjs/toolkit'
import {
  ResourcesState as CommonResourcesState,
  resourcesSlice,
} from '@globalfishingwatch/dataviews-client'
// <<<<<<< HEAD
import { THINNING_CONFIG } from 'data/config'
// =======
// import { ThinningConfig } from '@globalfishingwatch/api-types'
// import {
//   AVAILABLE_START,
//   AVAILABLE_END,
//   THINNING_LEVEL_BY_ZOOM,
//   THINNING_LEVEL_ZOOMS,
// } from 'data/config'
// >>>>>>> develop
import { selectDebugOptions } from 'features/debug/debug.slice'
import { isGuestUser } from 'features/user/user.slice'

export {
  setResource,
  fetchResourceThunk,
  selectResourceByUrl,
  selectResources,
} from '@globalfishingwatch/dataviews-client'

// DO NOT MOVE TO RESOURCES.SELECTORS, IT CREATES A CIRCULAR DEPENDENCY
export const selectTrackThinningConfig = createSelector(
  [(state) => isGuestUser(state), selectDebugOptions],
  (guestUser, { thinning }) => {
    if (!thinning) return null
    const config = THINNING_CONFIG[guestUser ? 'guest' : 'user']

    // <<<<<<< HEAD
    return { config }
    // =======
    //     return { config, zoom: selectedZoom }
    //   }
    // )

    // const AVAILABLE_START_YEAR = new Date(AVAILABLE_START).getFullYear()
    // const AVAILABLE_END_YEAR = new Date(AVAILABLE_END).getFullYear()
    // const YEARS = range(AVAILABLE_START_YEAR, AVAILABLE_END_YEAR + 1)

    // export const selectTrackChunksConfig = createSelector(
    //   [selectUrlStartQuery, selectUrlEndQuery],
    //   (start, end) => {
    //     if (!start || !end) return null
    //     const startDT = getUTCDateTime(start)
    //     const endDT = getUTCDateTime(end)

    //     const delta = Duration.fromMillis(+endDT - +startDT)

    //     if (delta.as('years') > 2) return null

    //     const bufferedStart = startDT.minus({ month: 1 })
    //     const bufferedEnd = endDT.plus({ month: 1 })

    //     const chunks = [] as { start: string; end: string }[]

    //     YEARS.forEach((year) => {
    //       const yearStart = DateTime.fromObject({ year }, { zone: 'utc' })
    //       const yearEnd = DateTime.fromObject({ year: year + 1 }, { zone: 'utc' })

    //       if (+bufferedEnd > +yearStart && +bufferedStart < +yearEnd) {
    //         chunks.push({
    //           start: yearStart.toISO() as string,
    //           end: yearEnd.toISO() as string,
    //         })
    //       }
    //     })

    //     return chunks
    // >>>>>>> develop
  }
)

export type ResourcesState = CommonResourcesState
export default resourcesSlice.reducer
