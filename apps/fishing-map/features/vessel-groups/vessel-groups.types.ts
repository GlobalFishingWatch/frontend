export type VesselGroupReportSection = 'vessels' | 'insights' | 'activity' | 'events'
export type VesselGroupReportVesselsSubsection = 'flag' | 'shiptypes' | 'geartypes' | 'source'
export type VesselGroupReportActivitySubsection = 'fishing-effort' | 'presence'
export type VGREventsVesselsProperty = 'flag' | 'geartype'
export type VGREventsSubsection = 'encounter-events' | 'loitering' | 'gaps' | 'port_visits'
export type VesselGroupReportVesselsOrderProperty = 'shipname' | 'flag' | 'shiptype'
export type VesselGroupReportVesselsOrderDirection = 'asc' | 'desc'

export type VesselGroupReportState = {
  viewOnlyVesselGroup: boolean
  vGRSection: VesselGroupReportSection
  vGRVesselsSubsection?: VesselGroupReportVesselsSubsection
  vGRActivitySubsection?: VesselGroupReportActivitySubsection
  vGREventsSubsection?: VGREventsSubsection
  vGREventsVesselsProperty?: VGREventsVesselsProperty
  vGRVesselPage?: number
  vGRVesselsResultsPerPage?: number
  vGRVesselFilter?: string
  vGREventsVesselPage?: number
  vGREventsResultsPerPage?: number
  vGREventsVesselFilter?: string
  vGRVesselsOrderProperty?: VesselGroupReportVesselsOrderProperty
  vGRVesselsOrderDirection?: VesselGroupReportVesselsOrderDirection
}

export type VesselGroupReportStateProperty = keyof VesselGroupReportState
