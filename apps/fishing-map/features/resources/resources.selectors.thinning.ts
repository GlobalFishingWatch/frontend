import { createSelector } from '@reduxjs/toolkit'
import { DateTime, Duration } from 'luxon'
import { range } from 'lodash'
import {} from '@globalfishingwatch/dataviews-client'
import { ThinningLevels } from '@globalfishingwatch/api-client'
import { AVAILABLE_START, AVAILABLE_END } from 'data/config'
import { selectDebugOptions } from 'features/debug/debug.slice'
import { selectUrlEndQuery, selectUrlStartQuery } from 'routes/routes.selectors'
import { getUTCDateTime } from 'utils/dates'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'

export {
  setResource,
  fetchResourceThunk,
  selectResourceByUrl,
  selectResources,
} from '@globalfishingwatch/dataviews-client'

const TRACK_THINNING_BY_ZOOM_GUEST = {
  0: ThinningLevels.Insane,
  4: ThinningLevels.Aggressive,
}
const TRACK_THINNING_BY_ZOOM_USER = { ...TRACK_THINNING_BY_ZOOM_GUEST, 7: ThinningLevels.Default }

export const selectTrackThinningConfig = createSelector(
  [selectIsGuestUser, selectDebugOptions],
  (guestUser, { thinning }) => {
    if (!thinning) return undefined
    return guestUser ? TRACK_THINNING_BY_ZOOM_GUEST : TRACK_THINNING_BY_ZOOM_USER
  }
)

const AVAILABLE_START_YEAR = new Date(AVAILABLE_START).getFullYear()
const AVAILABLE_END_YEAR = new Date(AVAILABLE_END).getFullYear()
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

    const chunks = [] as { start: string; end: string }[]

    YEARS.forEach((year) => {
      const yearStart = DateTime.fromObject({ year }, { zone: 'utc' })
      const yearEnd = DateTime.fromObject({ year: year + 1 }, { zone: 'utc' })

      if (+bufferedEnd > +yearStart && +bufferedStart < +yearEnd) {
        chunks.push({
          start: yearStart.toISO() as string,
          end: yearEnd.toISO() as string,
        })
      }
    })

    return chunks
  }
)
