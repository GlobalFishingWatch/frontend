import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { IconButton } from '@globalfishingwatch/ui-components/icon-button'

import { IS_DEVELOPMENT_ENV } from 'data/map/config'
import { CROWDIN_IN_CONTEXT_LANG } from 'features/i18n/i18n.config'
import { useLanguageOptions } from 'features/i18n/language.hooks'

import styles from './LanguageToggle.module.css'

export function CrowdinScripts({ enabled }: { enabled: boolean }) {
  const injectedRef = useRef(false)

  useEffect(() => {
    if (!enabled || injectedRef.current) return
    injectedRef.current = true

    const initScript = document.createElement('script')
    initScript.textContent = `var _jipt = []; _jipt.push(['project', 'gfw-frontend']);`
    document.head.appendChild(initScript)

    const crowdinScript = document.createElement('script')
    crowdinScript.src = '//cdn.crowdin.com/jipt/jipt.js'
    document.head.appendChild(crowdinScript)
  }, [enabled])

  return null
}

type LanguageToggleProps = {
  className?: string
  position?: 'bottomRight' | 'rightDown'
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({
  position = 'bottomRight',
  className = '',
}: LanguageToggleProps) => {
  const { i18n } = useTranslation()
  const { options, toggleLanguage, isLoading } = useLanguageOptions()

  return (
    <div className={cx(styles.languageToggle, className)} data-testid="language-toggle-container">
      <div className={styles.languageBtn}>
        <IconButton
          icon={IS_DEVELOPMENT_ENV && i18n.language !== 'source' ? 'warning' : 'language'}
          type={IS_DEVELOPMENT_ENV && i18n.language !== 'source' ? 'warning' : 'default'}
          loading={isLoading}
          disabled={isLoading}
          testId="language-toggle-button"
        />
      </div>
      <ul className={cx(styles.languages, styles[position])} data-testid="language-menu">
        {options.map(({ id, label, testId }) => (
          <li key={id}>
            <button
              onClick={() => toggleLanguage(id)}
              data-testid={testId}
              className={cx(styles.language, {
                [styles.currentLanguage]: i18n.language === id,
                [styles.warning]: id === 'source' && i18n.language !== 'source',
              })}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
      <CrowdinScripts enabled={i18n.language === CROWDIN_IN_CONTEXT_LANG} />
    </div>
  )
}

export default LanguageToggle
