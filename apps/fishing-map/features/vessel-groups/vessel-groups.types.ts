export type VGRSection = 'vessels' | 'insights' | 'activity' | 'events'
export type VGRVesselsSubsection = 'flag' | 'shiptypes' | 'geartypes' | 'source'
export type VGRActivitySubsection = 'fishing' | 'presence'
export type VGREventsVesselsProperty = 'flag' | 'geartype' | 'shiptype'
export type VGREventsSubsection = 'encounter' | 'loitering' | 'gaps' | 'port_visits'

export type VGRSubsection = VGREventsSubsection | VGRActivitySubsection | VGRVesselsSubsection

export type VesselGroupReportState = {
  viewOnlyVesselGroup: boolean
  // TODO:CVP remove this and use general section
  vGRSection: VGRSection
  vGRVesselsSubsection?: VGRVesselsSubsection
  vGRActivitySubsection?: VGRActivitySubsection
  vGREventsSubsection?: VGREventsSubsection
  vGREventsVesselsProperty?: VGREventsVesselsProperty
  vGREventsVesselPage?: number
  vGREventsResultsPerPage?: number
  vGREventsVesselFilter?: string
}

export type VesselGroupReportStateProperty = keyof VesselGroupReportState
