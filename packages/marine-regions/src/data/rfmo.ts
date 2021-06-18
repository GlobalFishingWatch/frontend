import { MarineRegion, MarineRegionLocaleKey } from '../marine-regions'

const rfmo: Record<string, MarineRegion<MarineRegionLocaleKey>> = {
  CCSBT: { id: 'CCSBT', label: 'CCSBT' },
  IATTC: { id: 'IATTC', label: 'IATTC' },
  ICCAT: { id: 'ICCAT', label: 'ICCAT' },
  IOTC: { id: 'IOTC', label: 'IOTC' },
  WCPFC: { id: 'WCPFC', label: 'WCPFC' },
}

export default rfmo
