export type VesselGroupReportSection = 'vessels' | 'insights' | 'activity' | 'events'
export type VesselGroupReportVesselsSubsection = 'flag' | 'shiptypes' | 'geartypes' | 'source'
export type VesselGroupReportActivitySubsection = 'fishing-effort' | 'presence'
export type VesselGroupReportEventsVesselsProperty = 'flag' | 'geartype'
export type VesselGroupReportEventsSubsection =
  | 'encounter-events'
  | 'loitering'
  | 'gaps'
  | 'port_visits'
export type VesselGroupReportVesselsOrderProperty = 'shipname' | 'flag' | 'shiptype'
export type VesselGroupReportVesselsOrderDirection = 'asc' | 'desc'

export type VesselGroupReportState = {
  viewOnlyVesselGroup: boolean
  vesselGroupReportSection: VesselGroupReportSection
  vesselGroupReportVesselsSubsection?: VesselGroupReportVesselsSubsection
  vesselGroupReportActivitySubsection?: VesselGroupReportActivitySubsection
  vesselGroupReportEventsSubsection?: VesselGroupReportEventsSubsection
  vesselGroupReportEventsVesselsProperty?: VesselGroupReportEventsVesselsProperty
  vesselGroupReportVesselPage?: number
  vesselGroupReportResultsPerPage?: number
  vesselGroupReportVesselFilter?: string
  vesselGroupReportEventsVesselPage?: number
  vesselGroupReportEventsResultsPerPage?: number
  vesselGroupReportEventsVesselFilter?: string
  vesselGroupReportVesselsOrderProperty?: VesselGroupReportVesselsOrderProperty
  vesselGroupReportVesselsOrderDirection?: VesselGroupReportVesselsOrderDirection
}

export type VesselGroupReportStateProperty = keyof VesselGroupReportState
