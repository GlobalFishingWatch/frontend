import {
  LOITERING_EVENTS_MAX_DISTANCE,
  LOITERING_EVENTS_MAX_DURATION,
  LOITERING_EVENTS_MIN_DISTANCE,
  LOITERING_EVENTS_MIN_DURATION,
} from 'data/constants'

import type { SettingEventSectionName, SettingsEvents } from '../settings.slice'

import ActivityEvents from './ActivityEvents'

import styles from './SettingsComponents.module.css'

interface SettingsProps {
  settings: SettingsEvents
  section: SettingEventSectionName
}
const LoiteringEvents: React.FC<SettingsProps> = (props): React.ReactElement<any> => {
  const { settings, section } = props

  return (
    <div className={styles.settingsFieldsContainer}>
      <ActivityEvents
        section={section}
        settings={settings}
        minDuration={LOITERING_EVENTS_MIN_DURATION}
        maxDuration={LOITERING_EVENTS_MAX_DURATION}
        minDistance={LOITERING_EVENTS_MIN_DISTANCE}
        maxDistance={LOITERING_EVENTS_MAX_DISTANCE}
      ></ActivityEvents>
    </div>
  )
}

export default LoiteringEvents
