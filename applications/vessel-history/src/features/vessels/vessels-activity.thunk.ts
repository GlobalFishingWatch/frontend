import { createAsyncThunk } from '@reduxjs/toolkit'
import GFWAPI from '@globalfishingwatch/api-client'
import { VesselSearch } from '@globalfishingwatch/api-types'
import { EVENTS_DATASET, RESULTS_PER_PAGE, SEARCH_MIN_CHARACTERS } from 'data/constants'
import { RootState } from 'store'

const fetchData = async (vesselId: string, signal?: AbortSignal | null) => {
  console.log(vesselId)
  return await GFWAPI.fetch<any>(
    `/v1/events?datasets=${encodeURIComponent(EVENTS_DATASET)}&vessels=${vesselId}&startDate=2017-01-01&endDate=2021-05-05`,
    {
      signal,
    }
  )
    .then((json: any) => {
      const events = json.entries

      return {
        events,
      }
    })
    .catch((error) => {
      return null
    })
}

export type VesselSearchThunk = {
  vesselId: string
}

export const fetchVesselActivityThunk = createAsyncThunk(
  'search/vessels-activity',
  async ({ vesselId }: VesselSearchThunk, { rejectWithValue, getState, signal }) => {
    console.log(vesselId)
    const events = await fetchData(vesselId, signal)
    return events
  },
  {
    condition: ({ vesselId }, { getState, extra }) => {
      const { search } = getState() as RootState
      return true
    },
  }
)
