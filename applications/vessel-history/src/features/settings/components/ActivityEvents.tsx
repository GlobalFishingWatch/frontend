import React, { useCallback, useMemo } from 'react'
// import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { MultiSelect, IconButton, InputText } from '@globalfishingwatch/ui-components'
import { SelectOption } from '@globalfishingwatch/ui-components/dist/select'
// import { MultiSelectOption } from '@globalfishingwatch//ui-components/dist/multi-select'
// import { selectEEZs, selectMPAs, selectRFMOs } from 'features/regions/regions.selectors'
import { SettingsEvents } from '../settings.slice'
import { useSettingsConnect } from '../settings.hooks'
import styles from './SettingsComponents.module.css'

interface SettingsProps {
  settings: SettingsEvents
  section: string
  minDuration: number
  maxDuration: number
  minDistance: number
  maxDistance: number
}

const ActivityEvents: React.FC<SettingsProps> = (props): React.ReactElement => {
  const { settings, section } = props
  const { t } = useTranslation()
  const { setSettingOptions, setSetting, EEZ_OPTIONS, RFMOS_OPTIONS, MPAS_OPTIONS } =
    useSettingsConnect()

  const anyOption: SelectOption<string> = useMemo(
    () => ({
      id: '0-any',
      label: t('common.any', 'Any') as string,
      disabled: false,
      tooltip: t('common.any', 'Any') as string,
    }),
    [t]
  )

  const getOptions = useCallback(
    (availableOptions: SelectOption[], selected?: string | string[]) => {
      const allOptions = [anyOption, ...availableOptions]
      const selectedOptions = allOptions.filter((option) => selected?.includes(option.id))
      const options = [
        // First display ANY whether it's selected or not
        anyOption,
        // Then all selected options
        ...selectedOptions.filter((option) => option !== anyOption),
        // And at the bottom the rest of the options
        ...availableOptions.filter((option) => !selectedOptions.includes(option)),
      ]
      return { options, selectedOptions }
    },
    [anyOption]
  )

  const onSelectRegion = useCallback(
    (selected: SelectOption<string>, currentSelected: SelectOption[], field: string) => {
      selected === anyOption
        ? // when ANY is selected the rest are deselected
          setSettingOptions(section, field, [selected])
        : // when other than ANY is selected
          setSettingOptions(section, field, [
            // then ANY should be deselected
            ...currentSelected.filter((option) => option !== anyOption),
            selected,
          ])
    },
    [section, setSettingOptions, anyOption]
  )

  const { options: eezOptions, selectedOptions: eezSelected } = useMemo(
    () => getOptions(EEZ_OPTIONS, settings.eezs),
    [EEZ_OPTIONS, settings.eezs, getOptions]
  )
  const { options: rfmoOptions, selectedOptions: rfmoSelected } = useMemo(
    () => getOptions(RFMOS_OPTIONS, settings.rfmos),
    [RFMOS_OPTIONS, settings.rfmos, getOptions]
  )
  const { options: mpaOptions, selectedOptions: mpaSelected } = useMemo(
    () => getOptions(MPAS_OPTIONS, settings.mpas),
    [MPAS_OPTIONS, settings.mpas, getOptions]
  )

  return (
    <div>
      <div className={styles.settingsField}>
        <label>
          {t('settings.eezs.label', 'Events in these EEZs')}
          <IconButton type="default" size="tiny" icon="info"></IconButton>
        </label>
        <MultiSelect
          selectedOptions={eezSelected}
          placeholderDisplayAll={true}
          onCleanClick={() => setSettingOptions(section, 'eezs', [])}
          onSelect={(item) => onSelectRegion(item, eezSelected, 'eezs')}
          onRemove={(option) =>
            setSettingOptions(
              section,
              'eezs',
              eezSelected.filter((o) => o.id !== option.id)
            )
          }
          options={eezOptions}
        ></MultiSelect>
      </div>
      <div className={styles.settingsField}>
        <label>
          {t('settings.rfmos.label', 'Events in these RFMOS')}
          <IconButton type="default" size="tiny" icon="info"></IconButton>
        </label>
        <MultiSelect
          onCleanClick={() => setSettingOptions(section, 'rfmos', [])}
          selectedOptions={rfmoSelected}
          placeholderDisplayAll={true}
          onSelect={(item) => onSelectRegion(item, rfmoSelected, 'rfmos')}
          onRemove={(option) =>
            setSettingOptions(
              section,
              'rfmos',
              rfmoSelected.filter((o) => o.id !== option.id)
            )
          }
          options={rfmoOptions}
        ></MultiSelect>
      </div>
      <div className={styles.settingsField}>
        <label>
          {t('settings.mpas.label', 'Events in these MPAs')}
          <IconButton type="default" size="tiny" icon="info"></IconButton>
        </label>
        <MultiSelect
          onCleanClick={() => setSettingOptions(section, 'mpas', [])}
          selectedOptions={mpaSelected}
          placeholderDisplayAll={true}
          onSelect={(item) => onSelectRegion(item, mpaSelected, 'mpas')}
          onRemove={(option) =>
            setSettingOptions(
              section,
              'mpas',
              mpaSelected.filter((o) => o.id !== option.id)
            )
          }
          options={mpaOptions}
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
        <span>{t('settings.kms', 'kms')}</span>
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
        <span>{t('settings.kms', 'kms')}</span>
      </div>
    </div>
  )
}

export default ActivityEvents
