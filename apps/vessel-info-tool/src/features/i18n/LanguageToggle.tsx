import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import type { Locale } from '@globalfishingwatch/api-types'
import { IconButton } from '@globalfishingwatch/ui-components'

import { LocaleLabels } from './i18n'

import styles from './LanguageToggle.module.css'

type LanguageToggleProps = {
  className?: string
  position?: 'bottomRight' | 'rightDown'
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({
  position = 'rightDown',
  className = '',
}: LanguageToggleProps) => {
  const { i18n } = useTranslation()
  const toggleLanguage = (lang: Locale | 'source') => {
    i18n.changeLanguage(lang)
  }
  return (
    <div className={cx(styles.languageToggle, className)}>
      <div className={styles.languageBtn}>
        <IconButton icon="language" />
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
        {/* {hasEditTranslationsPermissions && (
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
        )} */}
      </ul>
      {/* {i18n.language === CROWDIN_IN_CONTEXT_LANG && (
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
      )} */}
    </div>
  )
}

export default LanguageToggle
