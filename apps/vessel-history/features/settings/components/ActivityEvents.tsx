import React, { useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import cx from 'classnames'

import type {
  MultiSelectOnFilter,
  MultiSelectOption} from '@globalfishingwatch/ui-components';
import {
  InputText,
  MultiSelect} from '@globalfishingwatch/ui-components'

import DataAndTerminology from 'features/data-and-terminology/DataAndTerminology'

import { useSettingsConnect, useSettingsRegionsConnect } from '../settings.hooks'
import type { SettingEventSectionName, SettingsEvents } from '../settings.slice'

import styles from './SettingsComponents.module.css'

interface SettingsProps {
  settings: SettingsEvents
  section: SettingEventSectionName
  minDuration: number
  maxDuration: number
  minDistance: number
  maxDistance: number
}
interface MpaAutocompleteProps {
  placeholder: string
  onFilterOptions: MultiSelectOnFilter
}
const truncateLabels = (option: MultiSelectOption) => ({
  ...option,
  label: option.label.toString().slice(0, 55),
})
const ActivityEvents: React.FC<SettingsProps> = (props): React.ReactElement<any> => {
  const { settings, section } = props
  const { t } = useTranslation()
  const { setSettingOptions, setSetting } = useSettingsConnect()

  const { anyOption, EEZ_REGIONS, RFMOS_REGIONS, MPAS_REGIONS, getOptions } =
    useSettingsRegionsConnect(section)

  const eez = useMemo(
    () => getOptions(EEZ_REGIONS, 'eezs', settings.eezs),
    [EEZ_REGIONS, settings.eezs, getOptions]
  )
  const rfmo = useMemo(
    () => getOptions(RFMOS_REGIONS, 'rfmos', settings.rfmos),
    [RFMOS_REGIONS, settings.rfmos, getOptions]
  )
  const mpa = useMemo(
    () => getOptions(MPAS_REGIONS?.map(truncateLabels), 'mpas', settings.mpas),
    [MPAS_REGIONS, settings.mpas, getOptions]
  )

  const eezPlaceholder = useMemo(
    () =>
      !eez.selected?.length
        ? (t('selects.none', 'None') as string) :
        (
          eez.selected.length > 1 ?
            t('event.nSelected', '{{count}} selected', { count: eez.selected.length }) :
            eez.selected[0].label.toString()
        ),
    [eez.selected, t]
  )

  const rfmoPlaceholder = useMemo(
    () =>
      !rfmo.selected?.length ?
        (t('selects.none', 'None') as string) :
        (
          rfmo.selected.length > 1 ?
            t('event.nSelected', '{{count}} selected', { count: rfmo.selected.length }) :
            rfmo.selected[0].label.toString()
        ),
    [rfmo.selected, t]
  )

  const mpaAutocomplete: MpaAutocompleteProps = useMemo(
    () => ({
      placeholder: !mpa.selected?.length ?
        (t(`common.typeToSearch`, 'Type to search') as string) :
        (mpa.selected.length > 1 ?
          t('event.nSelected', '{{count}} selected', { count: mpa.selected.length }) :
          mpa.selected[0].label.toString()
        ),

      onFilterOptions: (allOptions, filteredOptions, filter) => {
        if (filter && filter?.length >= 3) {
          return filteredOptions
        }
        return [anyOption, ...mpa.selected.filter((option) => option !== anyOption)]
      },
    }),
    [anyOption, mpa, t]
  )

  const eventType = useMemo(() => t(`settings.${section}.title`), [section, t])
  return (
    <div>
      <div className={styles.settingsField}>
        <label className={styles.settingsLabel}>
          <span>{t('settings.eezs.label', 'Events in these EEZs')}</span>
          <DataAndTerminology
            size="tiny"
            type="default"
            title={t('settings.eezs.label', 'Events in these EEZs')}
          >
            <Trans i18nKey="settings.eezs.description" values={{ eventType }}>
              Highlight all {{ eventType }} that may have occured inside an EEZ. We calculate a
              bounding box for the event location based on the minimum and maximum coordinates and
              verify if it overlaps with the bounding box of the EEZ. For example, if you select
              Argentina EEZ and Chile EEZ under the {{ eventType }} activity highlights, you will
              see all {{ eventType }} where the bounding box created by minimum and maximum
              coordinates of the events overlapped with the minimum and maximum coordinates of the
              Argentina EEZ OR the Chile EEZ. Because a bounding box method is used, it is possible
              the actual track coordinates do not overlap with the EEZ. Please investigate the
              highlighted events further on the map.
            </Trans>
          </DataAndTerminology>
        </label>
        <MultiSelect
          placeholder={eezPlaceholder}
          selectedOptions={eez.selected}
          placeholderDisplayAll={true}
          onCleanClick={eez.onClean}
          onSelect={eez.onSelect}
          onRemove={eez.onRemove}
          options={eez.options}
        ></MultiSelect>
      </div>
      <div className={styles.settingsField}>
        <label className={styles.settingsLabel}>
          {t('settings.rfmos.label', 'Events in these RFMOS')}
          <DataAndTerminology
            size="tiny"
            type="default"
            title={t('settings.rfmos.label', 'Events in these RFMOS')}
          >
            <Trans i18nKey="settings.rfmos.description" values={{ eventType }}>
              Highlight all {{ eventType }} that occurred inside and RFMO. We calculate a bounding
              box for the event location based on the minimum and maximum coordinates and verify if
              it overlaps with the RFMO. Example if you select IOTC and WCPFC, you will see all
              {{ eventType }} where the bounding box created by minimum and maximum coordinates of
              the events overlapped with the minimum and maximum coordinates of IOTC OR WCPFC.
              Because a bounding box method is used, it is possible the actual track coordinates do
              not overlap with the RFMO. Please invesitage highlighted event further on the map.
            </Trans>
          </DataAndTerminology>
        </label>
        <MultiSelect
          placeholder={rfmoPlaceholder}
          onCleanClick={() => setSettingOptions(section, 'rfmos', [])}
          selectedOptions={rfmo.selected}
          placeholderDisplayAll={true}
          onSelect={rfmo.onSelect}
          onRemove={rfmo.onRemove}
          options={rfmo.options}
        ></MultiSelect>
      </div>
      <div className={styles.settingsField}>
        <label className={styles.settingsLabel}>
          {t('settings.mpas.label', 'Events in these MPAs')}
          <DataAndTerminology
            size="tiny"
            type="default"
            title={t('settings.mpas.label', 'Events in these MPAs')}
          >
            <Trans i18nKey="settings.mpas.description" values={{ eventType }}>
              Highlight all {{ eventType }} that occurred inside an MPA. We calculate a bounding box
              for the event location based on the minimum and maximum coordinates and verify if it
              overlaps with the MPA. For example, if you select Galápagos and Ascension Island, you
              will see all {{ eventType }} where the bounding box created by minimum and maximum
              coordinates of the events overlapped with the minimum and maximum coordinates of the
              Galápagos OR Ascension Island MPA. Because a bounding box method is used, it is
              possible the actual track coordinates do not overlap with the MPA. Please invesitage
              highlighted event further on the map.
            </Trans>
          </DataAndTerminology>
        </label>
        <MultiSelect
          onCleanClick={mpa.onClean}
          selectedOptions={mpa.selected}
          onFilterOptions={mpaAutocomplete.onFilterOptions}
          onSelect={mpa.onSelect}
          onRemove={mpa.onRemove}
          options={mpa.options}
          placeholder={mpaAutocomplete.placeholder}
          className={styles.multiSelectRegions}
        ></MultiSelect>
      </div>
      <div className={cx(styles.settingsField, styles.inlineRow)}>
        <label className={styles.settingsLabel}>
          {t('settings.duration', 'DURATION')}
          <DataAndTerminology size="tiny" type="default" title={t('settings.duration', 'Duration')}>
            <Trans i18nKey="settings.durationDescription" values={{ eventType }}>
              Highlight all {{ eventType }} that had a duration longer than the value configured.
              Example if you configure 5 hours, you will see all {{ eventType }} with duration more
              or equal to 5 hours
            </Trans>
            <br />
            {t('settings.helpRange', 'Should be a value between', {
              min: props.minDuration,
              max: props.maxDuration,
            })}
          </DataAndTerminology>
        </label>
        <div>
          <span>{t('settings.longerThan', 'Longer than')}</span>
          <InputText
            type="number"
            value={settings.duration}
            min={props.minDuration}
            max={props.maxDuration}
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
            <Trans i18nKey="settings.distanceShoreDescription" values={{ eventType }}>
              Highlight all {{ eventType }} that had a distance longer than the value configured.
              Example if you configure 8 km, you will see all {{ eventType }} with distance more or
              equal to 8 km from the shore. Distance from shore will be highlighted if either the
              start or end position is more or equal to the specified distance.
            </Trans>
            <br />
            {t('settings.helpRange', 'Should be a value between', {
              min: props.minDistance,
              max: props.maxDistance,
            })}
          </DataAndTerminology>
        </label>
        <div>
          <span>{t('settings.greaterThan', 'Greater than')}</span>
          <InputText
            type="number"
            value={settings.distanceShoreLonger}
            min={props.minDistance}
            max={props.maxDistance}
            onChange={(event) =>
              setSetting(section, 'distanceShoreLonger', parseInt(event.currentTarget.value))
            }
          ></InputText>
          <span>{t('settings.km', 'km')}</span>
        </div>
      </div>
      <div className={cx(styles.settingsField, styles.inlineRow)}>
        <label className={styles.settingsLabel}>
          {t('event.distancePort', 'Distance from port')}
          <DataAndTerminology
            size="tiny"
            type="default"
            title={t('settings.distancePort', 'Distance from port')}
          >
            <Trans i18nKey="settings.distancePortDescription" values={{ eventType }}>
              Highlight all {{ eventType }} that had a distance from port longer than the value
              configured. Example if you configure 8 km, you will see all {{ eventType }} with
              distance more or equal to 8 km. Distance from port is will be highlighted if either
              the start or end position is more or equal to the specified distance. Ports include
              all GFW identified anchorages (for more details on anchorage including its definition
              here)
            </Trans>
            <br />
            {t('settings.helpRange', 'Should be a value between', {
              min: props.minDistance,
              max: props.maxDistance,
            })}
          </DataAndTerminology>
        </label>
        <div>
          <span>{t('settings.greaterThan', 'Greater than')}</span>
          <InputText
            type="number"
            value={settings.distancePortLonger}
            min={props.minDistance}
            max={props.maxDistance}
            onChange={(event) =>
              setSetting(section, 'distancePortLonger', parseInt(event.currentTarget.value))
            }
          ></InputText>
          <span>{t('settings.km', 'km')}</span>
        </div>
      </div>
    </div>
  )
}

export default ActivityEvents
