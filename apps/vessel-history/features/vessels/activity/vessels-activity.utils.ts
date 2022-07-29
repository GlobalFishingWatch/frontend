import { ValueItem } from 'types'
import { ActivityEvent } from 'types/activity'

export const groupEvents = (events: ActivityEvent[]) => {
  console.error('not implemented yet')
}

export const getEncounterStatus = (event: ActivityEvent): string => {
  return event.encounter?.authorizationStatus || ''
}

export const getUniqueHistoryValues = (valuesHistory: ValueItem[]) =>
  Array.from(new Set((valuesHistory ?? []).map((item) => item.value)))
