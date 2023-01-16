import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Logo } from '@globalfishingwatch/ui-components'
import { useLocalStorage } from '@globalfishingwatch/react-hooks'
import { Locale } from 'types'
import LanguageToggle from 'features/i18n/LanguageToggle'
import SOURCE_SWITCH_CONTENT from 'features/welcome/SourceSwitch.content'
import styles from './Welcome.module.css'

export const DISABLE_SOURCE_SWITCH_POPUP = 'DisableSourceSwitchPopup'

const WelcomeSourceSwitch: React.FC = () => {
  const { t, i18n } = useTranslation()
  const [disabled, setDisabled] = useLocalStorage(DISABLE_SOURCE_SWITCH_POPUP, true)
  const { title, description } =
    SOURCE_SWITCH_CONTENT[i18n.language as Locale] || SOURCE_SWITCH_CONTENT[Locale.en]

  useEffect(() => {
    if (disabled === true) {
      setDisabled(true)
    }
  })

  const onDisableToggled = useCallback(() => {
    setDisabled(!disabled)
  }, [disabled, setDisabled])

  return (
    <div className={styles.container}>
      <div className={styles.logos}>
        <Logo />
      </div>
      <div className={styles.headerActions}>
        <div className={styles.disableSection}>
          <input
            id="disableWelcomeSourceSwitchPopup"
            type="checkbox"
            onChange={onDisableToggled}
            className={styles.disableCheckbox}
            checked={disabled}
          />
          <label className={styles.disableLabel} htmlFor="disableWelcomeSourceSwitchPopup">
            {t('common.welcomePopupDisable', "Don't show again")}
          </label>
        </div>
        <LanguageToggle className={styles.lngToggle} position="rightDown" />
      </div>
      <h1 className={styles.title}>{title}</h1>
      <div
        className={styles.contentContainer}
        dangerouslySetInnerHTML={{ __html: description }}
      ></div>
    </div>
  )
}

export default WelcomeSourceSwitch
