import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { history } from 'redux-first-router'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import { fetchRegionsThunk } from 'features/regions/regions.slice'
import { selectSettings } from './settings.slice'
import FishingEvents from './components/FishingEvents'
import LoiteringEvents from './components/LoiteringEvents'
import EncounterEvents from './components/EncounterEvents'
import PortVisits from './components/PortVisits'
import styles from './Settings.module.css'

interface SettingsOption {
  title: string
}

interface SettingsOptions {
  [key: string]: SettingsOption
}

const Settings: React.FC = (): React.ReactElement => {
  const settings = useSelector(selectSettings)
  const { t } = useTranslation()
  const options = ['fishing_events', 'encounters', 'loitering_events', 'port_visits']
  const optionsData: SettingsOptions = {
    fishing_events: {
      title: t('settings.fishingEvents.title', 'Fishing Events'),
    },
    encounters: {
      title: t('settings.encounters.title', 'Encounters'),
    },
    loitering_events: {
      title: t('settings.loiteringEvents.title', 'Loitering Events'),
    },
    port_visits: {
      title: t('settings.portVisits.title', 'Port Visits'),
    },
  }
  const [selectedOption, setSelectedOption] = useState('')

  const dispatch = useDispatch()
  const onBackClick = useCallback(() => {
    if (selectedOption) {
      setSelectedOption('')
    } else {
      history().goBack()
    }
  }, [selectedOption])

  useEffect(() => {
    dispatch(fetchRegionsThunk())
  }, [dispatch])

  return (
    <div className={styles.settingsContainer}>
      <header className={styles.settingsHeader}>
        <IconButton
          type="border"
          size="default"
          icon="arrow-left"
          onClick={onBackClick}
          className={styles.backButton}
        />
        <h1>
          {t('settings.title', 'Settings')}{' '}
          {selectedOption && <span> - {optionsData[selectedOption].title}</span>}
        </h1>
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
        <EncounterEvents settings={settings.encounters} section="encounters"></EncounterEvents>
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
