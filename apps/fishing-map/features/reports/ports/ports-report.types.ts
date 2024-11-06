export type PortReportVesselsSubsection = 'flag' | 'shiptypes' | 'geartypes' | 'source'

export type PortsReportState = {
  portsReportVesselsSubsection?: PortReportVesselsSubsection
  portsReportVesselPage?: number
  portsReportVesselsResultsPerPage?: number
  portsReportVesselFilter?: string
  portsReportVesselsOrderProperty?: string
  portsReportVesselsOrderDirection?: string
}

export type PortsReportStateProperty = keyof PortsReportState
