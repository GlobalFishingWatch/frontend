import React, { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { MultiSelect, IconButton, InputText } from '@globalfishingwatch/ui-components'
import { SelectOption } from '@globalfishingwatch/ui-components/dist/select'
import { MultiSelectOption } from '@globalfishingwatch//ui-components/dist/multi-select'
import { selectEEZs, selectMPAs, selectRFMOs } from 'features/regions/regions.selectors'
import { SettingsEvents } from '../settings.slice'
import { useApplySettingsConnect } from '../settings.hooks'
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
  const { setSettingOptions, setSetting } = useApplySettingsConnect()
  const EEZ_OPTIONS: SelectOption[] = useSelector(selectEEZs) ?? []
  const RFMOS_OPTIONS: MultiSelectOption[] = useSelector(selectRFMOs) ?? []
  const MPAS_OPTIONS: MultiSelectOption[] = useSelector(selectMPAs) ?? []

  const anyOption: SelectOption<string> = useMemo(
    () => ({
      id: '0-any',
      label: t('common.any', 'Any') as string,
      disabled: false,
      tooltip: t('common.any', 'Any') as string,
    }),
    [t]
  )

  const eezs = [anyOption, ...EEZ_OPTIONS].filter((option) => settings.eezs?.includes(option.id))
  const rfmos = RFMOS_OPTIONS.filter((option) => settings.rfmos?.includes(option.id))
  const mpas = MPAS_OPTIONS.filter((option) => settings.mpas?.includes(option.id))

  const eezList = useMemo(
    () => [anyOption, ...eezs, ...EEZ_OPTIONS.filter((option) => !eezs.includes(option))],
    [EEZ_OPTIONS, anyOption, eezs]
  )
  const onSelectEEZ = useCallback(
    (selected: SelectOption<string>) => {
      selected === anyOption
        ? setSettingOptions(section, 'eezs', [selected])
        : setSettingOptions(section, 'eezs', [...eezs, selected])
    },
    [anyOption]
  )
  return (
    <div>
      <div className={styles.settingsField}>
        <label>
          {t('settings.eezs.label', 'Events in these EEZs')}
          <IconButton type="default" size="tiny" icon="info"></IconButton>
        </label>
        <MultiSelect
          selectedOptions={eezs}
          placeholderDisplayAll={true}
          onCleanClick={() => setSettingOptions(section, 'eezs', [])}
          onSelect={onSelectEEZ}
          onRemove={(option) =>
            setSettingOptions(
              section,
              'eezs',
              eezs.filter((o) => o.id !== option.id)
            )
          }
          options={eezList}
        ></MultiSelect>
      </div>
      <div className={styles.settingsField}>
        <label>
          {t('settings.rfmos.label', 'Events in these RFMOS')}
          <IconButton type="default" size="tiny" icon="info"></IconButton>
        </label>
        <MultiSelect
          onCleanClick={() => setSettingOptions(section, 'rfmos', [])}
          selectedOptions={rfmos}
          placeholderDisplayAll={true}
          onSelect={(selected: MultiSelectOption) =>
            setSettingOptions(section, 'rfmos', [...rfmos, selected])
          }
          onRemove={(option) =>
            setSettingOptions(
              section,
              'rfmos',
              rfmos.filter((o) => o.id !== option.id)
            )
          }
          options={RFMOS_OPTIONS}
        ></MultiSelect>
      </div>
      <div className={styles.settingsField}>
        <label>
          {t('settings.mpas.label', 'Events in these MPAs')}
          <IconButton type="default" size="tiny" icon="info"></IconButton>
        </label>
        <MultiSelect
          onCleanClick={() => setSettingOptions(section, 'mpas', [])}
          selectedOptions={mpas}
          placeholderDisplayAll={true}
          onSelect={(selected: MultiSelectOption) =>
            setSettingOptions(section, 'mpas', [...mpas, selected])
          }
          onRemove={(option) =>
            setSettingOptions(
              section,
              'mpas',
              mpas.filter((o) => o.id !== option.id)
            )
          }
          options={MPAS_OPTIONS}
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
