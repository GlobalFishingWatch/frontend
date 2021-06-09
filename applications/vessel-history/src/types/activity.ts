export interface RegionsMeanPosition {
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
    major_fao: string[];
}

export enum EventType {
    Fishing = 'fishing',
}

export interface EventInfo {
    distance_km: number;
    message_count: number;
    avg_speed_knots: number;
    avg_duration_hrs: number;
}

export interface EventVessel {
    id: string;
    name: string;
    ssvid: string;
    seg_id: string;
}

export interface ActivityEvent {
    event_type: EventType;
    vessel_id: string;
    seg_id: string;
    event_start: string;
    event_end: string;
    lat_mean: number;
    lon_mean: number;
    lat_min: number;
    lat_max: number;
    lon_min: number;
    lon_max: number;
    regions_mean_position: RegionsMeanPosition;
    start_distance_from_shore_km?: number;
    end_distance_from_shore_km: number;
    start_distance_from_port_km?: number;
    end_distance_from_port_km: number;
    event_info: EventInfo;
    event_vessels: EventVessel[];
}

export interface ActivityEventGroup {
    event_type: EventType
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
