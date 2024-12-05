import { TrackPoint } from '@globalfishingwatch/api-types'

export type WorkspaceParam =
  | 'zoom'
  | 'satellite'
  | 'latitude'
  | 'longitude'
  | 'start'
  | 'end'
  | 'vessel'
  | 'minSpeed'
  | 'maxSpeed'
  | 'minElevation'
  | 'maxElevation'
  | 'fromHour'
  | 'toHour'
  | 'hiddenLayers'
  | 'importView'
  | 'project'
  | 'timebarMode'
  | 'workspaceDataviews'
  | 'filterMode'
  | 'colorMode'
  | 'maxDistanceFromPort'
  | 'minDistanceFromPort'
  | 'hiddenLabels'
export type QueryParams = {
  [query in WorkspaceParam]?: string | number | boolean | null
}

export type ContextLayer = {
  id: string
  label: string
  color: string
  active?: boolean
  visible?: boolean
  description?: string
  disabled?: boolean
}

export type CoordinatePosition = {
  latitude: number
  longitude: number
}

export type MapCoordinates = {
  latitude: number
  longitude: number
  zoom: number
}

export declare type VesselPoint = {
  id: string
  type: string
  action: ActionType | string
  position: {
    lng?: number
    lon?: number
    lat: number
  }
  fishing: boolean
  timestamp: number
  distanceFromPort: number
  speed: number
  course: number
  elevation: number
  hour: number
  outOfRange: boolean
}

export enum ActionType {
  untracked = 'untracked',
  selected = 'selected',
  fishing = 'fishing',
  notfishing = 'notfishing',
  transiting = 'transiting',
  dredging = 'dredging',
  nondredging = 'nondredging',
  transporting = 'transporting',
  discharging = 'discharging',
  encounter_other = 'encounter_o',

  setting = 'setting',
  dumping = 'dumping',
  hauling = 'hauling',
  btw_set_haul = 'btw_set_haul',
  other = 'other',
  trawling = 'trawling',
  bottom_trawling = 'bottom_trawling',
  mid_trawling = 'mid_trawling',
}

export type TrackColor = {
  [A in ActionType | string]: string
}

export const TRACK_COLORS: TrackColor = {
  // Colors defined for
  // https://globalfishingwatch.atlassian.net/browse/LABELER-79
  // in https://globalfishingwatch.slack.com/archives/CE4LDNQ4B/p1615397369068300
  [ActionType.untracked]: '#8091AB',
  [ActionType.selected]: '#ffffff',
  [ActionType.fishing]: '#FFD714',
  [ActionType.notfishing]: '#FDA16F',
  [ActionType.transiting]: '#5D88FF',
  [ActionType.dredging]: '#FC9B98',
  [ActionType.nondredging]: '#B3DF8A',
  [ActionType.transporting]: '#FF5F00',
  [ActionType.discharging]: '#6FE9FE',
  [ActionType.dumping]: '#9966FF',
  // Preferred by Juanca
  // [ActionType.setting]: '#FC9B98',
  // [ActionType.hauling]: '#B3DF8A',

  // Preferred by Joanna
  [ActionType.setting]: '#00ff00',
  [ActionType.hauling]: '#ff00ff',

  [ActionType.btw_set_haul]: '#5D88FF',
  [ActionType.other]: '#E1B57B',

  [ActionType.trawling]: '#FF5F00',
  [ActionType.bottom_trawling]: '#6FE9FE',
  [ActionType.mid_trawling]: '#9966FF',
}

export type LayersData = {
  action: ActionType | string
  trackPoints: TrackPoint[]
}

export type DayNightLayer = {
  isNight: boolean
  from: number
  to: number
}

export declare type ArrowFeature = {
  type: string
  geometry: {
    type: string
    coordinates: [number, number]
  }
  properties: {
    timestamp: number
    speed: number
    course: number
    action: ActionType
  }
}

export interface VesselDirectionsGeneratorConfig {
  type: 'geojson'
  data: {
    features: ArrowFeature[]
    type: 'FeatureCollection'
  }
}

export type ExportFeature = {
  type: 'Feature'
  geometry: {
    type: 'LineString'
    coordinates: Array<Array<number | undefined | null>>
  }
  properties: {
    type: 'track'
    coordinateProperties: {
      times: Array<number | undefined | null>
      speed: Array<number | undefined | null>
      course: Array<number | undefined | null>
      labels_id: Array<ActionType | string | undefined | null>
      elevation?: Array<number | undefined | null>
    }
  }
}

export type Label = {
  id: string
  name: string
  color?: string
}

export type ExportData = {
  type: 'FeatureCollection'
  properties: {
    version: number
    labeling_project_name?: string
    labeling_project_labels?: Label[]
    vessel: {
      id: string | null | undefined
      shipname: string | null | undefined
      callsign: string | null | undefined
      mmsi: string | null | undefined
      flag: string | null | undefined
      imo: string | null | undefined
    }
  }
  features: ExportFeature[]
}

export type FilterModeValues = {
  [key: string]: { min: number; max: number }
}
