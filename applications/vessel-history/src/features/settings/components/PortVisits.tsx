import React, { useMemo } from 'react'
import cx from 'classnames'
import { Trans, useTranslation } from 'react-i18next'
import { InputText, MultiSelect } from '@globalfishingwatch/ui-components'
import {
  PORTVISIT_EVENTS_MAX_DISTANCE,
  PORTVISIT_EVENTS_MAX_DURATION,
  PORTVISIT_EVENTS_MIN_DISTANCE,
  PORTVISIT_EVENTS_MIN_DURATION,
} from 'data/constants'
import DataAndTerminology from 'features/data-and-terminology/DataAndTerminology'
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
  const { COUNTRIES, getOptions } = useSettingsRegionsConnect('portVisits')

  const flags = useMemo(
    () =>
      getOptions(
        COUNTRIES.sort((a, b) => (a.label > b.label ? 1 : -1)),
        'flags',
        settings.flags
      ),
    [COUNTRIES, settings.flags, getOptions]
  )
  const eventType = useMemo(() => t(`settings.${section}.title`), [section, t])

  return (
    <div className={styles.settingsFieldsContainer}>
      <div>
        <div className={styles.settingsField}>
          <label>
            {t('settings.portVisits.inThesePortStates', 'Events in these port States')}
            <DataAndTerminology
              size="tiny"
              type="default"
              title={t('settings.portVisits.inThesePortStates', 'Events in these port States')}
            >
              <Trans
                i18nKey="settings.portVisits.inThesePortStatesDescription"
                values={{ eventType }}
              >
                Highlight all {{ eventType }} that occurred in ports inside these states. Please
                investigate highlighted event further on the map.
              </Trans>
            </DataAndTerminology>
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
            <DataAndTerminology
              size="tiny"
              type="default"
              title={t('settings.duration', 'Duration')}
            >
              <Trans i18nKey="settings.durationDescription" values={{ eventType }}>
                Highlight all {{ eventType }} that had a duration longer than the value configured.
                Example if you configure 5 hours, you will see all {{ eventType }} with duration
                more or equal to 5 hours
              </Trans>
            </DataAndTerminology>
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
            <DataAndTerminology
              size="tiny"
              type="default"
              title={t('settings.distanceShore', 'Distance from shore')}
            >
              <Trans i18nKey="settings.distanceShoreDescription" values={{ eventType }}>
                Highlight all {{ eventType }} that had a distance longer than the value configured.
                Example if you configure 8 km, you will see all {{ eventType }} with distance more
                or equal to 8 km from the shore. Distance from shore will be highlighted if either
                the start or end position is more or equal to the specified distance.
              </Trans>
            </DataAndTerminology>
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
