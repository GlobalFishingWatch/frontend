import { VesselLastIdentity } from 'features/search/search.slice'

export type VesselGroupReportVesselParsed = Omit<VesselLastIdentity, 'dataset'> & {
  index: number
  shipName: string
  vesselType: string
  gearType: string
  flagTranslated: string
  flagTranslatedClean: string
  mmsi: string
  dataset: string
  source: string
}