export type PortsReportVesselsProperty = 'flag' | 'geartype'

export type PortsReportState = {
  portsReportName?: string
  portsReportCountry?: string
  portsReportDatasetId?: string
  portsReportVesselsProperty?: PortsReportVesselsProperty
  portsReportVesselsPage?: number
  portsReportVesselsResultsPerPage?: number
  portsReportVesselsFilter?: string
}

export type PortsReportStateProperty = keyof PortsReportState
