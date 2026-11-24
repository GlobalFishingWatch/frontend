/** Area, port and vessel group reports: get_report_*, get_vessel_group*, get_port_report */

import type {
  AssistantBbox,
  AssistantDatedValue,
  AssistantLoadStatus,
  AssistantTimeRange,
} from './shared-context-tool.types.js'

export type AssistantReportArea = {
  datasetId?: string
  areaId?: string | number
  name?: string
  status?: string
  global: boolean
  bounds?: AssistantBbox
  buffer?: { value: number; unit?: string; operation?: string }
  savedReport?: { id: string; name: string }
  category?: string
  subcategory?: string
  unit?: string
  timeRange: AssistantTimeRange
  graph?: string
  timeComparison?: {
    start: string
    compareStart: string
    duration: number
    durationType: 'days' | 'months'
  }
}

export type AssistantReportActivityLayer = {
  id: string
  unit?: string
  interval?: string
  points: number
  total: number
  mean?: number
  max?: AssistantDatedValue
  min?: AssistantDatedValue
}

/** `isLoading` alone: still computing, nothing to show yet */
export type AssistantReportActivity =
  | { isLoading: true }
  | {
      isLoading: boolean
      unit?: string
      timeRange: AssistantTimeRange
      layers: AssistantReportActivityLayer[]
    }

export type AssistantCountByValue = { value: string; vessels: number }

export type AssistantReportVessels = {
  status?: string
  unit?: string
  /** Vessels in the table, after the user's table filter */
  total?: number
  /** Vessels in the report, before that filter */
  totalUnfiltered?: number
  totalValue: number
  flags: AssistantCountByValue[]
  geartypes: AssistantCountByValue[]
  vesselTypes: AssistantCountByValue[]
  /** In table order */
  top: {
    id: string
    datasetId?: string
    shipname?: string
    flag?: string
    ssvid?: string
    imo?: string
    geartype?: string
    vesselType?: string
    value?: number
  }[]
  page?: number
}

export type AssistantReportEvents =
  | { status: string }
  | {
      status?: string
      layers: {
        dataviewId?: string
        events?: number
        vessels?: number
        flags?: number
        /** The highest point of the events graph */
        peak?: AssistantDatedValue
        groups?: { name: string; value: number }[]
      }[]
      topVessels: {
        id: string
        datasetId?: string
        shipname?: string
        flag?: string
        events?: number
      }[]
      topPorts?: { id: string; name: string; country: string; value: number }[]
    }

export type AssistantVesselGroup =
  | { status?: string }
  | {
      status?: string
      id: string
      name: string
      vessels: number
      flags: { flag: string; vessels: number }[]
      timeRange: AssistantTimeRange
      category?: string
      subcategory?: string
    }

export type AssistantInsightValue =
  number | unknown[] | { tokyo?: unknown[]; paris?: unknown[] } | undefined

export type AssistantInsightVessels = {
  vessels: number
  top: {
    id: string
    shipname?: string
    flag?: string
    ssvid?: string
    value: AssistantInsightValue
  }[]
}

export type AssistantVesselGroupInsights = {
  timeRange: AssistantTimeRange
  coverage: AssistantLoadStatus | { vessels: number; meanPercentage?: number }
  aisOff: AssistantLoadStatus | AssistantInsightVessels
  fishingInNoTakeMpas: AssistantLoadStatus | AssistantInsightVessels
  fishingInRfmoWithoutKnownAuthorization: AssistantLoadStatus | AssistantInsightVessels
  iuuLists: AssistantLoadStatus | AssistantInsightVessels
  flagChanges: AssistantLoadStatus | AssistantInsightVessels
  mouLists: AssistantLoadStatus | AssistantInsightVessels
}

export type AssistantPortReport = {
  id?: string
  name?: string
  country?: string
  datasetId?: string
  timeRange: AssistantTimeRange
  footprint?: { name?: string; bounds?: AssistantBbox }
}
