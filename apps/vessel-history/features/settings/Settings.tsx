import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { back } from 'redux-first-router'

import type { SwitchEvent} from '@globalfishingwatch/ui-components';
import { IconButton, Switch, SwitchRow } from '@globalfishingwatch/ui-components'

import DataAndTerminology from 'features/data-and-terminology/DataAndTerminology'

import ActivityEventDataAndTerminology from './components/ActivityEventDataAndTerminology'
import EncounterEvents from './components/EncounterEvents'
import FishingEvents from './components/FishingEvents'
import GapEvents from './components/GapEvents'
import LoiteringEvents from './components/LoiteringEvents'
import PortVisits from './components/PortVisits'
import { useSettingsConnect } from './settings.hooks'
import type { SettingEventSectionName } from './settings.slice';
import { selectSettings } from './settings.slice'

import styles from './Settings.module.css'

interface SettingsOption {
  title: string
}

interface SettingsOptions {
  [key: string]: SettingsOption
}

const Settings: React.FC = (): React.ReactElement<any> => {
  const settings = useSelector(selectSettings)
  const { t } = useTranslation()
  const { setFiltersStatus } = useSettingsConnect()
  const options: SettingEventSectionName[] = [
    'fishingEvents',
    'encounters',
    'loiteringEvents',
    'portVisits',
    'gapEvents',
  ]
  const optionsData: SettingsOptions = {
    fishingEvents: {
      title: t('settings.fishingEvents.title', 'Fishing Events'),
    },
    encounters: {
      title: t('settings.encounters.title', 'Encounters'),
    },
    loiteringEvents: {
      title: t('settings.loiteringEvents.title', 'Loitering Events'),
    },
    portVisits: {
      title: t('settings.portVisits.title', 'Port Visits'),
    },
    gapEvents: {
      title: t('settings.gapEvents.title', 'Likely Disabling Events'),
    },
  }
  const [selectedOption, setSelectedOption] = useState<SettingEventSectionName>()

  const onBackClick = useCallback(() => {
    if (selectedOption) {
      setSelectedOption(undefined)
    } else {
      back()
    }
  }, [selectedOption])

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
        {selectedOption && (
          <DataAndTerminology
            size="medium"
            type="solid"
            className={styles.infoIcon}
            title={
              t('common.dataAndTerminology', 'Data and Terminology') +
              ' - ' +
              optionsData[selectedOption].title
            }
          >
            <ActivityEventDataAndTerminology section={selectedOption} />
          </DataAndTerminology>
        )}
      </header>

      {!selectedOption && (
        <ul>
          <li className={styles.switchRow}>
            <SwitchRow
              active={settings.enabled}
              onClick={function (event: SwitchEvent): void {
                setFiltersStatus(!settings.enabled)
              }}
              label={t('settings.enable', 'Enable activity highlights')}
            ></SwitchRow>
          </li>
          {options.map((option: string) => (
            <li key={option} onClick={() => setSelectedOption(option as SettingEventSectionName)}>
              {optionsData[option].title}
              <IconButton type="default" size="default" icon="arrow-right" />
            </li>
          ))}
        </ul>
      )}

      {selectedOption === 'fishingEvents' && (
        <FishingEvents settings={settings.fishingEvents} section="fishingEvents"></FishingEvents>
      )}
      {selectedOption === 'encounters' && (
        <EncounterEvents settings={settings.encounters} section="encounters"></EncounterEvents>
      )}
      {selectedOption === 'loiteringEvents' && (
        <LoiteringEvents
          settings={settings.loiteringEvents}
          section="loiteringEvents"
        ></LoiteringEvents>
      )}
      {selectedOption === 'portVisits' && (
        <PortVisits settings={settings.portVisits} section="portVisits"></PortVisits>
      )}
      {selectedOption === 'gapEvents' && (
        <GapEvents settings={settings.gapEvents} section="gapEvents"></GapEvents>
      )}
    </div>
  )
}

export default Settings
