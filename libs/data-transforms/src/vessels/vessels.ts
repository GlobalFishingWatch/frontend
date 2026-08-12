export const SSVID_LENGTH = 9
export const IMO_LENGTH = 7
export const CALLSIGN_MIN_LENGTH = 4

export type VesselIdentifierType = 'ssvid' | 'imo' | 'callsign'

export function getVesselIdentifierType(query?: string): VesselIdentifierType | undefined {
  if (!query) return undefined
  const value = query.trim()
  const isNumeric = /^\d+$/.test(value)
  if (isNumeric && value.length === SSVID_LENGTH) {
    return 'ssvid'
  }
  if (isNumeric && value.length === IMO_LENGTH) {
    return 'imo'
  }
  if (value.length >= CALLSIGN_MIN_LENGTH && /^[A-Z0-9]+$/.test(value)) {
    return 'callsign'
  }
  return undefined
}
