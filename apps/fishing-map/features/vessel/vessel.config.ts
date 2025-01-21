import { RegionType, SelfReportedSource , VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'

import type { I18nNamespaces } from 'features/i18n/i18n.types'
import type { IdentityVesselData } from 'features/vessel/vessel.slice'

import type { VesselProfileState } from './vessel.types'

export const DEFAULT_VESSEL_IDENTITY_DATASET = 'public-global-vessel-identity'
export const DEFAULT_VESSEL_IDENTITY_VERSION = 'v3.0'
export const DEFAULT_VESSEL_IDENTITY_ID = `${DEFAULT_VESSEL_IDENTITY_DATASET}:${DEFAULT_VESSEL_IDENTITY_VERSION}`
export const INCLUDES_RELATED_SELF_REPORTED_INFO_ID = 'POTENTIAL_RELATED_SELF_REPORTED_INFO'
export const CACHE_FALSE_PARAM = { id: 'cache', value: 'false' }
export const REGISTRY_SOURCES = [
  {
    key: 'TMT',
    logo: 'https://globalfishingwatch.org/wp-content/uploads/TMT_logo_primary_RGB@2x.png',
    contact: 'jac-coord@tm-tracking.org',
  },
]

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

export type VesselRenderField<Key = string> = {
  key: Key
  label?: string
  terminologyKey?: I18nNamespaces['dataTerminology']
}

const COMMON_FIELD_GROUPS: VesselRenderField[] = [{ key: 'shipname' }, { key: 'flag' }]

const IDENTIFIER_FIELDS: VesselRenderField[] = [
  { key: 'ssvid', label: 'mmsi' },
  { key: 'imo' },
  { key: 'callsign' },
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

const VESSEL_FISICAL_FEATURES_FIELDS: VesselRenderField[] = [
  { key: 'lengthM', label: 'length' },
  { key: 'depthM', label: 'draft' },
  { key: 'tonnageGt', label: 'grossTonnage' },
]

const VESSEL_SHIPTYPES_FIELD: VesselRenderField = {
  key: 'shiptypes',
  terminologyKey: 'shiptype',
}

const VESSEL_GEARTYPES_FIELD: VesselRenderField = {
  key: 'geartypes',
  terminologyKey: 'geartype',
}

const VESSEL_CLASSIFICATION_FIELDS: VesselRenderField[] = [
  VESSEL_SHIPTYPES_FIELD,
  VESSEL_GEARTYPES_FIELD,
]

export const IDENTITY_FIELD_GROUPS: Record<VesselIdentitySourceEnum, VesselRenderField[][]> = {
  [VesselIdentitySourceEnum.SelfReported]: [
    COMMON_FIELD_GROUPS,
    IDENTIFIER_FIELDS,
    VESSEL_CLASSIFICATION_FIELDS,
  ],
  [VesselIdentitySourceEnum.Registry]: [
    COMMON_FIELD_GROUPS,
    [VESSEL_GEARTYPES_FIELD, { key: 'builtYear', label: 'year built' }],
    IDENTIFIER_FIELDS,
    VESSEL_FISICAL_FEATURES_FIELDS,
  ],
}

export const REGISTRY_FIELD_GROUPS: VesselRenderField<
  keyof Pick<IdentityVesselData, 'registryOwners' | 'registryPublicAuthorizations' | 'operator'>
>[] = [
  {
    key: 'registryOwners',
    label: 'owner',
    terminologyKey: 'owner',
  },
  {
    key: 'operator',
    label: 'operator',
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
