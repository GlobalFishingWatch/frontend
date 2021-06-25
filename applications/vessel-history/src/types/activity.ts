export interface EventVessel {
    id: string;
    name: string;
    ssvid: string;
    nextPort?: any;
}
export interface Position {
    lat: number;
    lon: number;
}

export enum EventType {
    Fishing = 'fishing',
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

export interface ActivityEvent {
    type: EventType;
    vessel: EventVessel;
    start: string;
    end: string;
    position: Position;
    regions: Regions;
    boundingBox: number[];
    distances: Distances;
    fishing: Fishing;
}
export interface ActivityEventGroup {
    event_type: EventType
    event_eez?: number | string
    event_rfmo?: number | string
    ocean?: string
    open: boolean
    entries: ActivityEvent[];
}

export interface ActivityEvents {
    total: number;
    limit?: any;
    groups: ActivityEventGroup[];
}

export interface OfflineVesselActivity {
    activities: ActivityEvent[]
    profileId: string
    savedOn: string
}
