import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { useLocalStorage } from '@globalfishingwatch/react-hooks'
import { Logo, Modal } from '@globalfishingwatch/ui-components'

import { ROOT_DOM_ELEMENT } from 'data/config'
import LanguageToggle from 'features/i18n/LanguageToggle'
import { Locale } from 'types'

import type { WelcomeContentKey } from './welcome.content'
import WELCOME_POPUP_CONTENT from './welcome.content'

import styles from './Welcome.module.css'

const DISABLE_WELCOME_POPUP_DICT: Record<WelcomeContentKey, string> = {
  'fishing-activity': 'WelcomePopup',
  'marine-manager': 'MarineManagerPopup',
  'vessel-profile': 'VesselProfilePopup',
}

type WelcomeProps = {
  contentKey: WelcomeContentKey
}

type WelcomeLocalStorageKey = { visible: boolean; showAgain: boolean; version?: number }
const Welcome = ({ contentKey }: WelcomeProps) => {
  const [welcomePopup, setWelcomePopup] = useLocalStorage<WelcomeLocalStorageKey>(
    DISABLE_WELCOME_POPUP_DICT[contentKey],
    { visible: true, showAgain: false }
  )
  const { t, i18n } = useTranslation()

  const welcomeModalContent = WELCOME_POPUP_CONTENT[contentKey]
  const welcomeModalContentTranslated =
    welcomeModalContent?.[i18n.language as Locale] || welcomeModalContent?.[Locale.en]

  useEffect(() => {
    if (!welcomePopup?.visible && welcomePopup?.showAgain) {
      setWelcomePopup((popup) => ({ ...popup, visible: true }))
    }
  }, [])

  useEffect(() => {
    if (welcomeModalContent?.version && welcomeModalContent?.version !== welcomePopup?.version) {
      setWelcomePopup((popup) => ({
        visible: true,
        showAgain: popup.showAgain,
        version: welcomeModalContent.version,
      }))
    }
  }, [])

  const onDisableToggled = useCallback(() => {
    setWelcomePopup((popup) => ({
      ...popup,
      showAgain: !popup.showAgain,
    }))
  }, [setWelcomePopup])

  if (!welcomePopup?.visible || !welcomeModalContentTranslated) {
    if (!welcomeModalContentTranslated) {
      console.warn('Missing every welcome modal content by languages')
    }
    return null
  }

  const { partnerLogo, partnerLink } = welcomeModalContent
  const { title, description } = welcomeModalContentTranslated

  return (
    <Modal
      header={false}
      appSelector={ROOT_DOM_ELEMENT}
      shouldCloseOnEsc
      isOpen={welcomePopup?.visible}
      onClose={() => {
        setWelcomePopup((popup) => ({
          ...popup,
          visible: false,
        }))
      }}
    >
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
          <div className={styles.disableSection}>
            <input
              id="disableWelcomePopup"
              type="checkbox"
              onChange={onDisableToggled}
              className={styles.disableCheckbox}
              checked={!welcomePopup?.showAgain}
            />
            <label className={styles.disableLabel} htmlFor="disableWelcomePopup">
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
    </Modal>
  )
}

export default Welcome
