import React, { useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import cx from 'classnames'

import { InputText, MultiSelect } from '@globalfishingwatch/ui-components'

import {
  PORTVISIT_EVENTS_MAX_DISTANCE,
  PORTVISIT_EVENTS_MAX_DURATION,
  PORTVISIT_EVENTS_MIN_DISTANCE,
  PORTVISIT_EVENTS_MIN_DURATION,
} from 'data/constants'
import DataAndTerminology from 'features/data-and-terminology/DataAndTerminology'

import { useSettingsConnect, useSettingsRegionsConnect } from '../settings.hooks'
import type { SettingEventSectionName, SettingsPortVisits } from '../settings.slice'

import styles from './SettingsComponents.module.css'

// Remove once https://github.com/i18next/react-i18next/issues/1483 fixed
const TransComponent = Trans as any

interface SettingsProps {
  settings: SettingsPortVisits
  section: SettingEventSectionName
}

const PortVisits: React.FC<SettingsProps> = (props): React.ReactElement<any> => {
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

  const flagsPlaceholder = useMemo(
    () =>
      !flags.selected?.length
        ? (t('selects.none', 'None') as string)
        : flags.selected.length > 1
        ? t('event.nSelected', '{{count}} selected', { count: flags.selected.length })
        : flags.selected[0].label.toString(),
    [flags.selected, t]
  )
  const eventType = useMemo(() => t(`settings.${section}.title`), [section, t])

  return (
    <div className={styles.settingsFieldsContainer}>
      <div>
        <div className={styles.settingsField}>
          <label className={styles.settingsLabel}>
            {t('settings.portVisits.inThesePortStates', 'Events in these port States')}
            <DataAndTerminology
              size="tiny"
              type="default"
              title={t('settings.portVisits.inThesePortStates', 'Events in these port States')}
            >
              <TransComponent
                i18nKey="settings.portVisits.inThesePortStatesDescription"
                values={{ eventType }}
              >
                Highlight all {{ eventType }} that may have occured in a port State. A port visit
                occurs when a vessel transits to an anchorage, and the port State is assigned based
                on the Exclusive Economic Zone (EEZ) the anchorage is within. Anchorages are based
                upon the Global Fishing Watch anchorages dataset, a global database of anchorage
                locations where vessels congregate:
                <a
                  href="https://globalfishingwatch.org/datasets-and-code-anchorages/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  https://globalfishingwatch.org/datasets-and-code-anchorages/
                </a>{' '}
                . Please investigate the highlighted events further on the map.
              </TransComponent>
            </DataAndTerminology>
          </label>
          <MultiSelect
            placeholder={flagsPlaceholder}
            selectedOptions={flags.selected}
            placeholderDisplayAll={true}
            onCleanClick={flags.onClean}
            onSelect={flags.onSelect}
            onRemove={flags.onRemove}
            options={flags.options}
          ></MultiSelect>
        </div>
        <div className={cx(styles.settingsField, styles.inlineRow)}>
          <label className={styles.settingsLabel}>
            {t('settings.duration', 'DURATION')}
            <DataAndTerminology
              size="tiny"
              type="default"
              title={t('settings.duration', 'Duration')}
            >
              <TransComponent i18nKey="settings.durationDescription" values={{ eventType }}>
                Highlight all {{ eventType }} that had a duration longer than the value configured.
                Example if you configure 5 hours, you will see all {{ eventType }} with duration
                more or equal to 5 hours
              </TransComponent>
              <br />
              {t('settings.helpRange', 'Should be a value between', {
                min: PORTVISIT_EVENTS_MIN_DURATION,
                max: PORTVISIT_EVENTS_MAX_DURATION,
              })}
            </DataAndTerminology>
          </label>
          <div>
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
        </div>
        <div className={cx(styles.settingsField, styles.inlineRow)}>
          <label className={styles.settingsLabel}>
            {t('event.distanceShore', 'Distance from shore')}
            <DataAndTerminology
              size="tiny"
              type="default"
              title={t('settings.distanceShore', 'Distance from shore')}
            >
              <TransComponent i18nKey="settings.distanceShoreDescription" values={{ eventType }}>
                Highlight all {{ eventType }} that had a distance longer than the value configured.
                Example if you configure 8 km, you will see all {{ eventType }} with distance more
                or equal to 8 km from the shore. Distance from shore will be highlighted if either
                the start or end position is more or equal to the specified distance.
              </TransComponent>
              <br />
              {t('settings.helpRange', 'Should be a value between', {
                min: PORTVISIT_EVENTS_MIN_DISTANCE,
                max: PORTVISIT_EVENTS_MAX_DISTANCE,
              })}
            </DataAndTerminology>
          </label>
          <div>
            <span>{t('settings.greaterThan', 'Greater than')}</span>
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
    </div>
  )
}

export default PortVisits
