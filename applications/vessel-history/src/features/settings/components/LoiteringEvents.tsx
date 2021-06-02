import React from 'react'
import { 
  LOITERING_EVENTS_MAX_DISTANCE, 
  LOITERING_EVENTS_MAX_DURATION, 
  LOITERING_EVENTS_MIN_DISTANCE, 
  LOITERING_EVENTS_MIN_DURATION 
} from 'data/constants'
import { SettingsEvents } from '../settings.slice'
import ActivityEvents from './ActivityEvents'
import '@globalfishingwatch/ui-components/dist/base.css'
import styles from './SettingsComponents.module.css'

interface SettingsProps {
  settings: SettingsEvents
  section: string
}
const LoiteringEvents: React.FC<SettingsProps> = (props): React.ReactElement => {
  const {  settings, section } = props

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
