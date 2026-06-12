import { SelfReportedSource } from '@globalfishingwatch/api-types'
import { DATASET_PRIVATE_PREFIX } from '@globalfishingwatch/datasets-client'

import type { DataTerminologySlugs } from 'features/cms/loaders/data-terminology.types'

export type VesselRenderField<Key = string> = {
  key: Key
  label?: string
  terminologyKey?: DataTerminologySlugs
  renderPlain?: boolean
}

export const AIS_SELF_REPORTED_SHIPTYPE = 'onFishingListSr'

const AIS_BASE_FIELDS: VesselRenderField[] = [
  { key: 'shipname' },
  { key: AIS_SELF_REPORTED_SHIPTYPE, label: 'vesselType' },
  { key: 'flag' },
]
export const OTHER_BASE_FIELDS: VesselRenderField[] = [{ key: 'shipname' }, { key: 'flag' }]

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

export const GFW_PREDICTION_FIELDS: VesselRenderField[][] = [
  [VESSEL_SHIPTYPES_FIELD, VESSEL_GEARTYPES_FIELD],
  // [VESSEL_SHIPTYPES_FIELD, VESSEL_GEARTYPES_FIELD, { key: 'lengthM', label: 'lengthM' }],
  // [{ key: 'tonnageGt', label: 'grossTonnage' }],
]

export const REGISTRY_FIELDS: VesselRenderField[][] = [
  OTHER_BASE_FIELDS,
  [VESSEL_GEARTYPES_FIELD, { key: 'builtYear' }],
  IDENTIFIER_FIELDS,
  VESSEL_FISICAL_FEATURES_FIELDS,
]

const REGISTRY_OWNER_FIELD: VesselRenderField = {
  key: 'registryOwners',
  label: 'owner',
  terminologyKey: 'owner',
}
const REGISTRY_OPERATOR_FIELD: VesselRenderField = {
  key: 'operator',
  label: 'operator',
}
const REGISTRY_AUTHORIZATIONS_FIELD: VesselRenderField = {
  key: 'registryPublicAuthorizations',
  label: 'authorization',
  terminologyKey: 'authorization',
}
const REGISTRY_RECORDID_FIELD: VesselRenderField = {
  key: 'recordId',
  label: 'recordId',
}
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
  [SelfReportedSource.Panama]: [[{ key: 'sourceFleet' }]],
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

export type IdentitySection = {
  type: 'fields' | 'registryFields'
  key: string
  terminologyKey?: DataTerminologySlugs
  sectionLabel?: string
  field?: VesselRenderField
  fields?: VesselRenderField[][]
}

export const REGISTRY_IDENTITY_LAYOUT: IdentitySection[] = [
  { type: 'fields', key: 'registryFields', fields: REGISTRY_FIELDS },
  { type: 'registryFields', key: 'registryOwners', field: REGISTRY_OWNER_FIELD },
  { type: 'registryFields', key: 'operator', field: REGISTRY_OPERATOR_FIELD },
  {
    type: 'registryFields',
    key: 'registryPublicAuthorizations',
    field: REGISTRY_AUTHORIZATIONS_FIELD,
  },
  { type: 'registryFields', key: 'recordId', field: REGISTRY_RECORDID_FIELD },
]

export const AIS_IDENTITY_LAYOUT: IdentitySection[] = [
  {
    type: 'fields',
    key: 'selfReportedByVessel',
    sectionLabel: 'selfReportedByVessel',
    terminologyKey: 'selfReported',
    fields: [AIS_BASE_FIELDS, IDENTIFIER_FIELDS],
  },
  {
    type: 'fields',
    key: 'gfwPredictions',
    sectionLabel: 'gfwPredictions',
    terminologyKey: 'shiptype',
    fields: GFW_PREDICTION_FIELDS,
  },
]

export const VMS_BASE_IDENTITY_LAYOUT: IdentitySection[] = [
  {
    type: 'fields',
    key: 'selfReportedVMS',
    fields: [OTHER_BASE_FIELDS, [VESSEL_SHIPTYPES_FIELD, VESSEL_GEARTYPES_FIELD]],
  },
]
