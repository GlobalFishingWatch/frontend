import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { MultiSelect, IconButton, InputText } from '@globalfishingwatch/ui-components'
import {
  MultiSelectOnFilter,
  MultiSelectOption,
} from '@globalfishingwatch/ui-components/dist/multi-select'
import { SettingEventSectionName, SettingsEvents } from '../settings.slice'
import { useSettingsConnect, useSettingsRegionsConnect } from '../settings.hooks'
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
  label: option.label.slice(0, 55),
})
const ActivityEvents: React.FC<SettingsProps> = (props): React.ReactElement => {
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

  const mpaAutocomplete: MpaAutocompleteProps = useMemo(
    () => ({
      placeholder: !mpa.selected?.length
        ? (t(`common.typeToSearch`, 'Type to search') as string)
        : mpa.selected.length > 1
        ? t('event.nSelected', '{{count}} selected', { count: mpa.selected.length })
        : mpa.selected[0].label,

      onFilterOptions: (allOptions, filteredOptions, filter) => {
        if (filter && filter?.length >= 3) {
          return filteredOptions
        }
        return [anyOption, ...mpa.selected.filter((option) => option !== anyOption)]
      },
    }),
    [anyOption, mpa, t]
  )

  return (
    <div>
      <div className={styles.settingsField}>
        <label>
          {t('settings.eezs.label', 'Events in these EEZs')}
          <IconButton type="default" size="tiny" icon="info"></IconButton>
        </label>
        <MultiSelect
          selectedOptions={eez.selected}
          placeholderDisplayAll={true}
          onCleanClick={eez.onClean}
          onSelect={eez.onSelect}
          onRemove={eez.onRemove}
          options={eez.options}
        ></MultiSelect>
      </div>
      <div className={styles.settingsField}>
        <label>
          {t('settings.rfmos.label', 'Events in these RFMOS')}
          <IconButton type="default" size="tiny" icon="info"></IconButton>
        </label>
        <MultiSelect
          onCleanClick={() => setSettingOptions(section, 'rfmos', [])}
          selectedOptions={rfmo.selected}
          placeholderDisplayAll={true}
          onSelect={rfmo.onSelect}
          onRemove={rfmo.onRemove}
          options={rfmo.options}
        ></MultiSelect>
      </div>
      <div className={styles.settingsField}>
        <label>
          {t('settings.mpas.label', 'Events in these MPAs')}
          <IconButton type="default" size="tiny" icon="info"></IconButton>
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
        <label>
          {t('settings.duration', 'DURATION')}
          <IconButton type="default" size="tiny" icon="info"></IconButton>
        </label>
        <span>{t('settings.longerThan', 'Longer than')}</span>
        <InputText
          type="number"
          value={settings.duration}
          min={props.minDuration}
          max={props.maxDuration}
          onChange={(event) => setSetting(section, 'duration', parseInt(event.currentTarget.value))}
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
          min={props.minDistance}
          max={props.maxDistance}
          onChange={(event) =>
            setSetting(section, 'distanceShoreLonger', parseInt(event.currentTarget.value))
          }
        ></InputText>
        <span>{t('settings.km', 'km')}</span>
      </div>
      <div className={cx(styles.settingsField, styles.inlineRow)}>
        <label>
          {t('event.distancePort', 'Distance from port')}
          <IconButton type="default" size="tiny" icon="info"></IconButton>
        </label>
        <span>{t('settings.longerThan', 'Longer than')}</span>
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
  )
}

export default ActivityEvents
