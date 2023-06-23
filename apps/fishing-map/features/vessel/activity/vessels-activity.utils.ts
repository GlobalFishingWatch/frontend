import { ActivityEvent } from 'types/activity'

export const getEncounterStatus = (event: ActivityEvent): string => {
  return event.encounter?.authorizationStatus || ''
}
