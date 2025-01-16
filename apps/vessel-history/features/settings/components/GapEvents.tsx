import {
  GAP_EVENTS_MAX_DISTANCE,
  GAP_EVENTS_MAX_DURATION,
  GAP_EVENTS_MIN_DISTANCE,
  GAP_EVENTS_MIN_DURATION,
} from 'data/constants'

import type { SettingEventSectionName, SettingsEvents } from '../settings.slice'

import ActivityEvents from './ActivityEvents'

import styles from './SettingsComponents.module.css'

interface SettingsProps {
  settings: SettingsEvents
  section: SettingEventSectionName
}
const GapEvents: React.FC<SettingsProps> = (props): React.ReactElement<any> => {
  const { settings, section } = props

  return (
    <div className={styles.settingsFieldsContainer}>
      <ActivityEvents
        section={section}
        settings={settings}
        minDuration={GAP_EVENTS_MIN_DURATION}
        maxDuration={GAP_EVENTS_MAX_DURATION}
        minDistance={GAP_EVENTS_MIN_DISTANCE}
        maxDistance={GAP_EVENTS_MAX_DISTANCE}
      ></ActivityEvents>
    </div>
  )
}

export default GapEvents
