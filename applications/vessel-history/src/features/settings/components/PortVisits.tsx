import React from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { InputText } from '@globalfishingwatch/ui-components'
import { SettingsPortVisits } from '../settings.slice'
import { useSettingsConnect } from '../settings.hooks'
import styles from './SettingsComponents.module.css'

interface SettingsProps {
  settings: SettingsPortVisits
  section: string
}

const PortVisits: React.FC<SettingsProps> = (props): React.ReactElement => {
  const { settings, section } = props
  const { t } = useTranslation()
  const { setSetting } = useSettingsConnect()

  return (
    <div className={styles.settingsFieldsContainer}>
      <div className={cx(styles.settingsField, styles.inlineRow)}>
        <label>{t('settings.portVisits.title', 'Port Visits')}</label>
        <span>{t('settings.portVisits.inputStart', 'Port visits in')}</span>
        <InputText
          type="number"
          value={settings.ports ?? 0}
          min={0}
          onChange={(event) => setSetting(section, 'ports', parseInt(event.currentTarget.value))}
        ></InputText>
        <span>{t('settings.portVisits.inputEnd', 'ports')}</span>
      </div>
    </div>
  )
}

export default PortVisits
