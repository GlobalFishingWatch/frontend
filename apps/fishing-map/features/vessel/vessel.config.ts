import { RegionType, SelfReportedSource } from '@globalfishingwatch/api-types'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { I18nNamespaces } from 'features/i18n/i18n.types'
import { IdentityVesselData } from 'features/vessel/vessel.slice'
import { VesselGroupReportState, VesselProfileState } from 'types'

export const DEFAULT_VESSEL_IDENTITY_DATASET = 'public-global-vessel-identity'
export const DEFAULT_VESSEL_IDENTITY_VERSION = 'v3.0'
export const DEFAULT_VESSEL_IDENTITY_ID = `${DEFAULT_VESSEL_IDENTITY_DATASET}:${DEFAULT_VESSEL_IDENTITY_VERSION}`
export const CACHE_FALSE_PARAM = { id: 'cache', value: 'false' }

export const DEFAULT_VESSEL_STATE: VesselProfileState = {
  vesselDatasetId: DEFAULT_VESSEL_IDENTITY_ID,
  vesselRegistryId: undefined,
  vesselSelfReportedId: undefined,
  vesselIdentitySource: VesselIdentitySourceEnum.Registry,
  vesselActivityMode: 'type',
  vesselSection: 'activity',
  vesselArea: 'eez',
  vesselRelated: 'encounters',
  viewOnlyVessel: true,
}

export const DEFAULT_VESSEL_GROUP_REPORT_STATE: VesselGroupReportState = {
  vesselGroupReportSection: 'vessels',
  vesselGroupReportSectionCategory: undefined,
}

export type VesselRenderField<Key = string> = {
  key: Key
  label?: string
  terminologyKey?: I18nNamespaces['dataTerminology']
}

const COMMON_FIELD_GROUPS: VesselRenderField[][] = [
  [{ key: 'shipname' }, { key: 'flag' }],
  [{ key: 'ssvid', label: 'mmsi' }, { key: 'imo' }, { key: 'callsign' }],
]

// TODO review private datasets to ensure there are no missing fields

type CustomVMSGroup = Partial<Record<SelfReportedSource, VesselRenderField[][]>>
export const CUSTOM_VMS_IDENTITY_FIELD_GROUPS: CustomVMSGroup = {
  [SelfReportedSource.Peru]: [
    [{ key: 'origin' }, { key: 'fleet' }, { key: 'nationalId' }],
    [{ key: 'capacity' }, { key: 'beam' }],
  ],
  [SelfReportedSource.CostaRica]: [[{ key: 'nationalId' }]],
  [SelfReportedSource.Indonesia]: [
    [{ key: 'widthRange' }, { key: 'lengthRange' }, { key: 'grossTonnageRange' }],
  ],
  [SelfReportedSource.Brazil]: [
    [{ key: 'fishingZone' }, { key: 'mainGear' }, { key: 'targetSpecies' }],
    [{ key: 'codMarinha' }],
  ],
  [SelfReportedSource.Chile]: [[{ key: 'fleet' }]],
}

const SELF_REPORTED_FIELD_GROUPS: VesselRenderField[][] = [
  [
    { key: 'shiptypes', terminologyKey: 'shiptype' },
    { key: 'geartypes', terminologyKey: 'geartype' },
  ],
]

export const IDENTITY_FIELD_GROUPS: Record<VesselIdentitySourceEnum, VesselRenderField[][]> = {
  [VesselIdentitySourceEnum.SelfReported]: [...COMMON_FIELD_GROUPS, ...SELF_REPORTED_FIELD_GROUPS],
  [VesselIdentitySourceEnum.Registry]: [
    ...COMMON_FIELD_GROUPS,
    [
      { key: 'geartypes' },
      { key: 'lengthM', label: 'length' },
      { key: 'tonnageGt', label: 'grossTonnage' },
    ],
  ],
}

export const REGISTRY_FIELD_GROUPS: VesselRenderField<
  keyof Pick<IdentityVesselData, 'registryOwners' | 'registryPublicAuthorizations'>
>[] = [
  {
    key: 'registryOwners',
    label: 'owner',
    terminologyKey: 'owner',
  },
  {
    key: 'registryPublicAuthorizations',
    label: 'authorization',
    terminologyKey: 'authorization',
  },
]

export const REGIONS_PRIORITY: RegionType[] = [
  RegionType.mpa,
  RegionType.eez,
  RegionType.fao,
  RegionType.rfmo,
]
