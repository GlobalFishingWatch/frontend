import { RegionType, SourceCode } from '@globalfishingwatch/api-types'
import { VesselIdentitySourceEnum } from 'features/search/search.config'
import { IdentityVesselData } from 'features/vessel/vessel.slice'
import { VesselProfileState } from 'types'

export const DEFAULT_VESSEL_IDENTITY_ID = 'public-global-vessel-identity-all-shiptypes:v20230623'
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
  label: string
  terminologyKey?: string
}

const COMMON_FIELD_GROUPS = [
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
]

// TODO review private datasets to ensure there are no missing fields

type CustomVMSGroup = Partial<Record<SourceCode, VesselRenderField[][]>>
export const CUSTOM_VMS_IDENTITY_FIELD_GROUPS: CustomVMSGroup = {
  [SourceCode.Peru]: [
    [
      { key: 'fleet', label: 'fleet' },
      { key: 'nationalId', label: 'nationalId' },
    ],
    [
      { key: 'capacity', label: 'capacity' },
      { key: 'beam', label: 'beam' },
      { key: 'origin', label: 'origin' },
    ],
  ],
  [SourceCode.CostaRica]: [[{ key: 'nationalId', label: 'nationalId' }]],
  [SourceCode.Indonesia]: [
    [{ key: 'widthRange', label: 'widthRange' }],
    [{ key: 'lengthRange', label: 'lengthRange' }],
    [{ key: 'grossTonnageRange', label: 'grossTonnageRange' }],
  ],
  [SourceCode.Brazil]: [
    [{ key: 'fishingZone', label: 'fishingZone' }],
    [{ key: 'codMarinha', label: 'codMarinha' }],
    [{ key: 'mainGear', label: 'mainGear' }],
    [{ key: 'targetSpecies', label: 'targetSpecies' }],
  ],
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
