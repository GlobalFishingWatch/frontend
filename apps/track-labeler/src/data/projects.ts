import type { Label } from '../types';
import { ActionType } from '../types'

import { Field } from './models'

export type Project = {
  name: string
  dataset: string
  labels: Label[]
  available_filters: Field[]
  display_options: Field[]
  permission: {
    type: string
    value: string
    action: string
  }
}

export const commonFilters: Field[] = [Field.speed, Field.elevation, Field.timestamp]

export const PROJECTS: any = {
  '1': {
    name: 'Sand Dredger Tracks',
    dataset: 'sand-dredger-tracks:v20200828',
    //dataset: 'carriers',
    labels: [
      {
        id: ActionType.dredging,
        name: 'Dredging',
      },
      {
        id: ActionType.nondredging,
        name: 'Non Dredging',
      },
      {
        id: ActionType.transiting,
        name: 'Transit',
      },
      {
        id: ActionType.transporting,
        name: 'Transporting',
      },
      {
        id: ActionType.discharging,
        name: 'Discharging',
      },
      {
        id: ActionType.dumping,
        name: 'Dumping',
      },
    ],
    available_filters: [...commonFilters, Field.distanceFromPort],
    display_options: [Field.speed, Field.distanceFromPort, Field.elevation],
    permission: {
      type: 'labeler-project',
      value: 'sand-dredger',
      action: 'read',
    },
  },
  '2': {
    name: 'Trawler Tracks',
    dataset: 'public-global-fishing-longliner-tracks:v20201001',
    labels: [
      {
        id: ActionType.trawling,
        name: 'Trawling',
        color: '#FF5F00',
      },
      {
        id: ActionType.bottom_trawling,
        name: 'Bottom Trawling',
        color: '#ff00ff',
      },
      {
        id: ActionType.mid_trawling,
        name: 'Mid Trawling',
        color: '#9966FF',
      },
      {
        id: ActionType.hauling,
        name: 'Hauling',
        color: '#6FE9FE',
      },
      {
        id: ActionType.other,
        name: 'Other Activity',
        color: '#E1B57B',
      },
    ],
    available_filters: [...commonFilters, Field.distanceFromPort],
    display_options: [Field.elevation, Field.speed, Field.distanceFromPort],
    permission: {
      type: 'labeler-project',
      value: 'trawler-tracks',
      action: 'read',
    },
  },
  '3': {
    name: 'Longline Tracks',
    dataset: 'public-global-fishing-longliner-tracks:v20201001',
    labels: [
      {
        id: ActionType.setting,
        name: 'Setting',
        color: '#FF5F00',
      },
      {
        id: ActionType.hauling,
        name: 'Hauling',
        color: '#6FE9FE',
      },
      {
        id: ActionType.other,
        name: 'Other Activity',
        color: '#E1B57B',
      },
    ],
    available_filters: [Field.speed, Field.elevation],
    display_options: [Field.speed, Field.elevation],
    permission: {
      type: 'labeler-project',
      value: 'longline-tracks',
      action: 'read',
    },
  },
}
