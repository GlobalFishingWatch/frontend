import { RegionType } from '@globalfishingwatch/api-types'
import { VesselProfileState } from 'types'

const DEFAULT_VESSEL_IDENTITY_ID = 'proto-global-vessel-identity:v20230623'
export const DEFAULT_VESSEL_STATE: VesselProfileState = {
  vesselDatasetId: DEFAULT_VESSEL_IDENTITY_ID,
  vesselRegistryIndex: 0,
  vesselActivityMode: 'type',
}

export type VesselRenderField = {
  key: string
  label: string
  terminologyKey?: string
}
export const IDENTITY_FIELD_GROUPS: VesselRenderField[][] = [
  [
    { key: 'shipname', label: 'shipname' },
    { key: 'flag', label: 'flag' },
  ],
  [
    { key: 'shiptype', label: 'shiptype', terminologyKey: 'vessel.terminology.shiptype' },
    { key: 'geartype', label: 'geartype', terminologyKey: 'vessel.terminology.geartype' },
  ],
  [
    { key: 'ssvid', label: 'mmsi' },
    { key: 'imo', label: 'imo' },
    { key: 'callsign', label: 'callsign' },
  ],
  [
    { key: 'lengthM', label: 'length' },
    { key: 'tonnageGt', label: 'grossTonnage' },
  ],
  [
    { key: 'owner.owner', label: 'owner' },
    { key: 'owner.ownerFlag', label: 'owner flag' },
  ],
  [{ key: 'authorization.sourceCode', label: 'authorizations' }],
]

export const REGIONS_PRIORITY: RegionType[] = [
  RegionType.mpa,
  RegionType.eez,
  RegionType.fao,
  RegionType.rfmo,
]
