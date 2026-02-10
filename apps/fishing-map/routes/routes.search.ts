import { fallback } from '@tanstack/zod-adapter'
import { z } from 'zod'

import {
  DataviewCategory,
  EventTypes,
  VesselIdentitySourceEnum,
} from '@globalfishingwatch/api-types'
import {
  COLOR_BY,
  FOOTPRINT_HIGH_RES_ID,
  FOOTPRINT_ID,
  FOURWINGS_VISUALIZATION_MODES,
  HEATMAP_ID,
  HEATMAP_LOW_RES_ID,
} from '@globalfishingwatch/deck-layers'

import {
  REPORT_ACTIVITY_GRAPHS,
  REPORT_EVENTS_GRAPHS,
  REPORT_VESSEL_GRAPHS,
} from 'features/reports/reports.config'
import {
  REPORT_VESSEL_ORDER_DIRECTIONS,
  REPORT_VESSEL_ORDER_PROPERTIES,
  ReportCategory,
} from 'features/reports/reports.types'
import { SEARCH_TYPES } from 'features/search/search.config'
import {
  VESSEL_AREA_SUBSECTIONS,
  VESSEL_PROFILE_ACTIVITY_MODES,
  VESSEL_RELATED_SUBSECTIONS,
  VESSEL_SECTIONS,
} from 'features/vessel/vessel.types'
import type { QueryParams } from 'types'
import {
  BUFFER_OPERATIONS,
  BUFFER_UNITS,
  TimebarGraphs,
  TimebarVisualisations,
  UserTab,
} from 'types'

const optionalNumber = () => fallback(z.coerce.number().optional(), undefined)
const optionalBoolean = () => fallback(z.union([z.boolean(), z.stringbool()]).optional(), undefined)
const optionalString = () => z.string().optional()
const optionalStringArray = () => fallback(z.array(z.string()).optional(), undefined)
const optionalEnum = <T extends string>(enumObj: Record<string, T>) =>
  fallback(z.enum(Object.values(enumObj) as [T, ...T[]]).optional(), undefined)
const optionalLiteralUnion = <T extends string>(values: readonly [T, ...T[]]) =>
  fallback(z.enum(values).optional(), undefined)

// TODO:RR review if we can use this as source of truth for the search params and remove the types/index.ts file
// ── Search params schema ────────────────────────────────────────────────────
// Covers every field in QueryParams (types/index.ts).
//
// Complex types (dataviewInstances, mapRulers, mapAnnotations, …) are already
// deeply parsed upstream by parseWorkspace + BASE_URL_TO_OBJECT_TRANSFORMATION
// and validated here only at a structural level.
//
// .partial() makes every key optional so TanStack Router doesn't force
// callers (Link, navigate, redirect) to always supply `search`.
// .passthrough() lets any future / untracked fields flow through.

export const searchParamsSchema = z
  .object({
    latitude: optionalNumber(),
    longitude: optionalNumber(),
    zoom: optionalNumber(),
    start: optionalString(),
    end: optionalString(),

    // ── WorkspaceState (extends BaseUrlWorkspace) ─────────────────────────
    activityCategory: optionalString(), // legacy
    dataviewInstances: z.array(z.any()).optional(), // deep-parsed by parseWorkspace
    dataviewInstancesOrder: optionalStringArray(),
    activityVisualizationMode: optionalLiteralUnion(FOURWINGS_VISUALIZATION_MODES),
    bivariateDataviews: fallback(
      z.union([z.tuple([z.string(), z.string()]), z.null()]).optional(),
      undefined
    ),
    collapsedSections: fallback(
      z.array(z.enum(Object.values(DataviewCategory) as [string, ...string[]])).optional(),
      undefined
    ),
    daysFromLatest: optionalNumber(),
    detectionsVisualizationMode: optionalLiteralUnion(FOURWINGS_VISUALIZATION_MODES),
    environmentVisualizationMode: optionalLiteralUnion([HEATMAP_ID, HEATMAP_LOW_RES_ID] as const),
    mapAnnotations: z.array(z.any()).optional(), // deep-parsed by parseWorkspace
    mapAnnotationsVisible: optionalBoolean(),
    mapRulers: z.array(z.any()).optional(), // deep-parsed by parseWorkspace
    mapRulersVisible: optionalBoolean(),
    readOnly: optionalBoolean(),
    reportLoadVessels: optionalBoolean(),
    sidebarOpen: optionalBoolean(),
    timebarGraph: optionalEnum(TimebarGraphs),
    timebarSelectedEnvId: optionalString(),
    timebarSelectedUserId: optionalString(),
    timebarSelectedVGId: optionalString(),
    timebarVisualisation: optionalEnum(TimebarVisualisations),
    vesselGroupsVisualizationMode: optionalLiteralUnion([
      FOOTPRINT_ID,
      FOOTPRINT_HIGH_RES_ID,
    ] as const),
    vesselsColorBy: optionalLiteralUnion(Object.keys(COLOR_BY) as [string, ...string[]]),
    vesselsMaxTimeGapHours: optionalNumber(),
    visibleEvents: fallback(
      z
        .union([
          z.array(z.enum(Object.values(EventTypes) as [string, ...string[]])),
          z.enum(['all', 'none']),
        ])
        .optional(),
      undefined
    ),

    // ── Partial<VesselProfileState> ───────────────────────────────────────
    vesselDatasetId: optionalString(),
    vesselRegistryId: optionalString(),
    vesselSelfReportedId: optionalString(),
    vesselSection: optionalLiteralUnion(VESSEL_SECTIONS),
    vesselArea: optionalLiteralUnion(VESSEL_AREA_SUBSECTIONS),
    vesselRelated: optionalLiteralUnion(VESSEL_RELATED_SUBSECTIONS),
    vesselIdentitySource: optionalEnum(VesselIdentitySourceEnum),
    vesselActivityMode: optionalLiteralUnion(VESSEL_PROFILE_ACTIVITY_MODES),
    includeRelatedIdentities: optionalBoolean(),

    // ── Partial<ReportState> ──────────────────────────────────────────────
    // ReportCategoryState
    reportCategory: optionalEnum(ReportCategory),

    // ReportSubcategoryState
    reportActivitySubCategory: optionalString(),
    reportDetectionsSubCategory: optionalString(),
    reportEventsSubCategory: optionalString(),
    reportVesselsSubCategory: optionalString(),

    // ReportVesselsState
    reportVesselFilter: optionalString(),
    reportVesselGraph: optionalLiteralUnion(REPORT_VESSEL_GRAPHS),
    reportVesselPage: optionalNumber(),
    reportVesselResultsPerPage: optionalNumber(),
    reportVesselOrderProperty: optionalLiteralUnion(REPORT_VESSEL_ORDER_PROPERTIES),
    reportVesselOrderDirection: optionalLiteralUnion(REPORT_VESSEL_ORDER_DIRECTIONS),

    // ReportActivityState
    reportActivityGraph: optionalLiteralUnion(REPORT_ACTIVITY_GRAPHS),
    reportTimeComparison: fallback(
      z
        .object({
          start: z.string(),
          compareStart: z.string(),
          duration: z.coerce.number(),
          durationType: z.enum(['days', 'months']),
        })
        .optional(),
      undefined
    ),
    reportComparisonDataviewIds: fallback(
      z
        .object({
          main: z.string(),
          compare: z.string().optional(),
        })
        .optional(),
      undefined
    ),

    // ReportEventsState
    reportEventsGraph: optionalLiteralUnion(REPORT_EVENTS_GRAPHS),
    reportEventsPortsFilter: optionalString(),
    reportEventsPortsPage: optionalNumber(),
    reportEventsPortsResultsPerPage: optionalNumber(),

    // AreaReportState
    reportAreaBounds: fallback(
      z
        .tuple([z.coerce.number(), z.coerce.number(), z.coerce.number(), z.coerce.number()])
        .optional(),
      undefined
    ),
    reportBufferValue: optionalNumber(),
    reportBufferUnit: optionalLiteralUnion(BUFFER_UNITS),
    reportBufferOperation: optionalLiteralUnion(BUFFER_OPERATIONS),

    // PortsReportState
    portsReportName: optionalString(),
    portsReportCountry: optionalString(),
    portsReportDatasetId: optionalString(),

    // ── AppState ──────────────────────────────────────────────────────────
    userTab: optionalEnum(UserTab),
    // mapDrawing — also in BASE_URL_TO_OBJECT_TRANSFORMATION
    // Normalises legacy boolean true / "true" → "polygons"
    mapDrawing: z
      .union([z.enum(['polygons', 'points']), z.boolean()])
      .optional()
      .catch(undefined as 'polygons' | 'points' | boolean | undefined)
      .transform((v) => (v === true ? 'polygons' : v)),
    mapDrawingEditId: optionalString(),
    trackCorrectionId: optionalString(), // 'new' | arbitrary ID string

    // ── RedirectParam ─────────────────────────────────────────────────────
    'access-token': optionalString(),
    callbackUrlStorage: optionalBoolean(),

    // ── VesselSearchState ─────────────────────────────────────────────────
    id: optionalString(),
    query: optionalString(),
    shipname: optionalString(),
    sources: optionalStringArray(),
    searchOption: optionalLiteralUnion(SEARCH_TYPES),
    infoSource: optionalEnum(VesselIdentitySourceEnum),
    ssvid: optionalString(),
    imo: optionalString(),
    callsign: optionalString(),
    codMarinha: optionalString(),
    nationalId: optionalString(),
    flag: optionalStringArray(),
    geartypes: optionalStringArray(), // GearType[] — open-ended, validated downstream
    shiptypes: optionalStringArray(), // VesselType[] — open-ended, validated downstream
    targetSpecies: optionalString(),
    transmissionDateFrom: optionalString(),
    transmissionDateTo: optionalString(),
    owner: optionalString(),
    fleet: optionalStringArray(),
    origin: optionalString(),
  })
  .partial()
  .passthrough()

export function validateSearchParams(search: Record<string, unknown>): QueryParams {
  return searchParamsSchema.parse(search) as QueryParams
}
