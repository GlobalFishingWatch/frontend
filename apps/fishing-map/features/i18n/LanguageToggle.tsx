import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { Fragment } from 'react'
import Script from 'next/script'
import { Icon } from '@globalfishingwatch/ui-components'
import { Locale } from 'types'
import { CROWDIN_IN_CONTEXT_LANG, LocaleLabels } from 'features/i18n/i18n'
import { selectBasemapLabelsDataviewInstance } from 'features/dataviews/selectors/dataviews.selectors'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectIsGFWDeveloper } from 'features/user/selectors/user.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectHasEditTranslationsPermissions } from 'features/user/selectors/user.permissions.selectors'
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
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const hasEditTranslationsPermissions = useSelector(selectHasEditTranslationsPermissions)
  const basemapDataviewInstance = useSelector(selectBasemapLabelsDataviewInstance)
  const toggleLanguage = (lang: Locale) => {
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
          locale: lang,
        },
      })
    }
  }
  return (
    <div className={cx(styles.languageToggle, className)}>
      <div className={styles.languageBtn}>
        <Icon icon="language" />
      </div>
      <ul className={cx(styles.languages, styles[position])}>
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
