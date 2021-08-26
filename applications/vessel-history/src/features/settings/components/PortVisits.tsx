import React, { useMemo } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { IconButton, InputText, MultiSelect } from '@globalfishingwatch/ui-components'
import {
  PORTVISIT_EVENTS_MAX_DISTANCE,
  PORTVISIT_EVENTS_MAX_DURATION,
  PORTVISIT_EVENTS_MIN_DISTANCE,
  PORTVISIT_EVENTS_MIN_DURATION,
} from 'data/constants'
import { SettingEventSectionName, SettingsPortVisits } from '../settings.slice'
import { useSettingsConnect, useSettingsRegionsConnect } from '../settings.hooks'
import styles from './SettingsComponents.module.css'

interface SettingsProps {
  settings: SettingsPortVisits
  section: SettingEventSectionName
}

const PortVisits: React.FC<SettingsProps> = (props): React.ReactElement => {
  const { settings, section } = props
  const { t } = useTranslation()
  const { setSetting } = useSettingsConnect()
  const { COUNTRIES, getOptions } = useSettingsRegionsConnect('portVisits', settings)

  const flags = useMemo(
    () =>
      getOptions(
        COUNTRIES.sort((a, b) => (a.label > b.label ? 1 : -1)),
        'flags',
        settings.flags
      ),
    [COUNTRIES, settings.flags, getOptions]
  )

  return (
    <div className={styles.settingsFieldsContainer}>
      <div>
        <div className={styles.settingsField}>
          <label>
            {t('settings.portVisits.inThesePortStates', 'Events in these port States')}
            <IconButton type="default" size="tiny" icon="info"></IconButton>
          </label>
          <MultiSelect
            selectedOptions={flags.selected}
            placeholderDisplayAll={true}
            onCleanClick={flags.onClean}
            onSelect={flags.onSelect}
            onRemove={flags.onRemove}
            options={flags.options}
          ></MultiSelect>
        </div>
        <div className={cx(styles.settingsField, styles.inlineRow)}>
          <label>
            {t('settings.duration', 'DURATION')}
            <IconButton type="default" size="tiny" icon="info"></IconButton>
          </label>
          <span>{t('settings.longerThan', 'Longer than')}</span>
          <InputText
            type="number"
            value={settings.duration}
            min={PORTVISIT_EVENTS_MIN_DURATION}
            max={PORTVISIT_EVENTS_MAX_DURATION}
            onChange={(event) =>
              setSetting(section, 'duration', parseInt(event.currentTarget.value))
            }
          ></InputText>
          <span>{t('settings.hours', 'hours')}</span>
        </div>
        <div className={cx(styles.settingsField, styles.inlineRow)}>
          <label>
            {t('event.distanceShore', 'Distance from shore')}
            <IconButton type="default" size="tiny" icon="info"></IconButton>
          </label>
          <span>{t('settings.longerThan', 'Longer than')}</span>
          <InputText
            type="number"
            value={settings.distanceShoreLonger}
            min={PORTVISIT_EVENTS_MIN_DISTANCE}
            max={PORTVISIT_EVENTS_MAX_DISTANCE}
            onChange={(event) =>
              setSetting(section, 'distanceShoreLonger', parseInt(event.currentTarget.value))
            }
          ></InputText>
          <span>{t('settings.km', 'km')}</span>
        </div>
      </div>
    </div>
  )
}

export default PortVisits
