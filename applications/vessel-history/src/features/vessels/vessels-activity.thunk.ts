import { createAsyncThunk } from '@reduxjs/toolkit'
import GFWAPI from '@globalfishingwatch/api-client'
import { VesselSearch } from '@globalfishingwatch/api-types'
import { FISHING_EVENTS_DATASET, RESULTS_PER_PAGE, SEARCH_MIN_CHARACTERS } from 'data/constants'
import { RootState } from 'store'
import { ActivityEvent, ActivityEventGroup } from 'types/activity'


const fetchData = (dataset: string, vesselId: string, signal?: AbortSignal | null) => {
  console.log(7)
  return GFWAPI.fetch<any>(
    `/v1/events?datasets=${encodeURIComponent(dataset)}&vessels=${vesselId}&startDate=2017-01-01&endDate=2021-05-05`
  )
    .then((json: any) => {
      return json.entries as ActivityEvent[] ?? []
    })
    .catch((error) => {
      return [] as ActivityEvent[]
    })
}

const fetchDatasets = async (vesselId: string, signal?: AbortSignal | null) => {
  console.log(vesselId)
  // TODO:duplicate for testing, others datasets should be used
  const datasets = [FISHING_EVENTS_DATASET, FISHING_EVENTS_DATASET]
  const fetchedEvents = await Promise.all(
    datasets.map(async (dataset) => fetchData(dataset, vesselId, signal))
  )
  console.error(324)
  const allEvents = fetchedEvents.flat()
  console.log(allEvents)
  const sortEvents = allEvents.sort(
    (n1: ActivityEvent, n2: ActivityEvent) => {
      return new Date(n1.event_start).getTime() > new Date(n2.event_start).getTime() ? -1 : 1
    }
  )
  console.log(sortEvents)

  return sortEvents
}

export type VesselSearchThunk = {
  vesselId: string
}

const groupEvents = (events: ActivityEvent[]) => {
  const groups: ActivityEventGroup[] = []
  events.forEach(event => {
    if (!groups.length || groups[groups.length - 1].event_type !== event.event_type) {
      groups.push({
        event_type: event.event_type,
        entries: [event]
      })
    }
    if (groups[groups.length - 1].event_type === event.event_type) {
      groups[groups.length - 1].entries.push(event)
    }
  });
  return groups
}

export const fetchVesselActivityThunk = createAsyncThunk(
  'vessels/activity',
  async ({ vesselId }: VesselSearchThunk, { rejectWithValue, getState, signal }) => {
    console.log(vesselId)
    const events = await fetchDatasets(vesselId, signal)
    console.log(events)
    return groupEvents(events)
  },
  {
    condition: ({ vesselId }, { getState, extra }) => {
      // TODO: conditions?
      return true
    },
  }
)
