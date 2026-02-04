import type { AdvancedSearchQueryFieldKey } from '@globalfishingwatch/api-client'

export type SupportedDatasetFilter =
  | SupportedActivityDatasetFilter
  | SupportedEnvDatasetFilter
  | SupportedContextDatasetFilter
  | SupportedEventsDatasetFilter
  | SupportedVesselDatasetFilter

type SupportedActivityDatasetFilter =
  | 'mmsi'
  | 'flag'
  | 'geartype'
  | 'geartypes'
  | 'fleet'
  | 'shiptype'
  | 'shiptypes'
  | 'origin'
  | 'vessel_type'
  | 'speed'
  | 'radiance'
  | 'duration'
  | 'source'
  | 'matched'
  | 'codMarinha'
  | 'targetSpecies' // TODO: normalice format in API and decide
  | 'target_species' // between camelCase or snake_case
  | 'casco'
  | 'license_category'
  | 'vessel-groups'
  | 'neural_vessel_type'
  | 'visibleValues'
  | 'callsign'
  | 'shipname'
  | 'ssvid'
  | 'imo'
  | 'label'
  | 'distance_from_port_km'

// Speed flag and vessels only added to debug purposes of vessel speed dataset
// Context env layers filtesr: Seamounts => height & Ecoregions => REALM
export type SupportedEnvDatasetFilter =
  | 'type'
  | 'speed'
  | 'elevation'
  | 'flag'
  | 'vessel_type'
  | 'Height'
  | 'REALM'
  // TODO: remove this when the dataset is updated
  | 'specie' // species-mm
  | 'species' // species-mm
  | 'genus' // species-mm
  | 'period' // species-mm
  | 'scenario' // species-mm
type SupportedContextDatasetFilter = 'removal_of' | 'vessel_id'
type SupportedEventsDatasetFilter = 'duration' | 'encounter_type' | 'type' | 'next_port_id'
type SupportedVesselDatasetFilter = AdvancedSearchQueryFieldKey
