import { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'

export const getEncounterStatus = (event: ActivityEvent): string => {
  return event.encounter?.authorizationStatus || ''
}
