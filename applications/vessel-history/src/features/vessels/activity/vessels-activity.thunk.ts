import { createAsyncThunk } from '@reduxjs/toolkit'
import GFWAPI from '@globalfishingwatch/api-client'
import { FISHING_EVENTS_DATASET } from 'data/constants'
import { ActivityEvent, ActivityEventGroup } from 'types/activity'


const fetchData = (dataset: string, vesselId: string, start: string, end: string, signal?: AbortSignal | null) => {
    return GFWAPI.fetch<any>(
        `/v1/events?datasets=${encodeURIComponent(dataset)}&vessels=${vesselId}&startDate=${start}&endDate=${end}`
    )
        .then((json: any) => {
            return json.entries as ActivityEvent[] ?? []
        })
        .catch((error) => {
            return [] as ActivityEvent[]
        })
}

const fetchDatasets = async (vesselId: string, start: string, end: string, signal?: AbortSignal | null) => {
    // TODO:duplicate for testing, others datasets should be used
    const datasets = [FISHING_EVENTS_DATASET]
    const fetchedEvents = await Promise.all(
        datasets.map(async (dataset) => fetchData(dataset, vesselId, start, end, signal))
    )
    const allEvents = fetchedEvents.flat()
    const sortEvents = allEvents.sort(
        (n1: ActivityEvent, n2: ActivityEvent) => {
            return new Date(n1.start).getTime() > new Date(n2.start).getTime() ? -1 : 1
        }
    )

    return sortEvents
}

export type VesselSearchThunk = {
    vesselId: string
    start: string
    end: string
}

const groupEvents = (events: ActivityEvent[]) => {
    const groups: ActivityEventGroup[] = []
    events.forEach(event => {
        if (
            !groups.length ||
            groups[groups.length - 1].event_type !== event.type ||
            groups[groups.length - 1].event_place !== event.regions.eez[0]
        ) {
            groups.push({
                event_type: event.type,
                event_place: event.regions.eez[0],
                open: true,
                entries: [event]
            })
        } else if (groups[groups.length - 1].event_type === event.type && groups[groups.length - 1].event_place === event.regions.eez[0]) {
            groups[groups.length - 1].entries.push(event)
            groups[groups.length - 1].open = false
        }
    });
    return groups
}

export const fetchVesselActivityThunk = createAsyncThunk(
    'vessels/activity',
    async ({ vesselId, start, end }: VesselSearchThunk, { rejectWithValue, getState, signal }) => {
        const events = await fetchDatasets(vesselId, start, end, signal)
        return groupEvents(events)
    },
    {
        condition: ({ vesselId }, { getState, extra }) => {
            // TODO: conditions?
            return true
        },
    }
)
