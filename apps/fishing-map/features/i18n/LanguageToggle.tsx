import { Fragment, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import Script from 'next/script'

import { IconButton } from '@globalfishingwatch/ui-components'

import { IS_DEVELOPMENT_ENV } from 'data/config'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectBasemapLabelsDataviewInstance } from 'features/dataviews/selectors/dataviews.selectors'
import { CROWDIN_IN_CONTEXT_LANG, LocaleLabels } from 'features/i18n/i18n'
import { selectHasEditTranslationsPermissions } from 'features/user/selectors/user.permissions.selectors'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import useClickedOutside from 'hooks/use-clicked-outside'
import { Locale } from 'types'

import styles from './LanguageToggle.module.css'

type LanguageToggleProps = {
  className?: string
  position?: 'bottomRight' | 'rightDown'
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({
  position = 'bottomRight',
  className = '',
}: LanguageToggleProps) => {
  const { i18n } = useTranslation()
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)

  const expandedContainerRef = useClickedOutside(() => setIsLanguageMenuOpen(false))

  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const hasEditTranslationsPermissions = useSelector(selectHasEditTranslationsPermissions)
  const basemapDataviewInstance = useSelector(selectBasemapLabelsDataviewInstance)
  const toggleLanguage = (lang: Locale | 'source') => {
    trackEvent({
      category: TrackCategory.I18n,
      action: `Change language`,
      label: lang,
    })
    i18n.changeLanguage(lang)
    if (basemapDataviewInstance?.id) {
      upsertDataviewInstance({
        id: basemapDataviewInstance.id as string,
        config: {
          locale: lang === 'source' ? Locale.en : (lang as Locale),
        },
      })
    }
    setIsLanguageMenuOpen(false)
  }

  return (
    <div className={cx(styles.languageToggle, className)} ref={expandedContainerRef}>
      <div className={styles.languageBtn}>
        <IconButton
          icon={IS_DEVELOPMENT_ENV && i18n.language !== 'source' ? 'warning' : 'language'}
          type={IS_DEVELOPMENT_ENV && i18n.language !== 'source' ? 'warning' : 'default'}
          onClick={(e) => {
            e.stopPropagation()
            setIsLanguageMenuOpen(!isLanguageMenuOpen)
          }}
        />
      </div>
      <ul className={cx(styles.languages, styles[position], { [styles.open]: isLanguageMenuOpen })}>
        {IS_DEVELOPMENT_ENV && (
          <li>
            <button
              onClick={() => toggleLanguage('source')}
              className={cx(styles.language, {
                [styles.currentLanguage]: i18n.language === 'source',
                [styles.warning]: IS_DEVELOPMENT_ENV && i18n.language !== 'source',
              })}
            >
              🚧 Source 🚧
            </button>
          </li>
        )}
        {LocaleLabels.map(({ id, label }) => (
          <li key={id}>
            <button
              onClick={() => toggleLanguage(id)}
              className={cx(styles.language, {
                [styles.currentLanguage]: i18n.language === id,
              })}
            >
              {label}
            </button>
          </li>
        ))}
        {hasEditTranslationsPermissions && (
          <li>
            <button
              onClick={() => toggleLanguage(CROWDIN_IN_CONTEXT_LANG as Locale)}
              className={cx(styles.language, {
                [styles.currentLanguage]: i18n.language === CROWDIN_IN_CONTEXT_LANG,
              })}
            >
              Edit translations
            </button>
          </li>
        )}
      </ul>
      {i18n.language === CROWDIN_IN_CONTEXT_LANG && (
        <Fragment>
          <Script
            id="pre-crowding"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
            var _jipt = [];
            _jipt.push(['project', 'gfw-frontend']);
    `,
            }}
          />
          <Script id="crowding" src="//cdn.crowdin.com/jipt/jipt.js" strategy="afterInteractive" />
        </Fragment>
      )}
    </div>
  )
}

export default LanguageToggle
