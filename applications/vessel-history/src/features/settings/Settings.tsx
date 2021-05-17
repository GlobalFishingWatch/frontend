import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { redirect } from 'redux-first-router'
import { IconButton } from '@globalfishingwatch/ui-components'
import { HOME } from 'routes/routes'
import styles from './Settings.module.css'
import '@globalfishingwatch/ui-components/dist/base.css'
import FishingEvents from './components/FishingEvents'
import LoiteringEvents from './components/LoiteringEvents'
import Encounters from './components/Encounters'
import PortVisits from './components/PortVisits'
import { selectSettings, updateSettings } from './settings.slice'

interface SettingsOption {
  title: string
}

interface SettingsOptions {
  [key: string]: SettingsOption
}

const Settings: React.FC = (): React.ReactElement => {
  const settings = useSelector(selectSettings)
  const options = ['fishing_events', 'encounters', 'loitering_events', 'port_visits']
  const optionsData: SettingsOptions = {
    fishing_events: {
      title: 'Fishing Events',
    },
    encounters: {
      title: 'Encounters',
    },
    loitering_events: {
      title: 'Loitering Events',
    },
    port_visits: {
      title: 'Port Visits',
    },
  }
  const [selectedOption, setSelectedOption] = useState('')

  const dispatch = useDispatch()
  const onBackClick = useCallback(() => {
    if (selectedOption) {
      setSelectedOption('')
    } else {
      dispatch(redirect({ type: HOME }))
    }
  }, [dispatch, selectedOption])

  return (
    <div className={styles.settingsContainer}>
      <header>
        <IconButton
          type="border"
          size="default"
          icon="arrow-left"
          onClick={onBackClick}
          className={styles.backButton}
        />
        <h1>Settings {selectedOption && <span> - {optionsData[selectedOption].title}</span>}</h1>
      </header>
      {!selectedOption && (
        <ul>
          {options.map((option: string) => (
            <li key={option} onClick={() => setSelectedOption(option)}>
              {optionsData[option].title}
              <IconButton type="default" size="default" icon="arrow-right" />
            </li>
          ))}
        </ul>
      )}
      {selectedOption === 'fishing_events' && (
        <FishingEvents settings={settings.fishingEvents} section="fishingEvents"></FishingEvents>
      )}
      {selectedOption === 'encounters' && (
        <Encounters settings={settings.encounters} section="encounters"></Encounters>
      )}
      {selectedOption === 'loitering_events' && (
        <LoiteringEvents
          settings={settings.loiteringEvents}
          section="loiteringEvents"
        ></LoiteringEvents>
      )}
      {selectedOption === 'port_visits' && (
        <PortVisits settings={settings.portVisits} section="portVisits"></PortVisits>
      )}
    </div>
  )
}

export default Settings
