export type VGRSection = 'vessels' | 'insights' | 'activity' | 'events'
export type VGRVesselsSubsection = 'flag' | 'shiptypes' | 'geartypes' | 'source'
export type VGRActivitySubsection = 'fishing' | 'presence'
export type VGREventsVesselsProperty = 'flag' | 'geartype'
export type VGREventsSubsection = 'encounter' | 'loitering' | 'gaps' | 'port_visits'
export type VGRVesselsOrderProperty = 'shipname' | 'flag' | 'shiptype'
export type VGRVesselsOrderDirection = 'asc' | 'desc'

export type VGRSubsection = VGREventsSubsection | VGRActivitySubsection | VGRVesselsSubsection

export type VesselGroupReportState = {
  viewOnlyVesselGroup: boolean
  vGRSection: VGRSection
  vGRVesselsSubsection?: VGRVesselsSubsection
  vGRActivitySubsection?: VGRActivitySubsection
  vGREventsSubsection?: VGREventsSubsection
  vGREventsVesselsProperty?: VGREventsVesselsProperty
  vGRVesselPage?: number
  vGRVesselsResultsPerPage?: number
  vGRVesselFilter?: string
  vGREventsVesselPage?: number
  vGREventsResultsPerPage?: number
  vGREventsVesselFilter?: string
  vGRVesselsOrderProperty?: VGRVesselsOrderProperty
  vGRVesselsOrderDirection?: VGRVesselsOrderDirection
}

export type VesselGroupReportStateProperty = keyof VesselGroupReportState
