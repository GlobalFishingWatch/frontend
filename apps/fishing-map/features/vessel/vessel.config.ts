import { RegionType, SourceCode } from '@globalfishingwatch/api-types'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { IdentityVesselData } from 'features/vessel/vessel.slice'
import { VesselProfileState } from 'types'

export const DEFAULT_VESSEL_IDENTITY_DATASET = 'public-global-vessel-identity-all-shiptypes'
export const DEFAULT_VESSEL_IDENTITY_VERSION = 'v20230623'
export const DEFAULT_VESSEL_IDENTITY_ID = `${DEFAULT_VESSEL_IDENTITY_DATASET}:${DEFAULT_VESSEL_IDENTITY_VERSION}`

export const DEFAULT_VESSEL_STATE: VesselProfileState = {
  vesselDatasetId: DEFAULT_VESSEL_IDENTITY_ID,
  vesselIdentityIndex: 0,
  vesselIdentitySource: VesselIdentitySourceEnum.Registry,
  vesselActivityMode: 'type',
  vesselSection: 'activity',
  vesselArea: 'eez',
  vesselRelated: 'encounters',
  viewOnlyVessel: true,
}

export type VesselRenderField<Key = string> = {
  key: Key
  label?: string
  terminologyKey?: string
}

const COMMON_FIELD_GROUPS = [
  [{ key: 'shipname' }, { key: 'flag' }],
  [
    { key: 'shiptype', terminologyKey: 'vessel.terminology.shiptype' },
    { key: 'geartype', terminologyKey: 'vessel.terminology.geartype' },
  ],
  [{ key: 'ssvid', label: 'mmsi' }, { key: 'imo' }, { key: 'callsign' }],
]

// TODO review private datasets to ensure there are no missing fields

type CustomVMSGroup = Partial<Record<SourceCode, VesselRenderField[][]>>
export const CUSTOM_VMS_IDENTITY_FIELD_GROUPS: CustomVMSGroup = {
  [SourceCode.Peru]: [
    [{ key: 'origin' }, { key: 'fleet' }, { key: 'nationalId' }],
    [{ key: 'capacity' }, { key: 'beam' }],
  ],
  [SourceCode.CostaRica]: [[{ key: 'nationalId' }]],
  [SourceCode.Indonesia]: [
    [{ key: 'widthRange' }, { key: 'lengthRange' }, { key: 'grossTonnageRange' }],
  ],
  [SourceCode.Brazil]: [
    [{ key: 'fishingZone' }, { key: 'mainGear' }, { key: 'targetSpecies' }],
    [{ key: 'codMarinha' }],
  ],
  [SourceCode.Chile]: [[{ key: 'fleet' }]],
}

export const IDENTITY_FIELD_GROUPS: Record<VesselIdentitySourceEnum, VesselRenderField[][]> = {
  [VesselIdentitySourceEnum.SelfReported]: COMMON_FIELD_GROUPS,
  [VesselIdentitySourceEnum.Registry]: [
    ...COMMON_FIELD_GROUPS,
    [
      { key: 'lengthM', label: 'length' },
      { key: 'tonnageGt', label: 'grossTonnage' },
    ],
  ],
}

type VesselRegistryFieldGroup = {
  key: keyof Pick<IdentityVesselData, 'registryOwners' | 'registryAuthorizations'>
  label: string
  terminologyKey?: string
}
export const REGISTRY_FIELD_GROUPS: VesselRegistryFieldGroup[] = [
  {
    key: 'registryOwners',
    label: 'owner',
    terminologyKey: 'vessel.terminology.owner',
  },
  {
    key: 'registryAuthorizations',
    label: 'authorization',
  },
]

export const REGIONS_PRIORITY: RegionType[] = [
  RegionType.mpa,
  RegionType.eez,
  RegionType.fao,
  RegionType.rfmo,
]
