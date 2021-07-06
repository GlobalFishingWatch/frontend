import { EncounterEvent, EventVessel, PointCoordinate } from "@globalfishingwatch/api-types/dist/events";
import { GroupRegions } from "features/regions/regions.slice";

export interface NextPort {
    id: string;
    label: string;
    iso: string;
    anchorageId: string;
}

export enum EventType {
    Fishing = 'fishing',
    Encounter = 'encounter',
}
export interface Regions {
    arg: any[];
    eez: string[];
    fao: string[];
    hsp: any[];
    kkp: any[];
    vme: string[];
    ames: string[];
    rfmo: string[];
    mpant: any[];
    mparu: any[];
    ocean: string[];
    other: any[];
    mregion: string[];
    majorFao: string[];
}

export interface Distances {
    startDistanceFromShoreKm?: number;
    endDistanceFromShoreKm: number;
    startDistanceFromPortKm?: number;
    endDistanceFromPortKm: number;
}

export interface Fishing {
    totalDistanceKm: number;
    averageSpeedKnots: number;
    averageDurationHours: number;
}
export interface RegionAuthorization {
    rfmo: string;
    authorized: boolean;
}
export interface Authorization {
    rfmo: string;
    authorized: boolean;
}
export interface VesselAuthorization {
    id: string;
    authorizations: Authorization[];
}


export interface ActivityEvent {
    type: EventType;
    vessel: EventVessel;
    start: string;
    end: string;
    position: PointCoordinate;
    regions: Regions;
    boundingBox: number[];
    distances: Distances;
    fishing?: Fishing;
    encounter?: EncounterEvent;
}

export interface ActivityFishingEvent extends ActivityEvent {
    fishing: Fishing;
}
export interface ActivityEncounterEvent extends ActivityEvent {
    encounter: EncounterEvent;
}

export type ActivityEventType = ActivityFishingEvent | ActivityEncounterEvent
export interface ActivityEventGroup {
    event_type: EventType
    event_places: GroupRegions[]
    ocean?: string
    start: string
    end: string
    encounter?: EncounterEvent
    open: boolean
    entries: ActivityEventType[];
}

export interface ActivityEvents {
    total: number;
    limit?: any;
    groups: ActivityEventGroup[];
}

export interface OfflineVesselActivity {
    activities: ActivityEventType[]
    profileId: string
    savedOn: string
}
