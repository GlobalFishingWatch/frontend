import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Logo } from '@globalfishingwatch/ui-components'
import { useLocalStorage } from '@globalfishingwatch/react-hooks'
import { Locale } from 'types'
import { WorkspaceCategories } from 'data/workspaces'
import LanguageToggle from 'features/i18n/LanguageToggle'
import styles from './Welcome.module.css'
import WELCOME_POPUP_CONTENT from './welcome.content'

type WelcomeProps = {
  contentKey: WorkspaceCategories
  showDisableCheckbox?: boolean
}

export const DISABLE_WELCOME_POPUP = 'DisableWelcomePopup'

const Welcome: React.FC<WelcomeProps> = ({ contentKey, showDisableCheckbox }: WelcomeProps) => {
  const { t, i18n } = useTranslation()
  const welcomeModal = WELCOME_POPUP_CONTENT[contentKey]
  const [disabled, setDisabled] = useLocalStorage(DISABLE_WELCOME_POPUP, true)

  useEffect(() => {
    if (disabled === true) {
      setDisabled(true)
    }
  })

  const onDisableToggled = useCallback(() => {
    setDisabled(!disabled)
  }, [disabled, setDisabled])

  if (!welcomeModal) {
    console.warn('Missing welcome modal content by category')
    return null
  }
  const welcomeModalContent = welcomeModal[i18n.language as Locale] || welcomeModal[Locale.en]
  if (!welcomeModalContent) {
    console.warn('Missing every welcome modal content by languages')
    return null
  }

  const { partnerLogo, partnerLink } = welcomeModal
  const { title, description } = welcomeModalContent

  return (
    <div className={styles.container}>
      <div className={styles.logos}>
        <Logo />
        {partnerLogo && partnerLink && (
          <a href={partnerLink} target="_blank" rel="noopener noreferrer">
            <img className={styles.partnerLogo} src={partnerLogo} alt="partner" />
          </a>
        )}
      </div>
      <div className={styles.headerActions}>
        {showDisableCheckbox && (
          <div className={styles.disableSection}>
            <input
              id="disableWelcomePopup"
              type="checkbox"
              onChange={onDisableToggled}
              className={styles.disableCheckbox}
              checked={disabled}
            />
            <label className={styles.disableLabel} htmlFor="disableWelcomePopup">
              {t('common.welcomePopupDisable', "Don't show again")}
            </label>
          </div>
        )}
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

export default Welcome
