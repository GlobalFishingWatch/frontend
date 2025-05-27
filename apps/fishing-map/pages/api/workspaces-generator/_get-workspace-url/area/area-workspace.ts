import { DatasetSubCategory, EventTypes } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { stringifyWorkspace } from '@globalfishingwatch/dataviews-client'

import { REPORT_DATAVIEW_INSTANCES } from 'data/highlighted-workspaces/report.dataviews'
import {
  EEZ_DATAVIEW_INSTANCE_ID,
  FAO_AREAS_DATAVIEW_INSTANCE_ID,
  MPA_DATAVIEW_INSTANCE_ID,
  RFMO_DATAVIEW_INSTANCE_ID,
} from 'data/workspaces'
import type {
  AnyReportSubCategory,
  ReportActivitySubCategory,
  ReportDetectionsSubCategory,
  ReportEventsSubCategory,
} from 'features/reports/reports.types'
import { ReportCategory } from 'features/reports/reports.types'
import { searchPorts } from 'pages/api/workspaces-generator/_get-workspace-url/port/port-search'
import type { AnyWorkspaceState } from 'types'
import { TimebarVisualisations } from 'types'
import { upperFirst } from 'utils/info'

import { type AreaSearchResult, type AreaType, searchAreas } from '../area/area-search'
import type { ConfigurationParams, DatasetType } from '../types'
import { DEFAULT_WORKSPACE, getDateRangeLabel, getSharedWorkspaceParams } from '../utils'

const AREA_DATAVIEW_BY_TYPE: Record<NonNullable<AreaType>, string> = {
  eez: EEZ_DATAVIEW_INSTANCE_ID,
  fao: FAO_AREAS_DATAVIEW_INSTANCE_ID,
  rfmo: RFMO_DATAVIEW_INSTANCE_ID,
  mpa: MPA_DATAVIEW_INSTANCE_ID,
}

const DATASET_CATEGORY_CONFIG: Record<
  DatasetType,
  { category: ReportCategory; subcategory?: AnyReportSubCategory }
> = {
  activity: { category: ReportCategory.Activity },
  fishing: { category: ReportCategory.Activity, subcategory: DatasetSubCategory.Fishing },
  presence: { category: ReportCategory.Activity, subcategory: DatasetSubCategory.Presence },
  detections: { category: ReportCategory.Detections },
  VIIRS: { category: ReportCategory.Detections, subcategory: DatasetSubCategory.Viirs },
  SAR: { category: ReportCategory.Detections, subcategory: DatasetSubCategory.Sar },
  events: { category: ReportCategory.Events },
  port_visits: { category: ReportCategory.Events, subcategory: EventTypes.Port },
  encounters: { category: ReportCategory.Events, subcategory: EventTypes.Encounter },
  loitering: { category: ReportCategory.Events, subcategory: EventTypes.Loitering },
  environment: { category: ReportCategory.Environment },
  sea_surface_temperature: { category: ReportCategory.Environment },
  salinity: { category: ReportCategory.Environment },
  chlorophyll: { category: ReportCategory.Environment },
}

function getAreaReportCategoryConfig(configuration: ConfigurationParams) {
  const { category, subcategory } = DATASET_CATEGORY_CONFIG[configuration.dataset || 'fishing']
  if (!subcategory) {
    return { reportCategory: category }
  }
  if (category === ReportCategory.Activity) {
    return {
      reportCategory: category,
      reportActivitySubCategory: subcategory as ReportActivitySubCategory,
    }
  }
  if (category === ReportCategory.Detections) {
    return {
      reportCategory: category,
      reportDetectionsSubCategory: subcategory as ReportDetectionsSubCategory,
    }
  }
  if (category === ReportCategory.Events) {
    return {
      reportCategory: category,
      reportEventsSubCategory: subcategory as ReportEventsSubCategory,
    }
  }
  return { reportCategory: category }
}

function getAreaReportDataviewInstances(
  configuration: ConfigurationParams,
  areaMatched: AreaSearchResult
): UrlDataviewInstance[] {
  const filters = {
    ...(configuration.filters?.flags && {
      flag: configuration.filters.flags,
    }),
    ...(configuration.filters?.gear_types &&
      configuration.dataset === 'fishing' && {
        geartypes: configuration.filters.gear_types,
      }),
    ...(configuration.filters?.vessel_types &&
      configuration.dataset === 'presence' && {
        vessel_type: configuration.filters.vessel_types,
      }),
  }

  const dataviewInstances: UrlDataviewInstance[] = REPORT_DATAVIEW_INSTANCES.map((instance) => {
    return {
      ...instance,
      config: {
        ...instance.config,
        filters,
      },
    }
  })
  if (areaMatched.type && AREA_DATAVIEW_BY_TYPE[areaMatched.type]) {
    dataviewInstances.push({
      id: AREA_DATAVIEW_BY_TYPE[areaMatched.type],
      config: {
        visible: true,
      },
    })
  }
  return dataviewInstances
}

export async function getAreaWorkspaceConfig(configuration: ConfigurationParams) {
  const { area, port } = configuration
  if (area?.name) {
    let areasMatched = searchAreas(area)
    if (!areasMatched?.length && port?.name) {
      areasMatched = searchPorts(port)
    }
    if (!areasMatched?.length) {
      return
    }

    const reportParams: AnyWorkspaceState = {
      ...getSharedWorkspaceParams(configuration),
      ...getAreaReportCategoryConfig(configuration),
      dataviewInstances: getAreaReportDataviewInstances(configuration, areasMatched[0]),
      timebarVisualisation: TimebarVisualisations.HeatmapActivity,
      reportLoadVessels: true,
    }
    const links = areasMatched.map((areaMatched) => ({
      url: `/map/${DEFAULT_WORKSPACE}/report/${areaMatched.dataset}/${areaMatched.id}?${stringifyWorkspace(reportParams)}`,
      message: `${upperFirst(configuration.dataset || '')} in ${areaMatched.label} ${getDateRangeLabel(configuration)}`,
    }))
    return {
      label: '',
      links,
    }
  }
}
