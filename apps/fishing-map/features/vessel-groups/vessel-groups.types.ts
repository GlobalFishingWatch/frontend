export type VesselGroupReportSection = 'vessels' | 'insights' | 'activity' | 'events'
export type VesselGroupReportVesselsSubsection = 'flag' | 'shiptypes' | 'geartypes' | 'source'
export type VesselGroupReportActivitySubsection = 'fishing-effort' | 'presence'
export type VesselGroupReportEventsSubsection = 'fishing' | 'encounters' | 'port' | 'loitering'
export type VesselGroupReportVesselsOrderProperty = 'shipname' | 'flag' | 'shiptype'
export type VesselGroupReportVesselsOrderDirection = 'asc' | 'desc'

export type VesselGroupReportState = {
  viewOnlyVesselGroup: boolean
  vesselGroupReportSection: VesselGroupReportSection
  vesselGroupReportVesselsSubsection?: VesselGroupReportVesselsSubsection
  vesselGroupReportActivitySubsection?: VesselGroupReportActivitySubsection
  vesselGroupReportEventsSubsection?: VesselGroupReportEventsSubsection
  vesselGroupReportVesselPage?: number
  vesselGroupReportResultsPerPage?: number
  vesselGroupReportVesselFilter?: string
  vesselGroupReportVesselsOrderProperty?: VesselGroupReportVesselsOrderProperty
  vesselGroupReportVesselsOrderDirection?: VesselGroupReportVesselsOrderDirection
}

export type VesselGroupReportStateProperty = keyof VesselGroupReportState
