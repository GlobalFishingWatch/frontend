import React from 'react'
import {
  FISHING_EVENTS_MAX_DISTANCE,
  FISHING_EVENTS_MAX_DURATION,
  FISHING_EVENTS_MIN_DISTANCE,
  FISHING_EVENTS_MIN_DURATION,
} from 'data/constants'
import { SettingEventSectionName, SettingsEvents } from '../settings.slice'
import ActivityEvents from './ActivityEvents'
import styles from './SettingsComponents.module.css'
interface SettingsProps {
  settings: SettingsEvents
  section: SettingEventSectionName
}

const FishingEvents: React.FC<SettingsProps> = (props): React.ReactElement => {
  const { settings, section } = props

  return (
    <div className={styles.settingsFieldsContainer}>
      <ActivityEvents
        section={section}
        settings={settings}
        minDuration={FISHING_EVENTS_MIN_DURATION}
        maxDuration={FISHING_EVENTS_MAX_DURATION}
        minDistance={FISHING_EVENTS_MIN_DISTANCE}
        maxDistance={FISHING_EVENTS_MAX_DISTANCE}
      ></ActivityEvents>
    </div>
  )
}

export default FishingEvents
