import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import type { Locale } from 'types'

import { Icon } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { LocaleLabels } from 'features/i18n/i18n'

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
  const toggleLanguage = (lang: Locale) => {
    trackEvent({
      category: TrackCategory.I18n,
      action: `Change language`,
      label: lang,
    })
    i18n.changeLanguage(lang)
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
      </ul>
    </div>
  )
}

export default LanguageToggle
