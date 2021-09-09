import { ActivityEvent } from 'types/activity'

export const groupEvents = (events: ActivityEvent[]) => {
  console.error('not implemented yet')
}

export const getEncounterStatus = (event: ActivityEvent): string => {
  return event.encounter?.authorizationStatus || ''
}
