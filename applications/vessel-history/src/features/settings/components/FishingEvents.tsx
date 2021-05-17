import React, { useCallback } from 'react'
import cx from 'classnames'
import { MultiSelect, InputText, IconButton } from '@globalfishingwatch/ui-components'
import '@globalfishingwatch/ui-components/dist/base.css'
import { SelectOption } from '@globalfishingwatch/ui-components/dist/select'
import { MultiSelectOption } from '@globalfishingwatch//ui-components/dist/multi-select'
import { SettingsEvents } from '../settings.slice'
import { useApplySettingsConnect } from '../settings.hooks'
import styles from './SettingsComponents.module.css'

interface SettingsProps {
  settings: SettingsEvents
  section: string
}

const FishingEvents: React.FC<SettingsProps> = (props): React.ReactElement => {
  const { settings, section } = props

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
  const eezs = EEZ_OPTIONS.filter((option) => settings.eezs?.includes(option.id))
  const rfmos = RFMOS_OPTIONS.filter((option) => settings.rfmos?.includes(option.id))
  const mpas = EEZ_OPTIONS.filter((option) => settings.mpas?.includes(option.id))

  return (
    <div className={styles.settingsFieldsContainer}>
      <div className={styles.settingsField}>
        <label>
          Events in There EEZs
          <IconButton type="default" size="tiny" icon="info" tooltip="testing tootip"></IconButton>
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
          Events in these RFMOS
          <IconButton type="default" size="tiny" icon="info" tooltip="testing tootip"></IconButton>
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
          Events in these MPAs
          <IconButton type="default" size="tiny" icon="info" tooltip="testing tootip"></IconButton>
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
          options={EEZ_OPTIONS}
        ></MultiSelect>
      </div>
      <div className={cx(styles.settingsField, styles.inlineRow)}>
        <label>
          DURATION
          <IconButton type="default" size="tiny" icon="info" tooltip="testing tootip"></IconButton>
        </label>
        <span>Longer than</span>
        <InputText
          type="number"
          value={settings.duration ?? 0}
          min={0}
          max={999}
          onChange={(event) => setSetting(section, 'duration', parseInt(event.currentTarget.value))}
        ></InputText>
        <span>hours</span>
      </div>
      <div className={cx(styles.settingsField, styles.inlineRow)}>
        <label>
          DISTANCE TRAVELLED
          <IconButton type="default" size="tiny" icon="info" tooltip="testing tootip"></IconButton>
        </label>
        <span>Longer than</span>
        <InputText
          type="number"
          value={settings.distance}
          min={0}
          max={99}
          onChange={(event) => setSetting(section, 'distance', parseInt(event.currentTarget.value))}
        ></InputText>
        <span>kms</span>
      </div>
    </div>
  )
}

export default FishingEvents
