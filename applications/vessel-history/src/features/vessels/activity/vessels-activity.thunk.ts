import { createAsyncThunk } from '@reduxjs/toolkit'
import GFWAPI from '@globalfishingwatch/api-client'
import { CARRIER_EVENTS_DATASET, FISHING_EVENTS_DATASET } from 'data/constants'
import { ActivityEventGroup, ActivityEventType } from 'types/activity'
import { GroupRegions, MarineRegionType } from 'features/regions/regions.slice'


const fetchData = (dataset: string, vesselId: string, start: string, end: string, signal?: AbortSignal | null) => {
    return GFWAPI.fetch<any>(
        `/v1/events?datasets=${encodeURIComponent(dataset)}&vessels=${vesselId}&startDate=${start}&endDate=${end}`
    )
        .then((json: any) => {
            return json.entries as ActivityEventType[] ?? []
        })
        .catch((error) => {
            return [] as ActivityEventType[]
        })
}

const fetchDatasets = async (vesselId: string, start: string, end: string, signal?: AbortSignal | null) => {
    // TODO:duplicate for testing, others datasets should be used
    const datasets = [FISHING_EVENTS_DATASET, CARRIER_EVENTS_DATASET]
    const fetchedEvents = await Promise.all(
        datasets.map(async (dataset) => fetchData(dataset, vesselId, start, end, signal))
    )
    const allEvents = fetchedEvents.flat()
    const sortEvents = allEvents.sort(
        (n1: ActivityEventType, n2: ActivityEventType) => {
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
const equals = (a: GroupRegions[], b: GroupRegions[]) =>
    a.length === b.length &&
    a.every((v, i) => v.type === b[i].type && v.id === b[i].id);

const groupEvents = (events: ActivityEventType[]) => {
    const groups: ActivityEventGroup[] = []
    events.forEach(event => {
        const places: GroupRegions[] = []
        if (event.regions.eez[0]) {
            const place: GroupRegions = {
                id: event.regions.eez[0],
                type: MarineRegionType.eez
            }
            places.push(place)
        }
        if (event.regions.rfmo[0]) {
            const place: GroupRegions = {
                id: event.regions.rfmo[0],
                type: MarineRegionType.rfmo
            }
            places.push(place)
        }

        if (
            !groups.length ||
            groups[groups.length - 1].event_type !== event.type ||
            !equals(groups[groups.length - 1].event_places, places)
        ) {


            const newGroup = {
                event_type: event.type,
                event_places: places,
                ocean: event.regions.ocean[0],
                start: event.start,
                end: event.end,
                open: true,
                encounter: event.encounter,
                entries: [event]
            }
            groups.push(newGroup)
        } else if (
            groups[groups.length - 1].event_type === event.type &&
            (
                equals(groups[groups.length - 1].event_places, places)
            )
        ) {
            groups[groups.length - 1].entries.push(event)
            groups[groups.length - 1].end = event.end
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
