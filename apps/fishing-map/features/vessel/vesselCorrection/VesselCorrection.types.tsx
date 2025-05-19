export type RelevantDataFields = {
  flag: string
  shipname: string
  geartypes: string
  shiptypes: string
  ssvid: string
  imo: string
  callsign: string
  comments?: string
}

export type InfoCorrectionSendFormat = {
  reviewer: string
  source: string
  workspaceLink: string
  dateSubmitted: string
  timeRange: string
  vesselId: string

  originalValues: RelevantDataFields
  proposedCorrections?: Partial<RelevantDataFields>
}

export const VALID_REGISTRY_FIELDS = [
  'ssvid',
  'shipname',
  'callsign',
  'imo',
  'flag',
  'shiptypes',
  'geartypes',

  // 'builtYear',
  // 'depthM',
  // 'lengthM',
  // 'tonnageGt',
  // 'registryOwners',
  // 'operator',
  // 'registryPublicAuthorizations',
]

export const VALID_AIS_FIELDS = ['shiptypes', 'geartypes']

//

export type ProposedFields = {
  flagCorrected?: string
  shipnameCorrected?: string
  geartypesCorrected?: string
  shiptypesCorrected?: string
  ssvidCorrected?: string
  imoCorrected?: string
  callsignCorrected?: string
}

export type InfoCorrectionSendFormdrgdfgat = {
  reviewer: string
  source: string
  workspaceLink: string
  dateSubmitted: string
  timeRange: string
  vesselId: string

  // originalValues
  flag: string
  shipname: string
  geartypes: string
  shiptypes: string
  ssvid: string
  imo: string
  callsign: string

  // proposedValues
  flagCorrected?: string
  shipnameCorrected?: string
  geartypesCorrected?: string
  shiptypesCorrected?: string
  ssvidCorrected?: string
  imoCorrected?: string
  callsignCorrected?: string

  comments?: string
}
