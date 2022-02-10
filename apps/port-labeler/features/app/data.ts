import { createSelector } from '@reduxjs/toolkit';
import data from './data.json';

export interface PortPosition {
    lat: number;
    lon: number;
    total_visits: number;
    drift_radius: number;
    top_destination: string;
    unique_stationary_ssvid: number;
    unique_stationary_fishing_ssvid: number;
    unique_active_ssvid: number;
    unique_total_ssvid: number;
    active_ssvid_days: number;
    stationary_ssvid_days: number;
    stationary_fishing_ssvid_days: string;
    s2id: string;
    label: string;
    sublabel: string;
    label_source: string;
    iso3: string;
    distance_from_shore_m: string;
    dock: string;
    community: string;
    comm_type: string;
    community_iso3: string;
}

export const DATA: PortPosition[]  = data as PortPosition[]

export const selectCountries = createSelector(
    [],() => {

        const countriesDuplicated: string[] = DATA.map(e => {
            return e.iso3
        })
        const countries = [...new Set(countriesDuplicated)];

        return countries.map(e => {
            return {
                id: e,
                label: e,
            }
        })
    }
)