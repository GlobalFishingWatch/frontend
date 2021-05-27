import React from 'react'
import { useTranslation } from 'react-i18next'
import { Logo } from '@globalfishingwatch/ui-components'
import { Locale } from 'types'
import { WorkspaceCategories } from 'data/workspaces'
import styles from './Welcome.module.css'
import WELCOME_POPUP_CONTENT from './welcome.content'

const Welcome: React.FC = () => {
  const { i18n } = useTranslation()
  const welcomeModal = WELCOME_POPUP_CONTENT[WorkspaceCategories.MarineManager]
  if (!welcomeModal) {
    console.warn('Missing welcome modal content by category')
    return null
  }
  const welcomeModalContent = welcomeModal[(i18n.language as Locale) || Locale.en]
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
      <h1 className={styles.title}>{title}</h1>
      <div
        className={styles.contentContainer}
        dangerouslySetInnerHTML={{ __html: description }}
      ></div>
    </div>
  )
}

export default Welcome
