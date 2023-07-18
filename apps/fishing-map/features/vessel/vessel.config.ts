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
  [{ key: 'registryOwners[0].owner', label: 'owner' }],
  [
    { key: 'lengthM', label: 'length' },
    { key: 'tonnageGt', label: 'grossTonnage' },
  ],
]
export const IDENTITY_FIELDS_INFO_AVAILABLE = ['geartype', 'shiptype']
