export type VesselRenderField = {
  key: string
  label: string
}
export const IDENTITY_FIELD_GROUPS: VesselRenderField[][] = [
  [
    { key: 'shipname', label: 'shipname' },
    { key: 'flag', label: 'flag' },
  ],
  [
    { key: 'shiptype', label: 'shiptype' },
    { key: 'geartype', label: 'geartype' },
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
export const IDENTITY_FIELDS_INFO_AVAILABLE = ['geartype', 'shiptype']
