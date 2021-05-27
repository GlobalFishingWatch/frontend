import React from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { MultiSelect, IconButton, InputText } from '@globalfishingwatch/ui-components'
import { SelectOption } from '@globalfishingwatch/ui-components/dist/select'
import { MultiSelectOption } from '@globalfishingwatch//ui-components/dist/multi-select'
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

  const EEZ_OPTIONS: SelectOption[] = [
    {
      id: 'ghana',
      label: 'Ghana',
    },
    {
      id: 'argentina',
      label: 'Argentina',
    },
  ]

  const RFMOS_OPTIONS: MultiSelectOption[] = [
    {
      id: 'CCSBT',
      label: 'CCSBT',
    },
    {
      id: 'IATTC',
      label: 'IATTC',
    },
    {
      id: 'ICCAT',
      label: 'ICCAT',
    },
    {
      id: 'IOTC',
      label: 'IOTC',
    },
    {
      id: 'NPFC',
      label: 'NPFC',
    },
    {
      id: 'SPRFMO',
      label: 'SPRFMO',
    },
    {
      id: 'WCPFC',
      label: 'WCPFC',
    },
  ]

  const MPAS_OPTIONS: MultiSelectOption[] = [
    {
      id: 'm1',
      label: 'MPAS 1',
    },
    {
      id: 'm2',
      label: 'MPAS 2',
    },
  ]
  const eezs = EEZ_OPTIONS.filter((option) => settings.eezs?.includes(option.id))
  const rfmos = RFMOS_OPTIONS.filter((option) => settings.rfmos?.includes(option.id))
  const mpas = MPAS_OPTIONS.filter((option) => settings.mpas?.includes(option.id))

  return (
    <div>
      <div className={styles.settingsField}>
        <label>
          {t('settings.eezs.label',"Events in these EEZs")}
          <IconButton type="default" size="tiny" icon="info"></IconButton>
        </label>
        <MultiSelect
          selectedOptions={eezs}
          placeholderDisplayAll={true}
          onCleanClick={() => setSettingOptions(section, 'eezs', [])}
          onSelect={(selected) => setSettingOptions(section, 'eezs', [...eezs, selected])}
          onRemove={(option) =>
            setSettingOptions(
              section,
              'eezs',
              eezs.filter((o) => o.id !== option.id)
            )
          }
          options={EEZ_OPTIONS}
        ></MultiSelect>
      </div>
      <div className={styles.settingsField}>
        <label>
          {t('settings.rfmos.label', "Events in these RFMOS")}
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
          {t('settings.mpas.label',"Events in these MPAs")}
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
        {t('settings.duration',"DURATION")}
          <IconButton type="default" size="tiny" icon="info"></IconButton>
        </label>
        <span>{t('settings.longerThan',"Longer than")}</span>
        <InputText
          type="number"
          value={settings.duration ?? 0}
          min={props.minDuration}
          max={props.maxDuration}
          onChange={(event) => setSetting(section, 'duration', parseInt(event.currentTarget.value))}
        ></InputText>
        <span>{t('settings.hours',"hours")}</span>
      </div>
      <div className={cx(styles.settingsField, styles.inlineRow)}>
        <label>
          {t('settings.distance',"DISTANCE TRAVELLED")}
          <IconButton type="default" size="tiny" icon="info"></IconButton>
        </label>
        <span>{t('settings.longerThan',"Longer than")}</span>
        <InputText
          type="number"
          value={settings.distance ?? 0}
          min={props.minDistance}
          max={props.maxDistance}
          onChange={(event) => setSetting(section, 'distance', parseInt(event.currentTarget.value))}
        ></InputText>
        <span>kms</span>
      </div>
    </div>
  )
}

export default ActivityEvents
