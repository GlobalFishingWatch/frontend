import { SelfReportedSource, VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { DATASET_PRIVATE_PREFIX } from '@globalfishingwatch/datasets-client'

import type I18nNamespaces from 'features/i18n/i18n.types'
import { VMS_PANAMA_V4_1_PREVIEW } from 'features/user/user.config'
import type { IdentityVesselData } from 'features/vessel/vessel.slice'

export type VesselRenderField<Key = string> = {
  key: Key
  label?: string
  terminologyKey?: keyof I18nNamespaces['data-terminology']
  renderPlain?: boolean
}

const COMMON_FIELD_GROUPS: VesselRenderField[] = [{ key: 'shipname' }, { key: 'flag' }]

const IDENTIFIER_FIELDS: VesselRenderField[] = [
  { key: 'ssvid', label: 'mmsi' },
  { key: 'imo' },
  { key: 'callsign' },
]

const VESSEL_FISICAL_FEATURES_FIELDS: VesselRenderField[] = [
  { key: 'lengthM', label: 'lengthM' },
  { key: 'depthM', label: 'depthM' },
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

export const SELF_REPORTED_SECTION_SPLIT = 2

export const IDENTITY_FIELD_GROUPS: Record<VesselIdentitySourceEnum, VesselRenderField[][]> = {
  [VesselIdentitySourceEnum.SelfReported]: [
    [
      { key: 'shipname' },
      { key: 'shiptypes', renderPlain: true, label: 'vesselType' },
      { key: 'flag' },
    ],
    IDENTIFIER_FIELDS,
    [VESSEL_SHIPTYPES_FIELD, VESSEL_GEARTYPES_FIELD, { key: 'lengthM', label: 'lengthM' }],
    [{ key: 'tonnageGt', label: 'grossTonnage' }],
  ],
  [VesselIdentitySourceEnum.Registry]: [
    COMMON_FIELD_GROUPS,
    [VESSEL_GEARTYPES_FIELD, { key: 'builtYear' }],
    IDENTIFIER_FIELDS,
    VESSEL_FISICAL_FEATURES_FIELDS,
  ],
}

export const REGISTRY_FIELD_GROUPS: VesselRenderField<
  keyof Pick<
    IdentityVesselData,
    'registryOwners' | 'registryPublicAuthorizations' | 'operator' | 'recordId'
  >
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
  {
    key: 'recordId',
    label: 'recordId',
  },
]

type CustomVMSGroup = Partial<
  Record<
    SelfReportedSource | `${SelfReportedSource}-${typeof DATASET_PRIVATE_PREFIX}`,
    VesselRenderField[][]
  >
>

export const CUSTOM_VMS_IDENTITY_FIELD_GROUPS: CustomVMSGroup = {
  [SelfReportedSource.Peru_Pipe3]: [
    [{ key: 'origin' }, { key: 'fleet' }, { key: 'nationalId' }],
    [{ key: 'length' }, { key: 'capacity' }, { key: 'beam' }],
    [{ key: 'regimen' }, { key: 'resolution' }],
    [{ key: 'casco' }, { key: 'chdSpecies' }],
  ],
  [SelfReportedSource.CostaRica_Pipe3]: [[{ key: 'nationalId' }]],
  [SelfReportedSource.Indonesia]: [[{ key: 'width' }, { key: 'length' }, { key: 'grossTonnage' }]],
  [SelfReportedSource.Brazil_Pipe3]: [
    [{ key: 'fishingZone' }, { key: 'mainGear' }, { key: 'targetSpecies' }],
    [{ key: 'codMarinha' }],
  ],
  [SelfReportedSource.Chile_Pipe3]: [[{ key: 'fleet' }]],
  [SelfReportedSource.Peru]: [
    [{ key: 'origin' }, { key: 'sourceFleet' }, { key: 'externalId' }],
    [{ key: 'length' }, { key: 'holdCapacityM3' }, { key: 'beam' }],
    [{ key: 'licenseDescription' }, { key: 'resolution' }],
    [{ key: 'hull' }, { key: 'targetSpecies' }],
  ],
  [SelfReportedSource.CostaRica]: [[{ key: 'externalId' }]],
  [SelfReportedSource.Brazil]: [
    [{ key: 'fishingZone' }, { key: 'mainGear' }, { key: 'targetSpecies' }],
    [{ key: 'externalId' }],
  ],
  [SelfReportedSource.Montenegro]: [[{ key: 'length' }]],
  [SelfReportedSource.Chile]: [[{ key: 'sourceFleet' }]],
  ...(VMS_PANAMA_V4_1_PREVIEW ? { [SelfReportedSource.Panama]: [[{ key: 'sourceFleet' }]] } : {}),
  [`${SelfReportedSource.Brazil}-${DATASET_PRIVATE_PREFIX}`]: [
    [{ key: 'vesselRegistrationCode' }, { key: 'fleetCode', terminologyKey: 'fleetCode' }],
    [
      { key: 'fishingLicenseCode' },
      { key: 'fishingLicenseStatus', terminologyKey: 'fishingLicenseStatus' },
    ],
    [{ key: 'fishingLicenseStartDate' }, { key: 'fishingLicenseEndDate' }],
    [{ key: 'builtYear' }, { key: 'length' }],
    [{ key: 'grossTonnage' }, { key: 'horsePower' }],
  ],
}

export const REGISTRY_SOURCES = [
  {
    key: 'TMT',
    logo: 'https://globalfishingwatch.org/wp-content/uploads/TMT_logo_primary_RGB@2x.png',
    contact: 'jac-coord@tm-tracking.org',
  },
]

// Context passed to condition() callbacks in IdentitySection
export type VesselRenderContext = {
  identitySource: VesselIdentitySourceEnum
  isVMS: boolean
  isChileanVMS: boolean
  isBrazilVMS: boolean
  isGFWUser: boolean
  isJACUser: boolean
  hasTMTPermission: boolean
  isPrivateDataset: boolean
  hasMoreInfo: boolean
  hasSsvid: boolean
}

export type IdentityFieldSection = {
  type: 'fields'
  key: string
  terminologyKey?: keyof I18nNamespaces['data-terminology']
  sectionLabel?: string
  fields: VesselRenderField[][]
  condition?: (ctx: VesselRenderContext) => boolean
}

export type RegistryGroupSection = {
  type: 'registry'
  key: string
  registryField: (typeof REGISTRY_FIELD_GROUPS)[number]
  condition?: (ctx: VesselRenderContext) => boolean
}

export type RegistryContactSection = {
  type: 'registryContact'
  key: string
  condition?: (ctx: VesselRenderContext) => boolean
}

export type ExternalLinksSection = {
  type: 'externalLinks'
  key: string
  condition?: (ctx: VesselRenderContext) => boolean
}

export type IdentitySection =
  | IdentityFieldSection
  | RegistryGroupSection
  | RegistryContactSection
  | ExternalLinksSection

// t('vessel.selfReportedByVessel')
// t('vessel.gfwPredictions')

export const FULL_IDENTITY_LAYOUT: IdentitySection[] = [
  // AIS: Self-reported by vessel
  {
    type: 'fields',
    key: 'selfReportedByVessel',
    sectionLabel: 'selfReportedByVessel',
    terminologyKey: 'selfReported',
    fields: IDENTITY_FIELD_GROUPS[VesselIdentitySourceEnum.SelfReported].slice(
      0,
      SELF_REPORTED_SECTION_SPLIT
    ),
    condition: (ctx) => ctx.identitySource === VesselIdentitySourceEnum.SelfReported && !ctx.isVMS,
  },
  // AIS: GFW predictions
  {
    type: 'fields',
    key: 'gfwPredictions',
    sectionLabel: 'gfwPredictions',
    terminologyKey: 'shiptype',
    fields: IDENTITY_FIELD_GROUPS[VesselIdentitySourceEnum.SelfReported].slice(
      SELF_REPORTED_SECTION_SPLIT
    ),
    condition: (ctx) => ctx.identitySource === VesselIdentitySourceEnum.SelfReported && !ctx.isVMS,
  },
  // VMS
  {
    type: 'fields',
    key: 'selfReportedVMS',
    fields: IDENTITY_FIELD_GROUPS[VesselIdentitySourceEnum.SelfReported],
    condition: (ctx) => ctx.identitySource === VesselIdentitySourceEnum.SelfReported && ctx.isVMS,
  },
  // Registry: base fields
  {
    type: 'fields',
    key: 'registryFields',
    fields: IDENTITY_FIELD_GROUPS[VesselIdentitySourceEnum.Registry],
    condition: (ctx) => ctx.identitySource === VesselIdentitySourceEnum.Registry,
  },
  // Registry: owners
  {
    type: 'registry',
    key: 'registryOwners',
    registryField: REGISTRY_FIELD_GROUPS[0],
    condition: (ctx) => ctx.identitySource === VesselIdentitySourceEnum.Registry,
  },
  // Registry: operator
  {
    type: 'registry',
    key: 'operator',
    registryField: REGISTRY_FIELD_GROUPS[1],
    condition: (ctx) => ctx.identitySource === VesselIdentitySourceEnum.Registry,
  },
  // Registry: authorizations
  {
    type: 'registry',
    key: 'registryPublicAuthorizations',
    registryField: REGISTRY_FIELD_GROUPS[2],
    condition: (ctx) => ctx.identitySource === VesselIdentitySourceEnum.Registry,
  },
  // Registry: recordId (GFW only)
  {
    type: 'registry',
    key: 'recordId',
    registryField: REGISTRY_FIELD_GROUPS[3],
    condition: (ctx) => ctx.identitySource === VesselIdentitySourceEnum.Registry,
  },
  // Registry: TMT card
  {
    type: 'registryContact',
    key: 'registryContact',
    condition: (ctx) =>
      ctx.identitySource === VesselIdentitySourceEnum.Registry &&
      ctx.hasMoreInfo &&
      ctx.hasTMTPermission,
  },
  // External tool links (all modes with SSVID)
  {
    type: 'externalLinks',
    key: 'externalLinks',
    condition: (ctx) => ctx.hasSsvid,
  },
]
