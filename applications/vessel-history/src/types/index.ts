export type WorkspaceParam =
  | 'zoom'
  | 'latitude'
  | 'longitude'
  | 'start'
  | 'end'
  | 'vessel'
  | 'timebarMode'

export type QueryParams = {
  [query in WorkspaceParam]?: string | number | boolean | null
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
}

export type TrackColor = {
  [A in ActionType | string]: string
}

export const TRACK_COLORS: TrackColor = {
  [ActionType.untracked]: '#8091AB',
  [ActionType.selected]: '#ffffff',
  [ActionType.fishing]: '#FFD714',
  [ActionType.notfishing]: '#FDA16F',
  [ActionType.transiting]: '#01FE6A',
  [ActionType.dredging]: '#00ffbc',
  [ActionType.nondredging]: '#ff64ce',
  [ActionType.transporting]: '#00eeff',
  [ActionType.discharging]: '#9da4ff',
}
