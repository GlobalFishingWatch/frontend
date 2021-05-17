import React, { useCallback } from 'react'
import cx from 'classnames'
import { InputText } from '@globalfishingwatch/ui-components'
import '@globalfishingwatch/ui-components/dist/base.css'
import { SettingsPortVisits } from '../settings.slice'
import { useApplySettingsConnect } from '../settings.hooks'
import styles from './SettingsComponents.module.css'

interface SettingsProps {
  settings: SettingsPortVisits
  section: string
}

const PortVisits: React.FC<SettingsProps> = (props): React.ReactElement => {
  const { settings, section } = props

  const { setSetting } = useApplySettingsConnect()

  return (
    <div className={styles.settingsFieldsContainer}>
      <div className={cx(styles.settingsField, styles.inlineRow)}>
        <label>PORT VISITS</label>
        <span>Port visits in</span>
        <InputText
          type="number"
          value={settings.ports ?? 0}
          min={0}
          max={99}
          onChange={(event) => setSetting(section, 'ports', parseInt(event.currentTarget.value))}
        ></InputText>
        <span>ports</span>
      </div>
    </div>
  )
}

export default PortVisits
